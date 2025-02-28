import { random } from "remotion";
import { getFilesFromDirectory } from '../../core-lib/FileUtils';
import { readJsonFile } from "../../core-lib/FileUtils";
import path from 'path';
import { ASSETS_DIRS, HD_REEL, PUBLIC_DIR } from "../constants";
import yargs from "yargs";
import JsonDb from "../../jsondb/JsonDb";
import { VideoRecord } from "../..//remotion/interfaces";

const SOURCE_JSON_FILE = `${PUBLIC_DIR}`;

export const IMAGES_PER_VIDEO = 1;
export const VIDEOS_PER_VIDEO = 1;

interface VideoOptionsType {
  durationInSeconds?: number,
  compositionIds?: Array<string>,
  imagesPerVideo?: number;
  categoryImage?: string;
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
  const { durationInSeconds, compositionIds, imagesPerVideo, categoryImage } = videoOptions;

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
    const cId = (compositionIds && compositionIds[index % compositionIds.length]) || "QuoteReel";

    const videoComposition = {
      id: cId,
      originalId: cId,
      durationInSeconds: durationInSeconds || HD_REEL.DURATION_SECONDS,
      fps: HD_REEL.FPS,
      width: HD_REEL.width,
      height: HD_REEL.height,
      rangeInSeconds: [],
      defaultProps: {
        ...item as object,
        isVideoType,
        filter: 'ForestFilter',
        categoryImage,
        videos: rVideos,
        images: rImages,
        music: rMusic,
        bgGradient: {
          colors: [
            "rgb(144, 61, 2)",
            "rgb(255, 152, 35)",
            "rgb(158, 71, 42)",
            "rgb(73, 45, 3)"
          ],
          angle: 45
        }
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
    map.set(item.summary, item);
  });
  return Array.from(map.values());
};


async function getCmdArguments() {
  const args = process.argv.slice(2);
  const options = yargs(args)
    .option("sourceJson", {
      alias: "s",
      type: "string",
      description: "Source Json File Folder",
      demandOption: "Source Json File path relative to public folder "
    })
    .option("dbName", {
      alias: "b",
      type: "string",
      description: "Database name",
      demandOption: "Data base name for JsonDb "
    })
    .option("durationInSeconds", {
      alias: "d",
      type: "number",
      description: "Duration of reel in seconds",
      demandOption: "Video Duration required (seconds), Ex. -- -d 10"
    })
    .option("imagesPerVideo", {
      alias: "i",
      type: "number",
      description: "Number of Images per Video",
      demandOption: "Number of Images per Video, Ex. -- -i 1"
    })
    .option("compositionIds", {
      alias: "c",
      type: "string",
      description: "Composition Ids for reels",
      demandOption: "One or more composition Id/s required, Ex. -- -c Quote, QuoteReel"
    })
    .option("categoryImage", {
      alias: "t",
      type: "string",
      description: "Category Image Relative Url to public Folder",
      demandOption: "Category Image Relative Url to public Folder, Ex. -- -t remotion-defaults/images/chanakya.jpg"
    })
    .help().argv;

  const { durationInSeconds, compositionIds, imagesPerVideo, categoryImage, sourceJson, dbName } = await options;

  return { durationInSeconds, compositionIds: compositionIds ? compositionIds.split(', ').map(s => s.trim()) : [], imagesPerVideo, categoryImage, sourceJson, dbName };
}

async function saveToJsonDb(dbName: string, compositions: Array<object>) {
  const quotesDb = new JsonDb(dbName);
  quotesDb.options = {
    duplicateCheckKeys: ['compositionInfo.defaultProps.title', 'compositionInfo.defaultProps.summary'],
    writeDeferMs: 1000
  }
  await quotesDb.load();

  const dbRecords = compositions.map((c: any) => {
    const { id, originalId, fps, width, height, durationInSeconds, rangeInSeconds, defaultProps } = c;
    const { tags, hashTags } = defaultProps;

    return {
      compositionInfo: { id, originalId, fps, width, height, durationInSeconds, rangeInSeconds, defaultProps: { ...defaultProps, hashTags: undefined, tags: undefined } },
      socialMedia: { tags, hashTags }
    } as VideoRecord
  });

  await quotesDb.add(dbRecords, true);
}

export const prepareJson = async () => {
  try {
    const videoOptions = await getCmdArguments();
    const { sourceJson, dbName } = videoOptions;
    const { images, videos, musics } = await readDataFromDirectories();
    const json = await readJsonFile(path.join(SOURCE_JSON_FILE, `${sourceJson}`));
    const quotes = toUniqueArray(json);

    const updatedJson = await getUpdatedJson(quotes as Array<object>, images, videos, musics, videoOptions);

    // await saveToJsonFile(updatedJson, `${DEST_JSON_FILE}/${compositionIds[0]}.json`);

    await saveToJsonDb(dbName, updatedJson);

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
