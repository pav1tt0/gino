import React from 'react';
import { BarChart3, Database, TrendingUp, PieChart, BookOpen, Download, MessageSquare } from 'lucide-react';

// Custom confirm dialog with better styling - make it global so it can be used from other components
window.showSustAIdConfirm = (message) => {
  return new Promise((resolve) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.style.animation = 'fadeIn 0.2s ease-out';

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4';
    dialog.style.animation = 'slideIn 0.3s ease-out';

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    dialog.innerHTML = `
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 mb-2">sustAId AI Assistant</h3>
          <p class="text-sm text-gray-600 mb-6">${message}</p>
          <div class="flex space-x-3">
            <button id="confirm-new" class="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
              Open New Tab
            </button>
            <button id="confirm-cancel" class="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
              Keep Existing
            </button>
          </div>
        </div>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Handle button clicks
    const handleResponse = (openNew) => {
      overlay.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
        resolve(openNew);
      }, 200);
    };

    const style2 = document.createElement('style');
    style2.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style2);

    dialog.querySelector('#confirm-new').onclick = () => handleResponse(true);
    dialog.querySelector('#confirm-cancel').onclick = () => handleResponse(false);
    overlay.onclick = (e) => {
      if (e.target === overlay) handleResponse(false);
    };
  });
};

const Navigation = ({ activeTab, setActiveTab }) => {
  const handleAIAssistantClick = () => {
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
    } else {
      // Window doesn't exist or is closed - open it
      window.sustAIdGPTWindow = window.open(
        'https://chatgpt.com/g/g-68c9d06b6eec81919a2e7d61ed7919c4-sustain',
        'sustAId_AI_Assistant'
      );
      window.sustAIdGPTWindowOpenTime = Date.now();

      // Check immediately if window is null (popup blocked)
      if (!window.sustAIdGPTWindow) {
        alert('Popup blocked! Please allow popups for sustAId to open the AI Assistant.');
      }
    }
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
