import express from 'express';
import { getPdfs , uploadPdfToFolder } from '../Controllers/pdfController.js';
import authMiddleware from '../middleware/authMiddleware.js'
import uploadPdf from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get('/folder/:folderId/pdfs',authMiddleware,getPdfs);

router.post('/folder/:folderId/upload', authMiddleware ,uploadPdf,uploadPdfToFolder);

export default router;
