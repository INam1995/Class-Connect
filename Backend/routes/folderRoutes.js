import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import Folder from "../models/Folder.js";
import {
  createFolder,
  joinFolder,
  myfolders,
  deleteFolder,
  leaveFolder,
  getFolderById,
  getFolderWithUserProgress,
  updateUserProgress
} from "../Controllers/Pdf&FolderController/folderController.js"; // ✅ Import controllers

const router = express.Router();

// Folder routes
router.post("/create", AuthMiddleware, createFolder);           // Create folder
router.post("/join", AuthMiddleware, joinFolder);               // Join a folder
router.get("/myfolders", AuthMiddleware, myfolders);            // Get user folders
router.delete("/deleteFolder/:folderId", AuthMiddleware, deleteFolder); // Delete folder
router.post("/leaveFolder/:folderId", AuthMiddleware, leaveFolder);    // Leave folder
router.get("/:folderId", AuthMiddleware, getFolderById);       // Get folder by ID

// New endpoint to get members of a specific folder
router.get("/:folderId/members", AuthMiddleware, async (req, res) => {
  try {
    const { folderId } = req.params;
    
    // Find the folder and populate the 'members' field
    
    const folder = await Folder.findById(folderId).populate("members", "name email");
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Return the list of members
    res.status(200).json(folder.members);
  } catch (err) {
    console.error("Error fetching folder members:", err);
    res.status(500).json({ message: "Error fetching folder members" });
  }
});

// Progress tracking routes
router.get("/:folderId/user-progress", AuthMiddleware, getFolderWithUserProgress);
router.patch("/:folderId/:pdfId/progress", AuthMiddleware, updateUserProgress);


export default router;
