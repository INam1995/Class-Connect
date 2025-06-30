import https from 'https';
import Folder from '../../models/Folder.js';
import { emitFileDownloaded } from '../../index.js'; 

export const downloadPDF = async (req, res) => {
    try {
        const fileUrl = decodeURIComponent(req.query.url);
        const userId = req.user?._id; 
        const pdfId = req.query.pdfId; 
        if (!fileUrl || !pdfId ) {
            return res.status(400).json({ message: 'File URL and PDF ID are required' });
        }
        const folder = await Folder.findOne({ "pdfs._id": pdfId });
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        const pdf = folder.pdfs.id(pdfId);
        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }
        if (userId && !pdf.downloadedBy.includes(userId)) {
            pdf.downloadedBy.push(userId);
            await folder.save(); 
        }
        emitFileDownloaded( userId); 
        res.setHeader('Content-Disposition', `attachment; filename="${pdf.name}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Stream the file from Cloudinary
        https.get(fileUrl, (fileStream) => {
            fileStream.pipe(res);
        }).on('error', (err) => {
            console.error('Error fetching file:', err);
            res.status(500).json({ message: 'Error downloading file' });
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
