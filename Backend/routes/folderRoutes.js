import express from 'express';
import { createFolder, getFolders } from '../Controllers/folderController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-folder', createFolder); // Create a folder
router.get('/get-folder',authMiddleware, getFolders);    // Get all folders for the authenticated user


export default router;