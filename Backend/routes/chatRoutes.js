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
import {AuthMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create chat room
// router.post("/rooms", authMiddleware, createChatRoom);

// ✅ Send message
router.post("/messages/:folderId", AuthMiddleware, sendMessage);
router.put("/messages/:messageId", AuthMiddleware, editMessage);
// ✅ Fetch messages from a chat room
router.get("/messages/:folderId", AuthMiddleware, getMessages);

// ✅ Mark messages as seen
router.put("/messages/seen/:folderId", AuthMiddleware, markMessagesAsSeen);

// ✅ Delete a message (only sender can delete)
router.delete("/messages/:messageId", AuthMiddleware, deleteMessage);

// ✅ Delete a chat room (only admin can delete)
router.delete("/rooms/:folderId", AuthMiddleware, deleteChatRoom);
router.get("/rooms/:folderId", AuthMiddleware,getAllChatRooms);
router.post("/messages/:folderId", AuthMiddleware,saveMessages);


export default router;
