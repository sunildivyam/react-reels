import { VideoRecord } from "./Composition.interface";

export interface RenderProgressType {
  dbName: string;
  timeStartedMS: number;
  timeEllapsedMS: number;
  progress: number;
  currentItem: {
    videoRecord?: VideoRecord;
    progress?: RenderProgressItemType;
    message?: string;
    error?: string
  };
  currentItemNo: number;
  totalItems: number;
  error?: string;
  renderedVideoUrls?: string[];
  history?: string[];
}

export type RenderProgressItemType = {
  renderedFrames: number;
  encodedFrames: number;
  encodedDoneIn: number | null;
  renderedDoneIn: number | null;
  renderEstimatedTime: number;
  progress: number;
  stitchStage: 'encoding' | 'muxing';
}
