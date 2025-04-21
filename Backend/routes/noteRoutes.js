const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadNote } = require('../Controllers/noteController');

const router = express.Router();

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define routes
router.post('/upload-notes', upload.single('pdf'), uploadNote);

module.exports = router;
