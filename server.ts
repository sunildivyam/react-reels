import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { router as apisRouter } from "./src/apis";
import cors from "cors";
import { Server } from "socket.io";
import http from "node:http";
import bodyParser from "body-parser";

dotenv.config();
const DEV = process.env.DEV;
const rootPath = DEV ? "dist" : ".";
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = 3000;
app.use(bodyParser.json());
app.use(cors());

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

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

/**
 * Socket io
 */

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
