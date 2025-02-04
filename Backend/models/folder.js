import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  uniqueKey: { type: String, unique: true, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure createdBy is set
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  // Reference to the User model
  pdfs: [
    {
      name: String,
      path: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
  
  
},{timestamps:true});

const Folder = mongoose.model('Folder', folderSchema);
export default Folder;
