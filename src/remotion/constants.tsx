export enum ASSETS_DIRS {
  IMAGES = 'images',
  VIDEOS = 'videos',
  MUSIC = 'music',
  DATA = 'data',
};
export const entryPoint = 'src/remotion/index.tsx';
export const PUBLIC_DIR = 'public';
export const PROCESSED_DIR = 'processed data';

export const PROCESSED_DIRS = [...Object.keys(ASSETS_DIRS)];
export const REMOTION_DEFAULTS = 'public/remotion-defaults';
export const OUT_DIR = 'out';
