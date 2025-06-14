import express from 'express';
import { getUserProfile } from '../Controllers/profileController/profileController.js'; // Import the controller
import { updateEmail ,updatePassword} from '../Controllers/profileController/settingController.js'; // Import the controller for email and password updates
const router = express.Router();

// Get user profile details
router.get('/user/:userId', getUserProfile); // Call the controller to handle this route
router.put('/:userId/email', updateEmail); // Call the controller to handle this route
router.put('/:userId/password', updatePassword); // Call the controller to handle this route

export default router;
