
import express from "express";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";

const router = express.Router();

// ✅ Add an answer
router.post("/", async (req, res) => {
  console.log(req.data);
  try {
    console.log(req.body);
    const { text, photo, questionId } = req.body;

    if (!questionId || (!text && !photo)) {
      console.log("hiii");
      return res.status(400).json({
        status: false,
        message: "Question ID and either text or photo are required",
      });
    }

    const answer = new Answer({
      text,
      photo,
      questionId,
    });

    await answer.save();

    // ✅ Update the question with the new answer
    await Question.findByIdAndUpdate(questionId, {

      $push: { answers: answer._id },
    
    });
    console.log(Question.data);
    res.status(201).json({
      status: true,
      message: "Answer added suSccessfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      message: "Error while adding answer",
    });
  }
});

// ✅ Like an answer
router.post("/:id/like", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ status: false, message: "Answer not found" });
    }

    answer.likes += 1;
    await answer.save();

    res.status(200).json({ status: true, likes: answer.likes, message: "Answer liked successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Error liking the answer" });
  }
});

// ✅ Dislike an answer
router.post("/:id/dislike", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ status: false, message: "Answer not found" });
    }

    answer.dislikes += 1;
    await answer.save();

    res.status(200).json({ status: true, dislikes: answer.dislikes, message: "Answer disliked successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Error disliking the answer" });
  }
});

// ✅ Get an answer
router.get("/:id", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ status: false, message: "Answer not found" });
    }

    res.status(200).json(answer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Error fetching the answer" });
  }
});

export default router;
