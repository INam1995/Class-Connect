import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [subjectName, setSubjectName] = useState('');

  // Fetch folders from the backend
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fAuth/folder');
        setFolders(response.data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };
    fetchFolders();
  }, []);

  // Create a new folder
  const handleCreateFolder = async () => {
    if (folderName && subjectName) {
      try {
        const response = await axios.post('http://localhost:5000/api/fAuth/folder', {
          name: folderName,
          subject: subjectName,
        });
        setFolders([...folders, response.data]);
        setIsModalOpen(false);
        setFolderName('');
        setSubjectName('');
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };

  return (
    <div className="p-5">
      {/* Header */}
      <Navbar/>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create New Folder
        </button>
      </div>

      {/* Modal for creating a new folder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-3"
            />
            <input
              type="text"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCreateFolder}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <div
            key={folder._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-center bg-blue-100 rounded-full w-12 h-12 mb-3">
              <span className="text-blue-500 text-xl">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-center">{folder.name}</h3>
            <p className="text-sm text-gray-600 text-center">{folder.subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;