// // const mongoose = require("mongoose");

// // const AnswerSchema = new mongoose.Schema({
// //   answer: String,
// //   questionId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "questions",
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// //   user: Object,
// //   likes: {
// //     type: Number,
// //     default: 0,
// //   },
// //   dislikes:{
// //     type:Number,
// //     default:0,
// //   },
// // });

// // module.exports = mongoose.model("Answers", AnswerSchema);
// const mongoose = require("mongoose");

// const AnswerSchema = new mongoose.Schema({
//   answer: String,
//   questionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "questions",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   user: Object,
//   likes: {
//     type: Number,
//     default: 0,
//   },
//   dislikes: {
//     type: Number,
//     default: 0,
//   },
//   photo: {
//     type: String, // Store the image URL
//     default: null,
//   },
// });

// module.exports = mongoose.model("Answers", AnswerSchema);
// import  mongoose from "mongoose";
// const {Schema} =mongoose;
// const AnswerSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     default: null, // Allow null if only an image is uploaded
//   },
//   photo: {
//     type: String, // Stores the image URL
//     default: null, // Allow null if only text is provided
//   },
//   questionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Questions",
//     required: true,
//   },
//   //user: Object,
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User", // Reference to the User model
//     required: true,
//   },
//   likes: {
//     type: Number,
//     default: 0,
//   },
//   dislikes: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default  mongoose.model("Answers", AnswerSchema);
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    default: null,
  },
  photo: {
    type: String,
    default: null,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Questions",
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Answers", AnswerSchema);
