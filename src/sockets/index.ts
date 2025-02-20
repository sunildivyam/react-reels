import { io } from "../../server";
import { appEvents, AppEventsEnum } from "../core-lib/AppEvents";

export { io };

appEvents.on(AppEventsEnum.RENDER_START, (e) => {
  io.emit(AppEventsEnum.RENDER_START, e);
});
appEvents.on(AppEventsEnum.RENDER_PROGRESS, (e) => {
  io.emit(AppEventsEnum.RENDER_PROGRESS, e);
});
appEvents.on(AppEventsEnum.RENDER_FINISHED, (e) => {
  io.emit(AppEventsEnum.RENDER_FINISHED, e);
});
appEvents.on(AppEventsEnum.RENDER_FAILED, (e) => {
  io.emit(AppEventsEnum.RENDER_FAILED, e);
});
appEvents.on(AppEventsEnum.COMPOSITION_START, (e) => {
  io.emit(AppEventsEnum.COMPOSITION_START, e);
});
appEvents.on(AppEventsEnum.COMPOSITION_PROGRESS, (e) => {
  io.emit(AppEventsEnum.COMPOSITION_PROGRESS, e);
});
appEvents.on(AppEventsEnum.COMPOSITION_FINISHED, (e) => {
  io.emit(AppEventsEnum.COMPOSITION_FINISHED, e);
});
appEvents.on(AppEventsEnum.COMPOSITION_FAILED, (e) => {
  io.emit(AppEventsEnum.COMPOSITION_FAILED, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_START, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_START, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_PROGRESS, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_PROGRESS, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_FINISH, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_FINISH, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_FAILED, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_FAILED, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_START, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_START, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_PROGRESS, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_PROGRESS, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_FINISH, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_FINISH, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_FAILED, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_UPLOAD_BATCH_FAILED, e);
});
appEvents.on(AppEventsEnum.YOUTUBE_PLAYLIST_ITEM_ADDED, (e) => {
  io.emit(AppEventsEnum.YOUTUBE_PLAYLIST_ITEM_ADDED, e);
});
