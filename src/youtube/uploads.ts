import { OAuth2Client } from "google-auth-library";
import { VideoUpload } from "./youtube.interface";
import { createReadStream, statSync } from "fs";
import { google, youtube_v3 } from "googleapis";
import { appEvents, AppEventsEnum } from "../core-lib/AppEvents";
import { delay, resolvedPath } from "../core-lib/Utils";
import "../sockets/index";
import JsonDb from "../jsondb/JsonDb";
import { VideoRecord, YoutubeInfo } from "../jsondb/db.models";

let db: JsonDb;

appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_START, async (e) => {
  db = new JsonDb(e.dbName);
  await db.load();
});

appEvents.on(
  AppEventsEnum.YOUTUBE_UPLOAD_FINISH,
  (e: { videoUpload: VideoUpload; videoFilePath: string }) => {
    const { videoUpload, videoFilePath } = e;

    const vRecord: VideoRecord | undefined = db.find(
      videoUpload.id as string,
    ) as VideoRecord;
    if (vRecord) {
      vRecord.outFileName = videoFilePath;
      vRecord.youTube = {
        ...vRecord.youTube,
        videoId: videoUpload.youtubeVideoId,
        uploadedOn: new Date(),
        publishedAt: new Date(videoUpload.publishAt || ""),
      } as YoutubeInfo;
    }
    db.add([]);
  },
);

export const uploadVideo = async (
  auth: OAuth2Client,
  dbName: string,
  videoUpload: Partial<VideoUpload>,
): Promise<youtube_v3.Schema$Video> => {
  try {
    let videoFilePath = videoUpload.videoFilePath || "";
    if (!videoFilePath) {
      const err = "VideoFilePath is required";
      console.log(err);
      appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_FAILED, err);
      throw new Error(err);
    }

    videoFilePath = resolvedPath(videoFilePath);
    const inputVideoStream = createReadStream(videoFilePath);
    const fileSize = statSync(videoFilePath).size;
    let uploadedSize = 0;

    inputVideoStream.on("data", (chunk) => {
      uploadedSize += chunk.length;
      const progress = ((uploadedSize / fileSize) * 100).toFixed(2);
      // Emit Video progress event (videoUpload.id, percentage)
      appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_PROGRESS, {
        videoUpload,
        progress,
      });
    });

    appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_START, {
      videoUpload,
      videoFilePath,
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
    const uploaded = { ...videoUpload, youtubeVideoId: id, publishAt };

    appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_FINISH, {
      dbName,
      videoUpload: uploaded,
      videoFilePath,
    });
    // Add to playlists
    for (const pId of videoUpload.playlistIds || []) {
      if (id && pId) {
        await addToPlaylists(auth, pId, id);
        appEvents.emit(AppEventsEnum.YOUTUBE_PLAYLIST_ITEM_ADDED, {
          videoUpload: uploaded,
          playListId: pId,
        });
      }
    }

    return { ...uploaded };
  } catch (err) {
    console.log("Failed to upload video " + err);
    appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_FAILED, err);
    throw err;
  }
};

export const uploadVideos = async (
  auth: OAuth2Client,
  dbName: string,
  videoUploads: VideoUpload[],
) => {
  const result = [];
  appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_START, {
    videoUploads,
  });
  for (const [index, vid] of videoUploads.entries()) {
    try {
      const uploaded = await uploadVideo(auth, dbName, vid);
      result.push(uploaded);
      appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_START, {
        dbName,
        uploaded,
        progress: (((index + 1) / videoUploads.length) * 100).toFixed(2),
      });
    } catch (err: any) {
      if (err?.status == "429" || err.code == "429") {
        videoUploads.unshift(vid);
        await delay(30000);
      }
    }
  }

  appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_FINISH, {
    result,
  });
  return result;
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
