import express from "express";
import {
  sendMessage,
  getMessages,
  markMessagesAsSeen,
  deleteMessage,
  deleteChatRoom,
  getAllChatRooms,
  saveMessages,
  editMessage 
} from "../Controllers/chatcontroller.js";
// import {AuthMiddleware} from "../middleware/authMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create chat room
// router.post("/rooms", authMiddleware, createChatRoom);

// ✅ Send message
router.post("/messages/:folderId", authMiddleware, sendMessage);
router.put("/messages/:messageId", authMiddleware, editMessage);
// ✅ Fetch messages from a chat room
router.get("/messages/:folderId", authMiddleware, getMessages);

// ✅ Mark messages as seen
router.put("/messages/seen/:folderId", authMiddleware, markMessagesAsSeen);

// ✅ Delete a message (only sender can delete)
router.delete("/messages/:messageId", authMiddleware, deleteMessage);

// ✅ Delete a chat room (only admin can delete)
router.delete("/rooms/:folderId", authMiddleware, deleteChatRoom);
router.get("/rooms/:folderId", authMiddleware,getAllChatRooms);
router.post("/messages/:folderId", authMiddleware,saveMessages);


export default router;
