import { OAuth2Client } from "google-auth-library";
import { VideoUpload, YoutubeUploadProgress } from "./youtube.interface";
import { createReadStream, statSync } from "fs";
import { google, youtube_v3 } from "googleapis";
import { appEvents, AppEventsEnum } from "../core-lib/AppEvents";
import { resolvedPath, toPercentage } from "../core-lib/Utils";
import "../sockets/index";
import JsonDb from "../jsondb/JsonDb";
import { VideoRecord, YoutubeInfo } from "../remotion/interfaces";

const updatedProgress = (p: YoutubeUploadProgress): YoutubeUploadProgress => {
  p.timeEllapsedMS = Date.now() - p.timeStartedMS;
  return p;
};

appEvents.on(
  AppEventsEnum.YOUTUBE_UPLOAD_FINISH,
  async (e: YoutubeUploadProgress) => {
    const db = new JsonDb(e.dbName);
    await db.load();

    const { videoUpload } = e.currentItem;
    if (videoUpload) {
      const vRecord: VideoRecord | undefined = db.find(
        videoUpload.id as string,
      ) as VideoRecord;
      if (vRecord) {
        // vRecord.outFileName = videoFilePath;
        vRecord.youTube = {
          ...vRecord.youTube,
          videoId: videoUpload.youtubeVideoId,
          uploadedOn: new Date(),
          publishedAt: new Date(videoUpload.publishAt || ""),
        } as YoutubeInfo;
        db.update([vRecord]);
      }
    }
  },
);

export const uploadVideo = async (
  auth: OAuth2Client,
  videoUpload: VideoUpload,
  uploadProgress: YoutubeUploadProgress,
): Promise<VideoUpload> => {
  try {
    let videoFilePath = videoUpload.videoFilePath || "";

    if (!videoFilePath) {
      const err = "VideoFilePath is required";
      console.log(err);
      throw new Error(err);
    }

    videoFilePath = resolvedPath(videoFilePath);
    const inputVideoStream = createReadStream(videoFilePath);
    const fileSize = statSync(videoFilePath).size;
    let uploadedSize = 0;

    inputVideoStream.on("data", (chunk) => {
      uploadedSize += chunk.length;

      // Emit Video progress event (videoUpload.id, percentage)
      uploadProgress.currentItem.progress = toPercentage(
        uploadedSize,
        fileSize,
      );
      appEvents.emit(
        AppEventsEnum.YOUTUBE_UPLOAD_PROGRESS,
        updatedProgress(uploadProgress),
      );
    });

    const service = google.youtube("v3");
    const response = await service.videos.insert({
      auth: auth,
      part: ["snippet", "status"],
      // Channelid or handle is not needed, as it uploads to the channel as authenticated for.
      // forHandle: '@SoulfulAvengers',
      // id: 'UCyRfoXQcb6PK0ykyDwyFrjg', // channel id
      requestBody: {
        snippet: {
          // channelId: 'UCyRfoXQcb6PK0ykyDwyFrjg',
          title: videoUpload.title,
          description: videoUpload.description,
          tags: videoUpload.tags,
          categoryId: videoUpload.categoryId,
          notifySubscribers: videoUpload.notifySubscribers,
        } as youtube_v3.Schema$VideoSnippet,
        status: {
          privacyStatus: videoUpload.privacyStatus,
          publishAt: videoUpload.publishAt,
        },
      },
      media: {
        body: inputVideoStream, // videoUpload.media
      },
    });

    const id = (response.data as youtube_v3.Schema$Video).id;
    const publishAt = (response.data as youtube_v3.Schema$Video).snippet
      ?.publishedAt;

    // Update uploaded info
    if (uploadProgress.currentItem.videoUpload) {
      uploadProgress.currentItem.videoUpload.youtubeVideoId = id || "";
      uploadProgress.currentItem.videoUpload.publishAt = publishAt || "";
    }

    // Add to playlists
    let addedToPlaylists = false;
    for (const pId of videoUpload.playlistIds || []) {
      if (id && pId) {
        await addToPlaylists(auth, pId, id).catch((error) => {
          addedToPlaylists = false;
          uploadProgress.currentItem.error = error.message;
          appEvents.emit(
            AppEventsEnum.YOUTUBE_UPLOAD_FAILED,
            updatedProgress(uploadProgress),
          );
        });
        addedToPlaylists = true;
      }
    }

    addedToPlaylists &&
      appEvents.emit(AppEventsEnum.YOUTUBE_PLAYLIST_ITEM_ADDED, uploadProgress);

    return videoUpload;
  } catch (err) {
    throw err;
  }
};

export const uploadVideos = async (
  auth: OAuth2Client,
  dbName: string,
  videoUploads: VideoUpload[],
) => {
  let errorCount = 0;

  const videoUploadCount = videoUploads.length;

  let uploadProgress: YoutubeUploadProgress = {
    dbName: dbName,
    timeStartedMS: Date.now(),
    timeEllapsedMS: 0,
    progress: 0,
    currentItem: {
      videoUpload: undefined,
      progress: 0,
      error: undefined,
    },
    currentItemNo: 0,
    totalItems: videoUploadCount,
  };

  // Batch Upload start
  appEvents.emit(
    AppEventsEnum.YOUTUBE_UPLOAD_BATCH_START,
    updatedProgress(uploadProgress),
  );

  for (const [index, vid] of videoUploads.entries()) {
    try {
      const currentVuNo = index + 1;
      // Update render Progress
      uploadProgress = {
        ...uploadProgress,
        progress: toPercentage(index, videoUploadCount),
        currentItem: {
          videoUpload: vid,
          error: "",
          progress: 0,
        },
        currentItemNo: currentVuNo,
        totalItems: videoUploadCount,
      };

      appEvents.emit(
        AppEventsEnum.YOUTUBE_UPLOAD_BATCH_PROGRESS,
        updatedProgress(uploadProgress),
      );
      appEvents.emit(
        AppEventsEnum.YOUTUBE_UPLOAD_START,
        updatedProgress(uploadProgress),
      );

      const uploaded = await uploadVideo(auth, vid, uploadProgress);

      uploadProgress.currentItem.videoUpload = uploaded;
      uploadProgress.progress = toPercentage(currentVuNo, videoUploadCount);

      appEvents.emit(
        AppEventsEnum.YOUTUBE_UPLOAD_FINISH,
        updatedProgress(uploadProgress),
      );
    } catch (error: any) {
      uploadProgress.currentItem.error = error.message;
      appEvents.emit(
        AppEventsEnum.YOUTUBE_UPLOAD_FAILED,
        updatedProgress(uploadProgress),
      );
      errorCount++;

      if (errorCount >= 3) {
        // Batch Uplaod Error
        uploadProgress.error = error.message;
        uploadProgress.progress = 100;

        appEvents.emit(
          AppEventsEnum.YOUTUBE_UPLOAD_BATCH_FAILED,
          updatedProgress(uploadProgress),
        );
        break;
      }
    }
  }

  // Batch Upload FINISH
  uploadProgress.progress = 100;
  appEvents.emit(
    AppEventsEnum.YOUTUBE_UPLOAD_BATCH_FINISH,
    updatedProgress(uploadProgress),
  );
};

export const addToPlaylists = async (
  auth: OAuth2Client,
  playlistId: string,
  videoId: string,
) => {
  try {
    const service = google.youtube({
      version: "v3",
      auth,
    });
    const response = await service.playlistItems.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      },
    });

    return response.data as youtube_v3.Schema$Video;
  } catch (err) {
    console.log("Failed to add to playlist " + err);
    throw err;
  }
};
