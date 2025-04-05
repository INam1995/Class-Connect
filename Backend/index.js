import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import * as pdfjs from "pdfjs-dist";
import Bottleneck from "bottleneck";
import { GoogleGenerativeAI } from "@google/generative-ai";

import connectDB from "./models/db.js";
import authRouter from "./routes/authRoutes.js";
import folderRouter from "./routes/folderRoutes.js";
import downloadPdf from "./routes/downloadRoutes.js";
import pdfRoute from "./routes/pdfRoutes.js";
import questionRouter from "./routes/questionRoutes.js";
import answerRouter from "./routes/answerRoutes.js";
import chatRoom from "./routes/chatRoutes.js";
import ChatRoom from "./models/chatRoom.js";
import whiteboardRoutes from './routes/whiteboardRoutes.js';
import notificationsRoutes from "./routes/noti.js";
import stats from './routes/statRoute.js';
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const server = http.createServer(app);
const OPENAI_API_KEY = process.env.API_KEY4;

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize all socket events
// initWhiteboardSocket(io);

// ✅ Middleware to attach `io` to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Connect to Database
connectDB();



app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Backend is working");
});

// ✅ Socket.io Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on("send_message", ({ chatRoom, sender, text }) => {
    if (!chatRoom) return;
    io.to(chatRoom).emit("receive_message", { sender, text });
  });

  socket.on("add_member", async ({ chatRoom, userId, newMember }) => {
    try {
      const room = await ChatRoom.findById(chatRoom);
      if (!room) {
        socket.emit("member_added", { success: false, message: "Chat room not found." });
        return;
      }

      if (room.members.includes(newMember)) {
        socket.emit("member_added", { success: false, message: "Member already in room." });
        return;
      }

      room.members.push(newMember);
      await room.save();

      socket.emit("member_added", { success: true, message: "Member added successfully!" });
      io.to(chatRoom).emit("member_added", { success: true });
    } catch (error) {
      socket.emit("member_added", { success: false, message: "Error adding member." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Bottleneck for Rate Limiting
const limiter = new Bottleneck({
  maxConcurrent: 1, // Process one request at a time
  minTime: 20000, // 20 seconds between requests
});

// ✅ Function to Extract Text from PDF
async function extractTextFromPdf(pdfUrl) {
  try {
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
    // console.log("Text extracted from PDF:", text);
    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
}

const genAI = new GoogleGenerativeAI(`${OPENAI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

// ✅ Endpoint to Summarize a PDF from a URL
app.post("/api/summarize-url", async (req, res) => {
  try {
    const { pdfUrl } = req.body;
    if (!pdfUrl) {
      return res.status(400).json({ error: "PDF URL is required" });
    }
    const text = await extractTextFromPdf(pdfUrl);
    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "An error occurred while processing the PDF." });
  }
});

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/folders", folderRouter);
app.use("/api/pdfs", pdfRoute);
app.use("/api/chat", chatRoom);
app.use("/api/answers", answerRouter);
app.use("/api/questions", questionRouter);
app.use("/api/download", downloadPdf);
app.use('/api/whiteboard', whiteboardRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stat", stats);

// ✅ Start Server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
export const emitUserRegistered = (userName) => {
  io.emit('user-registered', { message: `New user registered: ${userName}` });
};

export const emitFileUploaded = (fileName) => {
  io.emit('file-uploaded', { message: `A new file (${fileName}) has been uploaded.` });
};

export const emitFileDownloaded = (fileName) => {
  io.emit('file-downloaded', { message: `⬇️ ${fileName} has been downloaded.` });
};

export { io };
