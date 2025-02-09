import { OAuth2Client } from "google-auth-library";
import { VideoUpload } from "./youtube.interface";
import { createReadStream } from "fs";
import { google, youtube_v3 } from "googleapis";
import { appEvents, AppEventsEnum } from "../core-lib/AppEvents";

export const uploadVideo = async (
  auth: OAuth2Client,
  videoUpload: Partial<VideoUpload>,
  videoFilePath: string,
): Promise<youtube_v3.Schema$Video> => {
  try {
    appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_START, {
      videoUpload,
      videoFilePath,
    });
    const inputVideoStream = createReadStream(videoFilePath);
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
    const uploaded = { ...videoUpload, id };

    appEvents.emit(AppEventsEnum.YOUTUBE_UPLOAD_FINISH, {
      videoUpload: uploaded,
      videoFilePath,
    });
    // Add to playlists
    for (const pId of videoUpload.playlistIds || []) {
      if (id && pId) {
        await addToPlaylists(pId, id);
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

export const addToPlaylists = async (playlistId: string, videoId: string) => {
  try {
    const service = google.youtube("v3");
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

