import express from "express";
import { router as youtubeRouter } from "./youtube";
import { router as compositionRouter } from "./composition";
import { router as renderingRouter } from "./rendering";
export const router = express.Router();

router.use("/youtube", youtubeRouter);
router.use("/composition", compositionRouter);
router.use("/render", renderingRouter);

router.use("*", (req, res) => {
  res.status(404).json("API Route NOT Found");
});
