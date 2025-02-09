import { Request, Response } from "express";
import { router } from "./index";

import { getAuth } from "../../youtube/auth";
import { getChannel, getPlaylists } from "../../youtube/channel";

router.get("/channel", async (req: Request, res: Response) => {
  try {
    const channel = await getChannel(getAuth());
    res.json(channel);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/channel/playlists", async (req: Request, res: Response) => {
  try {
    const playlists = await getPlaylists(getAuth());
    res.json(playlists);
  } catch (error) {
    res.status(500).send(error);
  }
});
