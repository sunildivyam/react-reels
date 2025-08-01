import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = "";

const extractJsonFromMarkdown = (markdown: string): any => {
  const jsonStart = markdown.indexOf('[');
  const jsonEnd = markdown.lastIndexOf(']') + 1;
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('JSON not found in the provided markdown');
  }
  const jsonString = markdown.slice(jsonStart, jsonEnd);
  return JSON.parse(jsonString);
};

const writeContentToFile = (content: string) => {
  const filePath = path.join(__dirname, '../../', 'public/data', 'ai-quotes.json');
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
};

export const AiQuotes = async () => {

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `gyan ki batey on Jeevan me Pyar ka mahatav. Use language hindi
  summary = in hindi and maximum of 150 characters allowed
  translation = translation in english of summary
  tags and hashTags = in english

  format: JSON
  Schema: [{
    title,
    summary,
    translation,
    tags,
    hashTags,
  }]

  give array of 2 such items
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const json = extractJsonFromMarkdown(text);
  writeContentToFile(json);
}


AiQuotes();
// const testData = "```json\n{\n  \"title\": \"जीवन में प्यार का महत्व: दो ज्ञान की बातें\",\n  \"summary\": \"Love's Importance in Life\",\n  \"translation\": [\n    {\n      \"point\": \"प्यार जीवन को अर्थ देता है:\",\n      \"english\": \"Love gives meaning to life:\"\n    },\n    {\n      \"detail\": \"प्यार केवल रोमांटिक रिश्तों तक सीमित नहीं है। यह परिवार, दोस्तों, और अपने आप से भी हो सकता है। यह हमें प्रेरणा, खुशी और संतुष्टि प्रदान करता है, जीवन की चुनौतियों का सामना करने की शक्ति देता है।  यह हमें सहानुभूति, करुणा और क्षमा करना सिखाता है, जिससे हम एक बेहतर इंसान बनते हैं।\",\n      \"english\": \"Love isn't limited to romantic relationships. It can be found in family, friends, and even within oneself. It provides inspiration, joy, and satisfaction, giving us the strength to face life's challenges. It teaches us empathy, compassion, and forgiveness, helping us become better human beings.\"\n    },\n    {\n      \"point\": \"प्यार विकास का आधार है:\",\n      \"english\": \"Love is the foundation of growth:\"\n    },\n    {\n      \"detail\": \"स्वस्थ रिश्तों में प्यार हमें बेहतर इंसान बनने के लिए प्रेरित करता है। हम अपनी कमजोरियों को पहचानते हैं और उन पर काम करते हैं। हम दूसरों के साथ संवाद करना और समझौता करना सीखते हैं।  प्यार  हमें  अपने  आराम क्षेत्र से बाहर निकलने  और  नई  चीजों का  अनुभव  करने  के लिए  प्रेरित करता  है, जिससे हम व्यक्तिगत और आध्यात्मिक रूप से विकसित होते हैं।\",\n      \"english\": \"In healthy relationships, love motivates us to become better people. We recognize and work on our weaknesses. We learn to communicate and compromise with others. Love pushes us outside our comfort zones to experience new things, leading to personal and spiritual growth.\"\n    }\n  ],\n  \"tags\": [\"Love\", \"Life\", \"Importance\", \"Relationships\", \"Growth\", \"Happiness\", \"Meaning\", \"Self-love\", \"Compassion\", \"Empathy\"],\n  \"hashTags\": [\"#Love\", \"#Life\", \"#MeaningOfLife\", \"#Relationships\", \"#PersonalGrowth\", \"#Happiness\", \"#SelfLove\", \"#Compassion\", \"#Empathy\", \"#Motivation\"]\n}\n```\n"
// console.log(extractJsonFromMarkdown(testData))
