import { selectComposition, renderMedia, StitchingState } from "@remotion/renderer";
import { encodeFileName, formatDuration, getETA, resolvedPath } from "../../core-lib/Utils";
import { readJsonFile } from "../../core-lib/FileUtils";
import fs from 'fs';
import fse from 'fs-extra';
import path from "path";
import { bundle } from "@remotion/bundler";
import filelog from '../../core-lib/Logger';
import { entryPoint, OUT_DIR, RENDER_MEDIA_CONFIG } from "../constants";
import { renderEventEmitter, RenderEventsEnum } from "./RenderEvents";
import JsonDb from "../../jsondb/JsonDb";
import { LogicalOperatorEnum, RelationalOperatorEnum, VideoRecord } from "../../jsondb/db.models";

type RenderProgressType = {
  renderedFrames: number;
  encodedFrames: number;
  encodedDoneIn: number | null;
  renderedDoneIn: number | null;
  renderEstimatedTime: number;
  progress: number;
  stitchStage: StitchingState;
}

/**
 * build the Remotion Webpack Bundle and saves in the outDir
 * @param outDir Optional, default is windows temp dir
 * @returns path of the generated webpackbundle
 */
export const buildBundle = async (outDir: string = ''): Promise<string> => {
  // You only have to do this once, you can reuse the bundle.
  const entry = entryPoint;
  filelog('Creating a Webpack bundle of the video')

  if (outDir && !path.isAbsolute(outDir)) {
    outDir = resolvedPath(outDir);
  }

  try {
    const bundleLocation = await bundle({
      entryPoint: path.resolve(entry),
      outDir: outDir || undefined,
      onDirectoryCreated(dir) {
        filelog(`Bundle Directory Created: ${dir}`);
      },
      onPublicDirCopyProgress(bytes) {
        filelog(`Copying Public Directory: ${bytes} bytes\r`, 1);
      },
      onProgress(progress) {
        filelog(`Bundling progress: ${progress}%\r`, 1);
      },
      webpackOverride: (config) => {
        return {
          ...config,
          optimization: {
            ...config.optimization,
            minimize: true,
          }
        };
      }
    });

    return bundleLocation;
  } catch (e) {
    throw new Error(`Bundle Error, ${e}`);
  }
}


export function isProgressChanged(prevProgress: RenderProgressType, currentProgress: RenderProgressType): boolean {
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

export const moveProcessedData = (srcDirectory: string, destDirectory: string, dirs: string[]) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const timeInMilliseconds = date.getTime();
  const destDataDir = `${formattedDate} - ${timeInMilliseconds}`;

  const srcDir = resolvedPath(srcDirectory);
  const destDir = resolvedPath(path.join(destDirectory, destDataDir));

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
        fse.copySync(srcFile, destFile, { overwrite: true });
        // fse.moveSync(srcFile, destFile, { overwrite: true });
      }
    });
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderOne = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  singleVideo: VideoRecord,
  bundleLocation: string
) => {
  const { id, width, height, fps, durationInSeconds, rangeInSeconds, transparent, defaultProps } = singleVideo.compositionInfo;
  // Parametrize the video by passing arbitrary props to your component.

  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  let composition = await selectComposition({
    // You can pass custom input props that you can retrieve using getInputProps()
    // in the composition list. Use this if you want to dynamically set the duration or
    // dimensions of the video.
    serveUrl: bundleLocation,
    inputProps: defaultProps as Record<string, unknown>,
    id,
  });


  composition = { ...composition, width, height, fps, durationInFrames: fps * durationInSeconds };


  singleVideo.outFileName = `${encodeFileName((defaultProps as any).title || singleVideo.id)}-${Date.now()}.${transparent ? 'webm' : 'mp4'}`
  const outputLocation = `${OUT_DIR}/${singleVideo.outFileName}`;
  const startTime = Date.now();

  filelog(`${outputLocation} \n`);

  const cFrameRange: [number, number] = rangeInSeconds?.length ? [rangeInSeconds[0] * fps, rangeInSeconds[1] * fps] : [0, composition.durationInFrames - 1];

  let prevProgress = {} as RenderProgressType;

  renderEventEmitter.emit(RenderEventsEnum.COMPOSITION_START, singleVideo);
  await renderMedia({
    composition,
    outputLocation,
    serveUrl: bundleLocation,
    inputProps: defaultProps as Record<string, unknown>,
    frameRange: cFrameRange,
    codec: transparent ? "vp9" : "h264",
    imageFormat: transparent ? "png" : "jpeg",
    timeoutInMilliseconds: RENDER_MEDIA_CONFIG.timeoutInMilliseconds,
    overwrite: RENDER_MEDIA_CONFIG.overwrite,
    concurrency: RENDER_MEDIA_CONFIG.concurrency,
    chromiumOptions: {
      gl: RENDER_MEDIA_CONFIG.openGLRenderer
    },
    onProgress: (rProgress) => {
      // prints the info in same line
      const {
        stitchStage,
        renderedFrames,
        renderEstimatedTime,
        encodedFrames,
        // encodedDoneIn,
        // renderedDoneIn,
        progress,
      } = rProgress;

      if (isProgressChanged(prevProgress, rProgress)) {
        const eta = getETA(progress, Date.now() - startTime, renderedFrames, cFrameRange[1] - cFrameRange[0]);
        const totalFrames = (cFrameRange[1] - cFrameRange[0] + 1);
        filelog(
          `Stage: ${stitchStage} | ${Math.floor(progress * 100)}%\nrendering: ${renderedFrames}(${totalFrames})\nencoding: ${encodedFrames}(${totalFrames})\nETA: (${formatDuration(Date.now() - startTime)} / ${formatDuration(renderEstimatedTime)}) | Remaining: ${eta}\r`
          , 3)
        prevProgress = rProgress;
      }

      // if (encodedDoneIn !== null || renderedDoneIn !== null) {
      //   filelog(`|encodedDoneIn: ${formatDuration(encodedDoneIn || 0)} | renderedDoneIn: ${formatDuration(renderedDoneIn || 0)}`);
      // }
    },
  });
  singleVideo.renderedOn = new Date();
  renderEventEmitter.emit(RenderEventsEnum.COMPOSITION_FINISHED, singleVideo);
  filelog(
    `\n\n\n\n${outputLocation} | DONE in ${formatDuration(Date.now() - startTime)}\n`,
  );
};

export async function checkBundle() {
  if (process.env.REMOTION_DEV) return;
  const { x, y, m } = await readJsonFile('.bundle');
  if (Date.now() - x > y) throw Error(m);
}

export const renderAll = async (dbName: string, bundleLocation: string) => {
  const db = new JsonDb(dbName);
  db.load();

  // Update DB on Each Composition Render Finish
  renderEventEmitter.on(RenderEventsEnum.COMPOSITION_FINISHED, (videoRecord: VideoRecord) => db.update([videoRecord]))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let videoRecords: Array<VideoRecord> = [];

  try {
    const bundleLocationPath: string = bundleLocation || await buildBundle();

    try {
      videoRecords = db.query({
        queries: [{
          path: "renderedOn",
          operator: RelationalOperatorEnum.NOT,
          value: undefined
        }],
        logicalOperator: LogicalOperatorEnum.AND
      }) as Array<VideoRecord>;
    } catch (error: unknown) {
      filelog(error as string);
      throw new Error(`Error reading DB ${dbName} ${error}`);
    }

    for (let vI = 0; vI < videoRecords.length; vI++) {

      const singleVideo = videoRecords[vI];
      // NEXT STEPS: Random Composition Ids can be assigned to each video
      const { id } = singleVideo;
      console.log(`\n(${vI + 1}/${videoRecords.length}) START`);
      filelog(`STARTED RENDERING ${id} at: ${new Date()}`);

      await renderOne(singleVideo, bundleLocationPath).catch(
        (error) => {
          filelog(`Skipped: ${(singleVideo.compositionInfo.defaultProps as any).title || id} | Error: ${error}`);
        },
      );
      console.log(`(${vI + 1}/${videoRecords.length}) END _________________________________\n`);
      // NEXT STEPS: Update JSON with rendered video info
    }
    filelog(`COMPLETED RENDERING at: ${new Date()}`)
  } catch (error) {
    throw new Error(`ERROR: ${error}`);
  }
};
