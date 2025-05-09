import React, { useEffect, useState } from "react";
import axios from "axios";

const ClassNotes = () => {
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : {};
    const userId = user?._id;
    const folderId = "65e75f9e2b1a4c3f947ea1b7";

    if (!userId) {
      alert("User not logged in. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);
    formData.append("uploadedBy", userId);
    formData.append("topic", "Math Notes");

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/api/class-notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully ✅");
      setFile(null);
      document.getElementById("fileInput").value = "";
      fetchNotes();
    } catch (error) {
      console.error("❌ Error uploading class note:", error.response?.data || error.message);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRating = async (pdfId, rating) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/class-notes/rate",
        { pdfId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotes();
    } catch (err) {
      console.error("Error rating PDF:", err.response?.data || err);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fef6f3] p-6">
      <h2 className="text-4xl font-bold text-[#222] text-center mb-10">
        🎓 <span className="text-[#f26d4f]">Class Notes</span> Hub
      </h2>

      {/* File Upload Section */}
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
        <p className="text-gray-500 text-center">No notes available. Upload your first note!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {notes.map((note) => (
            <div
            key={note._id}
            className="bg-white border border-gray-300 rounded-2xl shadow-md p-4 h-[320px] flex flex-col justify-between transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-[#f26d4f]"
            >
          
              <div>
                <span className="text-sm px-2 py-1 bg-[#8b5cf6] text-white rounded-full mb-2 inline-block">
                  PDF Note
                </span>
                <h3 className="text-xl font-semibold text-[#1f1f1f] mb-1">{note.name}</h3>
                <p className="text-gray-600 text-sm">👤 By: {note.uploadedBy?.name || "Unknown"}</p>
                <p className="text-gray-500 text-sm">🕒 {new Date(note.createdAt).toLocaleString()}</p>

                <a
                  href={`http://localhost:5000${note.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f26d4f] hover:underline mt-3 inline-block font-medium"
                >
                  📄 View PDF
                </a>
              </div>

              <div className="mt-4">
                <p className="text-gray-700 text-sm mb-1">
                  ⭐ Avg Rating: {note.averageRating || "No ratings yet"}
                </p>
                <p className="text-gray-700 text-sm mb-2">👥 Rated by {note.ratingCount || 0} users</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(note._id, star)}
                      className="text-yellow-400 text-xl hover:scale-110 transition"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {note.reviews?.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="font-semibold text-gray-700 mb-2">💬 Reviews:</h4>
                  <ul className="pl-4 list-disc text-sm text-gray-600 space-y-1">
                    {note.reviews.map((r, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{r.user?.name || "Anonymous"}:</span>{" "}
                        {r.review}
                        <span className="text-xs text-gray-400 ml-2">
                          ({new Date(r.createdAt).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassNotes;
