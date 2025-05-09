import express from "express";
import multer from "multer";
import { getClassNotes, uploadClassNote } from "../Controllers/classNoteController.js";
import { createRating, getAverageRating, getAllRating } from "../Controllers/RatingAndReview.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/rate", AuthMiddleware, createRating);
router.get("/reviews", getAllRating); // Optional
router.get("/", getClassNotes);
router.post("/upload", upload.single("file"), uploadClassNote);
router.post("/upload", AuthMiddleware, upload.single("file"), uploadClassNote);

export default router;
