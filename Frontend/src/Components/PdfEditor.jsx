import React from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfEditor = ({ url, onClose, pdf }) => {
  const trackDownload = async (e, pdf) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/download/pdf?url=${encodeURIComponent(
          pdf.path
        )}&pdfId=${pdf._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${pdf.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Download tracked successfully!');
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      // override the download button only
      download: {
        onClick: (props) => (e) => {
          if (pdf) {
            trackDownload(e, pdf);
          }
        },
      },
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[90%] h-[90%] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 z-10"
        >
          Close
        </button>
        <div className="h-full pt-10 px-5">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;
