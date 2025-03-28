// // // import  questionDB from "../models/Question.js";

// // // // Create a question
// // // export const createQuestion = async (req, res) => {
// // //   console.log("1");
// // //   try {
// // //     // await questionDB.create({
// // //       questionName: req.body.questionName,
// // //       questionUrl: req.body.questionUrl,
// // //     //  user: req.body.user,
// // //     });
// // // console.log("22");
// // //     res.status(201).send({
// // //       status: true,
// // //       message: "Question added successfully",
// // //     });
// // //   } catch (e) {
// // //     res.status(500).send({
// // //       status: false,
// // //       message: "Error while adding question",
// // //     });
// // //   }
// // // };

// // // // Get all questions with answers
// // // export const getAllQuestions = async (req, res) => {
// // //   try {
// // //     await questionDB
// // //       .aggregate([
// // //         {
// // //           $lookup: {
// // //             from: "answers",
// // //             localField: "_id",
// // //             foreignField: "questionId",
// // //             as: "allAnswers",
// // //           },
// // //         },
// // //       ])
// // //       .exec()
// // //       .then((doc) => {
// // //         res.status(200).send(doc);
// // //       })
// // //       .catch(() => {
// // //         res.status(500).send({
// // //           status: false,
// // //           message: "Unable to get the question details",
// // //         });
// // //       });
// // //   } catch (e) {
// // //     res.status(500).send({
// // //       status: false,
// // //       message: "Unexpected error",
// // //     });
// // //   }
// // // };
// // import questionDB from "../models/Question.js";

// // // ✅ Create a new question
// // export const createQuestion = async (req, res) => {
// //     console.log("🔥 Request Body:", req.body); // Debugging

// //     try {
// //         const { questionName, questionUrl, user } = req.body;

// //         // ✅ Validation: Ensure required fields exist
// //         if (!questionName || !user) {
// //             return res.status(400).json({
// //                 status: false,
// //                 message: "questionName and user are required!",
// //             });
// //         }

// //         // ✅ Create a new question
// //         const newQuestion = await questionDB.create({
// //             questionName,
// //             questionUrl,
// //             user,
// //         });

// //         console.log("✅ Question Created:", newQuestion);

// //         res.status(201).json({
// //             status: true,
// //             message: "Question added successfully",
// //             question: newQuestion,
// //         });

// //     } catch (error) {
// //         console.error("❌ Error while adding question:", error.message);
// //         res.status(500).json({
// //             status: false,
// //             message: "Error while adding question",
// //             error: error.message,
// //         });
// //     }
// // };

// // // ✅ Get all questions
// // export const getAllQuestions = async (req, res) => {
// //     try {
// //         const questions = await questionDB.find();
// //         res.status(200).json({ status: true, questions });
// //     } catch (error) {
// //         res.status(500).json({
// //             status: false,
// //             message: "Error fetching questions",
// //             error: error.message,
// //         });
// //     }
// // };
// import Question from "../models/Question.js"; 
// import Answer from "../models/Answer.js"; 

// export const createQuestion = async (req, res) => {
//   try {
//     const { questionName, questionUrl, user } = req.body;

//     if (!questionName || !user) {
//       return res.status(400).json({
//         status: false,
//         message: "questionName and user are required",
//       });
//     }

//     const newQuestion = new Question({ questionName, questionUrl, user });
//     await newQuestion.save();

//     res.status(201).json({
//       status: true,
//       message: "Question added successfully",
//       question: newQuestion,
//     });
//   } catch (error) {
//     console.error("Error while adding question:", error);
//     res.status(500).json({
//       status: false,
//       message: "Error while adding question",
//     });
//   }
// };

// export const getAllQuestions = async (req, res) => {
//   try {
//     const questions = await Question.aggregate([
//       {
//         $lookup: {
//           from: "answers", 
//           localField: "_id", 
//           foreignField: "questionId", 
//           as: "allAnswers",
//         },
//       },
//     ]);

//     res.status(200).json(questions);
//   } catch (error) {
//     console.error("Error while fetching questions:", error);
//     res.status(500).json({
//       status: false,
//       message: "Unable to get the question details",
//     });
//   }
// };

// export const deleteQuestion = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const question = await Question.findById(id);
//     if (!question) {
//       return res.status(404).json({
//         status: false,
//         message: "Question not found",
//       });
//     }

//     await Answer.deleteMany({ questionId: id });
//     await Question.findByIdAndDelete(id);

//     res.status(200).json({
//       status: true,
//       message: "Question deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error while deleting question:", error);
//     res.status(500).json({
//       status: false,
//       message: "Error while deleting question",
//     });
//   }
// };
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

// ✅ Create a question (Only authenticated users)
export const createQuestion = async (req, res) => {
  try {
    const { questionName, questionUrl } = req.body;
    const user = req.user; // From AuthMiddleware

    if (!questionName) {
      return res.status(400).json({ message: "Question name is required" });
    }

    const newQuestion = new Question({
      questionName,
      questionUrl,
      user: user._id,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error adding question" });
  }
};

// ✅ Fetch all questions with answers
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("user", "userName photo")
      .populate({ path: "answers", populate: { path: "user", select: "userName photo" } });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

// ✅ Delete question (Only by owner)
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await question.deleteOne();
    res.status(200).json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question" });
  }
};
