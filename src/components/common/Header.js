import React from 'react';
import { Upload, Database } from 'lucide-react';
import logo from '../../Logo-sustain.png';

const Header = ({
  handleFileUpload,
  handleReloadSupabase,
  supabaseMaterials
}) => {
  return (
    <header className="bg-white shadow-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center py-4 gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-1">
              <img src={logo} alt="sustAId Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                sust<span style={{ color: '#16a34a', fontStyle: 'italic', fontSize: '1.2em' }} className="font-extrabold">AI</span>d
              </h1>
              <p className="text-xs md:text-base text-gray-600 hidden sm:block">AI-Powered Sustainable Material Selection</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative">
              <input
                type="file"
                accept=".csv,.sql"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm md:text-base"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload CSV/SQL</span>
                <span className="sm:hidden">Upload Data</span>
              </label>
            </div>
            <button
              onClick={handleReloadSupabase}
              disabled={supabaseMaterials.length === 0}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                supabaseMaterials.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              title={supabaseMaterials.length === 0 ? 'No database loaded' : 'Reload original sustAId database'}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Reload sustAId database</span>
              <span className="sm:hidden">Reload DB</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
