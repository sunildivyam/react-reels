import { readdir, lstat, writeFile, readFile } from "fs/promises";
import path from 'path';
import { resolvedPath } from "./Utils";

export const getFilesFromDirectory = async (directoryPath: string): Promise<string[]> => {
  const dirPath = resolvedPath(directoryPath);
  const files = await readdir(dirPath);
  const fileStats = await Promise.all(files.map(async file => {
    const filePath = path.join(dirPath, file);
    const stats = await lstat(filePath);
    return stats.isFile() ? file : null;
  }));

  return fileStats.filter(file => file !== null) as string[];
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readJsonFile(jsonFile: string): Promise<any> {
  const filePath = resolvedPath(jsonFile);

  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}


export const saveToJsonFile = async (json: object, fileName: string) => {
  const filePath = resolvedPath(fileName);

  await writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8')
}
