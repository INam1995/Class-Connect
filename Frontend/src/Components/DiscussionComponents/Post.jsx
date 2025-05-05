
import "../css/Post.css";
import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { 
  
  ArrowDownward, ArrowUpward, ChatBubble, 
  MoreHoriz, RepeatOne, Share, Favorite, ThumbDown 
} from "@mui/icons-material";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import api from "../../api";
import ReactHtmlParser from "html-react-parser";
//import ReactHtmlParser from "react-html-parser";

// Initialize TimeAgo
TimeAgo.addDefaultLocale(en);

// Component for showing time ago
function LastSeen({ date }) {
  return (
    <div>
      <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />
    </div>
  );
}

function Post({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleQuill = (value) => {
    setAnswer(value);
  };
  const handleSubmit = async () => {
    console.log("hh");
    if (post?._id && answer !== "") {
      try {
        console.log("Submitting answer...");
        const response = await api.post("/api/answers", {
          text: answer,  // Fix: Use "text" instead of "answer" (Backend expects "text")
          questionId: post?._id,
        });
        console.log(response.data);
        alert("Answer added successfully");
        setIsModalOpen(false);
        setAnswer(""); // Clear input field
       
        console.log("Answers Data:", post?.allAnswers);
window.location.reload();
        window.location.href = "/discussion"; // Fix the reload syntax
      } catch (error) {
        console.error("Error adding answer:", error);
      }
    }
  };
  
  

  const handleLike = async (answerId) => {
    try {
      await api.post(`/api/answers/${answerId}/like`);
      window.location.reload();
      window.location.href="/discussion";
    } catch (error) {
      console.error("Error liking the answer:", error);
    }
  };

  const handleDislike = async (answerId) => {
    try {
      await api.post(`/api/answers/${answerId}/dislike`);
      window.location.reload();
    } catch (error) {
      console.error("Error disliking the answer:", error);
    }
  };

  return (
    <div className="post">
      <div className="post__info">
        <Avatar />
        {/* <h4>Anonymous</h4> */}
        <small>
          <LastSeen date={post?.createdAt} />
        </small>
      </div>
      <div className="post__body">
        <p>{post?.questionName}</p>
        <button onClick={() => setIsModalOpen(true)} className="post__btnAnswer">
          Answer
        </button>
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
          <div className="modal__question">
            <h1>{post?.questionName}</h1>
          </div>
          <div className="modal__answer">
            <ReactQuill value={answer} onChange={handleQuill} placeholder="Enter your answer" />
          </div>
          <div className="modal__button">
            <button className="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button onClick={handleSubmit} type="submit" className="add">
              Add Answer
            </button>
            
          </div>
        </Modal>
      </div>
      <div className="post__footer">
        <ArrowUpward />
        <ArrowDownward />
        <RepeatOne />
        <ChatBubble />
        <Share />
        <MoreHoriz />
      </div>
      <p>{post?.allAnswers?.length || 0} Answer(s)</p>
      <div className="post__answer">
        {post?.allAnswers?.map((_a) => (
          <div key={_a._id} className="post-answer-container">
            <div className="post-answered">
              <Avatar />
             {/* // <p>Anonymous</p> */}
              <span><LastSeen date={_a?.createdAt} /></span>
            </div>
            <div className="post-answer">
  {ReactHtmlParser(typeof _a.text === "string" ? _a.text : (typeof _a.answer === "string" ? _a.answer : JSON.stringify(_a.answer || "")))}
</div>


            {/* <div className="post-answer">
  {ReactHtmlParser(typeof _a.answer === "string" ? _a.answer : JSON.stringify(_a.answer))}
</div> */}

            {/* <div className="post-answer">{ReactHtmlParser(_a?.answer)}</div> */}
            <div>
              <button onClick={() => handleLike(_a._id)}>
                <Favorite /> {_a.likes || 0}
              </button>
              <button onClick={() => handleDislike(_a._id)}>
                <ThumbDown /> {_a.dislikes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
