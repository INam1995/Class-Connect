import express from 'express';
const app = express()
import cors from 'cors';

import connectDB from './models/db.js';
import authRouter from './routes/authRoutes.js'
import folderRouter from './routes/folderRoutes.js'
import downloadPdf from './routes/downloadRoutes.js';
import pdfRoute from './routes/pdfRoutes.js'

import axios from "axios";
import * as pdfjs from 'pdfjs-dist';
import Bottleneck from 'bottleneck';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { Server } from 'socket.io';
import http from 'http';

const OPENAI_API_KEY = process.env.API_KEY4; 

app.use(express.json());

connectDB()

app.get('/',(req,res)=>{
    res.send("backend is working")
});


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));

app.use('/api/auth', authRouter);
app.use('/api/folders', folderRouter);  
app.use('/api/pdfs', pdfRoute);  
app.use('/api/download',downloadPdf);


// Socket.IO connection
io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);
  });
});

const limiter = new Bottleneck({
    maxConcurrent: 1, // Process one request at a time
    minTime: 20000, // 20 seconds between requests (3 requests per minute)
});

// Function to extract text from a PDF
async function extractTextFromPdf(pdfUrl) {
    try {
      const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
      const dataBuffer = new Uint8Array(response.data);
      // Extract text from the PDF using pdfjs-dist
      const loadingTask = pdfjs.getDocument(dataBuffer);
      const pdfDocument = await loadingTask.promise;
      let text = '';
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        console.log(`Text content for page ${i}:`, "done");
        text += textContent.items.map((item) => item.str).join(' ');
      }
      // console.log("text",text);
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error.message);
      throw new Error('Failed to extract text from PDF');
    }
}

const genAI = new GoogleGenerativeAI(`${OPENAI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const summarizeText = limiter.wrap(async (text) => {
    let timeoutId;
  
    return new Promise((resolve, reject) => {
      if (timeoutId) clearTimeout(timeoutId);
  
      timeoutId = setTimeout(async () => {
        try {
          // Step 1: Use Google Generative AI for Summarization
          const prompt = `Summarize the following text in 3 sentences:\n\n"${text}"`;
          const result = await model.generateContent(prompt);
          const googleSummary = result.response.text();
  
          if (googleSummary) {
            return resolve(googleSummary);
          }
  
          // Step 2: If Google AI Fails, Use Eden AI API as a Fallback
          const edenOptions = {
            method: "POST",
            url: "https://api.edenai.run/v2/text/summarize",
            headers: { authorization: `Bearer ${OPENAI_API_KEY}` },
            data: {
              output_sentences: 3,
              providers: "microsoft,connexun,openai,emvista",
              text: text,
              language: "en",
            },
          };
  
          const response = await axios.request(edenOptions);
          const edenSummary = response.data.microsoft?.result || response.data.openai?.result;
  
          resolve(edenSummary || "Summarization failed.");
        } catch (error) {
          console.error("Error with summarization:", error.message);
          reject(new Error("Failed to summarize text"));
        }
      }, 1000);
    });
});

// Endpoint to summarize a PDF from a URL
app.post('/api/summarize-url', async (req, res) => {
    try {
      const { pdfUrl } = req.body; // Get the PDF URL from the request body
      if (!pdfUrl) {
        return res.status(400).json({ error: 'PDF URL is required' });
      }
      const text2 = await extractTextFromPdf(pdfUrl);
      const summary = await summarizeText(text2);
      res.json({ summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'An error occurred while processing the PDF.' });
    }
});


const port = process.env.PORT || 5000;
server.listen(port,()=>{
    console.log(`server is running on ${port}`);
})


export { io }; // Export the Socket.IO instance for use in controllers