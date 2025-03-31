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
