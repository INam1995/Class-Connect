import express from "express";
import {
  createPoll,
  votePoll,
  getPollsByFolder,
  deletePoll,
  unvotePoll
} from "../Controllers/ChatController/pollController.js"; // ✅ Add `.js` if not present






import {
  sendMessage,
  getMessages,
  markMessagesAsSeen,
  deleteMessage,
  deleteChatRoom,
  getAllChatRooms,
  saveMessages,
  editMessage ,
  deleteSelectedMessages
} from "../Controllers/ChatController/chatController.js"; // ✅ Import controllers
// import {AuthMiddleware} from "../middleware/authMiddleware.js";
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
router.post("/messages/:folderId/delete-bulk", AuthMiddleware, deleteSelectedMessages);
router.post("/polls/:folderId", AuthMiddleware, createPoll);
router.post("/polls/vote/:pollId", AuthMiddleware, votePoll);
router.get("/polls/:folderId", AuthMiddleware, getPollsByFolder);
router.delete("/polls/:pollId", AuthMiddleware, deletePoll);
router.post("/polls/unvote/:pollId", AuthMiddleware, unvotePoll);


export default router;
