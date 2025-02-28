import axios, { AxiosProgressEvent } from 'axios';
import { Asset, UploadAssetsResult } from './AssetsManager.interface';

export const endpoints = {
  assets: 'api/assets',
  uploadAssets: 'api/assets/upload',
  deleteAssets: 'api/assets/delete',
  listImages: 'api/assets/list/images',
  listMusic: 'api/assets/list/music',
  listVideos: 'api/assets/list/videos',
  imageThumb: 'api/assets/images/thumb',  // Static endpoints
  videoThumb: 'api/assets/videos/thumb',  // Static endpoints
  images: 'api/assets/images',  // Static endpoints
  music: 'api/assets/music',  // Static endpoints
  videos: 'api/assets/videos',  // Static endpoints
}

export const uploadAssets = async (files: File[], progressCb: (progressEvent: AxiosProgressEvent) => void): Promise<UploadAssetsResult[] | undefined> => {
  if (!files?.length) throw new Error("Please select files to upload");

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  try {
    const response = await axios.post(endpoints.uploadAssets, formData, {
      onUploadProgress: progressCb,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.progress;
  } catch (error) {
    throw error;
  }
};


export const listAssets = async (): Promise<Asset[] | undefined> => {
  try {
    const [images, music, videos] = await Promise.all([
      axios.get<Asset[]>(endpoints.listImages),
      axios.get<Asset[]>(endpoints.listMusic),
      axios.get<Asset[]>(endpoints.listVideos)
    ]);

    const assets = [...images.data, ...music.data, ...videos.data];

    return assets;
  } catch (error) {
    console.error("List Assets error:", error);
  }
};


export const deleteAssets = async (assets: Asset[]): Promise<UploadAssetsResult[] | undefined> => {
  if (!assets?.length) throw new Error("Please select files to Delete");

  try {
    const response = await axios.post(endpoints.deleteAssets, { assets });

    return response.data;
  } catch (error) {
    throw error;
  }
};
