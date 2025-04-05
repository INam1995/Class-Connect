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
  // const [whiteboardRoomId, setWhiteboardRoomId] = useState("");


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
  // }, [isModalOpen]);
  }, [isModalOpen, isWhiteboardOpen]);

  // Handle folder creation
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

  // Handle folder joining
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
      if (response.ok===200 && data.folder) {
        setJoinedFolders((prev) => [...prev, data.folder]);  
        alert("Joined folder successfully!");
      } else {
        alert(data.message || "Error joining folder.");
      }
    } catch (error) {
      alert("Error joining folder. Please try again.");
    }
  };

  // ✅ Handle folder deletion (Only for folders the user created)
  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    const token = localStorage.getItem("token"); 
   // const token = localStorage.getItem("token");  // ✅ Get token from storage
    console.log("Token being sent:", token);  // ✅ Debug log
  
    if (!token) {
      alert("You are not logged in! Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/folders/deleteFolder/${folderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
     console.log(response.status)
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
  

  // ✅ Handle leaving a joined folder
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

  const navigate = useNavigate(); // ✅ Correct way to use navigate

  const handleFolderClick = (folderId) => {
    console.log("Navigating to folder:", folderId);
    navigate(`/folder/${folderId}`);
  };


  return (
    <> 
      <Navbar/>
      <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-500 mb-6">📂 My Folders</h1>

         <div className="flex gap-4 mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Create / Join Folder
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            onClick={() => handleOpenWhiteboard("global-whiteboard")}
          >
            🎨 Open Whiteboard
          </button>
        </div>

        {loading ? (
          <p className="text-lg text-gray-600">⏳ Loading folders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="w-full max-w-6xl">
            {/* ✅ Created Folders Section */}
            <FolderGrid
              title="Created Folders"
              folders={createdFolders}
              color="bg-yellow-200"
              onFolderClick={handleFolderClick} // ✅ Pass the function for joined folders
              onDelete={handleDeleteFolder} 
              deleteLabel="Delete"
            />
            <FolderGrid
              title="Joined Folders"
              folders={joinedFolders}
              color="bg-blue-200"
              onFolderClick={handleFolderClick} // ✅ Pass the function
              onDelete={handleLeaveFolder} 
              deleteLabel="Leave"
            />
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
