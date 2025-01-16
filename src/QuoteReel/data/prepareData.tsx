import { QuoteReelType } from "../QuoteReel";
import json from './quotes.json';

import fs from 'fs';
import path from 'path';

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
    let video = '';
    let img = '';

    if (index < videos.length) {
      video = videos[index];
    } else {
      img = images[(index - videos.length) % images.length];
    }
    // const video = videos[index % videos.length];
    // const img = index >= videos.length ? images[index % images.length] : '';
    const music = musics[index % musics.length];

    return {
      ...item,
      filter: 'ForestFilter',
      video: video ? `videos/${video}` : video,
      img: img ? `images/${img}` : img,
      music: music ? `music/${music}` : music,
    };
  });

  return updatedJson;
}

export const saveToJsonFile = async (json: Array<QuoteReelType>, fileName: string) => {
  const filePath = path.join(__dirname, fileName);
  await fs.promises.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8')
}

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
    const quotes = toUniqueArray(json);
    const updatedJson = await getUpdatedJson(quotes as Array<QuoteReelType>, images, videos, musics);
    await saveToJsonFile(updatedJson, './final-quotes.json');
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
