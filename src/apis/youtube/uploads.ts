import { Request, Response } from "express";
import { router } from "./index";

import { getAuth } from "../../youtube/auth";
import { uploadVideos } from "../../youtube/uploads";
import JsonDb from "../../jsondb/JsonDb";
const YOUTUBE_UPLOAD_DB = "YouubeUploads";

router.get("/uploads", async (req: Request, res: Response) => {
  const { batchUploadId } = req.query;
  if (!batchUploadId) res.status(500).send("batchUploadId is required");

  try {
    const db = new JsonDb(YOUTUBE_UPLOAD_DB);
    await db.load();
    const youtubeBatchUpload = db.find(batchUploadId as string);
    res.json(youtubeBatchUpload);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/uploads", async (req: Request, res: Response) => {
  const { batchUpload } = req.body;
  try {
    const db = new JsonDb(YOUTUBE_UPLOAD_DB);
    await db.load();
    const youtubeBatchUpload = await db.add([batchUpload], true);
    res.json(youtubeBatchUpload[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/alluploads", async (req: Request, res: Response) => {
  try {
    const db = new JsonDb(YOUTUBE_UPLOAD_DB);
    await db.load();
    const youtubeBatchUploads = db.all();
    res.json(youtubeBatchUploads);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/upload", async (req: Request, res: Response) => {
  const { dbName, videoUploads } = req.body;

  try {
    const uploaded = await uploadVideos(getAuth(), dbName, videoUploads);

    res.json(uploaded);
  } catch (error) {
    res.status(500).send(error);
  }
});
