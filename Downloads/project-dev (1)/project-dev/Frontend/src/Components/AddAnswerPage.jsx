import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Button, TextField, Typography, Box } from "@mui/material";

export default function AddAnswerPage() {
  const { questionId } = useParams();
  const [answerText, setAnswerText] = useState("");
  const navigate = useNavigate();

  const handleAddAnswer = async () => {
    if (!answerText.trim()) return;

    try {
      await api.post("/api/answers", {
        text: answerText,
        questionId,
      });
      navigate("/discussion");
    } catch (err) {
      console.error("Error adding answer:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add Your Answer
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Your Answer"
        variant="outlined"
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="Write your answer here..."
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleAddAnswer}>
        Submit Answer
      </Button>
    </Box>
  );
}
