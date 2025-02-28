import { Request, Response } from "express";
import { router } from "./index";

import { getAuth } from "../../youtube/auth";
import { uploadVideos } from "../../youtube/uploads";

router.post("/upload", async (req: Request, res: Response) => {
  const { dbName, videoUploads } = req.body;

  try {
    const uploaded = await uploadVideos(getAuth(), dbName, videoUploads);

    res.json(uploaded);
  } catch (error) {
    res.status(500).send(error);
  }
});
