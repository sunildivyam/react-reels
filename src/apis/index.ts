import express from "express";
import { router as youtubeRouter } from "./youtube";

export const router = express.Router();

router.use("/youtube", youtubeRouter);

// Example route for getting all items
router.get("/items", (req, res) => {
  res.send("Get all items");
});

// Example route for getting a single item by ID
router.get("/items/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Get item with ID: ${id}`);
});

// Example route for creating a new item
router.post("/items", (req, res) => {
  const newItem = req.body;
  res.send(`Create a new item: ${JSON.stringify(newItem)}`);
});

// Example route for updating an item by ID
router.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  res.send(
    `Update item with ID: ${id}, with data: ${JSON.stringify(updatedItem)}`,
  );
});

// Example route for deleting an item by ID
router.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Delete item with ID: ${id}`);
});

router.use("*", (req, res) => {
  res.status(404).json("API Route NOT Found");
});
