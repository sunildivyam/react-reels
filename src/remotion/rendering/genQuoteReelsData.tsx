import { random } from "remotion";
import { getFilesFromDirectory, saveToJsonFile } from '../../core-lib/FileUtils';
import { readJsonFile } from "../../core-lib/FileUtils";
import path from 'path';
import { ASSETS_DIRS, HD_REEL, PUBLIC_DIR } from "../constants";
import yargs from "yargs";

const SOURCE_JSON_FILE = `${PUBLIC_DIR}/${ASSETS_DIRS.DATA}/quotes.json`;
const DEST_JSON_FILE = `${PUBLIC_DIR}/${ASSETS_DIRS.DATA}/QuoteReel.json`;;

export const IMAGES_PER_VIDEO = 1;
export const VIDEOS_PER_VIDEO = 1;

interface VideoOptionsType {
  durationInSeconds?: number,
  compositionIds?: Array<string>,
  imagesPerVideo?: number;
}

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
  videoOptions: VideoOptionsType) {
  const { durationInSeconds, compositionIds, imagesPerVideo } = videoOptions;

  const updatedJson = json.map((item, index) => {
    let rVideos: Array<object> = [];
    let rImages: Array<string> = [];
    let rMusic: string = '';
    let isVideoType = false;

    if (index < videos.length) {
      isVideoType = true;
      const vidFile = videos[index];
      rVideos = vidFile ? [{
        src: `${ASSETS_DIRS.VIDEOS}/${vidFile}`,
        duration: 0
      }] : [];
      for (let i = 0; i < (imagesPerVideo || VIDEOS_PER_VIDEO) - 1; i++) {
        const vidFile = videos[Math.floor(random(null) * videos.length)];
        const vid = { src: `${ASSETS_DIRS.VIDEOS}/${vidFile}`, duration: 0 };
        vidFile && rVideos.push(vid);
      }
    } else {
      isVideoType = false;

      // 1st Image
      const imgFile = images[(index - videos.length) % images.length];
      rImages = imgFile ? [`${ASSETS_DIRS.IMAGES}/${imgFile}`] : [];
      // Additional Images
      for (let i = 0; i < (imagesPerVideo || IMAGES_PER_VIDEO) - 1; i++) {
        const imgFile = images[Math.floor(random(null) * images.length)];
        const image = `${ASSETS_DIRS.IMAGES}/${imgFile}`;
        imgFile && rImages.push(image);
      }
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
    .option("imagesPerVideo", {
      alias: "i",
      type: "number",
      description: "Number of Images per Video",
    })
    .option("compositionIds", {
      alias: "c",
      type: "string",
      description: "Composition Ids for reels",
    })
    .help().argv;

  const { durationInSeconds, compositionIds, imagesPerVideo } = await options;

  if (!durationInSeconds || !compositionIds || !imagesPerVideo) console.log('You can provide Reel imagesPerVideo, duration and compositionIds using command line -- -d 30 -c QuoteReel, NewsReel -i 2');

  return { durationInSeconds, compositionIds: compositionIds ? compositionIds.split(', ').map(s => s.trim()) : [], imagesPerVideo };
}


export const prepareJson = async () => {
  try {
    const videoOptions = await getCmdArguments();
    const { images, videos, musics } = await readDataFromDirectories();
    const json = await readJsonFile(SOURCE_JSON_FILE);
    const quotes = toUniqueArray(json);
    const updatedJson = await getUpdatedJson(quotes as Array<object>, images, videos, musics, videoOptions);

    await saveToJsonFile(updatedJson, DEST_JSON_FILE);

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
