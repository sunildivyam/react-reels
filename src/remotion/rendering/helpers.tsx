import { selectComposition, renderMedia } from "@remotion/renderer";
import { encodeFileName, formatDuration, getETA, resolvedPath, toPercentage } from "../../core-lib/Utils";
import { readJsonFile } from "../../core-lib/FileUtils";
import fs from 'fs';
import fse from 'fs-extra';
import path from "path";
import { bundle } from "@remotion/bundler";
import filelog from '../../core-lib/Logger';
import { entryPoint, OUT_DIR, RENDER_MEDIA_CONFIG } from "../constants";
import { appEvents, AppEventsEnum } from "../../core-lib/AppEvents";
import JsonDb from "../../jsondb/JsonDb";
import { LogicalOperatorEnum, RelationalOperatorEnum } from "../../jsondb/db.models";
import { RenderProgressType, RenderProgressItemType } from "./rendering.interface";
import { VideoRecord } from "../interfaces";

const updatedProgress = (p: RenderProgressType): RenderProgressType => {
  p.timeEllapsedMS = Date.now() - p.timeStartedMS;
  return p;
}

/**
 * build the Remotion Webpack Bundle and saves in the outDir
 * @param outDir Optional, default is windows temp dir
 * @returns path of the generated webpackbundle
 */
export const buildBundle = async (outDir: string = ''): Promise<string> => {
  // You only have to do this once, you can reuse the bundle.
  const entry = entryPoint;
  filelog('Creating a Webpack bundle of the video');

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

export function isProgressChanged(prevProgress: RenderProgressItemType, currentProgress: RenderProgressItemType): boolean {
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
    if (fs.existsSync(srcPath)) {
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
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderOne = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  singleVideo: VideoRecord,
  bundleLocation: string,
  renderProgress: RenderProgressType,
): Promise<VideoRecord> => {
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


  const outFileName = `${encodeFileName((defaultProps as any).title || singleVideo.id)}-${Date.now()}.${transparent ? 'webm' : 'mp4'}`
  const outputLocation = `${OUT_DIR}/${outFileName}`;
  const startTime = Date.now();
  singleVideo.outFileName = outputLocation;
  filelog(`${outputLocation} \n`);

  const cFrameRange: [number, number] = rangeInSeconds?.length ? [rangeInSeconds[0] * fps, rangeInSeconds[1] * fps] : [0, composition.durationInFrames - 1];

  let prevProgress = {} as RenderProgressItemType;

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
        const progressMsg = `Stage: ${stitchStage} | ${Math.floor(progress * 100)}%\nrendering: ${renderedFrames}(${totalFrames})\nencoding: ${encodedFrames}(${totalFrames})\nETA: (${formatDuration(Date.now() - startTime)} / ${formatDuration(renderEstimatedTime)}) | Remaining: ${eta}\r`;
        filelog(progressMsg, 3);
        renderProgress.currentItem = {
          ...renderProgress.currentItem,
          progress: { ...rProgress, progress: rProgress.progress * 100 },
          message: progressMsg
        };
        appEvents.emit(AppEventsEnum.COMPOSITION_PROGRESS, updatedProgress(renderProgress));
        prevProgress = rProgress;
      }

      // if (encodedDoneIn !== null || renderedDoneIn !== null) {
      //   filelog(`|encodedDoneIn: ${formatDuration(encodedDoneIn || 0)} | renderedDoneIn: ${formatDuration(renderedDoneIn || 0)}`);
      // }
    },
  });

  singleVideo.renderedOn = new Date();

  filelog(
    `\n\n\n\n${outputLocation} | DONE in ${formatDuration(Date.now() - startTime)}\n`,
  );

  return singleVideo;
};

export async function checkBundle() {
  if (process.env.REMOTION_DEV) return;
  const { x, y, m } = await readJsonFile('.bundle');
  if (Date.now() - x > y) throw Error(m);
}

export const startRender = async (dbName: string) => {
  const db = new JsonDb(dbName);
  await db.load();

  try {
    const videoRecords: Array<VideoRecord> = db.query({
      queries: [{
        path: "renderedOn",
        operator: RelationalOperatorEnum.NOT,
        value: undefined
      }],
      logicalOperator: LogicalOperatorEnum.AND
    }) as Array<VideoRecord>;

    return videoRecords;
  } catch (error: unknown) {
    filelog(error as string);
    throw new Error(`Error reading DB ${dbName} ${error}`);
  }
}

export const renderAll = async (dbName: string, videoRecords: Array<VideoRecord>, bundleLocation: string) => {
  const db = new JsonDb(dbName);
  await db.load();

  let renderProgress: RenderProgressType = {
    dbName: dbName,
    timeStartedMS: Date.now(),
    timeEllapsedMS: 0,
    progress: 0,
    currentItem: {
      videoRecord: undefined,
      progress: undefined,
      error: undefined,
    },
    currentItemNo: 0,
    totalItems: videoRecords.length,
    renderedVideoUrls: [],
    history: []
  }

  try {
    // Batch Start event
    appEvents.emit(AppEventsEnum.RENDER_START, renderProgress);

    // Build and get bundle location
    const bundleLocationPath: string = bundleLocation || await buildBundle();

    // Start batch items
    const videoRecordsCount = videoRecords.length;
    for (let vI = 0; vI < videoRecordsCount; vI++) {
      const videoRecord = videoRecords[vI];
      const currentVrNo = vI + 1;
      // Update render Progress
      renderProgress = {
        ...renderProgress,
        progress: toPercentage(vI, videoRecordsCount),
        currentItem: {
          videoRecord: videoRecord,
          message: '',
          error: '',
          progress: {
            renderedFrames: 0,
            encodedFrames: 0,
            encodedDoneIn: null,
            renderedDoneIn: null,
            renderEstimatedTime: 0,
            progress: 0,
            stitchStage: "encoding"
          }
        },
        currentItemNo: currentVrNo,
        totalItems: videoRecordsCount
      }

      // NEXT STEPS: Random Composition Ids can be assigned to each video
      const { id } = videoRecord;
      console.log(`\n(${currentVrNo}/${renderProgress.totalItems}) START`);

      filelog(`STARTED RENDERING ${id} at: ${new Date()}`);

      // VR PROGRESS
      appEvents.emit(AppEventsEnum.RENDER_PROGRESS, updatedProgress(renderProgress));
      appEvents.emit(AppEventsEnum.COMPOSITION_START, updatedProgress(renderProgress));

      try {
        const renderedVideoRecord = await renderOne(videoRecord, bundleLocationPath, renderProgress);

        renderProgress.currentItem.videoRecord = renderedVideoRecord;
        renderProgress.progress = toPercentage(currentVrNo, videoRecordsCount);
        renderProgress.renderedVideoUrls?.push(renderedVideoRecord.outFileName);
        renderProgress.history?.push(`${renderedVideoRecord.id} | ${renderedVideoRecord.outFileName}`);

        console.log('REND P', renderProgress.history);
        console.log('REND OUrls', renderProgress.renderedVideoUrls);
        db.update([renderedVideoRecord]);

        appEvents.emit(AppEventsEnum.COMPOSITION_FINISH, updatedProgress(renderProgress));

        console.log(`(${currentVrNo}/${videoRecords.length}) END _________________________________\n`);
      } catch (error: any) {
        if (renderProgress.currentItem.videoRecord) renderProgress.currentItem.videoRecord.outFileName = ''
        renderProgress.currentItem.error = error.message;
        renderProgress.progress = toPercentage(currentVrNo, videoRecordsCount);
        renderProgress.history = [`${videoRecord.id} | ${videoRecord.outFileName} | Error:${error.message}`, ...(renderProgress.history || [])]
        appEvents.emit(AppEventsEnum.COMPOSITION_FAILED, updatedProgress(renderProgress));
        filelog(`Skipped: ${(videoRecord.compositionInfo.defaultProps as any).title || id} | Error: ${error}`);
      }
    }

    renderProgress.progress = 100;
    appEvents.emit(AppEventsEnum.RENDER_FINISH, updatedProgress(renderProgress));
    filelog(`COMPLETED RENDERING at: ${new Date()}`)
  } catch (error: any) {
    renderProgress.error = error.message;
    renderProgress.progress = 100;
    renderProgress.history = [`Batch Error:${error.message}`, ...renderProgress.history || []]
    appEvents.emit(AppEventsEnum.RENDER_FAILED, updatedProgress(renderProgress));
    throw new Error(`ERROR: ${error}`);
  }
};
