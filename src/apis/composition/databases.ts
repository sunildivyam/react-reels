import { Request, Response } from "express";
import { router } from "./index";

import JsonDb from "../../jsondb/JsonDb";
import { getFilesFromDirectory } from "../../core-lib/FileUtils";
import { DB_DATA_FOLDER } from "../../jsondb/constants";

router.get("/list-dbs", async (req: Request, res: Response) => {
  try {
    const files = await getFilesFromDirectory(DB_DATA_FOLDER);
    const dbNames = files.map((file) => file.split(".json")[0]);
    res.json(dbNames);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/add-db", async (req: Request, res: Response) => {
  const { dbName } = req.body;

  try {
    const db = new JsonDb(dbName as string);
    await db.load(true);
    res.json(dbName);
  } catch (error) {
    res.status(500).send(error);
  }
});
