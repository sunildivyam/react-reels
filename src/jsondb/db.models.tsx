export interface YoutubeInfo {
  channelId?: string;
  videoId?: string;
  uploadedOn?: Date;
  publishedAt?: Date;
  scheduleAfterHrs?: number;
}

export interface CompositionInfo {
  id: string,
  originalId: string,
  fps: number,
  width: number,
  height: number,
  durationInSeconds: number,
  rangeInSeconds: [number, number],
  transparent: boolean;
  defaultProps: object,
}

export interface VideoRecord {
  id: string;
  compositionInfo: CompositionInfo;
  outFileName: string;
  socialMedia: object;
  youTube?: YoutubeInfo;
  instagram?: object;
  renderedOn?: Date;
}

export type DbRecord = Record<string, VideoRecord>;

export enum RelationalOperatorEnum {
  NOT = '!',
  EQUALS = '==',
  NOT_EQUALS = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
}
export enum LogicalOperatorEnum {
  AND = '&&',
  OR = '||',
}

export interface Query {
  path: string;
  operator: RelationalOperatorEnum;
  value: string | number | boolean | Date | undefined | null;
}

export interface Queries {
  queries: Array<Query>;
  logicalOperator: LogicalOperatorEnum;
}

export interface DbOptions {
  /**
   * dot separated keys to check against, for duplicates
   * Ex: ['compositionInfo.defaultProps.title', 'compositionInfo.defaultProps.summary' ]
   */
  duplicateCheckKeys?: Array<string>;
  /**
   * Writes to DISK after writeDeferMs milliseconds, if any data is updated
   */
  writeDeferMs?: number;
}
