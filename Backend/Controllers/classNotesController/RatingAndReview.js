import RatingAndReview from "../../models/RatingAndReview.js";
// import Pdf from "../models/pdf.js"; // Assuming this is where your PDFs live
import mongoose from "mongoose";

// ✅ Create a rating for a PDF
export const createRating = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // ✅ Fix: convert to ObjectId
    const { rating, review, pdfId, folderId } = req.body;

    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      pdfId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You already reviewed this PDF.",
      });
    }

    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      pdfId,
      folderId,
      user: userId, // ✅ Now it's a proper ObjectId
    });

    return res.status(200).json({
      success: true,
      message: "Rating and review added successfully.",
      ratingReview,
    });
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get average rating for a PDF
export const getAverageRating = async (req, res) => {
  try {
    const { pdfId } = req.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          pdfId: new mongoose.Types.ObjectId(pdfId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const average = result.length > 0 ? result[0].averageRating : 0;

    return res.status(200).json({
      success: true,
      averageRating: average,
    });
  } catch (error) {
    console.error("Average rating error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all reviews
export const getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "name email",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.error("Get all ratings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
