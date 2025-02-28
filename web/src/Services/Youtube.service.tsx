import axios from 'axios';
import { ChannelInfo, VideoCategoryEnums, VideoMeta, VideoPlaylist, VideoUpload } from './youtube.interface';
import { VideoRecord } from './Composition.interface';
import { MAX_HASHTAGS_IN_TITLE } from '../config';

const endpoints = {
  youtubePlaylists: 'api/youtube/channel/playlists',
  youtubeChannel: 'api/youtube/channel',
  youtubeAuthorized: 'api/youtube/authorized',
  youtubeAuthorize: 'api/youtube/auth',
  youtubeUpload: 'api/youtube/upload',
}


export const uploadVideos = async (dbName: string, uploads: VideoUpload[]): Promise<Array<VideoPlaylist>> => {
  try {

    const response = await axios.post(endpoints.youtubeUpload, { dbName, videoUploads: uploads }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error Uploading videos:', error);
    throw error;
  }
};


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

export const generateTitle = (title: string, hashTags: string[]): string => {
  const hashTags3 = hashTags.slice(0, MAX_HASHTAGS_IN_TITLE);
  const hashTagsString = hashTags3.join(' ');
  let combinedTitle = `${title} ${hashTagsString}`;

  if (combinedTitle.length > 100) {
    const excessLength = combinedTitle.length - 100;
    title = title.slice(0, title.length - excessLength);
    combinedTitle = `${title} ${hashTagsString}`;
  }

  return combinedTitle;
};

export const generateDescription = (summary: string, translation: string, tags: string[], hashTags: string[]): string => {
  return `${summary}


  ${translation}


  ${hashTags?.join(' ')}


  ${tags?.join(', ')}

  `;
};

export const prepareUploadReadyVideos = (
  videoRecords: VideoRecord[],
  playlistIds: string[],
  meta?: VideoMeta
): VideoUpload[] => {
  const vRecs = videoRecords.filter(rec => rec.outFileName && !rec.youTube?.uploadedOn);

  const videos: VideoUpload[] = vRecs.map((vR: VideoRecord, index: number) => {
    const defaultProps = (vR.compositionInfo?.defaultProps as any);
    const socialMedia = (vR.socialMedia as any);
    const tagsU = [...(meta?.tags || []), ...(socialMedia?.tags || [])];
    const hashTagsU = [...(meta?.hashTags || []), ...(socialMedia?.hashTags || [])];

    const vid: VideoUpload = {
      id: vR.id || '',
      title: generateTitle(defaultProps?.title || '', hashTagsU), // Mix with global + hashTags
      description: generateDescription(defaultProps?.summary || '', defaultProps?.translation || '', tagsU, hashTagsU),// Mix with global + hashTags
      tags: socialMedia?.tags || [], // Mix with global
      categoryId: meta?.categoryId || VideoCategoryEnums.Entertainment,
      privacyStatus: 'private',
      publishAt: (() => {
        const date = meta?.startPublishFrom ? new Date(meta?.startPublishFrom) : new Date();
        date.setHours(date.getHours() + (index * (meta?.publishDelayHours || 0)));
        return date.toISOString();
      })(),
      notifySubscribers: true,
      playlistIds,
      thumbnails: {},
      videoFilePath: vR.outFileName
    }

    return vid;
  });

  return videos;
}
