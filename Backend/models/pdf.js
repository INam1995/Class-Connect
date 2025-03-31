import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  folderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder', 
    required: true 
  },
  path: { 
    type: String, 
    required: true 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },

},{timestamps:true});

const Pdf = mongoose.model('Pdf', pdfSchema);
export default Pdf;
