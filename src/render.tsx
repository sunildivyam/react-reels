import path from "path";
import yargs from "yargs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia, FrameRange, StitchingState } from "@remotion/renderer";
import { encodeFileName, formatDuration, getETA, readJsonFile } from "./lib/Utils";

import filelog from './lib/Logger';
const PUBLIC_DIR = 'public';
const PROCESSED_DIR = 'processed data';
const PROCESSED_DIRS = [
  `images`,
  `videos`,
  `music`,
  `data`];

import fs from 'fs';
import fse from 'fs-extra';

type RenderProgressType = {
  renderedFrames: number;
  encodedFrames: number;
  encodedDoneIn: number | null;
  renderedDoneIn: number | null;
  renderEstimatedTime: number;
  progress: number;
  stitchStage: StitchingState;
}

function isProgressChanged(prevProgress: RenderProgressType, currentProgress: RenderProgressType): boolean {
  return (
    prevProgress.renderedFrames !== currentProgress.renderedFrames ||
    prevProgress.encodedFrames !== currentProgress.encodedFrames ||
    prevProgress.encodedDoneIn !== currentProgress.encodedDoneIn ||
    prevProgress.renderedDoneIn !== currentProgress.renderedDoneIn ||
    // prevProgress.renderEstimatedTime !== currentProgress.renderEstimatedTime ||
    prevProgress.progress !== currentProgress.progress ||
    prevProgress.stitchStage !== currentProgress.stitchStage
  );
}

const moveProcessedData = (srcDirectory: string, destDirectory: string, dirs: string[], compositionId: string) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const timeInMilliseconds = date.getTime();
  const destDataDir = `${formattedDate} - ${compositionId} - ${timeInMilliseconds}`;

  const srcDir = path.resolve(__dirname, '../', srcDirectory);
  const destDir = path.resolve(__dirname, '../', destDirectory, destDataDir);

  dirs.forEach((dir) => {
    const srcPath = path.join(srcDir, dir);
    const destPath = path.join(destDir, dir);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    const files = fs.readdirSync(srcPath);
    files.forEach((file) => {
      const srcFile = path.join(srcPath, file);
      const destFile = path.join(destPath, file);
      if (fs.lstatSync(srcFile).isFile()) {
        fse.moveSync(srcFile, destFile, { overwrite: true });
      }
    });
  });
};

async function getCmdArguments() {
  const args = process.argv.slice(2);
  const options = yargs(args)
    .option("composition", {
      alias: "c",
      type: "string",
      description: "ID of Composition to render",
    })
    .option("json", {
      alias: "j",
      type: "string",
      description: "Path of JSON data file relative to public folder",
    })
    .help().argv;

  const { composition, json } = await options;
  if (!composition) throw new Error("Composition required");
  if (!json) throw new Error("Video Json file path required");

  return { composition, json };
}


const renderOne = async (
  videoProps: any,
  bundleLocation: string,
  compositionId: string,
) => {
  // Parametrize the video by passing arbitrary props to your component.

  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  const composition = await selectComposition({
    // You can pass custom input props that you can retrieve using getInputProps()
    // in the composition list. Use this if you want to dynamically set the duration or
    // dimensions of the video.
    serveUrl: bundleLocation,
    inputProps: videoProps,
    id: compositionId,
  });


  const outputLocation = `out/${encodeFileName(videoProps.title)}-${Date.now()}.mp4`;
  const startTime = Date.now();

  const frameRange: FrameRange = [0, composition.durationInFrames - 1];
  // const frameRange: FrameRange = [0, 10];
  let prevProgress = {} as RenderProgressType;

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps: videoProps,
    frameRange,
    onProgress: (rProgress) => {
      // prints the info in same line
      const {
        stitchStage,
        renderedFrames,
        renderEstimatedTime,
        encodedFrames,
        encodedDoneIn,
        renderedDoneIn,
        progress,
      } = rProgress;
      
      if (isProgressChanged(prevProgress, rProgress)) {
        const eta = getETA(progress, Date.now() - startTime, renderedFrames, frameRange[1] - frameRange[0]);

        filelog(
          `${outputLocation} | ${stitchStage} | ${Math.floor(progress * 100)}% | Frames (rendered: ${renderedFrames} encoded: ${encodedFrames}) | ETA: (${formatDuration(Date.now() - startTime)} / ${formatDuration(renderEstimatedTime)}) | Remaining: ${eta}\r`,
          true);
        prevProgress = rProgress;
      }

      if (encodedDoneIn !== null || renderedDoneIn !== null) {
        filelog(`|encodedDoneIn: ${formatDuration(encodedDoneIn || 0)} | renderedDoneIn: ${formatDuration(renderedDoneIn || 0)}`);
      }
    },
  });

  filelog(
    `${outputLocation} | DONE in ${formatDuration(Date.now() - startTime)}`,
  );
};

export const startRender = async (compositionId: string, jsonPath: string) => {
  let videoInfos: Array<any> = [];
  try {
    videoInfos = await readJsonFile(`${PUBLIC_DIR}/data/${jsonPath}`);
  } catch (error: any) {
    filelog(error);
    throw new Error(`Error reading json file ${jsonPath} ${error}`);
  }

  // You only have to do this once, you can reuse the bundle.
  const entry = "src/index.ts";
  filelog(`STARTED RENDERING ${compositionId} at: ${new Date()}`);
  filelog('Creating a Webpack bundle of the video')

  const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
    // If you have a Webpack override, make sure to add it here
    webpackOverride: (config) => config,
  });

  try {
    for (const vidInfo of videoInfos) {
      const singleVideo = { ...vidInfo };
      await renderOne(singleVideo, bundleLocation, compositionId).catch(
        (error) => {
          filelog(`Skipped: ${singleVideo.title} | Error: ${error}`);
        },
      );
    }
    filelog(`COMPLETED RENDERING at: ${new Date()}`)
  } catch (error) {
    throw error;
  }
};

async function main() {
  filelog.clear();

  try {
    const { composition, json } = await getCmdArguments();

    await startRender(composition, json)
      .then(() => {
        filelog('All Renders Completed.');
        filelog(`Moving all files and data to ${PROCESSED_DIR}`);
        moveProcessedData(PUBLIC_DIR, PROCESSED_DIR, PROCESSED_DIRS, composition);
      })
      .catch((error) => {
        console.error(error);
        filelog(error);
        process.exit(1);
      });
  } catch (error: any) {
    filelog(error);
  }
}

main();
