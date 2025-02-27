import { Request, Response } from "express";
import { router } from "./index";

import JsonDb from "../../jsondb/JsonDb";
import { compositionIds } from "../../remotion/compositions";

router.get("/all", async (req: Request, res: Response) => {
  const { dbName } = req.query;

  try {
    const db = new JsonDb(dbName as string);
    await db.load();
    const all = db.all();
    res.json(all);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/add", async (req: Request, res: Response) => {
  const { dbName, videoRecord } = req.body;
  const isSingleRecord = !Array.isArray(videoRecord);

  try {
    const db = new JsonDb(dbName as string);
    await db.load();
    const added = await db.add(
      isSingleRecord ? [videoRecord] : [...videoRecord],
    );
    res.json(isSingleRecord ? added[0] : added);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/update", async (req: Request, res: Response) => {
  const { dbName, videoRecord } = req.body;

  try {
    const db = new JsonDb(dbName as string);
    await db.load();
    const [updated] = await db.update([videoRecord]);
    res.json(updated);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/delete", async (req: Request, res: Response) => {
  const { dbName, videoRecord } = req.body;

  try {
    const db = new JsonDb(dbName as string);
    await db.load();
    await db.delete([videoRecord]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/ids", async (req: Request, res: Response) => {
  try {
    res.json(compositionIds);
  } catch (error) {
    res.status(500).send(error);
  }
});
