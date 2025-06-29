import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Get the current file's URL
const __dirname = path.dirname(__filename); // Get the directory name
// Define where to store the uploaded files
const storage = multer.memoryStorage({
// const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save the uploaded files inside the 'uploads/pdfs' directory
    const folderId = req.params.folderId; // Use folderId from URL parameters
    const uploadPath = path.join(__dirname, '..', 'uploads', 'pdfs', folderId); // Use __dirname
    // Ensure the directory exists (it will create if not)
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath); // Set the upload directory dynamically
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames by appending timestamp to original filename
    const fileExtension = path.extname(file.originalname);
    const uniqueName = Date.now() + fileExtension;
    cb(null, uniqueName);
  }
});


// Multer middleware for handling file uploads
const uploadPdf = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    // if (file.mimetype === 'application/pdf') {
    //   cb(null, true);
    // } 
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/vnd.ms-powerpoint', // ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    }
    else {
      cb(new Error('Invalid file type, only PDF files are allowed.'));
    }
  }
}).single('pdf'); // 'pdf' is the name of the file input field in the form

export default uploadPdf;
