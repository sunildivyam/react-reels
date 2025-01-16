import path from "path";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { quotes } from "./data/Quotes";
import { DynamicReelType } from "./DynamicReel";

const renderOne = async (
  dynamicReel: DynamicReelType,
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
    inputProps: dynamicReel,
    id: compositionId,
  });

  const outputLocation = `out/${dynamicReel.name}.mp4`;
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps: dynamicReel,
    onProgress: (progress) => {
      // prints the info in same line
      process.stdout.write(
        `${outputLocation} | ${progress.stitchStage} | ${Math.floor(progress.progress * 100)}% \r`,
      );
    },
  });
  console.log(`${outputLocation} | DONE`);
};

const start = async () => {
  // The composition you want to render
  const compositionId = "dynamicReel";

  // You only have to do this once, you can reuse the bundle.
  const entry = "src/index.ts";
  console.log("Creating a Webpack bundle of the video");

  const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
    // If you have a Webpack override, make sure to add it here
    webpackOverride: (config) => config,
  });

  for (const element of quotes) {
    const singleDynamicReel = { ...element };
    await renderOne(singleDynamicReel, bundleLocation, compositionId).catch(
      (error) => {
        console.error(`Skipped: ${singleDynamicReel.name}`, error);
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
