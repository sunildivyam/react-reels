import { Request, Response } from "express";
import { router } from "./index";
import { genAiQuotes } from "../../ai/AiQuotes";

router.post("/quotes", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  try {
    const quotes = await genAiQuotes(prompt);
    res.json(quotes);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
