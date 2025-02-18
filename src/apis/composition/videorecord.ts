import { Request, Response } from "express";
import { router } from "./index";

import JsonDb from "../../jsondb/JsonDb";

router.get("/all", async (req: Request, res: Response) => {
  const { dbName } = req.query;

  try {
    const db = new JsonDb(dbName as string);
    await db.load(true);
    const all = db.all();
    res.json(all);
  } catch (error) {
    res.status(500).send(error);
  }
});
