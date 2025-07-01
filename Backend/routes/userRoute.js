import express from 'express';
import { getUserProfile } from '../Controllers/profileController.js'; // Import the controller
import { updateEmail ,updatePassword} from '../Controllers/settingController.js';
const router = express.Router();

// Get user profile details
router.get('/user/:userId', getUserProfile); // Call the controller to handle this route
router.put('/:userId/email', updateEmail); // Call the controller to handle this route
router.put('/:userId/password', updatePassword); // Call the controller to handle this route

export default router;
