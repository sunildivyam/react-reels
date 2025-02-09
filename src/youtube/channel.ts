import { OAuth2Client } from "google-auth-library";
import { VideoPlaylist, ChannelInfo } from "./youtube.interface";
import { google } from "googleapis";

export const getPlaylists = async (
  auth: OAuth2Client,
): Promise<Array<VideoPlaylist>> => {
  try {
    const service = google.youtube("v3");
    const response = await service.playlists.list({
      auth: auth,
      part: ["id", "snippet"],
      mine: true,
    });

    return (
      response.data.items?.map(
        (playlist) =>
          ({
            id: playlist.id,
            title: playlist.snippet?.title,
            description: playlist.snippet?.description,
          }) as VideoPlaylist,
      ) || []
    );
  } catch (err) {
    console.log("Failed to list playlists " + err);
    throw err;
  }
};

export const getChannel = async (auth: OAuth2Client): Promise<ChannelInfo> => {
  try {
    const service = google.youtube("v3");
    const response: any = await service.channels.list({
      auth: auth,
      part: ["snippet", "contentDetails", "statistics"],
      // forHandle: "@himalayan-avengers",
      mine: true,
    });

    const channels = response.data.items;
    if (!channels || channels.length === 0) {
      throw new Error("No channel found");
    }

    const channel = channels[0];
    const channelInfo: ChannelInfo = {
      id: channel.id,
      title: channel.snippet?.title,
      description: channel.snippet?.description,
      localized: channel.snippet?.localized,
      publishedAt: channel.snippet?.publishedAt,
      thumbnails: channel.snippet?.thumbnails,
      customUrl: channel.snippet?.customUrl,
      country: channel.snippet?.country,
      statistics: {
        viewCount: channel.statistics?.viewCount,
        commentCount: channel.statistics?.commentCount,
        subscriberCount: channel.statistics?.subscriberCount,
        hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount,
        videoCount: channel.statistics?.videoCount,
      },
    };

    return channelInfo;
  } catch (err) {
    console.log("The API returned an error: " + err);
    throw err;
  }
};
