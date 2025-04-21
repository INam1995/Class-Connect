import mongoose from "mongoose";
import Pdf from "../models/pdf.js";
import User from "../models/user.js";
import RatingAndReview from "../models/RatingAndReview.js";

export const getClassNotes = async (req, res) => {
  try {
    const notes = await Pdf.find({})
      .populate({
        path: "uploadedBy",
        select: "name email",
        strictPopulate: false,
      })
      .exec();

    const enhancedNotes = await Promise.all(
      notes.map(async (note) => {
        const reviews = await RatingAndReview.find({ pdfId: note._id })
          .populate({ path: "user", select: "name" })
          .exec();

        const avgRating =
          reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

        return {
          ...note.toObject(), // turn Mongoose doc into plain object
          averageRating: reviews.length ? avgRating.toFixed(1) : null,
          ratingCount: reviews.length,
          reviews: reviews.map((r) => ({
            user: r.user,
            review: r.review,
            createdAt: r.createdAt,
          })),
        };
      })
    );

    res.status(200).json(enhancedNotes);
  } catch (error) {
    console.error("❌ Error in getClassNotes:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Upload new class note
export const uploadClassNote = async (req, res) => {
  console.log("hey");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("notes",req.body);
    const { folderId, uploadedBy, topic } = req.body;
    if (!folderId || !uploadedBy || !topic) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const objectIdFolderId = new mongoose.Types.ObjectId(folderId);
    const objectIdUserId = new mongoose.Types.ObjectId(uploadedBy); // Convert to ObjectId

    // Fetch user details for uploadedBy
    const user = await User.findById(uploadedBy); // Use the User model here
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newNote = new Pdf({
      name: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      folderId: objectIdFolderId,
      uploadedBy: objectIdUserId, // Store ObjectId
      topic,
      ratings: [],
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error uploading class note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add rating to a PDF
export const ratePdf = async (req, res) => {
  try {
    const { pdfId, userId, rating } = req.body;
    console.log("Incoming request:", { pdfId, userId, rating });

    if (!pdfId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const objectIdPdfId = new mongoose.Types.ObjectId(pdfId);
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const pdf = await Pdf.findById(objectIdPdfId);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // ✅ Check if the user already rated this PDF
    const existingRating = pdf.ratings.find((r) => r.userId.toString() === userId);

    if (existingRating) {
      console.log("✅ Updating existing rating");
      existingRating.rating = rating;
    } else {
      console.log("✅ Adding new rating");
      pdf.ratings.push({ userId: objectIdUserId, rating });
    }

    // ✅ Calculate new average rating
    pdf.averageRating =
      pdf.ratings.reduce((acc, curr) => acc + curr.rating, 0) / pdf.ratings.length;

    // ✅ Ensure the updated rating is saved
    await pdf.save();

    res.status(200).json({ message: "Rating added successfully", averageRating: pdf.averageRating });
  } catch (error) {
    console.error("❌ Error rating PDF:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
