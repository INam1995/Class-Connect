import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import {
  getFolderWithUserProgress,
  updateUserProgress
} from "../Controllers/Pdf&FolderController/progressController.js";

const router = express.Router();

// Routes for user progress on PDFs within a folder
router.get("/:folderId/user-progress", AuthMiddleware, getFolderWithUserProgress);
router.patch("/:folderId/:pdfId/progress", AuthMiddleware, updateUserProgress);

export default router;
