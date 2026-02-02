import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`;

const Methodology = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const pageRefs = useRef([]);
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
    const [isSmallScreen, setIsSmallScreen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setViewportWidth(width);
            setIsSmallScreen(width < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // PDF Navigation
    const goToPage = (pageCode) => {
        setPageNumber(pageCode);
        // Scroll to page
        if (pageRefs.current[pageCode - 1]) {
            pageRefs.current[pageCode - 1].scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Methodology</h2>
                    <a
                        href="/Methodology.pdf"
                        download
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                    </a>
                </div>

                {/* PDF Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-4 bg-gray-50 p-2 sm:p-3 rounded-lg sticky top-0 z-10 shadow-md">
                    {/* Navigation Controls */}
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => goToPage(Math.max(pageNumber - 1, 1))}
                            disabled={pageNumber <= 1}
                            className="flex items-center justify-center w-7 h-7 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            title="Previous page"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs sm:text-sm text-gray-700 min-w-[80px] sm:min-w-[100px] text-center">
                            Page {pageNumber} of {numPages || '...'}
                        </span>
                        <button
                            onClick={() => goToPage(Math.min(pageNumber + 1, numPages || pageNumber))}
                            disabled={pageNumber >= numPages}
                            className="flex items-center justify-center w-7 h-7 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            title="Next page"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                            disabled={scale <= 0.5}
                            className="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            title="Zoom out"
                        >
                            <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs sm:text-sm text-gray-700 min-w-[50px] sm:min-w-[60px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
                            disabled={scale >= 2.0}
                            className="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            title="Zoom in"
                        >
                            <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setScale(1.0)}
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            title="Reset zoom"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => goToPage(1)}
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ml-1 sm:ml-2"
                            title="Torna all'inizio"
                        >
                            ⬆ Top
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-4 w-full">
                    <Document
                        file="/Methodology.pdf"
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                            <div className="flex items-center justify-center py-8">
                                <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
                                <span className="ml-2 text-gray-600">Loading PDF...</span>
                            </div>
                        }
                        error={
                            <div className="flex items-center justify-center py-8 text-red-600">
                                <AlertCircle className="w-8 h-8 mr-2" />
                                <span>Failed to load PDF</span>
                            </div>
                        }
                        className="w-full"
                    >
                        <div className="border border-gray-200 rounded-lg overflow-auto shadow-sm w-full max-h-[85vh] sm:max-h-[70vh]">
                            <div className="flex flex-col items-center space-y-4 p-4">
                                {Array.from(new Array(numPages), (el, index) => (
                                    <div
                                        key={`page_${index + 1}`}
                                        ref={el => pageRefs.current[index] = el}
                                        className="shadow-lg"
                                    >
                                        <Page
                                            pageNumber={index + 1}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                            className="max-w-full"
                                            width={(isSmallScreen ? Math.max(viewportWidth - 40, 280) : Math.min(viewportWidth - 200, 1400)) * scale}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Document>
                </div>
            </div>
        </div>
    );
};

export default Methodology;
