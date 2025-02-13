import axios from 'axios';
import { VideoRecord } from './Composition.interface';

const endpoints = {
  compositionAll: 'api/composition/all',
}


export const getCompositionAll = async (dbName: string): Promise<Array<VideoRecord>> => {
  try {
    const response = await axios.get(`${endpoints.compositionAll}?dbName=${dbName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching VideoRecords All:', error);
    throw error;
  }
};
