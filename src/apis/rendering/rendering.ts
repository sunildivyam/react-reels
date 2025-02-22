import { Request, Response } from "express";
import { router } from "./index";

import { renderAll } from "../../remotion/rendering/helpers";
import { REMOTION_BUNDLE_PATH } from "./rendering.constants";

router.post("/videorecords", async (req: Request, res: Response) => {
  const { dbName, videoRecords } = req.body;

  try {
    const DEV = process.env.DEV;
    renderAll(dbName, videoRecords, DEV ? "" : REMOTION_BUNDLE_PATH);
    res.json({ started: true, startedOn: Date.now() });
  } catch (error) {
    res.status(500).send(error);
  }
});

export { router };
