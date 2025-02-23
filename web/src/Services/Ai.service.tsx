import axios from 'axios';
import { AiQuote } from './Ai.interface';
import { GEMINI_LIMIT_PER_MINUTE, GEMINI_LIMIT_PER_PROMPT } from '../config';
import { CompositionInfo, VideoInfo, VideoRecord } from './Composition.interface';

export const endpoints = {
  aiQuotes: 'api/ai/quotes',
}

let isGenerating = false;
let callCount = 0;
let errorCount = 0;
const MAX_ERROR_COUNT = 3;

const delayCall = async (startTime: number) => {
  const tDiff = Date.now() - startTime;
  const timePerCall = 60000 / GEMINI_LIMIT_PER_MINUTE;
  const delayMS = timePerCall - tDiff;
  const actualDelay = delayMS <= 0 ? 0 : delayMS;
  return new Promise(resolve => setTimeout(resolve, actualDelay));
}

export const startGenerating = async (
  prompt: string,
  maxQuotes: number,
  onResult?: (currentCount: number, maxCount: number, quotes: AiQuote[], error?: any) => void) => {
  if (isGenerating) return;
  isGenerating = true;
  callCount = 1;
  const maxCalls = Math.ceil(maxQuotes / GEMINI_LIMIT_PER_PROMPT);
  prompt = `${GEMINI_LIMIT_PER_PROMPT} ${prompt}`;

  onResult && onResult(callCount, maxCalls, [])

  const executeSequentially = async () => {
    while (callCount <= maxCalls && errorCount < MAX_ERROR_COUNT) {
      const startTime = Date.now();
      try {
        const quotes = await generateQuotes(prompt);
        callCount++;
        errorCount = 0;
        onResult && onResult(callCount, maxCalls, quotes);
      } catch (error) {
        onResult && onResult(callCount, maxCalls, [], error);
        errorCount++;
      }
      await delayCall(startTime);
    }
    isGenerating = false;
  };

  await executeSequentially();
  return;
};

export const generateQuotes = async (prompt: string): Promise<AiQuote[]> => {

  try {
    const response = await axios.post(endpoints.aiQuotes, { prompt });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const applyCompositionsToRawAssets = (
  cmpInfo: CompositionInfo | null,
  quotes: AiQuote[],
  imagesPerVideo: number,
  images: string[],
  videos: string[],
  musics: string[]
): VideoRecord[] => {
  if (!cmpInfo || !quotes?.length) return [];

  const vRecords = quotes.map((q: AiQuote, index: number) => {

    let rVideos: Array<VideoInfo> = [];
    let rImages: Array<string> = [];
    let rMusic: string = '';
    let isVideoType = false;

    if (index < videos.length) {
      isVideoType = true;
      const vidFile = videos[index];
      rVideos = vidFile ? [{
        src: vidFile,
        duration: 0
      }] : [];
      for (let i = 0; i < (imagesPerVideo || 1) - 1; i++) {
        const vidFile = videos[Math.floor(Math.random() * videos.length)];
        const vid = { src: vidFile, duration: 0 };
        vidFile && rVideos.push(vid);
      }
    } else {
      isVideoType = false;

      // 1st Image
      const imgFile = images[(index - videos.length) % images.length];
      rImages = imgFile ? [imgFile] : [];
      // Additional Images
      for (let i = 0; i < (imagesPerVideo || 1) - 1; i++) {
        const imgFile = images[Math.floor(Math.random() * images.length)];
        const image = imgFile;
        imgFile && rImages.push(image);
      }
    }

    const music = musics[index % musics.length];
    rMusic = music || '';

    const vRecord: VideoRecord = {
      id: '',
      compositionInfo: {
        ...cmpInfo,
        defaultProps: {
          ...cmpInfo.defaultProps,
          name: q.name,
          subTitle: q.subTitle,
          title: q.title,
          summary: q.summary,
          translation: q.translation,
          images: rImages,
          music: rMusic,
          videos: rVideos,
          isVideoType,
        }
      },
      outFileName: '',
      socialMedia: {
        tags: [...q.tags],
        hashTags: [...q.hashTags],
      }
    }
    return vRecord;
  });

  return vRecords;
}
