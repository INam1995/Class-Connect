import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    uniqueKey: { type: String, unique: true, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure createdBy is set
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to the User model
    pdfs: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true }, // Cloudinary URL
        createdAt: { type: Date, default: Date.now },
        downloadedBy: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            date: { type: Date, default: Date.now },
          },
        ],
        // **Progress Tracking Fields**
        progressByUser: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            completed: { type: Boolean, default: false }, // Track if user marked it as completed
            updatedAt: { type: Date, default: Date.now }, // Timestamp when progress was updated
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Folder = mongoose.model('Folder', folderSchema);
export default Folder;
