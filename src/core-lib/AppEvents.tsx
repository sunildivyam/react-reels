
import { EventEmitter } from 'node:events';


export class AppEvents extends EventEmitter {
  public static instance: AppEvents;

  private constructor() {
    super();
  }

  public static getInstance(): AppEvents {
    if (!AppEvents.instance) {
      AppEvents.instance = new AppEvents();
    }
    return AppEvents.instance;
  }
}
export const appEvents = AppEvents.getInstance();

export enum AppEventsEnum {
  RENDER_START = 'RENDER_START',
  RENDER_FINISHED = 'RENDER_FINISHED',
  COMPOSITION_START = 'COMPOSITION_START',
  COMPOSITION_FINISHED = 'COMPOSITION_FINISHED',
  YOUTUBE_UPLOAD_START = 'YOUTUBE_UPLOAD_START',
  YOUTUBE_UPLOAD_FINISH = 'YOUTUBE_UPLOAD_FINISH',
  YOUTUBE_UPLOAD_FAILED = 'YOUTUBE_UPLOAD_FAILED',
  YOUTUBE_PLAYLIST_ITEM_ADDED = 'YOUTUBE_PLAYLIST_ITEM_ADDED',
}
