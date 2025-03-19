import express from 'express';
import { downloadPDF } from '../Controllers/downloadController.js';

const router = express.Router();

router.get('/pdf', downloadPDF);


export default router;