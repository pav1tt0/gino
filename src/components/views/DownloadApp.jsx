import React from 'react';
import { Download, Monitor, Apple, AlertCircle, Terminal, CheckCircle, BookOpen } from 'lucide-react';

const DownloadApp = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Download sustAId Desktop App</h1>
        <p className="text-green-50 text-lg">Version 0.1.0 - Beta Test Release</p>
      </div>

      {/* Download Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Windows Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <Monitor className="w-10 h-10 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Windows</h2>
              <p className="text-sm text-gray-600">Portable Version</p>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p className="font-semibold mb-1">System Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Windows 10 or later (64-bit)</li>
              <li>Minimum 4 GB RAM (8 GB recommended)</li>
              <li>100 MB disk space</li>
              <li className="invisible">Spacer</li>
            </ul>
          </div>

          <a
            href="/downloads/sustaid_windows.exe"
            download
            className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Download for Windows</span>
          </a>
          <p className="text-xs text-gray-500 mt-2 text-center">sustaid_windows.exe (14.3 MB)</p>
        </div>

        {/* macOS Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-gray-700 transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <Apple className="w-10 h-10 text-gray-700" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">macOS</h2>
              <p className="text-sm text-gray-600">Apple Silicon (ARM)</p>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p className="font-semibold mb-1">System Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>macOS 10.15 (Catalina) or later</li>
              <li>Apple Silicon (M1, M2, M3, M4)</li>
              <li>Minimum 4 GB RAM (8 GB recommended)</li>
              <li>100 MB disk space</li>
            </ul>
          </div>

          <a
            href="/downloads/sustaid_mac.zip"
            download
            className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Download for macOS</span>
          </a>
          <p className="text-xs text-gray-500 mt-2 text-center">sustaid_mac.zip (7.8 MB)</p>
        </div>
      </div>

      {/* User Guide PDF */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">User Guide</h3>
              <p className="text-sm text-gray-600">Complete guide for using sustAId Desktop App</p>
            </div>
          </div>
          <a
            href="/downloads/sustaid_user_guide.pdf"
            download
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Download Guide</span>
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-3">sustaid_user_guide.pdf - Installation instructions, features overview, and troubleshooting tips</p>
      </div>

      {/* Installation Instructions */}
      <div className="space-y-6">
        {/* Windows Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Monitor className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Windows Installation</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-gray-700">
                <p className="font-medium">Download and Save</p>
                <p className="text-sm text-gray-600">Download sustaid_windows.exe and save it in a folder of your choice (e.g., Desktop or C:\Program Files\sustAId\)</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-gray-700">
                <p className="font-medium">Launch the App</p>
                <p className="text-sm text-gray-600">Double-click sustaid_windows.exe to launch the application. No installation required - it's portable!</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">Windows Security Warning</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    The first time you launch the app, Windows Defender may display a warning because the app is not digitally signed (this is normal for beta versions).
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    <strong>To proceed:</strong>
                  </p>
                  <ol className="list-decimal list-inside text-sm text-yellow-700 ml-2 mt-1 space-y-1">
                    <li>Click "More info"</li>
                    <li>Then click "Run anyway"</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* macOS Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Apple className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-bold text-gray-900">macOS Installation</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-gray-700">
                <p className="font-medium">Download and Extract</p>
                <p className="text-sm text-gray-600">Download sustaid_mac.zip and double-click it in your Downloads folder. The sustAId.app will appear.</p>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800">macOS Security Warning - Unlock Required</p>
                  <p className="text-sm text-orange-700 mt-1">
                    If you try to open the app now, macOS will show a "damaged file" error. This is normal. Follow these steps:
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Terminal className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div className="text-gray-700">
                <p className="font-medium">Open Terminal</p>
                <ol className="list-decimal list-inside text-sm text-gray-600 ml-2 mt-1 space-y-1">
                  <li>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Cmd + Space</kbd> on your keyboard</li>
                  <li>Type: <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">terminal</kbd></li>
                  <li>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Enter</kbd></li>
                </ol>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-gray-700 w-full">
                <p className="font-medium">Run This Command</p>
                <p className="text-sm text-gray-600 mb-2">Copy and paste this command into Terminal, then press Enter:</p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                  xattr -cr ~/Downloads/sustAId.app
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-gray-700">
                <p className="font-medium">Launch the App</p>
                <p className="text-sm text-gray-600">Close Terminal, return to your Downloads folder, and double-click sustAId.app to launch!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Need help?</strong> This is a beta test release. If you encounter any issues, please report them to our development team.
        </p>
      </div>
    </div>
  );
};

export default DownloadApp;
