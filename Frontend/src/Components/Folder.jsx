import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { useDropzone } from "react-dropzone";
import { FaFilePdf } from "react-icons/fa";
import PdfEditor from './PdfEditor';

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
  const [viewPdfUrl, setViewPdfUrl] = useState(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  const socket = io("http://localhost:5000", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on('connect', () => console.log('Connected to Socket.IO server'));
    socket.on('connect_error', (error) => console.error('Connection error:', error));
    socket.on('notification', (data) => setNotifications(prev => [...prev, data]));
    return () => socket.off('notification');
  }, []);

  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:5000/api/folders/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFolder({
          name: data.name || "Untitled Folder",
          subject: data.subject || "Unknown",
          pdfs: data.pdfs || [],
        });

        const initialProgress = {};
        data.pdfs.forEach(pdf => initialProgress[pdf._id] = pdf.completed || false);
        setPdfProgress(initialProgress);
      } catch (error) {
        console.error("Error fetching folder details:", error);
      }
    };
    fetchFolderDetails();
  }, [folderId]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
      setPdfFile(acceptedFiles[0]);
    } else {
      alert('Please upload only PDF files');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop,
    maxFiles: 1,
  });

  const handleUploadPdf = async () => {
    if (!pdfFile) return alert("Please select a PDF file.");

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("folderId", folderId);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`http://localhost:5000/api/pdfs/${folderId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      setFolder(prev => ({ ...prev, pdfs: [...prev.pdfs, data.pdf] }));
      setPdfProgress(prev => ({ ...prev, [data.pdf._id]: false }));
      setPdfFile(null);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSummarize = async (pdfUrl) => {
    setLoading(true);
    setCurrentPdf(pdfUrl);
    setSelectedPdfName(pdfUrl);
    try {
      const { data } = await axios.post('http://localhost:5000/api/summarize-url', { pdfUrl });
      setSummary(data.summary);
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
      await axios.patch(`http://localhost:5000/api/pdfs/${folderId}/${pdfId}/progress`, { completed: status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPdfProgress(prev => ({ ...prev, [pdfId]: status }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const trackDownload = async (e, pdf) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}&pdfId=${pdf._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
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
    const total = folder.pdfs.length;
    const completed = Object.values(pdfProgress).filter(Boolean).length;
    return total === 0 ? 0 : ((completed / total) * 100).toFixed(2);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-700">{folder.name}</h1>
          <p className="text-sm text-gray-600">Subject: {folder.subject}</p>
          <p className="text-sm">Overall Progress: {calculateOverallProgress()}%</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-purple-100 rounded-full hover:bg-purple-200">
            <IoIosNotifications className="text-2xl text-purple-700" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-10">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <ul className="space-y-2">
                  {notifications.length ? notifications.map((note, idx) => (
                    <li key={idx} className="text-sm">
                      <p>{note.message}</p>
                      <p className="text-xs text-gray-400">{new Date(note.timestamp).toLocaleString()}</p>
                    </li>
                  )) : <p className="text-gray-500">No new notifications.</p>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-4 bg-purple-50 hover:bg-purple-100">
        <input {...getInputProps()} />
        <p className="text-purple-700">Drag and drop PDF or click to upload</p>
        {pdfFile && <div className="mt-2 flex items-center justify-center space-x-2"><FaFilePdf className="text-red-500 text-xl" /><p>{pdfFile.name}</p></div>}
      </div>

<<<<<<< HEAD
      <button onClick={handleUploadPdf} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
      <br />
   
      <button
  onClick={() => navigate(`/chatroom/${folderId}`)}
  className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all"
=======
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${calculateOverallProgress()}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-700">Overall Progress: {calculateOverallProgress()}%</p>

      <div className="mt-5">
        <button
          onClick={() => navigate(`/chatroom/${folderId}`)}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 mb-4"
        >
          Start Chat
        </button>

        <h3 className="text-xl">📄 Uploaded PDFs</h3>
        {folder.pdfs.length > 0 ? (
          <ul>
            {folder.pdfs.map((pdf) => (
              <li key={pdf._id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <p className="font-semibold">{pdf.name}</p>
                <div className="flex space-x-4 mt-2">
                  <div className="flex space-x-2">
                    <button
                      className={`w-6 h-6 rounded-full transition-all ${
                        pdfProgress[pdf._id] ? "bg-green-500" : "bg-gray-300"
                      }`}
                      onClick={() => toggleCompletion(pdf._id, true)}
                    ></button>
                    <button
                      className={`w-6 h-6 rounded-full transition-all ${
                        !pdfProgress[pdf._id] ? "bg-red-500" : "bg-gray-300"
                      }`}
                      onClick={() => toggleCompletion(pdf._id, false)}
                    ></button>
                  </div>
                  {isPdfViewerOpen && viewPdfUrl && (
  <PdfEditor url={viewPdfUrl} onClose={() => setIsPdfViewerOpen(false)} />
)}

<button
  onClick={() => handleViewPdf(pdf)}
  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
>>>>>>> c551efa1a64ee1f8412be0677114a946bf5f3e81
>
  Start Chat
</button>

      

      <div className="w-full bg-gray-300 h-3 rounded mt-4">
        
        <div className="bg-purple-600 h-3 rounded transition-all duration-300" style={{ width: `${calculateOverallProgress()}%` }}></div>
      </div>


      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">📄 Uploaded PDFs</h3>
        <ul className="space-y-4">
          {folder.pdfs.map(pdf => (
            <li key={pdf._id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg text-purple-700">{pdf.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => toggleCompletion(pdf._id, true)} className={`w-6 h-6 rounded-full ${pdfProgress[pdf._id] ? 'bg-green-500' : 'bg-gray-300'}`}></button>
                  <button onClick={() => toggleCompletion(pdf._id, false)} className={`w-6 h-6 rounded-full ${!pdfProgress[pdf._id] ? 'bg-red-500' : 'bg-gray-300'}`}></button>
                </div>
<<<<<<< HEAD
              </div>
              
              <div className="flex flex-wrap gap-3 mt-2">
                <button onClick={() => handleViewPdf(pdf)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">View PDF</button>
                <a href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}&pdfId=${pdf._id}`} onClick={(e) => trackDownload(e, pdf)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Download</a>
                <button onClick={() => handleSummarize(pdf.path)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" disabled={loading && currentPdf === pdf.path}>
                  {loading && currentPdf === pdf.path ? 'Summarizing...' : 'Summarize'}
                </button>
              </div>
            </li>
          ))}
        </ul>
=======
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No PDFs found for this folder.</p>
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
>>>>>>> c551efa1a64ee1f8412be0677114a946bf5f3e81
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Summary</h2>
            <div>
              <p className="text-gray-800 whitespace-pre-line">{summary}</p>
              <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isPdfViewerOpen && viewPdfUrl && <PdfEditor url={viewPdfUrl} onClose={() => setIsPdfViewerOpen(false)} />}
    </div>
  );
};

export default FolderDetail;