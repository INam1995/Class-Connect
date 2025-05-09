import React, { useEffect, useState } from "react";
import axios from "axios";

const ClassNotes = () => {
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [reviewState, setReviewState] = useState({}); // { [pdfId]: { rating, review } }

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/class-notes");
      setNotes(data);
    } catch (err) {
      console.error("Error fetching class notes:", err);
    }
  };

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.token || localStorage.getItem("token") || "";
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user._id) return alert("User not logged in.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", "65e75f9e2b1a4c3f947ea1b7"); // TODO: dynamic later
    formData.append("uploadedBy", user._id);
    formData.append("topic", "Math Notes");

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/api/class-notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded ✅");
      setFile(null);
      document.getElementById("fileInput").value = "";
      fetchNotes();
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRating = async (pdfId, rating) => {
    const token = getToken();
    if (!token) return alert("Please log in to rate.");

    try {
      setReviewState((prev) => ({
        ...prev,
        [pdfId]: { ...prev[pdfId], rating },
      }));

      await axios.post(
        "http://localhost:5000/api/class-notes/rate",
        { pdfId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotes();
    } catch (err) {
      console.error("Rating failed:", err);
      alert("Failed to submit rating.");
    }
  };

  const handleSubmitReview = async (pdfId) => {
    const token = getToken();
    const { rating, review } = reviewState[pdfId] || {};
    if (!rating || !review) return alert("Please rate and write a review.");

    const note = notes.find((n) => n._id === pdfId);
    const folderId = note?.folderId;

    try {
      await axios.post(
        "http://localhost:5000/api/reviews/submit-review",
        { pdfId, rating, review, folderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted ✅");
      setReviewState((prev) => {
        const updated = { ...prev };
        delete updated[pdfId];
        return updated;
      });
      fetchNotes();
    } catch (err) {
      console.error("Review submit error:", err);
      alert("Review submission failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fef6f3] p-6">
      <h2 className="text-4xl font-bold text-[#222] text-center mb-10">
        🎓 <span className="text-[#f26d4f]">Class Notes</span> Hub
      </h2>

      {/* Upload Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full max-w-sm border border-gray-300 rounded-md p-2 text-gray-700"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-6 py-2 text-white font-bold rounded-md transition duration-300 shadow-md ${
            uploading ? "bg-gray-400" : "bg-[#f26d4f] hover:bg-[#e25539]"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Note"}
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <p className="text-gray-500 text-center">No notes available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white border border-gray-300 rounded-2xl shadow-md p-4 flex flex-col justify-between h-[380px] hover:scale-105 transition"
            >
              <div>
                <span className="text-sm px-2 py-1 bg-[#8b5cf6] text-white rounded-full mb-2 inline-block">
                  PDF Note
                </span>
                <h3 className="text-xl font-semibold">{note.name}</h3>
                <p className="text-gray-600 text-sm">👤 {note.uploadedBy?.name || "Unknown"}</p>
                <p className="text-gray-500 text-sm">🕒 {new Date(note.createdAt).toLocaleString()}</p>
                <a
                  href={`http://localhost:5000${note.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f26d4f] hover:underline mt-2 inline-block font-medium"
                >
                  📄 View PDF
                </a>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-1">
                  ⭐ Avg Rating: {note.averageRating || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  👥 Rated by {note.ratingCount || 0} users
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(note._id, star)}
                      className={`text-xl ${
                        (reviewState[note._id]?.rating || 0) >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {note.reviews?.length > 0 && (
                <div className="mt-3 border-t pt-2">
                  <h4 className="text-sm font-semibold text-gray-700">💬 Reviews:</h4>
                  <ul className="pl-4 list-disc text-sm text-gray-600 space-y-1 mt-1">
                    {note.reviews.map((r, idx) => (
                      <li key={idx}>
                        <strong>{r.user?.name || "Anonymous"}:</strong> {r.review}
                        <span className="text-xs text-gray-400 ml-1">
                          ({new Date(r.createdAt).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Review input */}
              <div className="mt-3 border-t pt-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Write a Review:</h4>
                <div className="flex items-start gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        setReviewState((prev) => ({
                          ...prev,
                          [note._id]: { ...prev[note._id], rating: s },
                        }))
                      }
                      className={`text-xl ${
                        (reviewState[note._id]?.rating || 0) >= s
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <textarea
                    rows={2}
                    placeholder="Your review..."
                    className="flex-1 border rounded-md p-1 text-sm"
                    value={reviewState[note._id]?.review || ""}
                    onChange={(e) =>
                      setReviewState((prev) => ({
                        ...prev,
                        [note._id]: { ...prev[note._id], review: e.target.value },
                      }))
                    }
                  />
                </div>
                <button
                  onClick={() => handleSubmitReview(note._id)}
                  className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                >
                  Submit Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassNotes;
