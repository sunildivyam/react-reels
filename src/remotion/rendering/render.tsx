import { moveProcessedData, renderAll } from "./helpers";
import filelog from '../../core-lib/Logger';
import yargs from "yargs";
import { PROCESSED_DIR, PROCESSED_DIRS, PUBLIC_DIR } from "../constants";

/**
 * Gets parameters from command prompt for rendering
 * compositionId: compositionId to render
 * fileName of json data file
 * @returns {json, bundleLocation}
 */

async function getCmdArguments() {
  const args = process.argv.slice(2);
  const options = yargs(args)
    .option("json", {
      alias: "j",
      type: "string",
      description: "Path of JSON data file relative to public folder",
    })
    .option("bundleLocation", {
      alias: "b",
      type: "string",
      description: "Bundle location",
    })
    .help().argv;

  const { json, bundleLocation } = await options;
  if (!json) throw new Error("Video Json file path required");

  return { json, bundleLocation };
}


async function main() {
  filelog.clear();

  try {
    const { json, bundleLocation } = await getCmdArguments();

    await renderAll(json, bundleLocation || '')
      .then(() => {
        filelog('All Renders Completed.');
        filelog(`Moving all files and data to ${PROCESSED_DIR}`);

        // NEXT STEPS: Move only completed data and asset files to processed data folder.
        moveProcessedData(PUBLIC_DIR, PROCESSED_DIR, PROCESSED_DIRS);
      })
      .catch((error) => {
        console.error(error);
        filelog(error);
        process.exit(1);
      });
  } catch (error: unknown) {
    filelog(error as string);
  }
}

main();
