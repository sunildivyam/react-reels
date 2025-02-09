import { Request, Response } from "express";
import { router } from "./index";

import {
  oauth2Client,
  storeToken,
  YOUTUBE_API_SCOPES,
} from "../../youtube/auth";

router.get("/auth", (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: YOUTUBE_API_SCOPES,
  });

  res.redirect(url);
});

router.get("/oauth2callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    await storeToken(tokens.access_token || "");
    res.send("Authenticated, Tokens saved in env for use.");
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Error during OAuth");
  }
});

router.get("/authorized", async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    const token = tokens.access_token || "";
    res.json({ token });
  } catch (error) {
    console.log("Error", error);
    res.status(401).json({ message: "Not Authorized" });
  }
});
