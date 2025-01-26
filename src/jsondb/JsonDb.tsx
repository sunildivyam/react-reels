
import * as fs from 'fs/promises';
import * as path from 'path';
import { DB_DATA_FOLDER, RELATIVE_PATH_TO_ROOT } from './constants';


class JsonDb {
  private _filePath: string;
  private _json: Object = {};

  constructor(fileName: string) {
    // Resolve Path
    this._filePath = path.resolve(__dirname, RELATIVE_PATH_TO_ROOT, DB_DATA_FOLDER, fileName);
  }

  async read(): Promise<any> {
    try {
      const data = await fs.readFile(this._filePath, 'utf-8');
      this._json = JSON.parse(data);;
      return this._json;
    } catch (error) {
      console.error('Error reading JSON file:', error);
      throw error;
    }
  }

  async save(): Promise<void> {
    try {
      const jsonData = JSON.stringify(this._json, null, 2);
      await fs.writeFile(this._filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saving JSON file:', error);
      throw error;
    }
  }
}

export default JsonDb;
