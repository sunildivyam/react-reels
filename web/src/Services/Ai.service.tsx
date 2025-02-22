import axios from 'axios';
import { AiQuote } from './Ai.interface';

export const endpoints = {
  aiQuotes: 'api/ai/quotes',
}

export const generateQuotes = async (prompt: string): Promise<AiQuote[]> => {

  try {
    const response = await axios.post(endpoints.aiQuotes, { prompt });

    return response.data;
  } catch (error) {
    throw error;
  }
};
