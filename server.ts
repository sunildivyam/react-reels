import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { router as apisRouter } from "./src/apis";

dotenv.config();
const DEV = process.env.DEV;
const rootPath = DEV ? "dist" : "./";

const app = express();
const port = 3000;

app.use(
  "/assets",
  express.static(path.join(__dirname, rootPath, "web/assets")),
);

// API routes
app.use("/api", apisRouter);

app.get("*", (req, res) => {
  const filePath = path.join(__dirname, rootPath, "web", "index.html");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  res.send(fileContent);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
