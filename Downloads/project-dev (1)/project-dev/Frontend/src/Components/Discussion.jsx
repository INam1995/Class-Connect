// // import React, { useState, useEffect } from "react";
// // import api from "../api";
// // import "./css/DiscussionBox.css";
// // import { Avatar, Button, TextField } from "@mui/material";
// // import ReactTimeAgo from "react-time-ago";
// // import TimeAgo from "javascript-time-ago";
// // import en from "javascript-time-ago/locale/en.json";

// // TimeAgo.addDefaultLocale(en);

// // function LastSeen({ date }) {
// //   return <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />;
// // }

// // export default function DiscussionBox() {
// //   const [questions, setQuestions] = useState([]);
// //   const [newQuestion, setNewQuestion] = useState("");

// //   useEffect(() => {
// //     const fetchQuestions = async () => {
// //       try {
// //         const res = await api.get("/api/questions?populate=answers");
// //         setQuestions(res.data);
// //       } catch (err) {
// //         console.error("Error fetching questions", err);
// //       }
// //     };

// //     fetchQuestions();
// //   }, []);

// //   const handlePostQuestion = async () => {
// //     if (!newQuestion.trim()) return;
// //     try {
// //       await api.post("/api/questions", { questionName: newQuestion });
// //       setNewQuestion("");
// //       window.location.reload();
// //     } catch (err) {
// //       console.error("Error posting question", err);
// //     }
// //   };
// //   const handleViewAnswers = (questionId) => {
// //     navigate(`/answers/${questionId}`); // Redirect to the answers page for this question
// //   };

// //   const handleAddAnswer = (questionId) => {
// //     navigate(`/add-answer/${questionId}`); // Navigate to the "Add Answer" page for this question
// //   };

// //   return (
// //     <div className="discussion-page">
// //       {/* Top Section: Add new question */}
// //       <div className="question-form-section">
// //         <h2>Add New Question</h2>
// //         <div className="new-question-box">
// //           <TextField
// //             fullWidth
// //             label="Type your question..."
// //             variant="outlined"
// //             value={newQuestion}
// //             onChange={(e) => setNewQuestion(e.target.value)}
// //             size="small"
// //           />
// //           <Button variant="contained" color="primary" onClick={handlePostQuestion}>
// //             Post
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Bottom Section: Show questions */}
// //       <div className="question-list-section">
// //         <h2>All Questions</h2>
// //         {questions.map((q, index) => (
// //           <div key={q._id} className="question-card">
// //             <div className="question-main">
// //               <div className="question-left">
// //                 <div className="question-title">
// //                   {String(index + 1).padStart(2, "0")}. {q.questionName}
// //                 </div>
// //                 <div className="question-subtitle">
// //                   {q.answers?.[0]?.text?.slice(0, 60) || "No answers yet"}
// //                 </div>
// //               </div>

// //               <div className="question-center">
// //                 <Avatar src={q.user?.avatar} sx={{ width: 32, height: 32 }} />
// //                 <span className="teacher-name">{q.user?.name || "Anonymous"}</span>
// //               </div>

// //               <div className="question-right">
// //                 <LastSeen date={q.createdAt} />
// //               </div>
// //             </div>

// //             <div className="question-actions">
// //             <Button
// //                 variant="outlined"
// //                 size="small"
// //                 onClick={() => handleViewAnswers(q._id)} // Redirect to show answers page
// //               >
// //                 View other answers
// //               </Button>
// //               <Button
// //                 variant="outlined"
// //                 size="small"
// //                 onClick={() => handleAddAnswer(q._id)} // Navigate to Add Answer page
// //               >
// //                 Add answer
// //               </Button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation
// import api from "../api";
// import "./css/DiscussionBox.css";
// import { Avatar, Button, TextField } from "@mui/material";
// import ReactTimeAgo from "react-time-ago";
// import TimeAgo from "javascript-time-ago";
// import en from "javascript-time-ago/locale/en.json";

// // TimeAgo.addDefaultLocale(en);

// function LastSeen({ date }) {
//   return <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />;
// }

// export default function DiscussionBox() {
//   const [questions, setQuestions] = useState([]);
//   const [newQuestion, setNewQuestion] = useState("");
//   const navigate = useNavigate();  // Initialize navigate

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const res = await api.get("/api/questions?populate=answers");
//         setQuestions(res.data);
//       } catch (err) {
//         console.error("Error fetching questions", err);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   const handlePostQuestion = async () => {
//     if (!newQuestion.trim()) return;
//     try {
//       await api.post("/api/questions", { questionName: newQuestion });
//       setNewQuestion("");
//       window.location.reload();
//     } catch (err) {
//       console.error("Error posting question", err);
//     }
//   };

//   // Navigate to the answers page
//   const handleViewAnswers = (questionId) => {
//     navigate(`/answers/${questionId}`);  // Redirect to show answers page
//   };

//   // Navigate to the Add Answer page
//   const handleAddAnswer = (questionId) => {
//     navigate(`/add-answer/${questionId}`);  // Navigate to Add Answer page
//   };

//   return (
//     <div className="discussion-page">
//       {/* Top Section: Add new question */}
//       <div className="question-form-section">
//         <h2>Add New Question</h2>
//         <div className="new-question-box">
//           <TextField
//             fullWidth
//             label="Type your question..."
//             variant="outlined"
//             value={newQuestion}
//             onChange={(e) => setNewQuestion(e.target.value)}
//             size="small"
//           />
//           <Button variant="contained" color="primary" onClick={handlePostQuestion}>
//             Post
//           </Button>
//         </div>
//       </div>

//       {/* Bottom Section: Show questions */}
//       <div className="question-list-section">
//         <h2>All Questions</h2>
//         {questions.map((q, index) => (
//           <div key={q._id} className="question-card">
//             <div className="question-main">
//               <div className="question-left">
//                 <div className="question-title">
//                   {String(index + 1).padStart(2, "0")}. {q.questionName}
//                 </div>
//                 <div className="question-subtitle">
//                   {q.answers?.[0]?.text?.slice(0, 60) || "No answers yet"}
//                 </div>
//               </div>

//               <div className="question-center">
//                 <Avatar src={q.user?.avatar} sx={{ width: 32, height: 32 }} />
//                 <span className="teacher-name">{q.user?.name || "Anonymous"}</span>
//               </div>

//               <div className="question-right">
//                 <LastSeen date={q.createdAt} />
//               </div>
//             </div>

//             <div className="question-actions">
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => handleViewAnswers(q._id)} // Redirect to show answers page
//               >
//                 View other answers
//               </Button>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => handleAddAnswer(q._id)} // Navigate to Add Answer page
//               >
//                 Add answer
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./css/DiscussionBox.css";
import { Avatar, Button, TextField } from "@mui/material";
import ReactTimeAgo from "react-time-ago";

function LastSeen({ date }) {
  return <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />;
}

export default function DiscussionBox() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/api/questions?populate=answers");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions", err);
      }
    };

    fetchQuestions();
  }, []);

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      await api.post("/api/questions", { questionName: newQuestion });
      setNewQuestion("");
      window.location.reload();
    } catch (err) {
      console.error("Error posting question", err);
    }
  };

  const handleViewAnswers = (questionId) => {
    navigate(`/answers/${questionId}`);
  };

  const handleAddAnswer = (questionId) => {
    navigate(`/add-answer/${questionId}`);
  };

  return (
    <div className="discussion-page">
      {/* Add new question */}
      <div className="question-form-section">
        <h2>Add New Question</h2>
        <div className="new-question-box">
          <TextField
            fullWidth
            label="Type your question..."
            variant="outlined"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            size="small"
          />
          <Button variant="contained" color="primary" onClick={handlePostQuestion}>
            Post
          </Button>
        </div>
      </div>

      {/* Show questions */}
      <div className="question-list-section">
        <h2>All Questions</h2>
        {questions.map((q, index) => (
          <div key={q._id} className="question-card">
            <div className="question-main">
              <div className="question-left">
                <div className="question-title">
                  {String(index + 1).padStart(2, "0")}. {q.questionName}
                </div>
                {/* <div className="question-subtitle">
                  {q.answers?.[0]?.text?.slice(0, 60) || "No answers yet"}
                </div> */}
              </div>

              <div className="question-center">
                <Avatar
                  src={q.user?.avatar || "https://ui-avatars.com/api/?name=Anonymous"}
                  sx={{ width: 32, height: 32 }}
                />
                <span className="teacher-name">{q.user?.name || "Anonymous"}</span>
              </div>

              <div className="question-right">
                <LastSeen date={q.createdAt} />
              </div>
            </div>

            <div className="question-actions">
              <Button variant="outlined" size="small" onClick={() => handleViewAnswers(q._id)}>
                View other answers
              </Button>
              <Button variant="outlined" size="small" onClick={() => handleAddAnswer(q._id)}>
                Add answer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
