import express from "express";
import multer from "multer";
import { getClassNotes, uploadClassNote } from "../Controllers/classNoteController.js";
import { createRating, getAverageRating, getAllRating } from "../Controllers/RatingAndReview.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer configuration (same as before)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Add timestamp to the filename
  },
});

const upload = multer({ storage });

// Routes
router.post("/rate", AuthMiddleware, createRating); // Add this if missing
router.get("/reviews", getAllRating); // Optional if needed elsewhere

router.get("/", getClassNotes);
router.post("/upload", upload.single("file"), uploadClassNote);
// Change this in classNotesRoutes.js
router.post("/upload", upload.single("file"), uploadClassNote);


export default router;
