import mongoose from "mongoose";
import Pdf from "../../models/pdf.js";
import User from "../../models/user.js";


export const getClassNotes = async (req, res) => {
  try {
   const notes = await Pdf.find({})
  .populate({ path: "uploadedBy", select: "name email" })
  .populate({ path: "reviews.user", select: "name email", strictPopulate: false }) // 🔧 FIXED
  .exec();




    const enhancedNotes = notes.map((note) => {
      const ratingCount = note.ratings?.length || 0;
      const avgRating = ratingCount
        ? note.ratings.reduce((acc, r) => acc + r.rating, 0) / ratingCount
        : null;

      return {
        ...note.toObject(),
        averageRating: avgRating?.toFixed(1),
        ratingCount,
        reviews: note.reviews?.map((r) => ({
          user: r.user,
          review: r.review,
          createdAt: r.createdAt,
        })),
      };
    });

    res.status(200).json(enhancedNotes);
  } catch (error) {
    console.error("❌ Error in getClassNotes:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Upload new class note

export const uploadClassNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folderId = req.body.folderId;
    const  topic  = req.body.topic;
    const  uploadedBy  = req.body.uploadedBy; 
    
    if (!folderId || !topic) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Verify the user ID is a valid format
    if (!mongoose.Types.ObjectId.isValid(uploadedBy)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Convert to ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(uploadedBy);
    const objectIdFolderId = new mongoose.Types.ObjectId(folderId);

    // Find the user
    const user = await User.findById(objectIdUserId);
    console.log("User query result:", user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const newNote = new Pdf({
      name: req.file.originalname,
      path: `/uploads/pdfs/${req.params.folderId}/${req.file.filename}`,

      folderId: objectIdFolderId,
      uploadedBy: objectIdUserId,
      topic,
      ratings: [],
    });

    await newNote.save();

    res.status(201).json({
      message: "Class note uploaded successfully",
      note: newNote,
      uploadedBy: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // Include other user fields you want to expose
      },
    });
  } catch (error) {
    console.error("Error uploading class note:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

// ✅ Add rating to a PDF
export const ratePdf = async (req, res) => {
  try {
    const { pdfId, rating } = req.body;
    const userId = req.user._id; // ✅ user from token

    if (!pdfId || !rating) {
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

    const existingRating = pdf.ratings.find((r) => r.userId.toString() === userId.toString());

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      pdf.ratings.push({ userId: objectIdUserId, rating });
    }

    pdf.averageRating =
      pdf.ratings.reduce((acc, curr) => acc + curr.rating, 0) / pdf.ratings.length;

    await pdf.save();

    res.status(200).json({ message: "Rating added successfully", averageRating: pdf.averageRating });
  } catch (error) {
    console.error("❌ Error rating PDF:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const submitReview = async (req, res) => {
  try {
    const { pdfId, rating, review } = req.body;
    const userId = req.user._id;

    if (!pdfId || !rating || !review) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const note = await Pdf.findById(pdfId);
if (!note) return res.status(404).json({ message: "PDF not found" });

// Ensure arrays exist
if (!Array.isArray(note.reviews)) note.reviews = [];
if (!Array.isArray(note.ratings)) note.ratings = [];

// Handle rating
const existingRating = note.ratings.find(r => r.userId.toString() === userId.toString());
if (existingRating) {
  existingRating.rating = rating;
} else {
  note.ratings.push({ userId, rating });
}

// Handle review
note.reviews.push({
  user: userId,
  review,
  createdAt: new Date(),
});

note.averageRating =
  note.ratings.reduce((acc, r) => acc + r.rating, 0) / note.ratings.length;

await note.save();


    res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("❌ Error submitting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
