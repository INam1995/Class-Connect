// JoinedFolders.js
import React, { useState, useEffect } from "react";

const JoinedFolders = () => {
  const [joinedFolders, setJoinedFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJoinedFolders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/fAuth/my-folders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token
          },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setJoinedFolders(data.joinedFolders || []);
        } else {
          setError(data.message || "Failed to fetch joined folders");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedFolders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-600 mb-3">Joined Folders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : joinedFolders.length > 0 ? (
        <ul>
          {joinedFolders.map((folder) => (
            <li key={folder._id} className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
              <h3 className="text-lg font-bold">{folder.name}</h3>
              <p className="text-gray-600">Subject: {folder.subject}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No joined folders</p>
      )}
    </div>
  );
};

export default JoinedFolders;
