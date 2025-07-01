import express from "express";
import { ratePdf, getClassNotes, uploadClassNote, submitReview } from "../Controllers/classNotesController/classNoteController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import uploadPdf from "../middleware/multerMiddleware.js";

const router = express.Router();

router.get("/", getClassNotes);
router.post("/upload/:folderId", AuthMiddleware, uploadPdf, uploadClassNote);
router.post("/rate", AuthMiddleware, ratePdf);

// ✅ New review submission route
router.post("/reviews/submit-review", AuthMiddleware, submitReview);

export default router;
