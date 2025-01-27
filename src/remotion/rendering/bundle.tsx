import yargs from "yargs";
import { buildBundle } from "./helpers";

// Runs the bundler, and builds saves it to outDir if passed else to Windows default temp dir


async function getCmdArguments() {
  const args = process.argv.slice(2);
  const options = yargs(args)
    .option("outDir", {
      alias: "o",
      type: "string",
      description: "Bundle output folder path",
    })
    .help().argv;

  const { outDir } = await options;
  // if (!outDir) throw new Error("Bundle Output folder required");

  return { outDir };
}

async function main() {
  const { outDir } = await getCmdArguments();
  const bundleName = await buildBundle(outDir);
  console.log(`\nBundle Created in: \n ${bundleName}`);
}

main();
