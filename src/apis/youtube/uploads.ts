import { Request, Response } from "express";
import { router } from "./index";

import { getAuth } from "../../youtube/auth";
import { uploadVideo } from "../../youtube/uploads";
import { resolvedPath } from "../../core-lib/Utils";

router.post("/upload", async (req: Request, res: Response) => {
  const { videoUpload, videoFilePath } = req.body;
  const vFile = resolvedPath(videoFilePath);

  try {
    const uploaded = await uploadVideo(getAuth(), videoUpload, vFile);

    res.json(uploaded);
  } catch (error) {
    res.status(500).send(error);
  }
});
