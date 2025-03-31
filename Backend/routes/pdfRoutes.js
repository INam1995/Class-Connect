import express from 'express';
import { getPdfs , uploadPdfToFolder, updatePdfProgress } from '../Controllers/pdfController.js';
import AuthMiddleware from '../middleware/authMiddleware.js'
import uploadPdf from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get('/:folderId/pdfs',getPdfs);

router.post('/:folderId/upload', AuthMiddleware ,uploadPdf,uploadPdfToFolder);

// Route to update PDF progress
router.patch('/:folderId/:pdfId/progress', AuthMiddleware, updatePdfProgress);

export default router;
