import express from "express";
import { summarizePdfFromUrl } from "../Controllers/Pdf&FolderController/summarizeController.js"; // Import the controller function

const router = express.Router();

router.post("/summarize-url", summarizePdfFromUrl);

export default router;
