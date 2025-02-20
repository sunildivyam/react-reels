import { checkBundle, moveProcessedData, renderAll, startRender } from "./helpers";
import filelog from '../../core-lib/Logger';
import yargs from "yargs";
import { PROCESSED_DIR, PROCESSED_DIRS, PUBLIC_DIR } from "../constants";
import { appEvents, AppEventsEnum } from "../../core-lib/AppEvents";

/**
 * Gets parameters from command prompt for rendering
 * fileName of json data file
 * bundleLocation
 * @returns {json, bundleLocation}
 */

async function getCmdArguments() {
  const args = process.argv.slice(2);
  const options = yargs(args)
    .option("json", {
      alias: "j",
      type: "string",
      description: `DB Name of the compositions`,
      demandOption: `Usage Ex: -j Quote`
    })
    .option("bundleLocation", {
      alias: "b",
      type: "string",
      description: "Bundle location",
    })
    .help().argv;

  const { json, bundleLocation } = await options;
  // if (!json) throw new Error("Video Json file path required. Ex: -- -j RelaxingVideo.json");

  return { json, bundleLocation };
}


async function main() {
  try {
    await checkBundle();
  } catch (error: unknown) {
    console.log((error as any)?.message);
    return;
  }

  filelog.clear();

  try {
    const { json, bundleLocation } = await getCmdArguments();
    const videoRecords = await startRender(json, bundleLocation || '');
    await renderAll(json, videoRecords, bundleLocation || '')
      .then(() => {
        appEvents.emit(AppEventsEnum.RENDER_FINISHED);
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
