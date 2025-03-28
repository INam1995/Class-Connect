
import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

// ✅ Add a question
router.post("/", async (req, res) => {
  try {
    const { questionName, questionUrl } = req.body;

    if (!questionName) {
      return res.status(400).json({
        status: false,
        message: "Question name is required",
      });
    }

    const newQuestion = new Question({
      questionName,
      questionUrl,
    });

    await newQuestion.save();
    res.status(201).json({
      status: true,
      message: "Question added successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      message: "Error while adding question",
    });
  }
});
// router.get("/", async (req, res) => {
//   try {
//     const questionsWithAnswers = await Question.aggregate([
//       {
//         $lookup: {
//           from: "answers", // The MongoDB collection name (must be lowercase)
//           localField: "_id", // The field in the "questions" collection
//           foreignField: "questionId", // The field in the "answers" collection
//           as: "allAnswers", // Name of the output array
//         },
//       },
//       {
//         $sort: { createdAt: -1 }, // Sort questions by newest first
//       },
//     ]);

//     res.status(200).send(questionsWithAnswers);
//   } catch (error) {
//     console.error("Error fetching questions with answers:", error);
//     res.status(500).send({
//       status: false,
//       message: "Unexpected error fetching questions",
//     });
//   }
// });
router.get("/", async (req, res) => {
  try {
    const questionsWithAnswers = await Question.aggregate([
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "allAnswers",
        },
      },
      {
        $set: {
          allAnswers: {
            $map: {
              input: "$allAnswers",
              as: "answer",
              in: {
                _id: "$$answer._id",
                createdAt: "$$answer.createdAt",
                answer: { $ifNull: ["$$answer.text", ""] }, // Ensure it's always a string
             //   user: "$$answer.user",
                likes: { $ifNull: ["$$answer.likes", 0] },
                dislikes: { $ifNull: ["$$answer.dislikes", 0] },
              },
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).send(questionsWithAnswers);
  } catch (error) {
    console.error("Error fetching questions with answers:", error);
    res.status(500).send({ status: false, message: "Error fetching data" });
  }
});

// ✅ Get all questions with answers
// router.get("/", async (req, res) => {
//   try {
//     const questions = await Question.find().populate("answers"); // Populating answers

//     res.status(200).json(questions);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       status: false,
//       message: "Unexpected error while fetching questions",
//     });
//   }
// });

export default router;
