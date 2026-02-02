import React from 'react';
import { Upload, Database } from 'lucide-react';
import logo from '../../Logo-sustain.png';

const Header = ({
  handleFileUpload,
  handleReloadSupabase,
  supabaseMaterials,
  userEmail,
  onLogout,
  isLoading
}) => {
  return (
    <header className="bg-white shadow-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-1">
              <img src={logo} alt="sustAId Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                sust<span style={{ color: '#16a34a', fontStyle: 'italic', fontSize: '1.2em' }} className="font-extrabold">AI</span>d
              </h1>
              <p className="text-xs md:text-base text-gray-600 hidden sm:block">AI-Powered Sustainable Material Selection</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4 lg:justify-end">
            <div className="relative group sm:flex-1 md:flex-none md:min-w-[190px]">
              <input
                type="file"
                accept=".csv,.sql"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm md:text-base font-medium h-auto w-full"
              >
                <Upload className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Upload CSV/SQL</span>
                <span className="sm:hidden">Upload Data</span>
              </label>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                Upload your own CSV or SQL database file
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
            <div className="relative group sm:flex-1 md:flex-none md:min-w-[220px]">
              <button
                onClick={handleReloadSupabase}
                disabled={isLoading}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm md:text-base font-medium h-auto w-full ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Database className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">
                  {supabaseMaterials.length === 0 ? 'Load sustAId database' : 'Reload sustAId database'}
                </span>
                <span className="sm:hidden">{supabaseMaterials.length === 0 ? 'Load DB' : 'Reload DB'}</span>
              </button>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                {isLoading ? 'Loading from Supabase...' : 'Load original sustAId database'}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
            {userEmail && onLogout && (
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 sm:flex-none">
                <div className="flex items-center space-x-2 bg-green-50 text-green-800 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                  <span className="truncate max-w-[180px] sm:max-w-[200px]">{userEmail}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-semibold whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
