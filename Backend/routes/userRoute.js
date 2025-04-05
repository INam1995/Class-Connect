import express from 'express';
import { getUserProfile } from '../Controllers/profile.js'; // Import the controller

const router = express.Router();

// Get user profile details
router.get('/user/:userId', getUserProfile); // Call the controller to handle this route

export default router;
