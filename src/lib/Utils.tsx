import { readFile } from "fs/promises";
import path from "path";

export function encodeFileName(input: string): string {
  return input.replace(/[\/\\*<>|:*"?]/g, ' ');
}

export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


export async function readJsonFile(jsonFile: string): Promise<any> {
  const filePath = path.resolve(__dirname, jsonFile);
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}
