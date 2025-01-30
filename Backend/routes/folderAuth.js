
import express from 'express';
import Folder from '../models/folder.js';
const router = express.Router();

// Create a new folder
router.post('/folder', async (req, res) => {
    try {
      const { name, subject } = req.body;
      const newFolder = new Folder({ name, subject });
      await newFolder.save();
      res.status(201).json(newFolder);
    } catch (error) {
      res.status(500).json({ message: 'Error creating folder', error });
    }
  });
  
  
  
  // Get all folders
  router.get('/folder', async (req, res) => {
    try {
      const folders = await Folder.find();
      res.status(200).json(folders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching folders', error });
    }
  });
  
  export default router;
  