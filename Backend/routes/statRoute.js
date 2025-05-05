import express from 'express';
import { getUserStats, getStats, search } from '../Controllers/statsController.js'; // Import your stats controller
import {getActivityLog} from '../Controllers/useractivity.js'
const router = express.Router();

// Get user statistics
router.get('/stats', getUserStats);
router.get('/search', search);

router.get('/getStats', getStats);

router.get('/activity', getActivityLog);

export default router;
