import axios from 'axios';
import { ChannelInfo, VideoPlaylist } from './youtube.interface';

const endpoints = {
  youtubePlaylists: 'api/youtube/channel/playlists',
  youtubeChannel: 'api/youtube/channel',
  youtubeAuthorized: 'api/youtube/authorized',
  youtubeAuthorize: 'api/youtube/auth',
}


export const getYoutubePlaylists = async (): Promise<Array<VideoPlaylist>> => {
  try {
    const response = await axios.get(endpoints.youtubePlaylists);
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube playlists:', error);
    throw error;
  }
};

export const getYoutubeChannel = async (): Promise<ChannelInfo> => {
  try {
    const response = await axios.get(endpoints.youtubeChannel);
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube channel:', error);
    throw error;
  }
};


export const youtubeAuthorized = async (): Promise<boolean> => {
  try {
    const response = await axios.get(endpoints.youtubeAuthorized);
    return response.data;
  } catch (error) {
    console.error('Error Authorizing YouTube channel:', error);
    throw error;
  }
};


export const youtubeAuthorize = async (): Promise<void> => {
  window.location.href = endpoints.youtubeAuthorize;
};
