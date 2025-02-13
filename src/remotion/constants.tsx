import { OpenGlRenderer } from "@remotion/renderer";

export enum ASSETS_DIRS {
  IMAGES = 'images',
  VIDEOS = 'videos',
  MUSIC = 'music',
  DATA = 'data',
};
export const entryPoint = 'src/remotion/index.tsx';
export const PUBLIC_DIR = 'public';
export const PROCESSED_DIR = 'processed data';

export const PROCESSED_DIRS = [...Object.values(ASSETS_DIRS), 'json_db_data'];
export const REMOTION_DEFAULTS = 'public/remotion-defaults';
export const OUT_DIR = 'out';

export const HD_REEL = {
  width: 1080,
  height: 1920,
  FPS: 30,
  DURATION_SECONDS: 30
}

export const HD_VIDEO = {
  width: 1080,
  height: 1920,
  FPS: 30
}

export const RENDER_MEDIA_CONFIG = {
  overwrite: true,
  timeoutInMilliseconds: 240 * 1000,
  concurrency: 8,
  openGLRenderer: 'angle' as OpenGlRenderer
}
