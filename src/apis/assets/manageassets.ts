import { Request, Response } from "express";
import { router } from "./index";
import {
  ASSETS_DIRS,
  IMAGE_THUMB_SIZE,
  IMAGES_THUMB_DIRNAME,
  PUBLIC_DIR,
} from "./constants";
import { deleteFiles, getFilesFromDirectory } from "../../core-lib/FileUtils";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { resolvedPath } from "../../core-lib/Utils";
import ffmpeg from "fluent-ffmpeg";

router.use(
  "/images/thumb",
  express.static(`${PUBLIC_DIR}/${ASSETS_DIRS.IMAGES}/${IMAGES_THUMB_DIRNAME}`),
);
router.use(
  "/videos/thumb",
  express.static(`${PUBLIC_DIR}/${ASSETS_DIRS.VIDEOS}/${IMAGES_THUMB_DIRNAME}`),
);
router.use("/images", express.static(`${PUBLIC_DIR}/${ASSETS_DIRS.IMAGES}`));
router.use("/music", express.static(`${PUBLIC_DIR}/${ASSETS_DIRS.MUSIC}`));
router.use("/videos", express.static(`${PUBLIC_DIR}/${ASSETS_DIRS.VIDEOS}`));

router.get("/list/images", async (req: Request, res: Response) => {
  try {
    const files = await getFilesFromDirectory(
      `${PUBLIC_DIR}/${ASSETS_DIRS.IMAGES}`,
    );
    const result = files.map((file) => ({
      filename: file,
      parentPath: ASSETS_DIRS.IMAGES,
      ext: file.split(".").pop(),
      name: file.substring(0, file.lastIndexOf(".")),
    }));
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/list/music", async (req: Request, res: Response) => {
  try {
    const files = await getFilesFromDirectory(
      `${PUBLIC_DIR}/${ASSETS_DIRS.MUSIC}`,
    );
    const result = files.map((file) => ({
      filename: file,
      parentPath: ASSETS_DIRS.MUSIC,
      ext: file.split(".").pop(),
      name: file.substring(0, file.lastIndexOf(".")),
    }));
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

const getAssetDir = (fileType: string): string => {
  let assetDir = ASSETS_DIRS.IMAGES;
  switch (fileType) {
    case "image":
      assetDir = ASSETS_DIRS.IMAGES;
      break;
    case "video":
      assetDir = ASSETS_DIRS.VIDEOS;
      break;
    case "audio":
      assetDir = ASSETS_DIRS.MUSIC;
      break;
    default:
      throw new Error("Mime type not supported");
  }

  return assetDir;
};
router.get("/list/videos", async (req: Request, res: Response) => {
  try {
    const files = await getFilesFromDirectory(
      `${PUBLIC_DIR}/${ASSETS_DIRS.VIDEOS}`,
    );
    const result = files.map((file) => ({
      filename: file,
      parentPath: ASSETS_DIRS.VIDEOS,
      ext: file.split(".").pop(),
      name: file.substring(0, file.lastIndexOf(".")),
    }));
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "audio/mpeg",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, audio, and video files are allowed.",
      ),
      false,
    );
  }
};
const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    const assetType = getAssetDir(file.mimetype.split("/")[0]);

    let uploadPath = `${PUBLIC_DIR}/${assetType}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, fileFilter });

router.post(
  "/upload",
  upload.array("files"),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const progress = [];

      for (const file of files) {
        try {
          const fileType = file.mimetype.split("/")[0];
          const thumbDir = resolvedPath(
            `${PUBLIC_DIR}/${getAssetDir(fileType)}/${IMAGES_THUMB_DIRNAME}`,
          );

          if (fileType === "image" || fileType === "video") {
            if (!fs.existsSync(thumbDir)) {
              fs.mkdirSync(thumbDir, { recursive: true });
            }
          }

          if (fileType === "image") {
            await sharp(file.path)
              .resize(IMAGE_THUMB_SIZE)
              .toFile(path.join(thumbDir, file.filename));
          }

          if (fileType === "video") {
            await new Promise((resolve, reject) => {
              ffmpeg(file.path)
                .on("end", resolve)
                .on("error", reject)
                .screenshots({
                  count: 1,
                  folder: thumbDir,
                  filename: `${file.filename.substring(0, file.filename.lastIndexOf("."))}.jpg`,
                  size: `${IMAGE_THUMB_SIZE}x?`,
                });
            });
          }

          progress.push({
            filename: file.filename,
            status: "uploaded",
          });
        } catch (error: any) {
          console.log(error);
          progress.push({
            filename: file.filename,
            status: "failed",
            error: error,
          });
        }
      }

      res.json({ progress });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
);

router.post("/delete", async (req: Request, res: Response) => {
  try {
    const { assets } = req.body;
    try {
      const toDelete = assets.map(
        (asset: any) => `${PUBLIC_DIR}/${asset.parentPath}/${asset.filename}`,
      );
      const toDeleteThumbs = assets
        .filter(
          (asset: any) =>
            asset.parentPath === "images" || asset.parentPath === "videos",
        )
        .map(
          (asset: any) =>
            `${PUBLIC_DIR}/${asset.parentPath}/${IMAGES_THUMB_DIRNAME}/${asset.parentPath === "images" ? asset.filename : `${asset.name}.jpg`}`,
        );

      await deleteFiles([...toDelete, ...toDeleteThumbs]);
    } catch (error: any) {
      console.log(error);
    }
    res.json({ assets });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
