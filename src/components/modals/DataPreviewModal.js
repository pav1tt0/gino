import React from 'react';
import { Database, BarChart3, CheckCircle, AlertCircle, X } from 'lucide-react';

const DataPreviewModal = ({ data, fileName, onConfirm, onCancel }) => {
  if (!data || data.length === 0) return null;

  // Validate data
  const validateMaterial = (material) => {
    const issues = [];
    if (!material['Material Name'] && !material['Material ID']) {
      issues.push('Missing Material Name/ID');
    }
    if (!material['Category']) {
      issues.push('Missing Category');
    }
    return issues;
  };

  // Get preview data (first 5 rows)
  const previewData = data.slice(0, 5);
  const totalRows = data.length;
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Check for issues
  const materialsWithIssues = data.filter(m => validateMaterial(m).length > 0).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Preview</h2>
            <p className="text-sm text-gray-600 mt-1">
              File: <span className="font-medium">{fileName}</span>
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Materials</p>
              <p className="text-xl font-bold text-gray-900">{totalRows}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Columns Detected</p>
              <p className="text-xl font-bold text-gray-900">{columns.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {materialsWithIssues === 0 ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            )}
            <div>
              <p className="text-sm text-gray-600">Data Quality</p>
              <p className="text-xl font-bold text-gray-900">
                {materialsWithIssues === 0 ? 'Good' : `${materialsWithIssues} issues`}
              </p>
            </div>
          </div>
        </div>

        {/* Preview Table */}
        <div className="flex-1 overflow-auto p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Preview (first {Math.min(5, totalRows)} of {totalRows} rows)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.slice(0, 6).map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                  {columns.length > 6 && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 italic">
                      +{columns.length - 6} more...
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, rowIdx) => {
                  const issues = validateMaterial(row);
                  return (
                    <tr key={rowIdx} className={issues.length > 0 ? 'bg-yellow-50' : ''}>
                      {columns.slice(0, 6).map((col, colIdx) => (
                        <td key={colIdx} className="px-4 py-2 whitespace-nowrap text-gray-900">
                          {row[col] || <span className="text-gray-400 italic">empty</span>}
                        </td>
                      ))}
                      {columns.length > 6 && (
                        <td className="px-4 py-2 text-gray-400">...</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Warning if issues found */}
          {materialsWithIssues > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Data Quality Warning
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {materialsWithIssues} material{materialsWithIssues > 1 ? 's' : ''} missing required fields (Material Name/ID or Category).
                    You can still import, but these materials may not display correctly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Import {totalRows} Material{totalRows > 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPreviewModal;
