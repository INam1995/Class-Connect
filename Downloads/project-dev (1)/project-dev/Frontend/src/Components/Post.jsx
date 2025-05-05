import React, { useState } from "react";
import "./css/Post.css";
import { Avatar } from "@mui/material";
import { Favorite, ThumbDown } from "@mui/icons-material";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactHtmlParser from "html-react-parser";
import api from "../api";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

// Component for displaying time ago
function LastSeen({ date }) {
  return (
    <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />
  );
}

function Post({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const handleSubmit = async () => {
    if (post?._id && answer !== "") {
      try {
        await api.post("/api/answers", {
          text: answer,
          questionId: post._id,
        });
        alert("Answer added successfully");
        setIsModalOpen(false);
        setAnswer("");
        window.location.reload();
      } catch (error) {
        console.error("Error adding answer:", error);
      }
    }
  };

  const handleLike = async (answerId) => {
    try {
      await api.post(`/api/answers/${answerId}/like`);
      window.location.reload();
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
        <Avatar src={post?.user?.avatar} />
        <div>
          <h4>{typeof post.user === "object" ? post.user?.name : post.user || "Anonymous"}</h4>
          <small>
            <LastSeen date={post?.createdAt} />
          </small>
        </div>
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
            <ReactQuill
              value={answer}
              onChange={setAnswer}
              placeholder="Enter your answer"
            />
          </div>
          <div className="modal__button">
            <button className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button onClick={handleSubmit} type="submit" className="add">Add Answer</button>
          </div>
        </Modal>
      </div>

      <p>{post?.allAnswers?.length || 0} Answer(s)</p>

      <div className="post__answer">
        {(showAllAnswers ? post?.allAnswers : post?.allAnswers?.slice(0, 1))?.map((_a) => (
          <div key={_a._id} className="post-answer-container">
            <div className="post-answered">
              <Avatar src={_a?.user?.avatar} />
              <span>
                <LastSeen date={_a?.createdAt} />
              </span>
            </div>
            <div className="post-answer">
              {ReactHtmlParser(
                typeof _a.text === "string"
                  ? _a.text
                  : (typeof _a.answer === "string"
                    ? _a.answer
                    : JSON.stringify(_a.answer || ""))
              )}
            </div>
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
        {post?.allAnswers?.length > 1 && !showAllAnswers && (
          <span className="view-more" onClick={() => setShowAllAnswers(true)}>
            View more answers
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
