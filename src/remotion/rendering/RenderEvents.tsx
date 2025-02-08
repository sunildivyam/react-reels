
import { EventEmitter } from 'node:events';


export class RenderEvents extends EventEmitter {
  public static instance: RenderEvents;

  private constructor() {
    super();
  }

  public static getInstance(): RenderEvents {
    if (!RenderEvents.instance) {
      RenderEvents.instance = new RenderEvents();
    }
    return RenderEvents.instance;
  }
}
export const renderEventEmitter = RenderEvents.getInstance();

export enum RenderEventsEnum {
  RENDER_START = 'renderStart',
  RENDER_FINISHED = 'renderFinish',
  COMPOSITION_START = 'compositionStart',
  COMPOSITION_FINISHED = 'compositionEnd',
}
