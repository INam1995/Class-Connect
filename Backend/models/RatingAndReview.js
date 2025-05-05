import mongoose from 'mongoose';

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Ensure 'User' matches your User model name
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: true,
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Folder',
        index: true,
    },
    pdfId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('RatingAndReview', ratingAndReviewSchema);
