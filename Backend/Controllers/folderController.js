import Folder from '../models/folder.js';

// Create a new folder
export const createFolder = async (req, res) => {
  const { name, subject,userId} = req.body;
  try {
    const folder = new Folder({ name, subject, userId: userId,pdfs: [] });
    await folder.save();
    res.status(201).json(folder);  // Ensure the folder object is returned here
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Get all folders for the authenticated user
export const getFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing in the request' });
    }
    // Fetch folders for the authenticated user
    const folders = await Folder.find({ userId: userId });
    if (!folders || folders.length === 0) {
      return res.status(200).json({ message: "No folders found for this user." });
    }
    // Return the folders
    res.json(folders);
  } catch (err) {
    console.error("Error fetching folders:", err);
    res.status(400).json({ error: err.message });
  }
};


// Fetch folder by ID
export const getFolderById = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    console.error("Error fetching folder details:", error);
    res.status(500).json({ message: "Server error" });
  }
};