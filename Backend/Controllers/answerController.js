// // // // // const answerDB = require("../models/Answer");

// // // // // // Create an answer
// // // // // exports.createAnswer = async (req, res) => {
// // // // //   try {
// // // // //     await answerDB.create({
// // // // //       answer: req.body.answer,
// // // // //       questionId: req.body.questionId,
// // // // //       user: req.body.user,
// // // // //     });

// // // // //     res.status(201).send({
// // // // //       status: true,
// // // // //       message: "Answer added successfully",
// // // // //     });
// // // // //   } catch (e) {
// // // // //     res.status(500).send({
// // // // //       status: false,
// // // // //       message: "Error while adding answer",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // Like an answer
// // // // // exports.likeAnswer = async (req, res) => {
// // // // //   try {
// // // // //     const answer = await answerDB.findById(req.params.id);

// // // // //     if (!answer) {
// // // // //       return res.status(404).send({
// // // // //         status: false,
// // // // //         message: "Answer not found",
// // // // //       });
// // // // //     }

// // // // //     answer.likes += 1;
// // // // //     await answer.save();

// // // // //     res.status(200).json({
// // // // //       status: true,
// // // // //       likes: answer.likes,
// // // // //       message: "Answer liked successfully",
// // // // //     });
// // // // //   } catch (err) {
// // // // //     res.status(500).send({
// // // // //       status: false,
// // // // //       message: "Error liking the answer",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // Dislike an answer
// // // // // exports.dislikeAnswer = async (req, res) => {
// // // // //   try {
// // // // //     const answer = await answerDB.findById(req.params.id);

// // // // //     if (!answer) {
// // // // //       return res.status(404).send({
// // // // //         status: false,
// // // // //         message: "Answer not found",
// // // // //       });
// // // // //     }

// // // // //     answer.dislikes += 1;
// // // // //     await answer.save();

// // // // //     res.status(200).json({
// // // // //       status: true,
// // // // //       dislikes: answer.dislikes,
// // // // //       message: "Answer disliked successfully",
// // // // //     });
// // // // //   } catch (err) {
// // // // //     res.status(500).send({
// // // // //       status: false,
// // // // //       message: "Error disliking the answer",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // Get an answer by ID
// // // // // exports.getAnswer = async (req, res) => {
// // // // //   try {
// // // // //     const answer = await answerDB.findById(req.params.id);

// // // // //     if (!answer) {
// // // // //       return res.status(404).send({
// // // // //         status: false,
// // // // //         message: "Answer not found",
// // // // //       });
// // // // //     }

// // // // //     res.status(200).json({
// // // // //       status: true,
// // // // //       likes: answer.likes,
// // // // //       answer: answer.answer,
// // // // //       user: answer.user,
// // // // //     });
// // // // //   } catch (err) {
// // // // //     res.status(500).send({
// // // // //       status: false,
// // // // //       message: "Error fetching the answer",
// // // // //     });
// // // // //   }
// // // // // };
// // // // const answerDB = require("../models/Answer");
// // // // const path = require("path");

// // // // // Create an answer with optional image upload
// // // // exports.createAnswer = async (req, res) => {
// // // //   try {
// // // //     let photoUrl = null;

// // // //     if (req.file) {
// // // //       photoUrl = `/uploads/${req.file.filename}`; // Store uploaded photo URL
// // // //     }

// // // //     const newAnswer = await answerDB.create({
// // // //       answer: req.body.answer,
// // // //       questionId: req.body.questionId,
// // // //       user: req.body.user,
// // // //       photo: photoUrl, // Save image URL in DB
// // // //     });

// // // //     res.status(201).send({
// // // //       status: true,
// // // //       message: "Answer added successfully",
// // // //       answer: newAnswer,
// // // //     });
// // // //   } catch (e) {
// // // //     res.status(500).send({
// // // //       status: false,
// // // //       message: "Error while adding answer",
// // // //       error: e.message,
// // // //     });
// // // //   }
// // // // };

// // // // // Like an answer
// // // // exports.likeAnswer = async (req, res) => {
// // // //   try {
// // // //     const answer = await answerDB.findById(req.params.id);

// // // //     if (!answer) {
// // // //       return res.status(404).send({ status: false, message: "Answer not found" });
// // // //     }

// // // //     answer.likes = (answer.likes || 0) + 1; // Ensure likes is initialized
// // // //     await answer.save();

// // // //     res.status(200).json({
// // // //       status: true,
// // // //       likes: answer.likes,
// // // //       message: "Answer liked successfully",
// // // //     });
// // // //   } catch (err) {
// // // //     res.status(500).send({ status: false, message: "Error liking the answer", error: err.message });
// // // //   }
// // // // };

// // // // // Dislike an answer
// // // // exports.dislikeAnswer = async (req, res) => {
// // // //   try {
// // // //     const answer = await answerDB.findById(req.params.id);

// // // //     if (!answer) {
// // // //       return res.status(404).send({ status: false, message: "Answer not found" });
// // // //     }

// // // //     answer.dislikes = (answer.dislikes || 0) + 1; // Ensure dislikes is initialized
// // // //     await answer.save();

// // // //     res.status(200).json({
// // // //       status: true,
// // // //       dislikes: answer.dislikes,
// // // //       message: "Answer disliked successfully",
// // // //     });
// // // //   } catch (err) {
// // // //     res.status(500).send({ status: false, message: "Error disliking the answer", error: err.message });
// // // //   }
// // // // };

// // // // // Get an answer by ID
// // // // exports.getAnswer = async (req, res) => {
// // // //   try {
// // // //     const answer = await answerDB.findById(req.params.id);

// // // //     if (!answer) {
// // // //       return res.status(404).send({ status: false, message: "Answer not found" });
// // // //     }

// // // //     res.status(200).json({
// // // //       status: true,
// // // //       answer: answer.answer,
// // // //       user: answer.user,
// // // //       likes: answer.likes,
// // // //       dislikes: answer.dislikes,
// // // //       photo: answer.photo ? `http://localhost:4000${answer.photo}` : null, // Return full image URL
// // // //     });
// // // //   } catch (err) {
// // // //     res.status(500).send({ status: false, message: "Error fetching the answer", error: err.message });
// // // //   }
// // // // };
// // // import  answerDB from "../models/Answer.js";

// // // // Create an answer (Text, Image, or Both)
// // // export const createAnswer = async (req, res) => {
// // //   try {
// // //     let { answer, questionId, user } = req.body;
// // //     let photoUrl = req.file ? `/uploads/${req.file.filename}` : null; // Store image URL if uploaded

// // //     // Validate that at least one input (text or image) is provided
// // //     if (!answer && !photoUrl) {
// // //       return res.status(400).json({
// // //         status: false,
// // //         message: "Answer must contain text, an image, or both.",
// // //       });
// // //     }

// // //     const newAnswer = await answerDB.create({
// // //       answer,
// // //       photo: photoUrl,
// // //       questionId,
// // //       user,
// // //     });

// // //     res.status(201).json({
// // //       status: true,
// // //       message: "Answer added successfully",
// // //       answer: newAnswer,
// // //     });
// // //   } catch (e) {
// // //     res.status(500).json({
// // //       status: false,
// // //       message: "Error while adding answer",
// // //       error: e.message,
// // //     });
// // //   }
// // // };

// // // // Get answer by ID
// // // export const getAnswer = async (req, res) => {
// // //   try {
// // //     const answer = await answerDB.findById(req.params.id);

// // //     if (!answer) {
// // //       return res.status(404).json({ status: false, message: "Answer not found" });
// // //     }

// // //     res.status(200).json({
// // //       status: true,
// // //       answer: answer.answer,
// // //       photo: answer.photo ? `http://localhost:4000${answer.photo}` : null,
// // //       user: answer.user,
// // //       likes: answer.likes,
// // //       dislikes: answer.dislikes,
// // //     });
// // //   } catch (err) {
// // //     res.status(500).json({
// // //       status: false,
// // //       message: "Error fetching the answer",
// // //       error: err.message,
// // //     });
// // //   }
// // // };
// // import answerDB from "../models/Answer.js";

// // // ✅ Create an answer (Text, Image, or Both)
// // export const createAnswer = async (req, res) => {
// //   try {
// //     const { answer, questionId, user } = req.body;
// //     const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

// //     // 🔹 Ensure at least text or image is provided
// //     if (!answer && !photoUrl) {
// //       return res.status(400).json({
// //         status: false,
// //         message: "Answer must contain text, an image, or both.",
// //       });
// //     }

// //     const newAnswer = await answerDB.create({
// //       answer,
// //       photo: photoUrl,
// //       questionId,
// //       user,
// //       likes: 0, // 🔹 Ensure default values
// //       dislikes: 0,
// //     });

// //     res.status(201).json({
// //       status: true,
// //       message: "Answer added successfully",
// //       answer: newAnswer,
// //     });
// //   } catch (e) {
// //     res.status(500).json({
// //       status: false,
// //       message: "Error while adding answer",
// //       error: e.message,
// //     });
// //   }
// // };

// // // ✅ Like an answer
// // export const likeAnswer = async (req, res) => {
// //   try {
// //     const answer = await answerDB.findById(req.params.id);

// //     if (!answer) {
// //       return res.status(404).json({ status: false, message: "Answer not found" });
// //     }

// //     answer.likes = (answer.likes || 0) + 1;
// //     await answer.save();

// //     res.status(200).json({
// //       status: true,
// //       likes: answer.likes,
// //       message: "Answer liked successfully",
// //     });
// //   } catch (err) {
// //     res.status(500).json({
// //       status: false,
// //       message: "Error liking the answer",
// //       error: err.message,
// //     });
// //   }
// // };

// // // ✅ Dislike an answer
// // export const dislikeAnswer = async (req, res) => {
// //   try {
// //     const answer = await answerDB.findById(req.params.id);

// //     if (!answer) {
// //       return res.status(404).json({ status: false, message: "Answer not found" });
// //     }

// //     answer.dislikes = (answer.dislikes || 0) + 1;
// //     await answer.save();

// //     res.status(200).json({
// //       status: true,
// //       dislikes: answer.dislikes,
// //       message: "Answer disliked successfully",
// //     });
// //   } catch (err) {
// //     res.status(500).json({
// //       status: false,
// //       message: "Error disliking the answer",
// //       error: err.message,
// //     });
// //   }
// // };

// // // ✅ Get an answer by ID
// // export const getAnswer = async (req, res) => {
// //   try {
// //     const answer = await answerDB.findById(req.params.id);

// //     if (!answer) {
// //       return res.status(404).json({ status: false, message: "Answer not found" });
// //     }

// //     res.status(200).json({
// //       status: true,
// //       answer: answer.answer,
// //       photo: answer.photo ? `http://localhost:4000${answer.photo}` : null, // ✅ Full image URL
// //       user: answer.user,
// //       likes: answer.likes || 0, // ✅ Ensure default values
// //       dislikes: answer.dislikes || 0,
// //     });
// //   } catch (err) {
// //     res.status(500).json({
// //       status: false,
// //       message: "Error fetching the answer",
// //       error: err.message,
// //     });
// //   }
// // };
// import Answer from "../models/Answer.js";
// import mongoose from "mongoose";

// // Create an answer
// // export const createAnswer = async (req, res) => {
// //   console.log("1");
// //   try {
// //     console.log("2");
// //     console.log(req.body);
// //     const { questionId, user, text } = req.body;
// //     console.log(questionId)
// //     console.log(text)
// //     console.log(user)
// //     if (!mongoose.Types.ObjectId.isValid(questionId)) {
// //       return res.status(400).json({ error: `Invalid questionId: ${questionId}` });
// //     }
// //     if (!mongoose.Types.ObjectId.isValid(user)) {
// //       return res.status(400).json({ error: `Invalid user ID: ${user}` });
// //     }

// //     const photo = req.file ? req.file.path : null; // If an image is uploaded
// //     console.log("3");
// //     if (!questionId || !user || (!text && !photo)) {
// //       return res.status(400).json({
// //         status: false,
// //         message: "questionId, user, and either text or photo are required",
// //       });
// //     }
// //     console.log("4");
// //     //const newAnswer = new Answer({ questionId, user, text, photo });
// //     console.log("6");
// //     const answer = new Answer({
// //       questionId,
// //       text,
// //       user,
// //       photo,
// //     });

// //     await answer.save();
// //     console.log("5");
// //     res.status(201).json({
// //       status: true,
// //       message: "Answer added successfully",
// //       answer: answer,
// //     });
// //   } catch (error) {
// //     console.error("Error while adding answer:", error);
// //     res.status(500).json({
// //       status: false,
// //       message: "Error while adding answer",
// //     });
// //   }
// // };

// export const createAnswer = async (req, res) => {
//   try {
//     const { questionId, user, text } = req.body;
    
//     if (!mongoose.Types.ObjectId.isValid(questionId)) {
//       return res.status(400).json({ error: "Invalid question ID" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(user)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     const answer = new Answer({
//       questionId,
//       text,
//       user: new mongoose.Types.ObjectId(user),  // ✅ Fix: Convert user ID to ObjectID
//     });

//     await answer.save();
//     res.status(201).json({ status: true, message: "Answer added successfully", answer });
//   } catch (error) {
//     console.error("Error while adding answer:", error);
//     res.status(500).json({ status: false, message: "Error while adding answer" });
//   }
// };

// // Like an answer
// export const likeAnswer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedAnswer = await Answer.findByIdAndUpdate(
//       id,
//       { $inc: { likes: 1 } },  // ✅ Fix: Use `$inc` to increase likes
//       { new: true }
//     );

//     if (!updatedAnswer) {
//       return res.status(404).json({ status: false, message: "Answer not found" });
//     }

//     res.status(200).json(updatedAnswer);
//   } catch (error) {
//     console.error("Error while liking answer:", error);
//     res.status(500).json({ status: false, message: "Error while liking answer" });
//   }
// };


// // Dislike an answer
// export const dislikeAnswer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedAnswer = await Answer.findByIdAndUpdate(
//       id,
//       { $inc: { dislikes: 1 } },
//       { new: true }
//     );

//     if (!updatedAnswer) {
//       return res.status(404).json({ status: false, message: "Answer not found" });
//     }

//     res.status(200).json(updatedAnswer);
//   } catch (error) {
//     console.error("Error while disliking answer:", error);
//     res.status(500).json({ status: false, message: "Error while disliking answer" });
//   }
// };

// // Get an answer by ID
// export const getAnswer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const answer = await Answer.findById(id);

//     if (!answer) {
//       return res.status(404).json({ status: false, message: "Answer not found" });
//     }

//     res.status(200).json(answer);
//   } catch (error) {
//     console.error("Error while fetching answer:", error);
//     res.status(500).json({ status: false, message: "Error while fetching answer" });
//   }
// };

// // Delete an answer by ID
// export const deleteAnswer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if the answer exists
//     const answer = await Answer.findById(id);
//     if (!answer) {
//       return res.status(404).json({ status: false, message: "Answer not found" });
//     }

//     // Delete the answer
//     await Answer.findByIdAndDelete(id);

//     res.status(200).json({
//       status: true,
//       message: "Answer deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error while deleting answer:", error);
//     res.status(500).json({ status: false, message: "Error while deleting answer" });
//   }
// };
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
// ✅ Get answers for a specific question
export const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    const answers = await Answer.find({ questionId }).populate("user", "name email");

    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching answers" });
  }
};

// ✅ Create an answer (Only authenticated users)
export const createAnswer = async (req, res) => {
  try {
    const { answer, questionId } = req.body;
    const user = req.user; 

    if (!answer || !questionId) {
      return res.status(400).json({ message: "Answer and Question ID are required" });
    }

    const newAnswer = new Answer({
      answer,
      questionId,
      user: user._id,
    });

    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ message: "Error adding answer" });
  }
};

// ✅ Like an answer
export const likeAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.likes += 1;
    await answer.save();

    res.status(200).json({ likes: answer.likes });
  } catch (error) {
    res.status(500).json({ message: "Error liking answer" });
  }
};

// ✅ Dislike an answer
export const dislikeAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.dislikes += 1;
    await answer.save();

    res.status(200).json({ dislikes: answer.dislikes });
  } catch (error) {
    res.status(500).json({ message: "Error disliking answer" });
  }
};

// ✅ Delete an answer
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await answer.deleteOne();
    res.status(200).json({ message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting answer" });
  }
};
