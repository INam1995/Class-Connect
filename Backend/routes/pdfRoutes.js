import express from 'express';
<<<<<<< HEAD
import { getPdfs , uploadPdfToFolder, updatePdfProgress } from '../Controllers/pdfController.js';
=======
import { getPdfs , uploadPdfToFolder } from '../Controllers/pdfController.js';
>>>>>>> newpro
import AuthMiddleware from '../middleware/authMiddleware.js'
import uploadPdf from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get('/:folderId/pdfs',getPdfs);

router.post('/:folderId/upload', AuthMiddleware ,uploadPdf,uploadPdfToFolder);

<<<<<<< HEAD
// Route to update PDF progress
router.patch('/:folderId/:pdfId/progress', AuthMiddleware, updatePdfProgress);

=======
>>>>>>> newpro
export default router;
