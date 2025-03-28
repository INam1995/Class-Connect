<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoIosNotifications } from 'react-icons/io'; // Make sure this is at the top of your file
import {io} from 'socket.io-client';

const FolderDetail = () => {
  const { folderId } = useParams();
  const [folder, setFolder] = useState({ name: "", subject: "", pdfs: [] });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [summary,setSummary]=useState('');// State for storing the summary
  const [loading,setLoading]=useState(false);// State for loading during summarization
  const [currentPdf, setCurrentPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]); // Store notifications
  const [showNotifications, setShowNotifications] = useState(false); // Toggle dropdown
  const [selectedPdfName, setSelectedPdfName] = useState(null);


  const [pdfs, setPdfs] = useState( []);
  const [pdfProgress, setPdfProgress] = useState({}
    // pdfs.reduce((acc, pdf) => ({ ...acc, [pdf._id]: false }), {})
  );
  // Update `pdfs` when `folder.pdfs` changes
  useEffect(() => {
    if (folder.pdfs) {
      setPdfs(folder.pdfs);
    }
  }, [folder.pdfs]);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalPdfs = pdfs.length;
    if (totalPdfs === 0) return 0; // Avoid division by zero

    const completedPdfs = Object.values(pdfProgress).filter((status) => status).length;
    return ((completedPdfs / totalPdfs) * 100).toFixed(2); // Round to 2 decimal places
  };

 

  // Call calculateProgress when pdfs change
  // useEffect(() => {
  //   calculateProgress(pdfs);
  // }, [pdfs]);

  // const socket = io("http://localhost:5000");
  const socket = io("http://localhost:5000", {
    transports: ["websocket"],  // Force WebSocket
  });
  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });
   // Listen for real-time notifications
   useEffect(() => {
    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      // setNotifications((prev) => [data, ...prev]); // Add new notification to the top
      setNotifications(prevNotifications => [...prevNotifications, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('notification');
    };
  }, []);
=======
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Login from './Login';

// const FolderDetail = () => {
//   const { folderId } = useParams();
//   const [folder, setFolder] = useState({ name: "", subject: "", pdfs: [] });
//   const [pdfFile, setPdfFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const fetchFolderDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const url = `http://localhost:5000/api/folders/${folderId}`;
//         const response = await axios.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFolder({
//           name: response.data.name || "Untitled Folder",
//           subject: response.data.subject || "Unknown",
//           pdfs: response.data.pdfs || [],  // ✅ Ensure `pdfs` is always an array
//         });
//       } catch (error) {
//         console.error("Error fetching folder details:", error);
//       }
//     };
//     fetchFolderDetails();
//   }, [folderId]);

//   const handleFileChange = (e) => {
//     setPdfFile(e.target.files[0]);
//   };

//   const handleUploadPdf = async () => {
//     if (!pdfFile) {
//       alert("Please select a PDF file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf", pdfFile);
//     formData.append("folderId", folderId);

//     try {
//       setUploading(true);
//       const token = localStorage.getItem("token");
//       const url = `http://localhost:5000/api/pdfs/${folderId}/upload`;
//       const response = await axios.post(url, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("PDF uploaded successfully!");
//       setFolder((prevFolder) => ({
//         ...prevFolder,
//         pdfs: [...prevFolder.pdfs, response.data.pdf],
//       }));
//       setUploading(false);
//       setPdfFile(null);
//     } catch (error) {
//       console.error("Error uploading PDF:", error);
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold">{folder.name || "Folder"}</h1>
//       <p>Subject: {folder.subject || "Unknown"}</p>
//       <div className="mt-5">
//         <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-3" />
//         <button onClick={handleUploadPdf} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
//           {uploading ? "Uploading..." : "Upload PDF"}
//         </button>
//       </div>
//       <div className="mt-5">
//         <h3 className="text-xl">📄 Uploaded PDFs</h3>
//         {folder.pdfs.length > 0 ? (
//           <ul>
//             {folder.pdfs.map((pdf) => (
//               <li key={pdf._id} className="mb-4 p-4 border rounded-lg shadow-sm">
//                 <p className="font-semibold">{pdf.name}</p>
//                 <div className="flex space-x-4">
//                   {/* View PDF Button */}
//                   <a
//                     href={`${pdf.path}?raw=true`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                   >
//                     View PDF
//                   </a>
//                   <a href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
//                       Download PDF
//                   </a>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No PDFs found for this folder.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FolderDetail;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Login from './Login';

const FolderDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState({ name: "", subject: "", pdfs: [] });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
>>>>>>> newpro

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
<<<<<<< HEAD
          pdfs: response.data.pdfs || [],  // ✅ Ensure `pdfs` is always an array
        });
        // setPdfs(response.data.pdfs || []);

        // Initialize progress state for each PDF
        const initialProgress = {};
        response.data.pdfs.forEach((pdf) => {
          initialProgress[pdf._id] = pdf.completed || false; // Assume 'completed' is a field from the backend
        });
        setPdfProgress(initialProgress);
=======
          pdfs: response.data.pdfs || [],
        });
>>>>>>> newpro
      } catch (error) {
        console.error("Error fetching folder details:", error);
      }
    };
    fetchFolderDetails();
  }, [folderId]);

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
<<<<<<< HEAD
      setPdfProgress((prevProgress) => ({
        ...prevProgress,
        [response.data.pdf._id]: false, // Initialize progress for the new PDF
      }));
=======
>>>>>>> newpro
      setUploading(false);
      setPdfFile(null);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setUploading(false);
    }
  };

<<<<<<< HEAD

  // Function to handle summarization
  const handleSummarize = async (pdfUrl) => {
    setLoading(true);
    setCurrentPdf(pdfUrl);
    console.log("pdfurl",pdfUrl)
    setSelectedPdfName(pdfUrl);
    try {
      const response = await axios.post('http://localhost:5000/api/summarize-url', { pdfUrl });
      setSummary(response.data.summary);
      console.log("response",response.data.summary)
      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert('An error occurred while summarizing the PDF.');
    } finally {
      setLoading(false);
    }
  };


  // Toggle completion status for a PDF
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

      // Update local progress state
      setPdfProgress((prevProgress) => ({
        ...prevProgress,
        [pdfId]: status,
      }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{folder.name || "Folder"}</h1>
          <p>Subject: {folder.subject || "Unknown"}</p>
          <p>Overall Progress: {calculateOverallProgress()}%</p>
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
=======
  // 🚀 Function to navigate to the discussion page
 

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">{folder.name || "Folder"}</h1>
      <p>Subject: {folder.subject || "Unknown"}</p>

      {/* 📢 Start Discussion Button */}
    
>>>>>>> newpro
      <div className="mt-5">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-3" />
        <button onClick={handleUploadPdf} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

<<<<<<< HEAD

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${calculateOverallProgress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-700">Overall Progress: {calculateOverallProgress()}%</p>
=======
>>>>>>> newpro
      <div className="mt-5">
        <h3 className="text-xl">📄 Uploaded PDFs</h3>
        {folder.pdfs.length > 0 ? (
          <ul>
            {folder.pdfs.map((pdf) => (
              <li key={pdf._id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <p className="font-semibold">{pdf.name}</p>
                <div className="flex space-x-4">
<<<<<<< HEAD
              {/* Individual Progress Completion */}
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

                  {/* View PDF Button */}
=======
>>>>>>> newpro
                  <a
                    href={`${pdf.path}?raw=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    View PDF
                  </a>
<<<<<<< HEAD
                  <a href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                      Download PDF
                  </a>

                  {/* Summarize PDF Button */}
                  <button
                    onClick={() => handleSummarize(pdf.path)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                    disabled={loading && currentPdf === pdf.path}
                  >
                  {loading && currentPdf === pdf.path ? 'Summarizing...' : 'Summarize PDF'}
                  </button>    
            </div>
=======
                  <a
                    href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Download PDF
                  </a>
                </div>
>>>>>>> newpro
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No PDFs found for this folder.</p>
        )}
<<<<<<< HEAD
        {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold">📝 Summary</h3>
            <p className="mt-2">{summary}</p>
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

=======
      </div>
      <div className="mt-5">
  <button
    onClick={() => {
      navigate(`/chatroom/${folderId}`);  // ✅ Corrected syntax
      console.log("Chat initiated!");
    }}
    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
  >
    Start Chat
  </button>
</div>
>>>>>>> newpro
    </div>
  );
};

<<<<<<< HEAD
export default FolderDetail;
=======
export default FolderDetail;
>>>>>>> newpro
