import express from 'express';
import { downloadPDF } from '../Controllers/downloadController.js';
import { AuthMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/pdf',AuthMiddleware, downloadPDF);


export default router;