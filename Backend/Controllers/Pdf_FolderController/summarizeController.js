import axios from "axios";
import * as pdfjs from "pdfjs-dist";
import Bottleneck from "bottleneck";
import { GoogleGenerativeAI } from "@google/generative-ai";

const OPENAI_API_KEY = process.env.API_KEY4;

// Initialize Generative AI Model
const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Bottleneck Rate Limiter
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 20000,
});


// Function to extract text from PDF URL
export const extractTextFromPdf = async (pdfUrl) => {
  const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
  const dataBuffer = new Uint8Array(response.data);
  const loadingTask = pdfjs.getDocument(dataBuffer);
  const pdfDocument = await loadingTask.promise;
  
  let text = "";
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item) => item.str).join(" ");
  }
  return text;
};

// Summarize the text using Gemini API
// const summarizeText = limiter.wrap(async (text) => {
//   const prompt = `Summarize the following text in 3 sentences:\n\n"${text}"`;
//   const result = await model.generateContent(prompt);
//   return result.response.text() || "Summarization failed.";
// });


const summarizeText = limiter.wrap(async (text) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prompt = `Summarize the following text in 3 sentences:\n\n"${text}"`;
      const result = await model.generateContent(prompt);
      const googleSummary = result.response.text();
      resolve(googleSummary || "Summarization failed.");
    } catch (error) {
      console.error("Error with summarization:", error.message);
      reject(new Error("Failed to summarize text"));
    }
  });
});


// app.post("/api/summarize-url", async (req, res) => {
//   try {
//     const { pdfUrl } = req.body;
//     if (!pdfUrl) {
//       return res.status(400).json({ error: "PDF URL is required" });
//     }
//     const text = await extractTextFromPdf(pdfUrl);
//     const summary = await summarizeText(text);
//     res.json({ summary });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message || "An error occurred while processing the PDF." });
//   }
// });


// Controller function for the route
// export const summarizePdfFromUrl = async (req, res) => {
//     console.log("Summarization Request:", req.header);
//   try {
//     const { pdfUrl } = req.body;
//     // console.log("PDF URL:", req);
//     if (!pdfUrl) return res.status(400).json({ error: "PDF URL is required" });

//     const text = await extractTextFromPdf(pdfUrl);
//     const summary = await summarizeText(text);

//     res.json({ summary });
//   } 
//   catch (error) {
//     console.error("Summarization Error:", error.message);
//     res.status(500).json({ error: error.message || "Summarization failed." });
//   }
// };


export const summarizePdfFromUrl = async (req, res) => {
  try {
    // console.log("Raw Body:", req.body); // Add this debug line
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    const { pdfUrl } = req.body;
    console.log("Extracted PDF URL:", pdfUrl); // Debug what was extracted
    
    if (!pdfUrl) {
      return res.status(400).json({ error: "PDF URL is required in body" });
    }
    try {
      const text = await extractTextFromPdf(pdfUrl);
      const summary = await summarizeText(text);
      res.json({ summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "An error occurred while processing the PDF." });
    }
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({ error: error.message });
  }
};
