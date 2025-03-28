import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
<<<<<<< HEAD
  },
=======
},
>>>>>>> newpro
  folderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder', 
    required: true 
<<<<<<< HEAD
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
=======
},
  path: { 
    type: String, 
    required: true 
},

},{timestamps:true});

 const Pdf = mongoose.model('Pdf', pdfSchema);
 export default Pdf;
>>>>>>> newpro
