import yargs from "yargs";
import path from 'path';
import { buildBundle } from "./helpers";
import { copyFiles, getFilesFromDirectory, saveToJsonFile } from "../../core-lib/FileUtils";
import { resolvedPath } from "../../core-lib/Utils";

// Runs the bundler, and builds saves it to outDir if passed else to Windows default temp dir
const TRIAL_PERIOD = 31 * 24 * 60 * 60 * 1000; // one month


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

async function createTrialPeriodStamp(destDir: string) {
  const trialFile = '.bundle';
  await saveToJsonFile({ x: Date.now(), y: TRIAL_PERIOD, m: 'Your Trial has expired. Please contact: +91-9910129602' }, path.join(resolvedPath(destDir), trialFile));
}

async function copyAdditionalBuildFiles(destDir: string) {
  const folders = ['src/core-lib', 'src/remotion/rendering'];
  const excludeFile = 'bundle.tsx'; // Exclude budle.tsx itself
  let files = ['package.json', 'tsconfig.json', '.eslintrc', 'src/remotion/constants.tsx']

  for (const folder of folders) {
    const folderFiles = await getFilesFromDirectory(folder);

    files = files.concat(files, folderFiles.map(f => path.join(folder, f)).filter(f => !f.includes(excludeFile)));
  }

  await copyFiles(files, destDir);
  await createTrialPeriodStamp(destDir);
}

async function main() {
  const { outDir } = await getCmdArguments();
  if (!outDir) console.log('You can specify Output bundle directory by -- -o [oudir], by default it is windows temp directory');
  const bundleLocation = await buildBundle(outDir);
  console.log(`\nBundle Created in: \n ${bundleLocation}`);

  console.log('Copying Video Engine node files...');

  await copyAdditionalBuildFiles(bundleLocation);
  console.log('Copying Video Engine node files - COMPLETED');
}

main();
