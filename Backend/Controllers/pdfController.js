import Folder from '../models/folder.js';
import cloudinary from '../utils/cloudinary.js'; 
import { sendNotification } from '../utils/notificationService.js';
import { io } from '../index.js'; // Import the Socket.IO instance

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
    const { _id: userId } = req.user;

    // Find the folder and populate its members
    const folder = await Folder.findById(folderId).populate('members');
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    // console.log("folder",folder)
    console.log("folder",folder.createdBy)
    // Check if the folder belongs to the authenticated user
    // if (folder.createdBy.toString() !== userId.toString()) {
    //   return res.status(403).json({ message: "Forbidden: You do not have permission to upload to this folder" });
    // }
    // console.log("hey");
    // Access the uploaded file via req.file (multer attaches it here)
    const file = req.file;
    // console.log("file")
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw', // Automatically detect the file type (PDF, image, etc.)
      folder: `pdfs/${folderId}`, 
      timeout: 60000,
      type: "upload",
      flags: "attachment",
    });
    // console.log("result",result);

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
    console.log("pdf",pdf);

    // Push the PDF data into the folder's pdfs array
    folder.pdfs.push(pdf);
    await folder.save();

    // 1. Notify all members via email
    // folder.members.forEach(member => {
    //   sendNotification(member.email, `A new PDF "${file.originalname}" has been uploaded to the folder "${folder.name}".`);
    // });

    // 2. Emit real-time notification to all members using Socket.IO
    io.emit('notification', {
      type: 'PDF_UPLOADED',
      message: `A new PDF "${file.originalname}" has been uploaded to the folder "${folder.name}".`,
      folderId: folder._id,
    });

    res.status(200).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Controller function to update PDF progress (completed or not completed)
export const updatePdfProgress = async (req, res) => {
  const { folderId, pdfId } = req.params;
  const { completed } = req.body;

  try {
    // Find the folder
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Find the PDF in the folder's pdfs array
    const pdf = folder.pdfs.find((pdf) => pdf._id.toString() === pdfId);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found in the folder" });
    }

    // Update the PDF's completed status
    pdf.completed = completed;
    await folder.save();

    // Emit real-time notification to all members using Socket.IO
    io.emit('notification', {
      type: 'PDF_PROGRESS_UPDATED',
      message: `The PDF "${pdf.name}" has been marked as ${completed ? "completed" : "not completed"}.`,
      folderId: folder._id,
    });

    res.status(200).json({ message: "PDF progress updated successfully", pdf });
  } catch (error) {
    console.error("Error updating PDF progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};