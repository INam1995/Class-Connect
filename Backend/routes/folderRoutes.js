import express from "express";

 import AuthMiddleware from "../middleware/authMiddleware.js";
import {
  createFolder,
  joinFolder,
  myfolders,
  deleteFolder,
  leaveFolder,
  getFolderById
} from "../Controllers/folder&PdfController/folderController.js"; // ✅ Import controllers

const router = express.Router();

// Folder routes
router.post("/create",AuthMiddleware, createFolder);
router.post("/join", AuthMiddleware, joinFolder);
router.get("/myfolders", AuthMiddleware, myfolders);
router.delete("/deleteFolder/:folderId", AuthMiddleware, deleteFolder);
router.post("/leaveFolder/:folderId", AuthMiddleware, leaveFolder);
router.get("/:folderId", AuthMiddleware, getFolderById);

export default router;
