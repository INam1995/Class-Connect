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
      setUploading(false);
      setPdfFile(null);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setUploading(false);
    }
  };

  // 🚀 Function to navigate to the discussion page
 

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">{folder.name || "Folder"}</h1>
      <p>Subject: {folder.subject || "Unknown"}</p>

      {/* 📢 Start Discussion Button */}
    
      <div className="mt-5">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-3" />
        <button onClick={handleUploadPdf} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      <div className="mt-5">
        <h3 className="text-xl">📄 Uploaded PDFs</h3>
        {folder.pdfs.length > 0 ? (
          <ul>
            {folder.pdfs.map((pdf) => (
              <li key={pdf._id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <p className="font-semibold">{pdf.name}</p>
                <div className="flex space-x-4">
                  <a
                    href={`${pdf.path}?raw=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    View PDF
                  </a>
                  <a
                    href={`http://localhost:5000/api/download/pdf?url=${encodeURIComponent(pdf.path)}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Download PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No PDFs found for this folder.</p>
        )}
      </div>
    </div>
  );
};

export default FolderDetail;
