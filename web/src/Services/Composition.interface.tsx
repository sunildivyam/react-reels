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
  rangeInSeconds: [number, number] | [],
  transparent: boolean;
  defaultProps: CompositionProps,
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

export interface CompositionProps {
  name?: string;
  title?: string;
  subTitle?: string;
  summary?: string;
  translation?: string;
  isVideoType?: boolean;
  filter?: string;
  categoryImage?: string;
  logo?: string;
  music?: string;
  images?: string[];
  videos?: string[];
  imageSeconds?: number;
  bgGradient?: BgGradient;
  particles?: CompositionParticles;
}


export interface BgGradient {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}

export interface CompositionParticles {
  count: number;
  speed: { min: number, max: number };
  opacity: number;
  smoothness: number;
  size: number;
  color: string;
  lightDistance: number;
  lightIntensity: number;
  lightColor: string;
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  shininess: number;
}
