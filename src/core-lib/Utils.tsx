import path from "path";

// Relative path to project root, from __dirname
const RELATIVE_PATH = '../../';

export function resolvedPath(file: string): string {
  if (path.isAbsolute(file)) return file;
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

export function getETA(progressPercent: number, progressTimeMs: number, completedCount: number, totalCount: number) {
  if (progressPercent <= 0 || completedCount <= 0) {
    return "N/A";
  }

  const etaPerItem = progressTimeMs / completedCount;
  const remainingCount = totalCount - completedCount;
  const remainingTime = etaPerItem * remainingCount;

  return formatDuration(remainingTime);
}
