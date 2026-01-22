import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">sustAId</h2>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-6 whitespace-pre-line">{message}</p>

        {/* Buttons */}
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
