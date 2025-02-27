import { VideoRecord } from "./Composition.interface";
import axios from 'axios';

export const endpoints = {
  renderVideoRecords: 'api/render/videorecords',
  outVideos: 'api/render/videos', // Static route for out (rendered Videos)
}


export const renderVideoRecords = async (dbName: string, videoRecords: VideoRecord[]): Promise<Array<VideoRecord>> => {
  try {
    const response = await axios.post(`${endpoints.renderVideoRecords}`, {
      dbName,
      videoRecords,
    });
    return response.data;
  } catch (error) {
    console.error('Error Rendering Video Records:', error);
    throw error;
  }
};


export const prepareRenderReadyVideos = (
  videoRecords: VideoRecord[],
): VideoRecord[] => {
  const vRecs = videoRecords.filter(rec => !rec.outFileName && !rec.renderedOn);
  return vRecs;
}
