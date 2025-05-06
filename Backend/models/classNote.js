import mongoose from 'mongoose';

const classNoteSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  path: { 
    type: String, 
    required: true, 
    trim: true 
  },
  topic: { 
    type: String, 
    trim: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// ✅ Create and export the model
const ClassNote = mongoose.model('ClassNote', classNoteSchema);

export default ClassNote;
