// import React, { useEffect, useRef, useState } from 'react';
// import { fabric } from 'fabric';
// import { PDFDocument } from 'pdf-lib';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// import 'pdfjs-dist/legacy/build/pdf.worker.entry';

// const PdfEditor = ({ url, onClose }) => {
//   const canvasRef = useRef(null);
//   const [mode, setMode] = useState('pen');
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const loadPdf = async () => {
//       const loadingTask = pdfjsLib.getDocument(url);
//       const pdf = await loadingTask.promise;
//       const page = await pdf.getPage(1); // First page only

//       const scale = 2;
//       const viewport = page.getViewport({ scale });

//       const tempCanvas = document.createElement('canvas');
//       const context = tempCanvas.getContext('2d');
//       tempCanvas.width = viewport.width;
//       tempCanvas.height = viewport.height;

//       await page.render({ canvasContext: context, viewport }).promise;
//       const imgData = tempCanvas.toDataURL();

//       const fabricCanvas = new fabric.Canvas('drawingCanvas', {
//         isDrawingMode: true,
//         width: tempCanvas.width,
//         height: tempCanvas.height,
//       });

//       canvasRef.current = fabricCanvas;

//       fabric.Image.fromURL(imgData, (img) => {
//         fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
//           scaleX: 1,
//           scaleY: 1,
//         });
//       });
//     };

//     loadPdf();
//   }, [url]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     if (mode === 'pen') {
//       canvas.isDrawingMode = true;
//       canvas.freeDrawingBrush.color = 'black';
//       canvas.freeDrawingBrush.width = 2;
//     } else if (mode === 'highlight') {
//       canvas.isDrawingMode = true;
//       canvas.freeDrawingBrush.color = 'rgba(255,255,0,0.3)';
//       canvas.freeDrawingBrush.width = 20;
//     } else if (mode === 'erase') {
//       canvas.isDrawingMode = true;
//       canvas.freeDrawingBrush.color = 'white';
//       canvas.freeDrawingBrush.width = 10;
//     } else if (mode === 'text') {
//       canvas.isDrawingMode = false;
//       const text = new fabric.IText('Type here', {
//         left: 100,
//         top: 100,
//         fontSize: 20,
//         fill: 'black',
//       });
//       canvas.add(text);
//     }
//   }, [mode]);

//   const savePdf = async () => {
//     const canvas = canvasRef.current;
//     const dataUrl = canvas.toDataURL({ format: 'png' });

//     const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);
//     const page = pdfDoc.getPages()[0];
//     const { width, height } = page.getSize();

//     const pngImage = await pdfDoc.embedPng(dataUrl);
//     page.drawImage(pngImage, {
//       x: 0,
//       y: 0,
//       width,
//       height,
//     });

//     const modifiedPdf = await pdfDoc.save();
//     const blob = new Blob([modifiedPdf], { type: 'application/pdf' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'annotated.pdf';
//     link.click();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-white w-[95%] h-[90%] rounded-lg shadow-lg relative p-4 overflow-auto">
//         <div className="absolute top-2 left-2 z-10 flex gap-2">
//           <button onClick={() => setMode('pen')} className="bg-blue-500 text-white px-3 py-1 rounded">Pen</button>
//           <button onClick={() => setMode('highlight')} className="bg-yellow-400 text-black px-3 py-1 rounded">Highlight</button>
//           <button onClick={() => setMode('erase')} className="bg-gray-400 text-white px-3 py-1 rounded">Eraser</button>
//           <button onClick={() => setMode('text')} className="bg-green-500 text-white px-3 py-1 rounded">Text</button>
//           <button onClick={savePdf} className="bg-purple-600 text-white px-3 py-1 rounded">Save</button>
//           <button onClick={onClose} className="bg-red-500 text-white px-3 py-1 rounded">Close</button>
//         </div>

//         <div ref={containerRef} className="w-full h-full mt-10 flex justify-center">
//           <canvas id="drawingCanvas" />
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useRef } from 'react';

const PdfEditor = ({ pdfUrl, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize canvas when component mounts
    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0'
    });

    // Basic PDF display (note: Fabric.js doesn't natively support PDFs)
    // This is a placeholder - you'll need a PDF library like pdf.js
    const loadDocument = () => {
      // Add a simple rectangle as placeholder
      const rect = new window.fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 200,
        height: 200
      });
      canvas.add(rect);
    };

    loadDocument();

    return () => {
      // Cleanup
      canvas.dispose();
    };
  }, [pdfUrl]);

  return (
    <div className="pdf-editor">
      <div className="editor-toolbar">
        <button onClick={onClose}>Close</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};



export default PdfEditor;
