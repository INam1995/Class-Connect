import Folder from '../models/folder.js';
import cloudinary from '../utils/cloudinary.js'; 


export const getPdfs = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found." });
    }
    res.status(200).json(folder); 
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Controller function to handle PDF upload to a folder
export const uploadPdfToFolder = async (req, res) => {
  const { folderId } = req.params; 
  try {
    // Get the authenticated user from req.user (set by authMiddleware)
    const userId = req.user._id;
    // Find the folder
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    // Check if the folder belongs to the authenticated user
    if (folder.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to upload to this folder" });
    }
    // Access the uploaded file via req.file (multer attaches it here)
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    //  Upload the file to Cloudinary
     const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw', // Automatically detect the file type (PDF, image, etc.)
      folder: `pdfs/${folderId}`, 
      timeout: 60000,
      type: "upload",
      flags: "attachment",
    });
    // Ensure folder.pdfs is defined
    if (!folder.pdfs) {
      folder.pdfs = []; 
    }
    // Save the PDF information to the folder
    const pdf = {
      name: file.originalname, 
      path: result.secure_url, 
      publicId: result.public_id, 
      createdAt: new Date(),
    };
    // Push the PDF data into the folder's pdfs array
    folder.pdfs.push(pdf);
    await folder.save();
    console.log("hey")
    res.status(200).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};