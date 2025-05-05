
import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined"; // ✅ FIXED IMPORT
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CloseIcon from "@mui/icons-material/Close"; // ✅ FIXED IMPORT
import {  Button, Input } from "@mui/material";

import "./css/QuoraHeader.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import api from "../api.js";

function QuoraHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const Close = <CloseIcon />;

  const handleSubmit = async () => {
    if (question !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        questionName: question,
        questionUrl: inputUrl,
      };
      await api
        .post("/api/questions", body, config)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          window.location.href("/");
        })
        .catch((e) => {
          console.log(e);
          alert("Error in adding question");
        });
    }
  };

  return (
    <div className="qHeader">
      <div className="qHeader-content">
        <div className="qHeader__logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/18/Wikipedia20_animated_Plane.gif"
            alt="logo"
          />
        </div>
        <div className="qHeader__icons">
          <div className="qHeader__icon">
            <HomeIcon />
          </div>
          <div className="qHeader__icon">
            <FeaturedPlayListOutlinedIcon />
          </div>
          <div className="qHeader__icon">
            <AssignmentTurnedInOutlinedIcon /> {/* ✅ FIXED HERE */}
          </div>
          <div className="qHeader__icon">
            <PeopleAltOutlinedIcon /> {/* ✅ FIXED HERE */}
          </div>
          <div className="qHeader__icon">
            <NotificationsOutlinedIcon /> {/* ✅ FIXED HERE */}
          </div>
        </div>
        <div className="qHeader__input">
          <SearchIcon /> {/* ✅ FIXED HERE */}
          <input type="text" placeholder="Search questions" />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
        <Modal
          open={isModalOpen}
          closeIcon={Close}
          onClose={() => setIsModalOpen(false)}
          closeOnEsc
          center
          closeOnOverlayClick={false}
          styles={{
            overlay: { height: "auto" },
          }}
        >
          <div className="modal__title">
            <h5>Add Question</h5>
            <h5>Share Link</h5>
          </div>
          <div className="modal__Field">
            <Input
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              type="text"
              placeholder="Start your question with 'What', 'How', 'Why', etc."
            />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Optional: include a link that gives context"
            />
            {inputUrl && <img src={inputUrl} alt="display" style={{ height: "40vh" }} />}
          </div>
          <div className="modal__buttons">
            <button className="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button onClick={handleSubmit} type="submit" className="add">
              Add Question
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default QuoraHeader;
