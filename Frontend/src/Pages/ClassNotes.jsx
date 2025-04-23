import React, { useEffect, useState } from "react";
import axios from "axios";
// import User from "../../../Backend/models/user.js";

const ClassNotes = () => {
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/class-notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching class notes:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    console.log("File to upload:", file);
  
    // Get user ID from localStorage or authentication context
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const userId = user?._id; // Assuming your user object has _id field
    const folderId = "65e75f9e2b1a4c3f947ea1b7";
    console.log("User ID:", userId);


    if (!userId) {
      alert("User not logged in. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);
    formData.append("uploadedBy", userId);
    formData.append("topic", "Math Notes"); // Optional: Replace with dynamic topic if needed
  
    try {
      setUploading(true);
      
          // Change this in ClassNotes.jsx
        await axios.post("http://localhost:5000/api/class-notes/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },});

     
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
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }
      const userId = localStorage.getItem("userId");
if (!userId) {
  alert("User not logged in.");
  return;
}


      const response = await axios.post(
        "http://localhost:5000/api/class-notes/rate",
        {
          pdfId,
          userId,
          rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Rating submitted! New Average: ${response.data.averageRating}`);
      fetchNotes();
    } catch (error) {
      console.error("Error rating PDF:", error.response?.data || error);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📚 Class Notes</h2>

      {/* File Upload Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border border-gray-300 rounded-md p-2 text-gray-700"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-5 py-2 text-white font-semibold ${
            uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } rounded-md shadow-md transition duration-300`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Notes List */}
      <ul className="space-y-6">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">
            No notes available. Upload your first note!
          </p>
        ) : (
          notes.map((note) => (
            <li
              key={note._id}
              className="bg-white p-5 rounded-md shadow-md border border-gray-200"
            >
              <h3 className="font-semibold text-xl text-gray-800 mb-1">
                📂 {note.name}
              </h3>
              <p className="text-gray-600">
                👤 Uploaded by: {note.uploadedBy?.name || "Unknown"}
              </p>
              <p className="text-gray-600">
                🕒 Uploaded on: {new Date(note.createdAt).toLocaleString()}
              </p>

              <a
                href={`http://localhost:5000${note.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-block mt-2"
              >
                View PDF
              </a>

              <div className="mt-4 flex flex-col gap-1">
                <p className="text-gray-600">
                  ⭐ Avg Rating: {note.averageRating || "No ratings yet"}
                </p>
                <p className="text-gray-600">
                  👥 Rated by: {note.ratingCount || 0} users
                </p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(note._id, star)}
                      className="text-yellow-500 text-xl hover:scale-110 transition"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Section */}
              {note.reviews && note.reviews.length > 0 && (
                <div className="mt-5 border-t pt-3">
                  <h4 className="font-semibold text-gray-700 mb-2">💬 Reviews:</h4>
                  <ul className="pl-4 list-disc text-sm text-gray-600 space-y-1">
                    {note.reviews.map((r, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">
                          {r.user?.name || "Anonymous"}:
                        </span>{" "}
                        {r.review}
                        <span className="text-xs text-gray-400 ml-2">
                          ({new Date(r.createdAt).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ClassNotes;
