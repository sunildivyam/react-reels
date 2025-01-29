import { random } from "remotion";
import { readJsonFile } from "../../lib/Utils";
import { VideoType } from "../../lib/Video";
import { QuoteReelType } from "./QuoteReel";

import fs from 'fs';
import path from 'path';

const SOURCE_QUOTE_FILE = 'public/data/quotesReel.json';
const DEST_QUOTE_FILE = 'public/data/final-quotesReel.json';

export const IMAGES_PER_REEL = 1;
export const VIDEOS_PER_REEL = 1;

const getFilesFromDirectory = async (directoryPath: string): Promise<string[]> => {
  const files = await fs.promises.readdir(directoryPath);
  const fileStats = await Promise.all(files.map(async file => {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.lstat(filePath);
    return stats.isFile() ? file : null;
  }));
  return fileStats.filter(file => file !== null) as string[];
};

export const readDataFromDirectories = async (): Promise<{ images: string[], videos: string[], musics: string[] }> => {
  const imagesDirectory = path.join(__dirname, '../../../public/images');
  const videosDirectory = path.join(__dirname, '../../../public/videos');
  const musicDirectory = path.join(__dirname, '../../../public/music');

  const [images, videos, musics] = await Promise.all([
    getFilesFromDirectory(imagesDirectory),
    getFilesFromDirectory(videosDirectory),
    getFilesFromDirectory(musicDirectory),
  ]);

  return { images, videos, musics };
};

export const getUpdatedJson = (json: Array<QuoteReelType>, images: Array<string>, videos: Array<string>, musics: Array<string>) => {
  const updatedJson = json.map((item, index) => {
    let rVideos: Array<VideoType> = [];
    let rImages: Array<string> = [];

    if (index < videos.length) {
      rVideos = [{
        src: `videos/${videos[index]}`,
        duration: 0
      }];
      for (let i = 0; i < VIDEOS_PER_REEL; i++) {
        const vid = { src: `videos/${videos[Math.floor(random(null) * videos.length)]}`, duration: 0 };
        rVideos.push(vid);
      }
    } else {
      rImages = [`images/${images[(index - videos.length) % images.length]}`];
      for (let i = 0; i < IMAGES_PER_REEL; i++) {
        const image = `images/${images[Math.floor(random(null) * images.length)]}`;
        rImages.push(image);
      }
    }

    const music = musics[index % musics.length];

    return {
      ...item,
      filter: 'ForestFilter',
      videos: rVideos,
      images: rImages,
      music: music ? `music/${music}` : music
    } as QuoteReelType;
  });

  return updatedJson;
}

export const saveToJsonFile = async (json: Array<QuoteReelType>, fileName: string) => {
  const filePath = path.join(__dirname, fileName);
  await fs.promises.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toUniqueArray = (items: Array<any>): Array<any> => {
  const map = new Map();
  items.forEach(item => {
    map.set(item.name, item);
  });
  return Array.from(map.values());
};

export const prepareJson = async () => {
  try {
    const { images, videos, musics } = await readDataFromDirectories();
    const json = await readJsonFile(SOURCE_QUOTE_FILE);
    const quotes = toUniqueArray(json);
    const updatedJson = await getUpdatedJson(quotes as Array<QuoteReelType>, images, videos, musics);

    const destPath = path.resolve(__dirname, DEST_QUOTE_FILE);
    await saveToJsonFile(updatedJson, destPath);

    console.log('Updated file saved');
    console.log('SUMMARY:');
    console.log(`
      OriginalQuotes: ${json.length}
      Duplicate Quotes: ${json.length - quotes.length} REMOVED
      Quotes: ${quotes.length}
      Videos: ${videos.length}
      Images: ${images.length}
      Music: ${musics.length}
      `);
  } catch (error) {
    console.log(error);
  }

}

prepareJson();
