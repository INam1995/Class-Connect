import express from 'express';
import { getUserStats, getStats, search } from '../Controllers/adminController/statsController.js'; // Import your stats controller
import {getActivityLog ,getOverallActivityStats} from '../Controllers/adminController/useractivity.js'
const router = express.Router();

// Get user statistics
router.get('/stats', getUserStats);
router.get('/search', search);

router.get('/getStats', getStats);

router.get('/activity', getActivityLog);
router.get('/allactivity', getOverallActivityStats);
export default router;
