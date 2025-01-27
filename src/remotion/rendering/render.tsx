import { moveProcessedData, renderAll } from "./helpers";
import filelog from '../lib/Logger';
import yargs from "yargs";
import { PROCESSED_DIR, PROCESSED_DIRS, PUBLIC_DIR } from "../constants";

/**
 * Gets parameters from command prompt for rendering
 * compositionId: compositionId to render
 * fileName of json data file
 * @returns {CompositionEvent, json}
 */

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


async function main() {
  filelog.clear();

  try {
    const { composition, json } = await getCmdArguments();

    await renderAll(composition, json)
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
