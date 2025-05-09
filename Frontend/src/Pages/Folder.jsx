import React, { useState, useEffect,useCallback } from "react";
import axios from "axios";
import { io } from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { useDropzone } from "react-dropzone";
import { FaFilePdf } from "react-icons/fa";
import PdfEditor from '../Components/Folder&PdfComponents/PdfEditor';


const FolderDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState({ 
    name: "", 
    subject: "", 
    pdfs: [],
    userProgressPercentage: 0,
    completedPdfs: 0,
    totalPdfs: 0
  });
  const [loading, setLoading] = useState(true);
  
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState('');
  const [currentPdf, setCurrentPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPdfName, setSelectedPdfName] = useState(null);
  const [pdfProgress, setPdfProgress] = useState({});
  const [viewPdfUrl, setViewPdfUrl] = useState(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const userId = localStorage.getItem("userId");

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
    const fetchFolderData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/folders/${folderId}/user-progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFolder(response.data.folder);
      } catch (error) {
        console.error("Error fetching folder:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderData();
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
  
  const handleViewPdf = (pdf) => {
    // Add a check to ensure the path is valid
    console.log(pdf.path);
    if (!pdf.path) {
      alert("PDF path is not available");
      return;
    }
    setViewPdfUrl(pdf.path);
    setIsPdfViewerOpen(true);
  };
  useEffect(() => {
    if (viewPdfUrl) {
      console.log("Updated viewPdfUrl:", viewPdfUrl);
    }
  }, [viewPdfUrl]);
  
  
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

  const calculateUserProgress = () => {
    if (!folder || !folder.pdfs) return 0;
    const totalPdfs = folder.pdfs.length;
    if (totalPdfs === 0) return 0;

    const completedPdfs = folder.pdfs.filter(pdf => pdf.userCompleted).length;
    return ((completedPdfs / totalPdfs) * 100).toFixed(2);
  };


  const handleToggleCompletion = async (pdfId, markAsComplete) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.patch(
        `/api/folders/${folderId}/${pdfId}/progress`,
        { completed: markAsComplete }, // true for green button, false for red
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit socket event after updating progress
      socket.emit('progress-updated', { 
        folderId,
        userId: userId // Make sure you have access to user ID
      });
  
      // Update local state
      setFolder(prev => {
        const updatedPdfs = prev.pdfs.map(pdf => {
          if (pdf._id === pdfId) {
            return {
              ...pdf,
              userCompleted: markAsComplete // Set to the button's intended state
            };
          }
          return pdf;
        });
  
        return {
          ...prev,
          pdfs: updatedPdfs
        };
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
  
  if (loading) return <div>Loading...</div>;


 
  // return (
  //   <div className="p-5">
  //     <div className="flex justify-between items-center">
  //     <div>
  //         <h1 className="text-2xl font-bold">{folder.name || "Folder"}</h1>
  //         <p>Subject: {folder.subject || "Unknown"}</p>
  //         <p>Overall Progress: {calculateUserProgress()}%</p>

  //         {/* ✅ Start Chat Button */}
  //         <button
  //           onClick={() => navigate(`/chatroom/${folderId}`)}
  //           className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all"
  //         >
  //           Start Chat
  //         </button>
  //     </div>

  //       <div className="relative">
  //         <button
  //           onClick={() => setShowNotifications(!showNotifications)}
  //           className="relative p-2 hover:bg-gray-200 rounded-full ml-4"
  //         >
  //           <IoIosNotifications className="text-2xl" />
  //           {notifications.length > 0 && (
  //             <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
  //               {notifications.length}
  //             </span>
  //           )}
  //         </button>
  //         {showNotifications && (
  //           <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
  //             <div className="p-4">
  //               <h3 className="font-bold mb-2">Notifications</h3>
  //               {notifications.length === 0 ? (
  //                 <p className="text-gray-500">No new notifications.</p>
  //               ) : (
  //                 <ul>
  //                   {notifications.map((notification, index) => (
  //                     <li key={index} className="mb-2">
  //                       <p className="text-sm">{notification.message}</p>
  //                       <p className="text-xs text-gray-500">
  //                         {new Date(notification.timestamp).toLocaleString()}
  //                       </p>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               )}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     <div className="mt-5">
  //       <div
  //         {...getRootProps()}
  //         className="border-dashed border-2 p-5 mb-3 cursor-pointer text-center relative"
  //       >
  //         <input {...getInputProps()} />
  //         <p>Drag & Drop PDF files here or click to select</p>
          
  //         {pdfFile && (
  //           <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-75 flex items-center justify-center">
  //             <FaFilePdf size={50} color="red" /> {/* PDF icon */}
  //             <p className="ml-2">{pdfFile.name}</p> {/* File name */}
  //           </div>
  //         )}
  //       </div>

  //       <button
  //         onClick={handleUploadPdf}
  //         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  //         disabled={uploading}
  //       >
  //         {uploading && <p className="text-sm text-gray-500">Uploading PDF...</p>}
  //       </button>
  //     </div>

  //     <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
  //       <div
  //         className="bg-blue-500 h-4 rounded-full transition-all"
  //         style={{ width: `${calculateUserProgress()}%` }}
  //       ></div>
  //     </div>
  //     <p className="text-sm text-gray-700">Overall Progress: {calculateUserProgress()}%</p>

  //     <div className="mt-5">
  //       <button
  //         onClick={() => navigate(`/chatroom/${folderId}`)}
  //         className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 mb-4"
  //       >
  //         Start Chat
  //       </button>

  //       <h3 className="text-xl">📄 Uploaded PDFs</h3>
  //       {folder.pdfs.length > 0 ? (
  //         <ul>
  //           {folder.pdfs.map((pdf) => (
  //             <li key={pdf._id} className="mb-4 p-4 border rounded-lg shadow-sm">
  //               <p className="font-semibold">{pdf.name}</p>
  //               <div className="flex space-x-4 mt-2">
  //                 <div className="flex space-x-2">
  //                   {/* Green button - mark as complete */}
  //                   <button
  //                     onClick={() => handleToggleCompletion(pdf._id, true)}
  //                     className={`w-6 h-6 rounded-full transition-all ${
  //                       pdf.userCompleted ? "bg-green-500" : "bg-gray-300"
  //                     }`}
  //                     title="Mark as complete"
  //                   ></button>
                    
  //                   {/* Red button - mark as incomplete */}
  //                   <button
  //                     onClick={() => handleToggleCompletion(pdf._id, false)}
  //                     className={`w-6 h-6 rounded-full transition-all ${
  //                       !pdf.userCompleted ? "bg-red-500" : "bg-gray-300"
  //                     }`}
  //                     title="Mark as incomplete"
  //                   ></button>
  //                 </div>

  //                 {isPdfViewerOpen && viewPdfUrl && (
  //                   <PdfEditor url={viewPdfUrl} onClose={() => setIsPdfViewerOpen(false)} />
  //                 )}

  //                 <button
  //                   onClick={() => handleViewPdf(pdf)}
  //                   className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
  //                 >
  //                   View PDF
  //                 </button>


  //                 <a
  //                   href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(
  //                     pdf.path
  //                   )}&pdfId=${pdf._id}`}
  //                   onClick={(e) => trackDownload(e, pdf)}
  //                   className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
  //                 >
  //                   Download PDF
  //                 </a>

  //                 <button
  //                   onClick={() => handleSummarize(pdf.path)}
  //                   className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
  //                   disabled={loading && currentPdf === pdf.path}
  //                 >
  //                   {loading && currentPdf === pdf.path ? 'Summarizing...' : 'Summarize PDF'}
  //                 </button>

  //               </div>
  //             </li>
  //           ))}
  //         </ul>
  //       ) : (
  //         <p className="text-gray-500">No PDFs found for this folder.</p>
  //       )}
  //     </div>

  //     {showModal && (
  //       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  //         <div className="bg-white p-6 rounded-lg shadow-lg w-96">
  //           <h3 className="text-xl font-semibold">📝 Summary</h3>
  //           <p className="mt-2">{summary}</p>
  //           <div className="mt-4 flex justify-end">
  //             <button
  //               onClick={() => setShowModal(false)}
  //               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
  //             >
  //               Close
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

//   return (
//   <div className="p-8 bg-gray-50 min-h-screen font-sans">
//     {/* Folder Info Header */}
//     <div className="text-center mb-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-1">{folder.name || "Folder"}</h1>
//       <p className="text-gray-600 text-lg">Subject: {folder.subject || "Unknown"}</p>
//     </div>

//     {/* Main Layout */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* Left Column - Progress */}
//       <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
//         <h2 className="text-lg font-semibold text-gray-700">📊 Progress</h2>
//         <div className="w-full bg-gray-200 rounded-full h-4">
//           <div
//             className="bg-blue-500 h-4 rounded-full transition-all"
//             style={{ width: `${calculateUserProgress()}%` }}
//           ></div>
//         </div>
//         <p className="text-sm text-gray-700 text-right">{calculateUserProgress()}%</p>
//       </div>

//       {/* Middle Column - Upload PDF */}
//       <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
//         <h2 className="text-lg font-semibold text-gray-700">📥 Upload PDF</h2>
//         <div
//           {...getRootProps()}
//           className="border-2 border-dashed border-gray-400 p-5 text-center rounded-lg cursor-pointer relative hover:bg-gray-50"
//         >
//           <input {...getInputProps()} />
//           <p className="text-gray-600">Drag & Drop PDF files here or click to select</p>

//           {pdfFile && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <FaFilePdf size={40} className="text-red-500" />
//               <p className="ml-2 font-medium text-gray-700">{pdfFile.name}</p>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleUploadPdf}
//           className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//           disabled={uploading}
//         >
//           {uploading ? "Uploading..." : "Upload PDF"}
//         </button>
//       </div>

//       {/* Right Column - Notifications & Chat */}
//       <div className="space-y-4">
//         {/* Notifications */}
//         <div className="bg-white p-5 rounded-xl shadow-md relative">
//           <h2 className="text-lg font-semibold text-gray-700 mb-2">🔔 Notifications</h2>
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full"
//           >
//             <IoIosNotifications className="text-2xl text-gray-700" />
//             {notifications.length > 0 && (
//               <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
//                 {notifications.length}
//               </span>
//             )}
//           </button>

//           {showNotifications && (
//             <div className="mt-4">
//               {notifications.length === 0 ? (
//                 <p className="text-sm text-gray-500">No new notifications.</p>
//               ) : (
//                 <ul className="space-y-2 max-h-40 overflow-auto">
//                   {notifications.map((notification, index) => (
//                     <li key={index} className="text-sm">
//                       <p>{notification.message}</p>
//                       <p className="text-xs text-gray-400">
//                         {new Date(notification.timestamp).toLocaleString()}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Start Chat */}
//         <div className="bg-white p-5 rounded-xl shadow-md text-center">
//           <button
//             onClick={() => navigate(`/chatroom/${folderId}`)}
//             className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
//           >
//             💬 Start Chat
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* PDF List */}
//     <div className="mt-10">
//       <h3 className="text-xl font-semibold mb-4">📄 Uploaded PDFs</h3>
//       {folder.pdfs.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {folder.pdfs.map((pdf) => (
//             <div key={pdf._id} className="bg-white p-4 rounded-lg shadow-sm">
//               <p className="font-medium mb-2">{pdf.name}</p>
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={() => handleToggleCompletion(pdf._id, true)}
//                   className={`w-6 h-6 rounded-full ${pdf.userCompleted ? "bg-green-500" : "bg-gray-300"}`}
//                   title="Mark as complete"
//                 ></button>

//                 <button
//                   onClick={() => handleToggleCompletion(pdf._id, false)}
//                   className={`w-6 h-6 rounded-full ${!pdf.userCompleted ? "bg-red-500" : "bg-gray-300"}`}
//                   title="Mark as incomplete"
//                 ></button>

//                 <button
//                   onClick={() => handleViewPdf(pdf)}
//                   className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
//                 >
//                   View
//                 </button>

//                 <a
//                   href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}&pdfId=${pdf._id}`}
//                   onClick={(e) => trackDownload(e, pdf)}
//                   className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
//                 >
//                   Download
//                 </a>

//                 <button
//                   onClick={() => handleSummarize(pdf.path)}
//                   className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600"
//                   disabled={loading && currentPdf === pdf.path}
//                 >
//                   {loading && currentPdf === pdf.path ? "Summarizing..." : "Summarize"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No PDFs found for this folder.</p>
//       )}
//     </div>

//     {/* Summary Modal */}
//     {showModal && (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//           <h3 className="text-xl font-semibold">📝 Summary</h3>
//           <p className="mt-2 text-gray-700">{summary}</p>
//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={() => setShowModal(false)}
//               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// );

  return (
  <div className="p-8 bg-gray-50 min-h-screen font-sans">
    {/* Folder Info Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">{folder.name || "Folder"}</h1>
      <p className="text-gray-600 text-lg">Subject: {folder.subject || "Unknown"}</p>
    </div>

    {/* Top Section: Progress, Upload, Chat */}
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-xl shadow-md">
      {/* Notification Icon */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 hover:bg-gray-200 rounded-full"
        >
          <IoIosNotifications className="text-2xl text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {notifications.length}
            </span>
          )}
        </button>
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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

      {/* Progress Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">📊 Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${calculateUserProgress()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-700 text-right">{calculateUserProgress()}%</p>
      </div>

      {/* Upload Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">📥 Upload PDF</h2>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 p-5 text-center rounded-lg cursor-pointer relative hover:bg-gray-50"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">Drag & Drop PDF files here or click to select</p>

          {pdfFile && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <FaFilePdf size={40} className="text-red-500" />
              <p className="ml-2 font-medium text-gray-700">{pdfFile.name}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleUploadPdf}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col justify-center items-center">
        <button
          onClick={() => navigate(`/chatroom/${folderId}`)}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
        >
          💬 Start Chat
        </button>
      </div>
    </div>

    {/* PDF List */}
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">📄 Uploaded PDFs</h3>
      {folder.pdfs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {folder.pdfs.map((pdf) => (
            <div key={pdf._id} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2">{pdf.name}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleToggleCompletion(pdf._id, true)}
                  className={`w-6 h-6 rounded-full ${pdf.userCompleted ? "bg-green-500" : "bg-gray-300"}`}
                  title="Mark as complete"
                ></button>

                <button
                  onClick={() => handleToggleCompletion(pdf._id, false)}
                  className={`w-6 h-6 rounded-full ${!pdf.userCompleted ? "bg-red-500" : "bg-gray-300"}`}
                  title="Mark as incomplete"
                ></button>

                <button
                  onClick={() => handleViewPdf(pdf)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  View
                </button>

                <a
                  href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}&pdfId=${pdf._id}`}
                  onClick={(e) => trackDownload(e, pdf)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Download
                </a>

                <button
                  onClick={() => handleSummarize(pdf.path)}
                  className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600"
                  disabled={loading && currentPdf === pdf.path}
                >
                  {loading && currentPdf === pdf.path ? "Summarizing..." : "Summarize"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No PDFs found for this folder.</p>
      )}
    </div>

    {/* Summary Modal */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-semibold">📝 Summary</h3>
          <p className="mt-2 text-gray-700">{summary}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);


};

export default FolderDetail;