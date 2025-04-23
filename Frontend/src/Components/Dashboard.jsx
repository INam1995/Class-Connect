import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CreateOrJoinFolderModal from "./CreateOrJoinFolderModal";
import FolderGrid from "./foldergrid";
import { useNavigate } from "react-router-dom";
import WhiteboardModal from "./WhiteboardModal.jsx";

const Dashboard = () => {
  const [createdFolders, setCreatedFolders] = useState([]);
  const [joinedFolders, setJoinedFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("created"); // Track which tab is active: "created" or "joined"

  // Fetch created and joined folders when the component mounts
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/folders/myfolders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setCreatedFolders(data.createdFolders || []);
          setJoinedFolders(data.joinedFolders || []);
        } else {
          setError(data.message || "Failed to fetch folders");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [isModalOpen, isWhiteboardOpen]);

  const handleCreateFolder = async (folderName, subjectName, uniqueKeyhere) => {
    try {
      const response = await fetch("http://localhost:5000/api/folders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: folderName, subject: subjectName, uniqueKey: uniqueKeyhere }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.folder) {
        setCreatedFolders((prev) => [...prev, data.folder]);
        alert("Folder created successfully!");
        setIsModalOpen(false);
      } else {
        alert(data.message || "Error creating folder.");
      }
    } catch (error) {
      alert("Error creating folder. Please try again.");
    }
  };

  const handleJoinFolder = async (folderKey) => {
    try {
      const response = await fetch("http://localhost:5000/api/folders/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ key: folderKey }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok === 200 && data.folder) {
        setJoinedFolders((prev) => [...prev, data.folder]);
        alert("Joined folder successfully!");
      } else {
        alert(data.message || "Error joining folder.");
      }
    } catch (error) {
      alert("Error joining folder. Please try again.");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/folders/deleteFolder/${folderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setCreatedFolders((prev) => prev.filter((folder) => folder._id !== folderId));
        setJoinedFolders((prev) => prev.filter((folder) => folder._id !== folderId));
        alert("Folder deleted successfully!");
      } else {
        alert("Error deleting folder. You might not be the owner.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting folder. Please try again.");
    }
  };

  const handleLeaveFolder = async (folderId) => {
    if (!window.confirm("Are you sure you want to leave this folder?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/folders/leaveFolder/${folderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setJoinedFolders((prev) => prev.filter((folder) => folder._id !== folderId));
        alert("You have left the folder!");
      } else {
        alert("Error leaving folder.");
      }
    } catch (error) {
      alert("Error leaving folder. Please try again.");
    }
  };

  const handleOpenWhiteboard = () => {
    setIsWhiteboardOpen(true);
  };

  const navigate = useNavigate();

  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">📂 My Folders</h1>

        {/* Tab filter for showing Created or Joined Folders */}
        <div className="flex gap-8 mb-6">
          <button
            className={`px-8 py-4 rounded-lg text-white ${activeTab === "created" ? "bg-orange-500" : "bg-gray-400"} hover:bg-orange-600`}
            onClick={() => setActiveTab("created")}
          >
            Created Folders
          </button>
          <button
            className={`px-8 py-4 rounded-lg text-white ${activeTab === "joined" ? "bg-teal-500" : "bg-gray-400"} hover:bg-teal-600`}
            onClick={() => setActiveTab("joined")}
          >
            Joined Folders
          </button>
        </div>

        {/* Buttons for creating or joining a folder */}
        <div className="flex gap-4 mb-8">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={() => setIsModalOpen(true)}
          >
            Create Folder
          </button>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)} // You can set this to join a specific folder
          >
            Join Folder
          </button>
        </div>

        {loading ? (
          <p className="text-xl text-gray-600">⏳ Loading folders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="w-full max-w-6xl">
            {/* Show folders based on the selected active tab */}
            {activeTab === "created" && (
              <FolderGrid
                title="Created Folders"
                folders={createdFolders}
                color="bg-yellow-300"
                onFolderClick={handleFolderClick}
                onDelete={handleDeleteFolder}
                deleteLabel="Delete"
              />
            )}
            {activeTab === "joined" && (
              <FolderGrid
                title="Joined Folders"
                folders={joinedFolders}
                color="bg-blue-300"
                onFolderClick={handleFolderClick}
                onDelete={handleLeaveFolder}
                deleteLabel="Leave"
              />
            )}
          </div>
        )}
      </div>

      <CreateOrJoinFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateFolder={handleCreateFolder}
        onJoinFolder={handleJoinFolder}
      />
      <WhiteboardModal
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
        roomId="global-whiteboard"
      />
    </>
  );
};

export default Dashboard;
