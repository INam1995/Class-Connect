// import express from 'express';
// import cors from 'cors';
// import http from "http";
// import { Server } from "socket.io";


// import connectDB from './models/db.js';
// import authRouter from './routes/authRoutes.js';
// import folderRouter from './routes/folderRoutes.js';
// import downloadPdf from './routes/downloadRoutes.js';
// import pdfRoute from './routes/pdfRoutes.js';
// import questionRouter from './routes/questionRoutes.js';
// import answerRouter from './routes/answerRoutes.js';
// import bodyParser from "body-parser";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import chatRoom from './routes/chatRoutes.js';
// import ChatRoom from "./models/chatRoom.js"; // ✅ Import missing model
// import { initializeSocket } from "./socketio.js";
// const app = express();
// const server = http.createServer(app);
// // Fix for __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5173",
//       credentials: true,
//     },
//   });
// app.use(express.json());
// initializeSocket(io);
// // Connect to Database
// connectDB();

// app.get('/', (req, res) => {
//     res.send("Backend is working");
// });

// app.use(cors({
//     origin: 'http://localhost:5173', // Replace with your frontend URL
//     credentials: true,
// }));


// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // ✅ Rename `chatRoom` to `roomId` to avoid conflicts
//   socket.on("join_room", ({ roomId, userId }) => {
//     socket.join(roomId);
//     console.log(`User ${userId} joined room ${roomId}`);
//   });


//   // ✅ Add validation before emitting a message
//   socket.on("send_message", ({ chatRoom, sender, text }) => {
//     if (!chatRoom) return;
//     io.to(chatRoom).emit("receive_message", { sender, text });
//   });

//   // ✅ Fix `ChatRoom` model reference
//   socket.on("add_member", async ({ chatRoom, userId, newMember }) => {
//     try {
//       const room = await ChatRoom.findById(chatRoom);
//       if (!room) {
//         socket.emit("member_added", { success: false, message: "Chat room not found." });
//         return;
//       }

//       if (room.members.includes(newMember)) {
//         socket.emit("member_added", { success: false, message: "Member already in room." });
//         return;
//       }

//       room.members.push(newMember);
//       await room.save();

//       socket.emit("member_added", { success: true, message: "Member added successfully!" });
//       io.to(chatRoom).emit("member_added", { success: true });
//     } catch (error) {
//       socket.emit("member_added", { success: false, message: "Error adding member." });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });
// // API Routes
// app.use('/api/auth', authRouter);
// app.use('/api/folders', folderRouter);
// app.use('/api/pdfs', pdfRoute);
// app.use('/api/chat', chatRoom);
// app.use('/api/answers', answerRouter);  // ✅ Fixed missing `/`
// app.use('/api/questions', questionRouter);  // ✅ Fixed missing `/`
// app.use('/api/download', downloadPdf);

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./models/db.js";
import authRouter from "./routes/authRoutes.js";
import folderRouter from "./routes/folderRoutes.js";
import downloadPdf from "./routes/downloadRoutes.js";
import pdfRoute from "./routes/pdfRoutes.js";
import questionRouter from "./routes/questionRoutes.js";
import answerRouter from "./routes/answerRoutes.js";
import chatRoom from "./routes/chatRoutes.js";
import ChatRoom from "./models/chatRoom.js";

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

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

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/folders", folderRouter);
app.use("/api/pdfs", pdfRoute);
app.use("/api/chat", chatRoom);
app.use("/api/answers", answerRouter);
app.use("/api/questions", questionRouter);
app.use("/api/download", downloadPdf);

// ✅ Fix: Use `server.listen` instead of `app.listen`
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
