import path from "path";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import relaxingVideos from "./RelaxingVideo/data/final-relaxing-videos.json";
import { encodeFileName } from "./lib/Utils";
import { RelaxingVideoProps } from "./RelaxingVideo";

const renderOne = async (
  relaxingVideo: RelaxingVideoProps,
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
    inputProps: relaxingVideo,
    id: compositionId,
  });

  const outputLocation = `out/${encodeFileName(relaxingVideo.title)}.mp4`;
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps: relaxingVideo,
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

      process.stdout.write(
        `${outputLocation} | ${stitchStage} | ${Math.floor(progress * 100)}% | renderedFrames: ${renderedFrames} | renderEstimatedTime: ${renderEstimatedTime} | encodedFrames: ${encodedFrames} | encodedDoneIn: ${encodedDoneIn} | renderedDoneIn: ${renderedDoneIn}\r`,
      );
    },
  });
  console.log(`${outputLocation} | DONE`);
};

const start = async () => {
  // The composition you want to render
  const compositionId = "relaxingVideo";

  // You only have to do this once, you can reuse the bundle.
  const entry = "src/index.ts";
  console.log("Creating a Webpack bundle of the video");

  const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
    // If you have a Webpack override, make sure to add it here
    webpackOverride: (config) => config,
  });

  for (const element of relaxingVideos) {
    const singleRelaxingVideo = { ...element };
    await renderOne(singleRelaxingVideo, bundleLocation, compositionId).catch(
      (error) => {
        console.error(`Skipped: ${singleRelaxingVideo.title}`, error);
      },
    );
  }
};

start()
  .then(() => {
    console.log("Render Completed.");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
