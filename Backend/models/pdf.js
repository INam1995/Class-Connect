import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: false },
    path: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    topic: { type: String, required: true }, // Add topic field
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true },
      },
    ],
    // Add a progress tracker for each user
    progressByUser: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        completed: { type: Boolean, default: false }, // Indicates whether the user has completed the PDF
        updatedAt: { type: Date, default: Date.now }
      },
    ],
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Pdf = mongoose.model('Pdf', pdfSchema);

export default Pdf;
