// ratingReviewRoutes.js

const express = require('express');
const router = express.Router();
const { uploadRatingReview } = require('../Controllers/ratingReviewController');

// Route to handle rating and review submission
router.post('/submit-review', uploadRatingReview);

module.exports = router;
