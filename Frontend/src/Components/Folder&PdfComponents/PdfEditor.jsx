import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/build/pdf.worker.entry';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfEditor = ({ url, onClose }) => {
  const [pages, setPages] = useState([]);
  const [mode, setMode] = useState('pen');
  const containerRef = useRef(null);

  const loadFabricPage = async (pdf, pageNum) => {
    const page = await pdf.getPage(pageNum);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const renderCanvas = document.createElement('canvas');
    const context = renderCanvas.getContext('2d');
    renderCanvas.width = viewport.width;
    renderCanvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    const dataURL = renderCanvas.toDataURL();

    return new Promise((resolve) => {
      fabric.Image.fromURL(dataURL, (img) => {
        const fabricCanvasEl = document.createElement('canvas');
        fabricCanvasEl.width = viewport.width;
        fabricCanvasEl.height = viewport.height;
        fabricCanvasEl.id = `fabricCanvas-${pageNum}`;

        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '20px';
        wrapper.style.border = '1px solid #ccc';
        wrapper.appendChild(fabricCanvasEl);

        if (containerRef.current) {
          containerRef.current.appendChild(wrapper);
        }

        const fabricCanvas = new fabric.Canvas(fabricCanvasEl.id, {
          isDrawingMode: true,
          width: viewport.width,
          height: viewport.height,
        });

        fabricCanvas.setBackgroundImage(
          img,
          () => {
            fabricCanvas.renderAll();
            resolve(fabricCanvas);
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
          }
        );
      });
    });
  };

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const canvasPromises = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        canvasPromises.push(loadFabricPage(pdf, i));
      }

      const allPages = await Promise.all(canvasPromises);
      setPages(allPages);
    };

    if (url && containerRef.current) {
      containerRef.current.innerHTML = '';
      loadPdf();
    }

    return () => {
      pages.forEach((canvas) => canvas.dispose());
    };
  }, [url]);

  useEffect(() => {
    pages.forEach((canvas) => {
      if (!canvas) return;
      if (mode === 'pen') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = 'black';
        canvas.freeDrawingBrush.width = 2;
      } else if (mode === 'highlight') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = 'rgba(255,255,0,0.3)';
        canvas.freeDrawingBrush.width = 20;
      } else if (mode === 'erase') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = 'white';
        canvas.freeDrawingBrush.width = 10;
      } else if (mode === 'text') {
        canvas.isDrawingMode = false;
        const text = new fabric.IText('Type here', {
          left: 100,
          top: 100,
          fontSize: 20,
          fill: 'black',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
      }
    });
  }, [mode, pages]);

  const savePdf = async () => {
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pdfPages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const canvas = pages[i];
      const dataUrl = canvas.toDataURL({ format: 'png' });
      const pngImage = await pdfDoc.embedPng(dataUrl);
      const { width, height } = pdfPages[i].getSize();

      pdfPages[i].drawImage(pngImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const modifiedPdf = await pdfDoc.save();
    const blob = new Blob([modifiedPdf], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'annotated.pdf';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] h-[90%] rounded-lg shadow-lg relative p-4 overflow-auto">
        <div className="absolute top-2 left-2 z-10 flex gap-2 flex-wrap">
          <button onClick={() => setMode('pen')} className="bg-blue-500 text-white px-3 py-1 rounded">Pen</button>
          <button onClick={() => setMode('highlight')} className="bg-yellow-400 text-black px-3 py-1 rounded">Highlight</button>
          <button onClick={() => setMode('erase')} className="bg-gray-400 text-white px-3 py-1 rounded">Eraser</button>
          <button onClick={() => setMode('text')} className="bg-green-500 text-white px-3 py-1 rounded">Text</button>
          <button onClick={savePdf} className="bg-purple-600 text-white px-3 py-1 rounded">Save</button>
          <button onClick={onClose} className="bg-red-500 text-white px-3 py-1 rounded">Close</button>
        </div>

        <div ref={containerRef} className="w-full h-full mt-14 overflow-auto" />
      </div>
    </div>
  );
};

export default PdfEditor;
