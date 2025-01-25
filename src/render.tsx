import path from "path";
import yargs from "yargs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { encodeFileName, formatDuration, readJsonFile } from "./lib/Utils";

import filelog from './lib/Logger';

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


  const outputLocation = `out/${encodeFileName(videoProps.title)}.mp4`;
  const startTime = Date.now();

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps: videoProps,
    // frameRange: [0, 200],
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

      filelog(
        `${outputLocation} | ${stitchStage} | ${Math.floor(progress * 100)}% | Frames (rendered: ${renderedFrames} encoded: ${encodedFrames}) | ETA: ${formatDuration(Date.now() - startTime)} / ${formatDuration(renderEstimatedTime)}\r`,
        true);

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
    videoInfos = await readJsonFile(jsonPath);

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
  try {
    const { composition, json } = await getCmdArguments();

    await startRender(composition, json)
      .then(() => {
        filelog('All Renders Completed.');
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
