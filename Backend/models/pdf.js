import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  topic: { type: String, required: true }, // Add topic field
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true },
    },
  ],
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Pdf = mongoose.model('Pdf', pdfSchema);

export default Pdf;
