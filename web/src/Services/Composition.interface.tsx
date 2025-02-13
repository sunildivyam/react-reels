import { VideoMeta } from "./youtube.interface";

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


export interface VideoEngineType {
  dbName?: string;
  videoMeta?: VideoMeta;
  videoRecords?: VideoRecord[];
}
