import { selectComposition, renderMedia, FrameRange, StitchingState } from "@remotion/renderer";
import { encodeFileName, formatDuration, getETA, readJsonFile, resolvedPath } from "../lib/Utils";
import fs from 'fs';
import fse from 'fs-extra';
import path from "path";
import { bundle } from "@remotion/bundler";
import filelog from '../lib/Logger';
import { entryPoint, PUBLIC_DIR } from "../constants";

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
        filelog(`Copying Public Directory: ${bytes} bytes\r`, true);
      },
      onProgress(progress) {
        filelog(`Bundling progress: ${progress}%\r`, true);
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

export const moveProcessedData = (srcDirectory: string, destDirectory: string, dirs: string[], compositionId: string) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderOne = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        const totalFrames = frameRange[1] - frameRange[0];

        filelog(
          `${outputLocation} | ${stitchStage} | ${Math.floor(progress * 100)}% | Frames(${totalFrames}) (rendered: ${renderedFrames} encoded: ${encodedFrames}) | ETA: (${formatDuration(Date.now() - startTime)} / ${formatDuration(renderEstimatedTime)}) | Remaining: ${eta}\r`,
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

export const renderAll = async (compositionId: string, jsonPath: string) => {
  filelog(`STARTED RENDERING ${compositionId} at: ${new Date()}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let videoInfos: Array<any> = [];

  try {
    const bundleLocation: string = await buildBundle();
    try {
      videoInfos = await readJsonFile(`${PUBLIC_DIR}/data/${jsonPath}`);
    } catch (error: unknown) {
      filelog(error as string);
      throw new Error(`Error reading json file ${jsonPath} ${error}`);
    }

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
    throw new Error(`ERROR: ${error}`);
  }
};
