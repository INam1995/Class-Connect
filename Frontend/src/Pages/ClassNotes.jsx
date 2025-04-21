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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", "65e75f9e2b1a4c3f947ea1b7");
    formData.append("uploadedBy", "65e75f9e2b1a4c3f947ea1b7"); // ✅ Use actual User ID from MongoDB
    formData.append("topic", "Math Notes");

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/api/class-notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");
      setFile(null);
      document.getElementById("fileInput").value = "";
      fetchNotes(); // ✅ Refresh notes after upload
    } catch (error) {
      console.error("Error uploading class note:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRating = async (pdfId, rating) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from storage
      if (!token) {
        alert("You need to log in first.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/class-notes/rate",
        { pdfId, userId: "65e75f9e2b1a4c3f947ea1b7", rating },
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Include the token
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
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
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
      <ul className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">No notes available. Upload your first note!</p>
        ) : (
          notes.map((note) => (
            <li key={note._id} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800">📂 {note.name}</h3>
              <p className="text-gray-600">👤 Uploaded by: {note.uploadedBy?.name || "Unknown"}</p>
              <a
                href={`http://localhost:5000${note.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View PDF
              </a>
              <div className="mt-2 flex items-center">
                <p className="text-gray-600 mr-2">⭐ Avg Rating: {note.averageRating || "No ratings yet"}</p>
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
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ClassNotes;
