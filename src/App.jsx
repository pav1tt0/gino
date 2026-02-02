import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RefreshCw, Database, Download } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { fetchMaterialsFromSupabase, supabaseConfigOk } from './supabaseClient';
import { useAuth } from './context/AuthContext';
import { parseCSVFile, parseSQLFile } from './utils/fileParsing';

import MainLayout from './layouts/MainLayout';
import AccessGate from './components/auth/AccessGate';
import ConfirmModal from './components/modals/ConfirmModal';
import DataPreviewModal from './components/modals/DataPreviewModal';

import Dashboard from './components/views/Dashboard';
import MaterialsDatabase from './components/views/MaterialsDatabase';
import Analytics from './components/views/Analytics';
import Methodology from './components/views/Methodology';
import Compare from './components/views/Compare';
import DownloadApp from './components/views/DownloadApp';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const SustainableMaterialsApp = () => {
  // Auth Context
  const { session, busy, error, setError, signIn, signUp, signOut } = useAuth();

  // State
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selected Materials (Shared across views)
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // Preview & Confirm Modal State
  const [previewData, setPreviewData] = useState(null);
  const [previewFileName, setPreviewFileName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [supabaseMaterials, setSupabaseMaterials] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(null);

  const [didAutoLoad, setDidAutoLoad] = useState(false);
  const autoLoadRef = useRef(false);

  // Auto-load Supabase data after successful auth
  useEffect(() => {
    if (didAutoLoad || autoLoadRef.current) return;
    if (!session || !supabaseConfigOk) return;
    if (materials.length > 0 || loading) return;

    const autoLoad = async () => {
      autoLoadRef.current = true;
      setLoading(true);
      try {
        const data = await fetchMaterialsFromSupabase();
        if (data && data.length > 0) {
          setSupabaseMaterials(data);
          setMaterials(data);
          toast.success(`Loaded ${data.length} materials from Supabase`);
        } else {
          toast.error('No materials found in Supabase');
        }
      } catch (err) {
        console.error('Supabase load error:', err);
        toast.error('Failed to load from Supabase');
      } finally {
        setLoading(false);
        setDidAutoLoad(true);
        autoLoadRef.current = false;
      }
    };

    autoLoad();
  }, [didAutoLoad, session, supabaseConfigOk, materials.length, loading]);

  // Reset auto-load flag on logout so next login auto-fetches again
  useEffect(() => {
    if (!session) {
      setDidAutoLoad(false);
      autoLoadRef.current = false;
    }
  }, [session]);

  // Handle Logout - Clear local state
  const handleLogout = async () => {
    await signOut();
    setMaterials([]);
    setSelectedMaterials([]);
    setSupabaseMaterials([]);
  };

  // Handle Reload Supabase
  const handleReloadSupabase = async () => {
    if (!supabaseConfigOk) {
      toast.error('Supabase not configured');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchMaterialsFromSupabase();
      if (data && data.length > 0) {
        setSupabaseMaterials(data);

        // If no materials loaded yet, or user wants to merge/replace?
        // Current logic: Replace materials with Supabase data
        setMaterials(data);
        toast.success(`Loaded ${data.length} materials from Supabase`);
      } else {
        toast.error('No materials found in Supabase');
      }
    } catch (err) {
      console.error('Supabase load error:', err);
      toast.error('Failed to load from Supabase');
    } finally {
      setLoading(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. VALIDATE FILE SIZE (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error(`File too large! Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      event.target.value = '';
      return;
    }

    // VALIDATE FILE TYPE
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.sql')) {
      toast.error('Please select a CSV or SQL file');
      event.target.value = '';
      return;
    }

    // Function to process the file
    const processFile = async () => {
      try {
        setLoading(true);
        toast.loading(`Reading ${file.name}...`, { id: 'file-upload' });

        const fileContent = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });

        let parsedMaterials = [];

        if (fileName.endsWith('.csv')) {
          parsedMaterials = parseCSVFile(fileContent);
        } else if (fileName.endsWith('.sql')) {
          parsedMaterials = parseSQLFile(fileContent);
        }

        if (parsedMaterials.length === 0) {
          toast.error('No data found in the file. Please check the file format.', { id: 'file-upload' });
          setLoading(false);
          return;
        }

        // SHOW PREVIEW instead of importing directly
        toast.dismiss('file-upload');
        setPreviewData(parsedMaterials);
        setPreviewFileName(file.name);
        setShowPreview(true);
        setLoading(false);
      } catch (error) {
        toast.error(`Error reading file: ${error.message}`, { id: 'file-upload' });
        setLoading(false);
      }
    };

    // 2. CONFIRM BEFORE OVERWRITING existing data (if any)
    if (materials.length > 0) {
      setConfirmMessage(
        `You have ${materials.length} materials already loaded.\n\n` +
        `Do you want to REPLACE them with the new file?\n\n` +
        `Click OK to replace, or Cancel to keep existing data.`
      );
      setConfirmCallback(() => processFile);
      setShowConfirm(true);
    } else {
      // No existing data, process immediately
      await processFile();
    }

    // Clear file input
    event.target.value = '';
  };

  // Handle Preview Actions
  const handlePreviewConfirm = () => {
    if (!previewData) return;
    setMaterials(previewData);
    setShowPreview(false);
    toast.success(
      `Successfully imported ${previewData.length} material${previewData.length > 1 ? 's' : ''}!`,
      { duration: 4000 }
    );
    setPreviewData(null);
    setPreviewFileName('');
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
    setPreviewData(null);
    setPreviewFileName('');
    toast.info('Import cancelled', { duration: 2000 });
  };

  // Handle Confirm Dialog Actions
  const handleConfirmOk = () => {
    setShowConfirm(false);
    if (confirmCallback) confirmCallback();
    setConfirmCallback(null);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    setConfirmCallback(null);
  };

  // Render Auth Screen if not authenticated
  if (!session) {
    return (
      <div
        className="min-h-screen flex flex-col p-4"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(34,197,94,0.18), transparent 45%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.16), transparent 45%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)'
        }}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#363636', color: '#fff' },
            success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-green-200 opacity-30 rounded-full blur-3xl"></div>
          <div className="hidden sm:block absolute bottom-0 right-0 w-48 h-48 bg-blue-200 opacity-30 rounded-full blur-3xl"></div>
          <div className="hidden sm:block absolute top-1/2 left-1/2 w-28 h-28 bg-emerald-200 opacity-30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <AccessGate
            onSignIn={signIn}
            onSignUp={signUp}
            onClearAuthError={() => setError('')}
            authBusy={busy}
            authError={error}
            supabaseConfigOk={supabaseConfigOk}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-6">
          <p className="mb-1">
            Developed by <span className="font-semibold text-green-600">Alessia Vittori</span> © 2025
          </p>
          <p>
            <a href="mailto:info@sustaid.net" className="text-green-600 hover:text-green-700 transition-colors">
              info@sustaid.net
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {/* Modals */}
      {showConfirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={handleConfirmOk}
          onCancel={handleConfirmCancel}
        />
      )}

      {showPreview && previewData && (
        <DataPreviewModal
          data={previewData}
          fileName={previewFileName}
          onConfirm={handlePreviewConfirm}
          onCancel={handlePreviewCancel}
        />
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={
              <MainLayout
                userEmail={session?.user?.email}
                onLogout={handleLogout}
                handleFileUpload={handleFileUpload}
                handleReloadSupabase={handleReloadSupabase}
                supabaseMaterials={supabaseMaterials}
                isLoading={loading}
              />
          }
        >
          <Route
            path="/dashboard"
            element={
              /* Pass simple materials array, Dashboard computes stats */
              <Dashboard materials={materials} />
            }
          />
          <Route
            path="/database"
            element={
              /* Pass materials and selection props. Filtering is internal. */
              <MaterialsDatabase
                materials={materials}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
              />
            }
          />
          <Route
            path="/compare"
            element={
              <Compare
                materials={materials}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <Analytics
                materials={materials}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
              />
            }
          />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/download" element={<DownloadApp />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </div>
  );
};

export default SustainableMaterialsApp;
