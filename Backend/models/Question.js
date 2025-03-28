// import { Schema, model } from "mongoose";

// const QuestionSchema = new Schema({
//   questionName: String,
//   questionUrl: String,
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
//   answers: {
//     type: Schema.Types.ObjectId,
//     ref: "Answers",
//   },
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User", // Reference to the User model
//     required: true,
//   },
//  // user: Object,
// });

// export default model("Questions", QuestionSchema);
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionName: {
    type: String,
    required: true,
  },
  questionUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answers",
    },
  ],
});

export default mongoose.model("Questions", QuestionSchema);
