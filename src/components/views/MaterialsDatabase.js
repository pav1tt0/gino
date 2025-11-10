import React, { useState } from 'react';
import { Search, Download, TrendingUp, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

const MaterialsDatabase = ({
  materials,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
  filteredMaterials,
  exportToCSV,
  exportToJSON,
  getSustainabilityColor,
  setSelectedMaterialDetail,
  selectedMaterialDetail,
  selectedMaterials,
  setSelectedMaterials
}) => {
  const [showApplications, setShowApplications] = useState(false);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials..."
                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {[...new Set(materials.map(m => m.Category))].filter(Boolean).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <select
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="sustainability">Sustainability Score</option>
              </select>
            </div>
          </div>
          {/* Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportToCSV(filteredMaterials, 'materials_database')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportToJSON(filteredMaterials, 'materials_database')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Materials Database</h2>
          <p className="text-xs sm:text-sm text-gray-600">Showing {filteredMaterials.length} materials</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sustainability Score</th>
                <th className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environmental Sustainability</th>
                <th className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durability</th>
                <th className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Range</th>
                <th className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 max-w-[80px] sm:max-w-[120px] md:whitespace-nowrap md:max-w-none">
                    <button
                      onClick={() => setSelectedMaterialDetail(material)}
                      className="text-xs sm:text-sm font-medium hover:underline cursor-pointer transition-opacity hover:opacity-80 text-left leading-tight"
                      style={{ color: getSustainabilityColor(material['Sustainability Score']) }}
                    >
                      {material['Material Name'] || 'Unknown'}
                    </button>
                  </td>
                  <td className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-gray-900">
                      {material.Category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900">{material['Sustainability Score'] || 'N/A'}</div>
                  </td>
                  <td className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {material['Environmental_Sustainability'] || 'N/A'}
                  </td>
                  <td className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {material['Durability'] || 'N/A'}
                  </td>
                  <td className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {material['Cost Range ($/kg)'] || 'N/A'}
                  </td>
                  <td className="px-1 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <button
                      onClick={() => {
                        const materialName = material['Material Name'];
                        setSelectedMaterials(prev =>
                          prev.includes(materialName) ? prev.filter(id => id !== materialName) : [...prev, materialName]
                        );
                      }}
                      className={selectedMaterials.includes(material['Material Name']) ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                    >
                      {selectedMaterials.includes(material['Material Name']) ? 'Remove' : 'Compare'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Material Detail Modal */}
      {selectedMaterialDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4" onClick={() => setSelectedMaterialDetail(null)}>
          <div className="bg-white w-full h-full sm:rounded-lg sm:shadow-xl sm:w-auto sm:max-w-3xl md:max-w-4xl lg:max-w-6xl sm:max-h-[90vh] sm:h-auto overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header - Fixed */}
            <div className="bg-white border-b border-gray-200 p-3 sm:p-4 rounded-t-lg flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 gap-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 pr-2">
                  {selectedMaterialDetail['Material Name'] || 'Material Details'}
                </h3>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap">
                    {selectedMaterialDetail.Category || 'N/A'}
                  </span>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold text-white whitespace-nowrap`}
                       style={{backgroundColor: getSustainabilityColor(selectedMaterialDetail['Sustainability Score'])}}>
                    {selectedMaterialDetail['Sustainability Score'] || 'N/A'}
                  </div>
                  <button
                    onClick={() => setSelectedMaterialDetail(null)}
                    className="text-gray-400 hover:text-red-500 text-xl font-bold hover:bg-gray-100 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* 4 Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
                <div className="bg-red-50 p-1.5 sm:p-2 rounded-lg border-2 border-red-200 text-center">
                  <div className="text-xs sm:text-sm font-semibold text-red-700 uppercase leading-tight">GHG Emissions</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                    {selectedMaterialDetail['GHG Emissions (kg CO2e/kg)']
                      ? `${selectedMaterialDetail['GHG Emissions (kg CO2e/kg)']} kg CO2e/kg`
                      : 'N/A'}
                  </div>
                </div>
                <div className="bg-green-50 p-1.5 sm:p-2 rounded-lg border-2 border-green-200 text-center">
                  <div className="text-xs sm:text-sm font-semibold text-green-700 uppercase leading-tight">Environmental Sustainability</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                    {selectedMaterialDetail['Environmental_Sustainability'] || 'N/A'}
                  </div>
                </div>
                <div className="bg-blue-50 p-1.5 sm:p-2 rounded-lg border-2 border-blue-200 text-center">
                  <div className="text-xs sm:text-sm font-semibold text-blue-700 uppercase leading-tight">Durability</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                    {selectedMaterialDetail['Durability'] || 'N/A'}
                  </div>
                </div>
                <div className="bg-purple-50 p-1.5 sm:p-2 rounded-lg border-2 border-purple-200 text-center">
                  <div className="text-xs sm:text-sm font-semibold text-purple-700 uppercase leading-tight">Cost Range</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                    {selectedMaterialDetail['Cost Range ($/kg)']
                      ? `${selectedMaterialDetail['Cost Range ($/kg)']} $/kg`
                      : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Primary Applications - Collapsible */}
              {selectedMaterialDetail['Primary Applications'] && (
                <div className="bg-amber-50 rounded-lg border border-amber-200 mt-2 sm:mt-3 overflow-hidden">
                  <button
                    onClick={() => setShowApplications(!showApplications)}
                    className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-amber-100 transition-colors"
                  >
                    <div className="text-xs sm:text-sm font-semibold text-amber-900 uppercase">Primary Applications</div>
                    {showApplications ? (
                      <ChevronUp className="w-4 h-4 text-amber-900" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-amber-900" />
                    )}
                  </button>
                  {showApplications && (
                    <div className="px-2 pb-2 sm:px-3 sm:pb-3">
                      <div className="text-xs sm:text-sm text-gray-800 leading-snug">
                        {selectedMaterialDetail['Primary Applications']}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable Content - Flexible height */}
            <div className="px-3 sm:px-4 pb-2 sm:pb-3 flex-1 overflow-y-auto">
              <h4 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 border-b pb-1.5 mb-2">All Properties</h4>
              <div className="pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#10b981 #e5e7eb'
              }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 8px;
                  }
                  div::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: #10b981;
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: #059669;
                  }
                `}</style>

                {/* Two columns layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  {/* Left column */}
                  <div className="md:border-r-2 md:border-gray-400 md:pr-4">
                    {[
                      'Sustainability Rating',
                      'Water Consumption (L/kg)',
                      'Energy Use (MJ/kg)',
                      'Land Use',
                      'Chemical Use Level',
                      'Fuel Consumption (MJ/kg)',
                      'Toxicity',
                      'Biodegradability',
                      'Social Sustainability'
                    ].map(key =>
                      selectedMaterialDetail[key] && selectedMaterialDetail[key] !== '' ? (
                        <div key={key} className="flex justify-between py-1.5 border-b border-gray-100">
                          <span className="text-xs font-medium text-gray-600 flex-shrink-0">{key}:</span>
                          <span className="text-xs text-gray-900 font-semibold text-right ml-2">
                            {selectedMaterialDetail[key]}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>

                  {/* Right column */}
                  <div>
                    {[
                      'Governance',
                      'Tensile Strength (MPa)',
                      'Abrasion Resistance',
                      'Chemical Resistance',
                      'Moisture Absorption',
                      'Temperature Resistance',
                      'Elasticity',
                      'Dyeability',
                      'Cost Volatility'
                    ].map(key =>
                      selectedMaterialDetail[key] && selectedMaterialDetail[key] !== '' ? (
                        <div key={key} className="flex justify-between py-1.5 border-b border-gray-100">
                          <span className="text-xs font-medium text-gray-600 flex-shrink-0">{key}:</span>
                          <span className="text-xs text-gray-900 font-semibold text-right ml-2">
                            {selectedMaterialDetail[key]}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>

                {/* Full width row for Comfort Level */}
                {selectedMaterialDetail['Comfort Level'] && selectedMaterialDetail['Comfort Level'] !== '' && (
                  <div className="py-2 border-t border-gray-300 mt-3 pt-3">
                    <div className="text-xs font-medium text-gray-600 mb-1">Comfort Level:</div>
                    <div className="text-xs text-gray-900 font-semibold leading-relaxed">
                      {selectedMaterialDetail['Comfort Level']}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Footer with 5 Buttons */}
            <div className="bg-gray-50 border-t border-gray-200 p-2 sm:p-3 rounded-b-lg flex-shrink-0">
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                <button
                  onClick={() => exportToCSV([selectedMaterialDetail], `${selectedMaterialDetail['Material Name']}_details`)}
                  className="flex items-center justify-center space-x-0.5 sm:space-x-1 bg-blue-600 text-white py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => exportToJSON([selectedMaterialDetail], `${selectedMaterialDetail['Material Name']}_details`)}
                  className="flex items-center justify-center space-x-0.5 sm:space-x-1 bg-purple-600 text-white py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>JSON</span>
                </button>
                <div className="relative group w-full">
                  <button
                  onClick={async () => {
                    // Build context for AI Assistant
                    const material = selectedMaterialDetail;
                    const prompt = `I need information about ${material['Material Name']} (${material['Category']}).

Key properties:
- Sustainability Score: ${material['Sustainability Score'] || material['Sustainability Rating'] || 'N/A'}
- GHG Emissions: ${material['GHG Emissions (kg CO2e/kg)'] || 'N/A'} kg CO2e/kg
- Water Consumption: ${material['Water Consumption (L/kg)'] || 'N/A'} L/kg
- Energy Use: ${material['Energy Use (MJ/kg)'] || 'N/A'} MJ/kg
- Durability: ${material['Durability'] || 'N/A'}
- Cost Range: ${material['Cost Range ($/kg)'] || 'N/A'}
- Primary Applications: ${material['Primary Applications'] || 'N/A'}

Can you help me understand this material better and suggest alternatives or best use cases?`;

                    // Copy to clipboard
                    try {
                      await navigator.clipboard.writeText(prompt);

                      // Remove any existing toast to avoid accumulation
                      const existingToast = document.getElementById('ai-toast');
                      if (existingToast) existingToast.remove();

                      // Create and show toast notification
                      const toast = document.createElement('div');
                      toast.id = 'ai-toast';
                      toast.className = 'fixed top-4 sm:top-20 left-4 right-4 sm:left-auto sm:right-4 bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg z-50 max-w-md';
                      toast.innerHTML = `
                        <div class="flex items-start space-x-3">
                          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <div>
                            <p class="font-semibold">Material data copied!</p>
                            <p class="text-sm text-green-100 mt-1">Paste it in the AI chat (Ctrl+V or Cmd+V)</p>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(toast);

                      // Remove toast after 8 seconds
                      setTimeout(() => {
                        const el = document.getElementById('ai-toast');
                        if (el) el.remove();
                      }, 8000);

                      // Open GPT after a short delay, with check for existing window
                      setTimeout(() => {
                        const now = Date.now();
                        const lastOpenTime = window.sustAIdGPTWindowOpenTime || 0;
                        const timeSinceOpen = now - lastOpenTime;
                        const thirtySeconds = 30000;

                        // Check if we have a reference to the GPT window
                        let windowIsOpen = false;

                        // If opened within last 30 seconds, assume it's still open
                        if (timeSinceOpen < thirtySeconds && lastOpenTime > 0) {
                          windowIsOpen = true;
                        } else {
                          // After 30 seconds, check if it's actually closed
                          try {
                            if (window.sustAIdGPTWindow) {
                              const isClosed = window.sustAIdGPTWindow.closed;
                              if (isClosed) {
                                // Window is closed - clear the timestamp
                                window.sustAIdGPTWindowOpenTime = 0;
                                windowIsOpen = false;
                              } else {
                                // Still open after 30 seconds (rare but possible)
                                windowIsOpen = true;
                              }
                            } else {
                              // No reference exists
                              windowIsOpen = false;
                            }
                          } catch (e) {
                            // Can't check - assume it's closed after 30 seconds
                            windowIsOpen = false;
                          }
                        }

                        if (windowIsOpen) {
                          // Window exists and is open - ask user what to do
                          if (window.showSustAIdConfirm) {
                            window.showSustAIdConfirm('The sustAId AI Assistant tab is already open. Would you like to open a new tab or keep using the existing one?').then((openNew) => {
                              if (openNew) {
                                // User wants a new tab - use _blank to force new tab
                                window.sustAIdGPTWindow = window.open(
                                  'https://chatgpt.com/g/g-68c9d06b6eec81919a2e7d61ed7919c4-sustain',
                                  '_blank'
                                );
                                window.sustAIdGPTWindowOpenTime = Date.now();
                              } else {
                                // User wants to keep existing - just try to focus it
                                try {
                                  if (window.sustAIdGPTWindow && !window.sustAIdGPTWindow.closed) {
                                    window.sustAIdGPTWindow.focus();
                                  }
                                } catch (e) {
                                  // Could not focus - do nothing
                                }
                                // Don't update timestamp - keep the original open time
                              }
                            });
                          }
                        } else {
                          // Window doesn't exist or is closed - open it
                          window.sustAIdGPTWindow = window.open(
                            'https://chatgpt.com/g/g-68c9d06b6eec81919a2e7d61ed7919c4-sustain',
                            'sustAId_AI_Assistant'
                          );
                          window.sustAIdGPTWindowOpenTime = Date.now();
                        }
                      }, 500);
                    } catch (err) {
                      alert('Could not copy to clipboard. Please enable clipboard permissions.');
                      console.error('Clipboard error:', err);
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-0.5 sm:space-x-1 bg-green-600 text-white py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Ask AI</span>
                  <span className="sm:hidden">AI</span>
                </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                    Copy material data to clipboard and open AI Assistant
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const materialName = selectedMaterialDetail['Material Name'];
                    setSelectedMaterials(prev =>
                      prev.includes(materialName)
                        ? prev.filter(name => name !== materialName)
                        : [...prev, materialName]
                    );
                  }}
                  className={`flex items-center justify-center space-x-0.5 sm:space-x-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg transition-colors text-xs sm:text-sm font-semibold ${
                    selectedMaterials.includes(selectedMaterialDetail['Material Name'])
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{selectedMaterials.includes(selectedMaterialDetail['Material Name']) ? 'Remove' : 'Compare'}</span>
                </button>
                <button
                  onClick={() => setSelectedMaterialDetail(null)}
                  className="flex items-center justify-center space-x-0.5 sm:space-x-1 bg-red-600 text-white py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsDatabase;
