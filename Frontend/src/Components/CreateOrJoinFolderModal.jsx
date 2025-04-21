import React, { useState } from "react";

const CreateOrJoinFolderModal = ({ isOpen, onClose, onCreateFolder, onJoinFolder }) => {
  const [folderName, setFolderName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [folderKey, setFolderKey] = useState("");
  const [uniqueKey, setUniqueKey] = useState(""); // New state for unique key
  const [isJoiningFolder, setIsJoiningFolder] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isJoiningFolder) {
      if (!folderKey.trim()) {
        setError("Please enter a valid folder key.");
        return;
      }
      onJoinFolder(folderKey.trim());
    } else {
      if (!folderName.trim() || !subjectName.trim() || !uniqueKey.trim()) {  // Check unique key too
        setError("Please fill in all fields.");
        return;
      }
      onCreateFolder(folderName.trim(), subjectName.trim(), uniqueKey.trim());  // Pass unique key to onCreateFolder
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isJoiningFolder ? "Join Existing Folder" : "Create New Folder"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isJoiningFolder ? (
            <>
              <input
                type="text"
                placeholder="Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                required
              />
              <input
                type="text"
                placeholder="Subject Name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                required
              />
              <input
                type="text"
                placeholder="Unique Key"
                value={uniqueKey}
                onChange={(e) => setUniqueKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                required
              />
            </>
          ) : (
            <input
              type="text"
              placeholder="Enter Folder Key"
              value={folderKey}
              onChange={(e) => setFolderKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              {isJoiningFolder ? "Join Folder" : "Create Folder"}
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsJoiningFolder(!isJoiningFolder)}
            className="text-blue-500 hover:text-blue-700 w-full"
          >
            {isJoiningFolder ? "Create a New Folder Instead" : "Join an Existing Folder Instead"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrJoinFolderModal;
