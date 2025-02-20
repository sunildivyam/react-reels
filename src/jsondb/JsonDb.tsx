
import * as fs from 'fs/promises';
import * as path from 'path';
import { CHANGED_EVENT, DB_DATA_FOLDER, DB_ID, RELATIVE_PATH_TO_ROOT, WRITE_DEFER_MS } from './constants';
import EventEmitter from 'node:events';
import { DbOptions, DbRecord, LogicalOperatorEnum, Queries, Query, RelationalOperatorEnum } from './db.models';


class JsonDb {
  /**
   * Name of the db, and will be used for saving the file on disk
   */
  private _filePath: string = '';
  /**
   * Db cache of all records
   */
  private _json: DbRecord = {};
  /**
   * Keeps a check if db is updated (record added, updated, deleted)
   * if true, then operations list/getRecord should read from disk
   */
  private _isDbLoaded: boolean = false;

  private _eventEmitter = new EventEmitter();
  private _saveTimeout: any = null;
  private _options: DbOptions = {
    duplicateCheckKeys: [],
    writeDeferMs: WRITE_DEFER_MS
  };

  public static instances: Record<string, JsonDb> = {};

  constructor(dbName: string) {
    // Stops creating Multiple instances of Same Db
    const existingInstance = JsonDb.instances[dbName];
    if (existingInstance) {
      return existingInstance;
    } else {
      JsonDb.instances[dbName] = this;
    }

    // Resolve Path
    this._filePath = path.resolve(__dirname, RELATIVE_PATH_TO_ROOT, DB_DATA_FOLDER, `${dbName}.json`);

    // Save to Disk when db data modified.
    this._eventEmitter.on(CHANGED_EVENT, () => {
      if (!this._saveTimeout) {
        this._saveTimeout = setTimeout(() => {
          this.save();
          clearTimeout(this._saveTimeout);
          this._saveTimeout = null;
        }, this._options.writeDeferMs || 0);
      }
    })
  }

  public get options(): DbOptions {
    return this._options;
  }

  public set options(v: DbOptions) {
    this._options = v;
  }

  private generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substring(2, 9);
  }

  private async save(): Promise<void> {
    try {
      const jsonData = JSON.stringify(this._json, null, 2);
      await fs.mkdir(path.dirname(this._filePath), { recursive: true });
      await fs.writeFile(this._filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saving JSON file:', error);
      throw error;
    }
  }

  private checkAndLoadDb() {
    if (!this._isDbLoaded) throw new Error(`DB is not loaded. Please call await db.load() first.`);
  }

  private exists(id: string, record: object): object | null {
    const existing = this._json[id];
    if (existing) {
      return existing;
    }

    // check ifExtended duplicate check needs to be verified.
    if (this._options.duplicateCheckKeys?.length) {
      const existingRecords = this.query({
        queries: this._options.duplicateCheckKeys.map(key => {
          const fieldPath = key.split('.');
          let fieldValue: any = record;
          for (const segment of fieldPath) {
            if (fieldValue !== undefined) {
              fieldValue = fieldValue[segment];
            }
          }

          return {
            path: key,
            operator: RelationalOperatorEnum.EQUALS,
            value: fieldValue
          }
        }),
        logicalOperator: LogicalOperatorEnum.AND
      });
      return existingRecords.length ? existingRecords[0] : null;
    } else {
      return null;
    }
  }

  public async load(force: boolean = false): Promise<void> {
    if (force || !this._isDbLoaded) {
      try {
        const fileExists = await fs.access(this._filePath).then(() => true).catch(() => false);
        if (!fileExists) {
          await this.save();
        }
        const data = await fs.readFile(this._filePath, 'utf-8');
        this._json = JSON.parse(data);
        this._isDbLoaded = true;
      } catch (error) {
        this._json = {};
        console.error('Error reading JSON file:', error);
        throw error;
      }
    } else {
      return;
    }
  }
  /**
   * Add Records to db, if duplicates exist and overwrite is true, updates them. Else duplicates will not be added.
   * @param records
   * @param overWriteExisting
   * @returns Added Records with their generated IDs.
   */
  public async add(records: Array<object>, overWriteExisting: boolean = false): Promise<Array<object>> {
    this.checkAndLoadDb();
    if (!records?.length) throw new Error('No records provided to add');
    const failed: Array<object> = [];
    records.forEach((r: any) => {
      const id = r.id ? r.id : this.generateUniqueId();

      const existing = this.exists(id, r);
      if (existing) {
        if (overWriteExisting) {
          delete r.id;
          this._json[(existing as any).id] = { ...r };
        } else {
          failed.push(r);
        }
      } else {
        delete r.id;
        this._json[id] = { ...r };
      }
      r.id = id;
    });

    this._eventEmitter.emit(CHANGED_EVENT, records);
    return records;
  }

  /**
   * Updates existing and creates add new ones if not existed.
   * @param records
   * @returns Updated or Added Records, with their generated Ids, if added
   */
  public async update(records: Array<object>): Promise<Array<object>> {
    this.checkAndLoadDb();
    if (!records?.length) throw new Error('No records provided to update');
    const added: Array<object> = [];
    records.forEach((r: any) => {
      const id = r.id ? r.id : this.generateUniqueId();

      const existing = this.exists(id, r);
      if (!existing) {
        added.push({ ...r, id });
      }

      delete r.id;
      this._json[id] = { ...r };
      r.id = id;
    });

    this._eventEmitter.emit(CHANGED_EVENT);
    return records;
  }

  public async delete(records: Array<object>): Promise<void> {
    this.checkAndLoadDb();
    if (!records?.length) throw new Error('No records provided to delete');
    records.forEach((r: any) => {
      r.id && delete this._json[r.id];
    });
    this._eventEmitter.emit(CHANGED_EVENT);
  }

  public find(id: string): object | undefined {
    this.checkAndLoadDb();
    const found = id ? this._json[id] : undefined;
    return found ? { ...found, id } : undefined;
  }


  public query(queries: Queries): Array<object> {
    this.checkAndLoadDb();
    const results: Array<object> = [];

    const evaluateQuery = (record: any, query: Query): boolean => {
      const fieldPath = query.path.split('.');
      let fieldValue = record;
      for (const segment of fieldPath) {
        if (fieldValue === undefined) return false;
        fieldValue = fieldValue[segment];
      }

      switch (query.operator) {
        case RelationalOperatorEnum.NOT:
          return !fieldValue;
        case RelationalOperatorEnum.EQUALS:
          return fieldValue === query.value;
        case RelationalOperatorEnum.NOT_EQUALS:
          return fieldValue !== query.value;
        case RelationalOperatorEnum.GREATER_THAN:
          return query.value != null && fieldValue > query.value;
        case RelationalOperatorEnum.LESS_THAN:
          return query.value != null && fieldValue < query.value;
        case RelationalOperatorEnum.GREATER_THAN_OR_EQUAL:
          return query.value != null && fieldValue >= query.value;
        case RelationalOperatorEnum.LESS_THAN_OR_EQUAL:
          return query.value != null && fieldValue <= query.value;
        default:
          return false;
      }
    };

    const evaluateQueries = (record: any, queries: Queries): boolean => {
      return queries.queries.reduce((acc, query) => {
        const result = evaluateQuery(record, query);
        if (queries.logicalOperator === LogicalOperatorEnum.AND) {
          return acc && result;
        } else {
          return acc || result;
        }
      }, queries.logicalOperator === LogicalOperatorEnum.AND);
    };

    for (const id in this._json) {
      const record = this._json[id];
      if (evaluateQueries(record, queries)) {
        results.push({ ...record, id });
      }
    }

    return results;
  }

  public all(): Array<object> {
    this.checkAndLoadDb();
    const results: Array<object> = Object.entries(this._json).map(ent => ({ ...ent[1], [DB_ID]: ent[0] }));

    return results;
  }
}

export default JsonDb;
