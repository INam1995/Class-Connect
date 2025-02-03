// CreatedFolders.js
import React, { useState, useEffect } from "react";

const CreatedFolders = () => {
  const [createdFolders, setCreatedFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCreatedFolders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/fAuth/my-folders", {
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
        } else {
          setError(data.message || "Failed to fetch created folders");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedFolders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-400 mb-3">Created Folders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : createdFolders.length > 0 ? (
        <ul>
          {createdFolders.map((folder) => (
            <li key={folder._id} className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
              <h3 className="text-lg font-bold">{folder.name}</h3>
              <p className="text-gray-600">Subject: {folder.subject}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No created folders</p>
      )}
    </div>
  );
};

export default CreatedFolders;
