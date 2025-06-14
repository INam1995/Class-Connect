import express from "express";
import { summarizePdfFromUrl } from "../Controllers/Pdf_FolderController/summarizeController.js"; // Import the controller function

const router = express.Router();

// POST /api/summarize-url
router.post("/summarize-url", summarizePdfFromUrl);

export default router;
