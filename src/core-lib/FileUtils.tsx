import { readdir, lstat, writeFile, readFile, copyFile, mkdir, unlink } from "fs/promises";
import fs from 'fs'
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

export const getFilesFromDirectorySortedByDate = async (directoryPath: string): Promise<string[]> => {
  const dirPath = resolvedPath(directoryPath);
  const files = await readdir(dirPath);
  const fileStats = await Promise.all(files.map(async file => {
    const filePath = path.join(dirPath, file);
    const stats = await lstat(filePath);
    return { file, createdDate: stats.birthtime };
  }));

  return fileStats
    .filter(fileStat => fileStat.createdDate)
    .sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime())
    .map(fileStat => fileStat.file);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readJsonFile(fileName: string): Promise<any> {
  const filePath = resolvedPath(fileName);
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}


export async function saveToJsonFile(json: object, fileName: string) {
  const filePath = resolvedPath(fileName);
  await writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8')
}

export async function copyFiles(files: Array<string>, destDir: string) {

  const destPath = resolvedPath(destDir);

  for (const file of files) {
    const srcFile = resolvedPath(file);
    const destFile = path.join(destPath, file)
    const destDirPath = path.dirname(destFile);
    if (!fs.existsSync(destDirPath)) {
      await mkdir(destDirPath, { recursive: true });
    }
    await copyFile(srcFile, destFile, fs.constants.COPYFILE_FICLONE);
  }
}

export async function deleteFiles(files: Array<string>) {
  for (const file of files) {
    const srcFile = resolvedPath(file);
    if (fs.existsSync(srcFile)) {
      await unlink(srcFile);
    }
  }
}
