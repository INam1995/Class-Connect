
 import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema({
//     folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     text: { type: String, required: true },
//     // fileUrl: { type: String, default: "" }, // For attachments like PDFs, images, etc.
//     seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have seen the message
//   }, { timestamps: true });
  
// const Message = mongoose.model('Message', MessageSchema);
// export default Message;  
// const MessageSchema = new mongoose.Schema({
//   folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   text: { type: String, required: true },
//   seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store users who saw the message
// }, { timestamps: true });

// const Message = mongoose.model("Message", MessageSchema);
// export default Message;
const MessageSchema = new mongoose.Schema(
  {
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }, // Ensure text is stored as UTF-8
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, collation: { locale: "en", strength: 2 } }  // Ensures UTF-8 support
);
const Message = mongoose.model("Message", MessageSchema);
export default Message;