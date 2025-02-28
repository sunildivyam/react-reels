import axios from 'axios';
import { VideoRecord } from './Composition.interface';

const endpoints = {
  compositionAll: 'api/composition/all',
  updateComposition: 'api/composition/update',
  addComposition: 'api/composition/add',
  deleteComposition: 'api/composition/delete',
  addDatabase: 'api/composition/add-db',
  listDatabases: 'api/composition/list-dbs',
  compositionIds: 'api/composition/ids',
}

export const addDatabase = async (dbName: string): Promise<string> => {
  try {
    const response = await axios.post(`${endpoints.addDatabase}`, {
      dbName
    });
    return response.data;
  } catch (error) {
    console.error('Error Adding database:', error);
    throw error;
  }
};


export const listDatabases = async (): Promise<Array<string>> => {
  try {
    const response = await axios.get(`${endpoints.listDatabases}`);
    return response.data;
  } catch (error) {
    console.error('Error Listing DBs:', error);
    throw error;
  }
};

export const updateVideoRecord = async (dbName: string, videoRecord: VideoRecord): Promise<VideoRecord> => {
  try {
    const response = await axios.post(`${endpoints.updateComposition}`, {
      dbName,
      videoRecord
    });
    return response.data;
  } catch (error) {
    console.error('Error Updating VideoRecord:', error);
    throw error;
  }
};


export const addVideoRecord = async (dbName: string, videoRecord: VideoRecord): Promise<VideoRecord> => {
  try {
    const response = await axios.post(`${endpoints.addComposition}`, {
      dbName,
      videoRecord
    });
    return response.data;
  } catch (error) {
    console.error('Error Adding VideoRecord:', error);
    throw error;
  }
};


export const deleteVideoRecord = async (dbName: string, videoRecord: VideoRecord): Promise<VideoRecord> => {
  try {
    const response = await axios.post(`${endpoints.deleteComposition}`, {
      dbName,
      videoRecord
    });
    return response.data;
  } catch (error) {
    console.error('Error Deleting VideoRecord:', error);
    throw error;
  }
};


export const addVideoRecords = async (dbName: string, videoRecords: VideoRecord[]): Promise<VideoRecord[]> => {
  try {
    const response = await axios.post(`${endpoints.addComposition}`, {
      dbName,
      videoRecord: videoRecords
    });
    return response.data;
  } catch (error) {
    console.error('Error Adding VideoRecord:', error);
    throw error;
  }
};

export const getCompositionAll = async (dbName: string): Promise<Array<VideoRecord>> => {
  try {
    const response = await axios.get(`${endpoints.compositionAll}?dbName=${dbName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching VideoRecords All:', error);
    throw error;
  }
};

export const getCompositionIds = async () => {
  try {
    const response = await axios.get(`${endpoints.compositionIds}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CompositionIds:', error);
    throw error;
  }
}
