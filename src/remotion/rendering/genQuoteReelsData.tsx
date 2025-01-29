import { random } from "remotion";
import { getFilesFromDirectory, saveToJsonFile } from '../../core-lib/FileUtils';
import { readJsonFile } from "../../core-lib/FileUtils";
import { VideoType } from "../lib/Video";
import path from 'path';
import { ASSETS_DIRS, HD_REEL, PUBLIC_DIR } from "../constants";
import yargs from "yargs";

const SOURCE_JSON_FILE = `${PUBLIC_DIR}/${ASSETS_DIRS.DATA}/quotes.json`;
const DEST_JSON_FILE = `${PUBLIC_DIR}/${ASSETS_DIRS.DATA}/QuoteReel.json`;;

export const IMAGES_PER_REEL = 1;
export const VIDEOS_PER_REEL = 1;


export const readDataFromDirectories = async (): Promise<{ images: string[], videos: string[], musics: string[] }> => {
  const imagesDirectory = path.join(PUBLIC_DIR, ASSETS_DIRS.IMAGES);
  const videosDirectory = path.join(PUBLIC_DIR, ASSETS_DIRS.VIDEOS);
  const musicDirectory = path.join(PUBLIC_DIR, ASSETS_DIRS.MUSIC);

  const [images, videos, musics] = await Promise.all([
    getFilesFromDirectory(imagesDirectory),
    getFilesFromDirectory(videosDirectory),
    getFilesFromDirectory(musicDirectory),
  ]);

  return { images, videos, musics };
};

// eslint-disable-next-line max-params
async function getUpdatedJson(json: Array<unknown>,
  images: Array<string>,
  videos: Array<string>,
  musics: Array<string>,
  durationInSeconds: number | undefined,
  compositionIds: Array<string> | undefined) {
  const updatedJson = json.map((item, index) => {
    let rVideos: Array<VideoType> = [];
    let rImages: Array<string> = [];
    let rMusic: string = '';
    let isVideoType = false;

    if (index < videos.length) {
      rVideos = [{
        src: `${ASSETS_DIRS.VIDEOS}/${videos[index]}`,
        duration: 0
      }];
      for (let i = 0; i < VIDEOS_PER_REEL; i++) {
        const vid = { src: `${ASSETS_DIRS.VIDEOS}/${videos[Math.floor(random(null) * videos.length)]}`, duration: 0 };
        rVideos.push(vid);
      }
      isVideoType = true;
    } else {
      rImages = [`${ASSETS_DIRS.IMAGES}/${images[(index - videos.length) % images.length]}`];
      for (let i = 0; i < IMAGES_PER_REEL; i++) {
        const image = `${ASSETS_DIRS.IMAGES}/${images[Math.floor(random(null) * images.length)]}`;
        rImages.push(image);
      }
      isVideoType = false;
    }

    const music = musics[index % musics.length];
    rMusic = music ? `${ASSETS_DIRS.MUSIC}/${music}` : music;

    const videoComposition = {
      compositionId: (compositionIds && compositionIds[index % compositionIds.length]) || "QuoteReel",
      durationInSeconds: durationInSeconds || HD_REEL.DURATION_SECONDS,
      fps: HD_REEL.FPS,
      width: HD_REEL.width,
      height: HD_REEL.height,
      rangeInSeconds: [],
      videoProps: {
        ...item as object,
        isVideoType,
        filter: 'ForestFilter',
        videos: rVideos,
        images: rImages,
        music: rMusic,
      }
    }

    return videoComposition;
  });

  return updatedJson;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toUniqueArray = (items: Array<any>): Array<any> => {
  const map = new Map();
  items.forEach(item => {
    map.set(item.name, item);
  });
  return Array.from(map.values());
};


async function getCmdArguments() {
  const args = process.argv.slice(2);
  const options = yargs(args)
    .option("durationInSeconds", {
      alias: "d",
      type: "number",
      description: "Duration of reel in seconds",
    })
    .option("compositionIds", {
      alias: "c",
      type: "string",
      description: "Composition Ids for reels",
    })
    .help().argv;

  const { durationInSeconds, compositionIds } = await options;

  return { durationInSeconds, compositionIds: compositionIds ? compositionIds.split(', ').map(s => s.trim()) : [] };
}


export const prepareJson = async () => {
  try {
    const { durationInSeconds, compositionIds } = await getCmdArguments();

    const { images, videos, musics } = await readDataFromDirectories();
    const json = await readJsonFile(SOURCE_JSON_FILE);
    const quotes = toUniqueArray(json);
    const updatedJson = await getUpdatedJson(quotes as Array<object>, images, videos, musics, durationInSeconds, compositionIds);

    const destPath = path.resolve(__dirname, DEST_JSON_FILE);

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
