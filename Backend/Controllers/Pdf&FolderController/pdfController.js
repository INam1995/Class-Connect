import Folder from '../../models/Folder.js';
import cloudinary from '../../utils/Cloudinary.js'; 
import { io } from '../../index.js'; 

export const getPdfs = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found." });
    }
    res.status(200).json(folder); 
  } 
  catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// export const uploadPdfToFolder = async (req, res) => {
//   const { folderId } = req.params; 
//   try {
//     const folder = await Folder.findById(folderId).populate('members');
//     if (!folder) {
//       return res.status(404).json({ message: "Folder not found" });
//     }
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     // Upload the file to Cloudinary
//     const result = await cloudinary.uploader.upload(file.path, {
//       resource_type: 'auto',
//       folder: `pdfs/${folderId}`, 
//       timeout: 60000,
//       type: "upload",
//     });

//     if (!folder.pdfs) {
//       folder.pdfs = []; 
//     }
//     // Save the PDF information to the folder
//     const pdf = {
//       name: file.originalname, 
//       path: result.secure_url, 
//       publicId: result.public_id, 
//       createdAt: new Date(),
//     };
//     folder.pdfs.push(pdf);
//     await folder.save();

//     io.emit('notification', {
//       type: 'PDF_UPLOADED',
//       message: `A new PDF "${file.originalname}" has been uploaded to the folder "${folder.name}".`,
//       folderId: folder._id,
//     });

//     res.status(200).json({ message: "PDF uploaded successfully", pdf });
//   } 
//   catch (error) {
//     console.error("Error uploading PDF:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



export const uploadPdfToFolder = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await Folder.findById(folderId).populate('members');
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: `pdfs/${folderId}`,
        timeout: 60000,
        type: "upload",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Cloudinary upload error" });
        }

        if (!folder.pdfs) {
          folder.pdfs = [];
        }

        const pdf = {
          name: file.originalname,
          path: result.secure_url,
          publicId: result.public_id,
          createdAt: new Date(),
        };

        folder.pdfs.push(pdf);
        await folder.save();

        io.emit('notification', {
          type: 'PDF_UPLOADED',
          message: `A new file "${file.originalname}" has been uploaded to the folder "${folder.name}".`,
          folderId: folder._id,
        });

        return res.status(200).json({ message: "File uploaded successfully", pdf });
      }
    );

    uploadStream.end(file.buffer);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const updatePdfProgress = async (req, res) => {
  const { folderId, pdfId } = req.params;
  const { completed } = req.body;
  const userId = req.user._id;
  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    const pdf = folder.pdfs.id(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found in folder' });
    }
    let userProgress = pdf.progressByUser.find(
      (entry) => entry.user.toString() === userId.toString()
    );

    if (userProgress) {
      userProgress.completed = completed;
      userProgress.updatedAt = new Date();
    } else {
      pdf.progressByUser.push({
        user: userId,
        completed,
        updatedAt: new Date(),
      });
    }
    await folder.save();
    res.status(200).json({ 
      message: 'PDF progress updated successfully',
      progress: {
        completed,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating PDF progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};