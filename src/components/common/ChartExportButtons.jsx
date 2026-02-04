import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Camera, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';

const ChartExportButtons = ({ chartRef, chartId, filename }) => {
    const [isExporting, setIsExporting] = useState(false);

    const getElement = () => {
        // Handle chartId string (for getElementById)
        if (chartId) {
            return document.getElementById(chartId);
        }
        // Handle ref objects
        if (chartRef && chartRef.current) {
            return chartRef.current;
        }
        return null;
    };

    const exportPNG = async () => {
        if (isExporting) return;
        const element = getElement();
        if (!element) {
            toast.error('Chart element not found. Please try again.');
            return;
        }
        setIsExporting(true);
        try {
            const scale = Math.min(3, window.devicePixelRatio || 2);
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale,
                logging: false,
                useCORS: true,
                allowTaint: false
            });
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            toast.success('Chart exported as PNG!');
        } catch (error) {
            console.error('Error exporting PNG:', error);
            toast.error('Failed to export as PNG');
        } finally {
            setIsExporting(false);
        }
    };

    const exportPDF = async () => {
        if (isExporting) return;
        const element = getElement();
        if (!element) {
            toast.error('Chart element not found. Please try again.');
            return;
        }
        setIsExporting(true);
        try {
            const scale = Math.min(3, window.devicePixelRatio || 2);
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale,
                logging: false,
                useCORS: true,
                allowTaint: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${filename}.pdf`);
            toast.success('Chart exported as PDF!');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Failed to export as PDF');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex items-center space-x-2 mb-2">
            <button
                onClick={exportPNG}
                disabled={isExporting}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                title="Export as PNG"
            >
                <FileImage className="w-3 h-3" />
                <span>{isExporting ? 'Exporting...' : 'PNG'}</span>
            </button>
            <button
                onClick={exportPDF}
                disabled={isExporting}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                title="Export as PDF"
            >
                <Camera className="w-3 h-3" />
                <span>{isExporting ? 'Exporting...' : 'PDF'}</span>
            </button>
        </div>
    );
};

export default ChartExportButtons;
