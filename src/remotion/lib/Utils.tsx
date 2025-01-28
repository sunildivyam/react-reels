import { readFile } from "fs/promises";
import path from "path";

// Relative path to project root, from __dirname
const RELATIVE_PATH = '../../../';

export function resolvedPath(file: string): string {
  return path.resolve(__dirname, RELATIVE_PATH, file);
}

export function encodeFileName(input: string): string {
  /* eslint-disable no-useless-escape */
  return input.replace(/[\/\\*<>|:*"?]/g, ' ');
}

export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readJsonFile(jsonFile: string): Promise<any> {
  const filePath = path.resolve(__dirname, RELATIVE_PATH, jsonFile);
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export function getETA(progressPercent: number, progressTimeMs: number, completedCount: number, totalCount: number) {
  if (progressPercent <= 0 || completedCount <= 0) {
    return "N/A";
  }

  const etaPerItem = progressTimeMs / completedCount;
  const remainingCount = totalCount - completedCount;
  const remainingTime = etaPerItem * remainingCount;

  return formatDuration(remainingTime);
}
