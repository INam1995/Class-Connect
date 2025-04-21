import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { useDropzone } from "react-dropzone";
import { FaFilePdf } from "react-icons/fa";

const FolderDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState({ name: "", subject: "", pdfs: [] });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPdfName, setSelectedPdfName] = useState(null);
  const [pdfProgress, setPdfProgress] = useState({});

  const socket = io("http://localhost:5000", {
    transports: ["websocket"],
  });

  // Listen for real-time notifications
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      setNotifications(prevNotifications => [...prevNotifications, data]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `http://localhost:5000/api/folders/${folderId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setFolder({
          name: response.data.name || "Untitled Folder",
          subject: response.data.subject || "Unknown",
          pdfs: response.data.pdfs || [],
        });

        // Initialize progress state for each PDF
        const initialProgress = {};
        response.data.pdfs.forEach((pdf) => {
          initialProgress[pdf._id] = pdf.completed || false;
        });
        setPdfProgress(initialProgress);
      } catch (error) {
        console.error("Error fetching folder details:", error);
      }
    };
    fetchFolderDetails();
  }, [folderId]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        alert('Please upload only PDF files');
      }
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop,
    maxFiles: 1,
  });

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUploadPdf = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("folderId", folderId);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const url = `http://localhost:5000/api/pdfs/${folderId}/upload`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("PDF uploaded successfully!");
      setFolder((prevFolder) => ({
        ...prevFolder,
        pdfs: [...prevFolder.pdfs, response.data.pdf],
      }));

      setPdfProgress((prevProgress) => ({
        ...prevProgress,
        [response.data.pdf._id]: false,
      }));

      setUploading(false);
      setPdfFile(null);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setUploading(false);
    }
  };

  const handleSummarize = async (pdfUrl) => {
    setLoading(true);
    setCurrentPdf(pdfUrl);
    setSelectedPdfName(pdfUrl);
    try {
      const response = await axios.post('http://localhost:5000/api/summarize-url', { pdfUrl });
      setSummary(response.data.summary);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert('An error occurred while summarizing the PDF.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (pdfId, status) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:5000/api/pdfs/${folderId}/${pdfId}/progress`;
      await axios.patch(
        url,
        { completed: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPdfProgress((prevProgress) => ({
        ...prevProgress,
        [pdfId]: status,
      }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
  
  const trackDownload = async (e, pdf) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/download/pdf?url=${encodeURIComponent(
          pdf.path
        )}&pdfId=${pdf._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Handle file as a binary stream
        }
      );

      // Create a download link
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${pdf.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Download tracked successfully!");
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };
  
  const calculateOverallProgress = () => {
    const totalPdfs = folder.pdfs.length;
    if (totalPdfs === 0) return 0;

    const completedPdfs = Object.values(pdfProgress).filter((status) => status).length;
    return ((completedPdfs / totalPdfs) * 100).toFixed(2);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
      <div>
  <h1 className="text-2xl font-bold">{folder.name || "Folder"}</h1>
  <p>Subject: {folder.subject || "Unknown"}</p>
  <p>Overall Progress: {calculateOverallProgress()}%</p>

  {/* ✅ Start Chat Button */}
  <button
    onClick={() => navigate(`/chatroom/${folderId}`)}
    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all"
  >
    Start Chat
  </button>
</div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-200 rounded-full ml-4"
          >
            <IoIosNotifications className="text-2xl" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-4">
                <h3 className="font-bold mb-2">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No new notifications.</p>
                ) : (
                  <ul>
                    {notifications.map((notification, index) => (
                      <li key={index} className="mb-2">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div
          {...getRootProps()}
          className="border-dashed border-2 p-5 mb-3 cursor-pointer text-center relative"
        >
          <input {...getInputProps()} />
          <p>Drag & Drop PDF files here or click to select</p>
          
          {pdfFile && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-75 flex items-center justify-center">
              <FaFilePdf size={50} color="red" /> {/* PDF icon */}
              <p className="ml-2">{pdfFile.name}</p> {/* File name */}
            </div>
          )}
        </div>

        <button
          onClick={handleUploadPdf}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      <div className="mt-6">
        {folder.pdfs.length > 0 && (
          <h2 className="text-xl font-semibold mb-4">Uploaded PDFs</h2>
        )}
        {folder.pdfs.map((pdf) => (
          <div key={pdf._id} className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <FaFilePdf size={20} className="text-red-600 mr-2" />
              <span>{pdf.name}</span>
            </div>

            <div>
              <button
                onClick={() => handleSummarize(pdf.url)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Summarize
              </button>

              <button
                onClick={(e) => trackDownload(e, pdf)}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Download
              </button>

              <button
                onClick={() => toggleCompletion(pdf._id, !pdfProgress[pdf._id])}
                className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                {pdfProgress[pdf._id] ? "Mark Incomplete" : "Mark Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p>{summary}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderDetail;
