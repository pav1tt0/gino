import React from 'react';
import { Database, Filter, Zap, Leaf } from 'lucide-react';

const Dashboard = ({ totalMaterials, categories, avgSustainability, highSustainability }) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Database className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalMaterials}</p>
              <p className="text-sm sm:text-base text-gray-600">Total Materials</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Filter className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{categories}</p>
              <p className="text-sm sm:text-base text-gray-600">Categories</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 flex-shrink-0" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{avgSustainability.toFixed(1)}</p>
              <p className="text-sm sm:text-base text-gray-600">Avg. Sustainability</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-emerald-500">
          <div className="flex items-center">
            <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 flex-shrink-0" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{highSustainability}</p>
              <p className="text-sm sm:text-base text-gray-600">High Sustainability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Infographic */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{
        backgroundImage: 'url(/sfondo.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay for better text readability (optional) */}
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-3 sm:px-8 py-4 sm:py-8">
          {/* Welcome Title */}
          <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 text-center">
            Welcome to sust<span style={{ color: 'white', fontStyle: 'italic', fontSize: '1.2em' }}>AI</span>d
          </h2>
          <p className="text-sm sm:text-xl text-white mb-4 sm:mb-6 text-center">AI-Powered Sustainable Material Selection</p>

          {/* Infographic Flow */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 mb-2 sm:mb-4 max-w-5xl w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6">
              {/* Step 1: Raw Materials */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <span className="text-2xl sm:text-4xl">🧵</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg">Raw Materials</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Fibres & Textiles</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-3xl text-green-600 font-bold">→</div>
              <div className="md:hidden text-xl sm:text-2xl text-green-600 font-bold rotate-90">↓</div>

              {/* Step 2: LCA Analysis */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <span className="text-2xl sm:text-4xl">📊</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg">LCA Analysis</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Environmental Impact</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-3xl text-blue-600 font-bold">→</div>
              <div className="md:hidden text-xl sm:text-2xl text-blue-600 font-bold rotate-90">↓</div>

              {/* Step 3: Designer's Perspective */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-lg" style={{ backgroundColor: '#fce7f3' }}>
                  <span className="text-2xl sm:text-4xl">👤</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg">Designer's Perspective</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Design Considerations & Properties</p>
                <p className="text-xs text-gray-600 mt-0.5 sm:hidden">Design & Properties</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-3xl font-bold" style={{ color: '#db2777' }}>→</div>
              <div className="md:hidden text-xl sm:text-2xl font-bold rotate-90" style={{ color: '#db2777' }}>↓</div>

              {/* Step 4: AI Decision */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <span className="text-2xl sm:text-4xl">🤖</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg">AI Decision</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Intelligent Analysis</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-3xl text-purple-600 font-bold">→</div>
              <div className="md:hidden text-xl sm:text-2xl text-purple-600 font-bold rotate-90">↓</div>

              {/* Step 5: Sustainable Choice */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <span className="text-2xl sm:text-4xl">✓</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg">Sustainable Choice</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Informed Decision</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
