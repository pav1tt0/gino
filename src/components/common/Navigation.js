import React from 'react';
import { BarChart3, Database, TrendingUp, PieChart, BookOpen, Download, MessageSquare } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const handleAIAssistantClick = () => {
    // Open AI Assistant in new tab
    window.open('https://chatgpt.com/g/g-68c9d06b6eec81919a2e7d61ed7919c4-sustain', '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className="bg-white border-b border-gray-200 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-8 min-w-max">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'database', label: 'Materials Database', shortLabel: 'Database', icon: Database },
            { id: 'compare', label: 'Compare Materials', shortLabel: 'Compare', icon: TrendingUp },
            { id: 'analytics', label: 'LCA Analytics', shortLabel: 'Analytics', icon: PieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveTab('methodology')}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'methodology' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span>Methodology</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'download' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            <span className="sm:hidden">Download</span>
            <span className="hidden sm:inline">Download App</span>
          </button>
          <button
            onClick={handleAIAssistantClick}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 border-transparent text-green-600 hover:text-green-700 hover:border-green-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="sm:hidden">AI</span>
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
