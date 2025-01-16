import { DynamicReelType } from "../DynamicReel";
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
  const imagesDirectory = path.join(__dirname, '../../public/images');
  const videosDirectory = path.join(__dirname, '../../public/videos');
  const musicDirectory = path.join(__dirname, '../../public/music');

  const [images, videos, musics] = await Promise.all([
    getFilesFromDirectory(imagesDirectory),
    getFilesFromDirectory(videosDirectory),
    getFilesFromDirectory(musicDirectory),
  ]);

  return { images, videos, musics };
};

export const getUpdatedJson = (json: Array<DynamicReelType>, images: Array<string>, videos: Array<string>, musics: Array<string>) => {
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

export const saveToJsonFile = async (json: Array<DynamicReelType>, fileName: string) => {
  const filePath = path.join(__dirname, fileName);
  await fs.promises.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8')
}

export const prepareJson = async () => {
  try {
    const { images, videos, musics } = await readDataFromDirectories();
    const updatedJson = await getUpdatedJson(json as Array<DynamicReelType>, images, videos, musics);
    await saveToJsonFile(updatedJson, './final-quotes.json');
    console.log('Updated file saved');
  } catch (error) {
    console.log(error);
  }

}

prepareJson();
