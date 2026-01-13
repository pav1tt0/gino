import React, { useState, useEffect } from 'react';
import { Search, Database, RefreshCw, PieChart, Download, Camera, FileImage, AlertCircle, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, PieChart as RechartsPieChart, Pie, Cell, ComposedChart, Line } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { checkInviteCode, fetchMaterialsFromSupabase, supabase, supabaseConfigOk } from './supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import ConfirmModal from './components/modals/ConfirmModal';
import DataPreviewModal from './components/modals/DataPreviewModal';
import Dashboard from './components/views/Dashboard';
import MaterialsDatabase from './components/views/MaterialsDatabase';
import DownloadApp from './components/views/DownloadApp';
import AccessGate from './components/auth/AccessGate';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

// Chart Export Buttons Component
const ChartExportButtons = ({ chartRef, chartId, filename }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const getElement = () => {
    // Handle chartId string (for getElementById)
    if (chartId) {
      return document.getElementById(chartId);
    }
    // Handle ref objects
    if (chartRef && chartRef.current) {
      return chartRef.current;
    }
    return null;
  };

  const exportPNG = async () => {
    if (isExporting) return;
    const element = getElement();
    if (!element) {
      toast.error('Chart element not found. Please try again.');
      return;
    }
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
        useCORS: true,
        allowTaint: false
      });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Chart exported as PNG!');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      toast.error('Failed to export as PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const exportPDF = async () => {
    if (isExporting) return;
    const element = getElement();
    if (!element) {
      toast.error('Chart element not found. Please try again.');
      return;
    }
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
        useCORS: true,
        allowTaint: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);
      toast.success('Chart exported as PDF!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export as PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-2">
      <button
        onClick={exportPNG}
        disabled={isExporting}
        className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
          isExporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
        title="Export as PNG"
      >
        <FileImage className="w-3 h-3" />
        <span>{isExporting ? 'Exporting...' : 'PNG'}</span>
      </button>
      <button
        onClick={exportPDF}
        disabled={isExporting}
        className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
          isExporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700'
        } text-white`}
        title="Export as PDF"
      >
        <Camera className="w-3 h-3" />
        <span>{isExporting ? 'Exporting...' : 'PDF'}</span>
      </button>
    </div>
  );
};

// Confirm Dialog Modal Component
// Missing Data Warning Component (Compact Version)
const MissingDataWarning = ({ excludedMaterials }) => {
  if (!excludedMaterials || excludedMaterials.length === 0) return null;

  return (
    <div className="mb-2 p-2 bg-yellow-50 border-l border-yellow-400 rounded text-xs inline-block max-w-md">
      <div className="flex items-start gap-1.5">
        <svg className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="min-w-0">
          <p className="text-yellow-700 font-medium leading-tight">
            {excludedMaterials.length} material{excludedMaterials.length > 1 ? 's' : ''} with missing data (N/A):
          </p>
          <div className="mt-0.5 text-yellow-600 leading-snug">
            {excludedMaterials.map((material, idx) => (
              <div key={idx} className="truncate">
                {material.name}{material.reason ? ` (${material.reason})` : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Tooltip Component for displaying full material names
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg" style={{ maxWidth: '300px' }}>
        <p className="font-semibold text-gray-900 mb-1 break-words">{data.fullName || label}</p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">{payload[0].name}:</span> {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
};

const SustainableMaterialsApp = () => {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedMaterialDetail, setSelectedMaterialDetail] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedAnalyticsMaterials, setSelectedAnalyticsMaterials] = useState([]);
  const [analyticsSearchQuery, setAnalyticsSearchQuery] = useState('');
  const [singleRadarMaterial, setSingleRadarMaterial] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [previewFileName, setPreviewFileName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [supabaseMaterials, setSupabaseMaterials] = useState([]); // Store original Supabase data
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const pageRefs = React.useRef([]);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  const [isSmallScreen, setIsSmallScreen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsSmallScreen(width < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth session error:', error);
        }
        if (isMounted) {
          setSession(data?.session || null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Load materials from Supabase when authenticated
  useEffect(() => {
    if (!session) {
      return;
    }

    const loadSupabaseMaterials = async () => {
      try {
        setLoading(true);
        const data = await fetchMaterialsFromSupabase('LCA_data_v2');
        if (data && data.length > 0) {
          setMaterials(data);
          setFilteredMaterials(data);
          setSupabaseMaterials(data); // Save original Supabase data
          console.log(`Loaded ${data.length} materials from Supabase`);
        }
      } catch (error) {
        console.error('Failed to load materials from Supabase:', error);
        // Silently fail - user can still upload CSV/SQL manually
      } finally {
        setLoading(false);
      }
    };

    loadSupabaseMaterials();
  }, [session]);


  // Handle page navigation with scroll
  const goToPage = (page) => {
    setPageNumber(page);
    if (pageRefs.current[page - 1]) {
      pageRefs.current[page - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Utility functions
  const getSustainabilityColor = (score) => {
    const numScore = parseFloat(score) || 0;
    if (numScore >= 5) return '#10b981'; // Green for high sustainability (5-6)
    if (numScore >= 3) return '#f59e0b'; // Yellow for medium sustainability (3-4)
    return '#ef4444'; // Red for low sustainability (1-2)
  };

  const handleSignIn = async ({ email, password }) => {
    setAuthError('');
    if (!supabaseConfigOk) {
      setAuthError('Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
      return;
    }

    setAuthBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: String(email || '').trim(),
        password: String(password || '')
      });

      if (error) {
        setAuthError(error.message);
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignUp = async ({ email, password, inviteCode }) => {
    setAuthError('');
    if (!supabaseConfigOk) {
      setAuthError('Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
      return;
    }

    setAuthBusy(true);
    try {
      const inviteOk = await checkInviteCode(inviteCode);
      if (!inviteOk) {
        setAuthError('Invalid invite code.');
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: String(email || '').trim(),
        password: String(password || '')
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      toast.success('Account created. You are now signed in.');
    } catch (error) {
      setAuthError('Sign up failed. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthError('');
    setAuthBusy(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Sign out error:', error);
      }
    } finally {
      setSession(null);
      setMaterials([]);
      setFilteredMaterials([]);
      setSupabaseMaterials([]);
      setAuthBusy(false);
    }
  };


  // Export functions
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Get all unique keys from the data
    const keys = Object.keys(data[0]);

    // Create CSV header
    const csvHeader = keys.join(',');

    // Create CSV rows
    const csvRows = data.map(item =>
      keys.map(key => {
        const value = item[key] || '';
        // Escape commas and quotes in values
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    );

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${data.length} materials to CSV!`);
  };

  const exportToJSON = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${data.length} materials to JSON!`);
  };

  // Parse SQL INSERT statements
  const parseSQLFile = (content) => {
    const materials = [];

    // Extract table columns from CREATE TABLE or first INSERT statement
    let columns = [];

    // Look for CREATE TABLE statement to get column names
    const createTableMatch = content.match(/CREATE\s+TABLE\s+\w+\s*\(([\s\S]*?)\);/i);
    if (createTableMatch) {
      const columnDefs = createTableMatch[1];
      columns = columnDefs.split(',').map(col => {
        const colName = col.trim().split(/\s+/)[0].replace(/[`'"]/g, '');
        return colName;
      }).filter(col => col.length > 0);
    }

    // If no CREATE TABLE found, try to extract from INSERT statements
    if (columns.length === 0) {
      const insertMatch = content.match(/INSERT\s+INTO\s+\w+\s*\(\s*([^)]+)\)/i);
      if (insertMatch) {
        columns = insertMatch[1].split(',').map(col => col.trim().replace(/[`'"]/g, ''));
      }
    }

    // Normalize column names: replace underscores with spaces and capitalize words
    const normalizeColumnName = (colName) => {
      return colName
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    // Extract INSERT statements
    const insertRegex = /INSERT\s+INTO\s+\w+(?:\s*\([^)]*\))?\s+VALUES\s*\(([^)]+)\)/gi;
    let match;

    while ((match = insertRegex.exec(content)) !== null) {
      const values = [];
      const valueString = match[1];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';

      for (let i = 0; i < valueString.length; i++) {
        const char = valueString[i];

        if ((char === '"' || char === "'") && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^['"]|['"]$/g, ''));
          current = '';
          continue;
        }

        if (char !== quoteChar || inQuotes) {
          current += char;
        }
      }
      values.push(current.trim().replace(/^['"]|['"]$/g, ''));

      // Create material object with normalized column names
      const material = {};
      columns.forEach((column, index) => {
        material[normalizeColumnName(column)] = values[index] || '';
      });
      materials.push(material);
    }

    return materials;
  };

  // Normalize column name - INTELLIGENT mapping (IT + EN + Keyword matching)
  const normalizeColumnName = (name) => {
    if (!name) return '';

    // Step 1: Clean the column name
    const cleaned = name.trim()
      .replace(/['"]/g, '')
      .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
      .replace(/\s+/g, ' ')    // Normalize multiple spaces
      .toLowerCase();

    // Step 2: EXACT MATCH - Extended dictionary (English + Italian)
    const exactMatchMap = {
      // Material identification (EN + IT)
      'material id': 'Material ID',
      'id materiale': 'Material ID',
      'material name': 'Material Name',
      'nome materiale': 'Material Name',
      'materiale': 'Material Name',
      'nome': 'Material Name',
      'material': 'Material Name',
      'category': 'Category',
      'categories': 'Category',
      'categoria': 'Category',
      'categorie': 'Category',
      'tipo': 'Category',
      'tipi': 'Category',
      'tipologia': 'Category',

      // Sustainability scores
      'sustainability rating': 'Sustainability Rating',
      'valutazione sostenibilita': 'Sustainability Rating',
      'sustainability score': 'Sustainability Score',
      'punteggio sostenibilita': 'Sustainability Score',
      'sostenibilita': 'Sustainability Score',
      'environmental sustainability': 'Environmental_Sustainability',
      'sostenibilita ambientale': 'Environmental_Sustainability',

      // Environmental impact - GHG/CO2
      'ghg emissions': 'GHG Emissions (kg CO2e/kg)',
      'emissioni ghg': 'GHG Emissions (kg CO2e/kg)',
      'emissioni co2': 'GHG Emissions (kg CO2e/kg)',
      'co2': 'GHG Emissions (kg CO2e/kg)',
      'emissioni': 'GHG Emissions (kg CO2e/kg)',
      'carbon footprint': 'GHG Emissions (kg CO2e/kg)',
      'impronta carbonio': 'GHG Emissions (kg CO2e/kg)',

      // Water consumption
      'water consumption': 'Water Consumption (L/kg)',
      'consumo acqua': 'Water Consumption (L/kg)',
      'consumo idrico': 'Water Consumption (L/kg)',
      'acqua': 'Water Consumption (L/kg)',
      'uso acqua': 'Water Consumption (L/kg)',

      // Energy use
      'energy use': 'Energy Use (MJ/kg)',
      'consumo energia': 'Energy Use (MJ/kg)',
      'consumo energetico': 'Energy Use (MJ/kg)',
      'energia': 'Energy Use (MJ/kg)',
      'uso energia': 'Energy Use (MJ/kg)',

      // Fuel consumption
      'fuel consumption': 'Fuel Consumption (MJ/kg)',
      'consumo carburante': 'Fuel Consumption (MJ/kg)',
      'carburante': 'Fuel Consumption (MJ/kg)',

      // Land use
      'land use': 'Land Use',
      'uso suolo': 'Land Use',
      'consumo suolo': 'Land Use',
      'suolo': 'Land Use',
      'occupazione suolo': 'Land Use',

      // Chemical use
      'chemical use level': 'Chemical Use Level',
      'uso sostanze chimiche': 'Chemical Use Level',
      'livello chimici': 'Chemical Use Level',
      'sostanze chimiche': 'Chemical Use Level',

      // Toxicity
      'toxicity': 'Toxicity',
      'tossicita': 'Toxicity',
      'tossico': 'Toxicity',

      // Biodegradability
      'biodegradability': 'Biodegradability',
      'biodegradabilita': 'Biodegradability',
      'biodegradabile': 'Biodegradability',

      // Social & governance
      'social sustainability': 'Social Sustainability',
      'sostenibilita sociale': 'Social Sustainability',
      'governance': 'Governance',
      'governanza': 'Governance',

      // Physical properties
      'durability': 'Durability',
      'durabilita': 'Durability',
      'durata': 'Durability',
      'resistenza': 'Durability',

      'tensile strength': 'Tensile Strength (MPa)',
      'resistenza trazione': 'Tensile Strength (MPa)',
      'trazione': 'Tensile Strength (MPa)',

      'abrasion resistance': 'Abrasion Resistance',
      'resistenza abrasione': 'Abrasion Resistance',
      'abrasione': 'Abrasion Resistance',

      'chemical resistance': 'Chemical Resistance',
      'resistenza chimica': 'Chemical Resistance',

      'moisture absorption': 'Moisture Absorption',
      'assorbimento umidita': 'Moisture Absorption',
      'umidita': 'Moisture Absorption',

      'temperature resistance': 'Temperature Resistance',
      'resistenza temperatura': 'Temperature Resistance',
      'temperatura': 'Temperature Resistance',

      'elasticity': 'Elasticity',
      'elasticita': 'Elasticity',

      'dyeability': 'Dyeability',
      'tingibilita': 'Dyeability',

      'comfort level': 'Comfort Level',
      'livello comfort': 'Comfort Level',
      'comfort': 'Comfort Level',
      'confort': 'Comfort Level',

      // Economic
      'cost range': 'Cost Range ($/kg)',
      'costo': 'Cost Range ($/kg)',
      'prezzo': 'Cost Range ($/kg)',
      'fascia prezzo': 'Cost Range ($/kg)',

      'cost volatility': 'Cost Volatility',
      'volatilita costo': 'Cost Volatility',
      'variabilita prezzo': 'Cost Volatility',

      // Applications
      'primary applications': 'Primary Applications',
      'applicazioni principali': 'Primary Applications',
      'applicazioni': 'Primary Applications',
      'utilizzo': 'Primary Applications',
      'usi': 'Primary Applications',

      'main challenges': 'Main Challenges',
      'sfide principali': 'Main Challenges',
      'sfide': 'Main Challenges',
      'criticita': 'Main Challenges',

      'key opportunities': 'Key Opportunities',
      'opportunita chiave': 'Key Opportunities',
      'opportunita': 'Key Opportunities',

      // Data sources
      'data source 1': 'Data Source 1',
      'fonte dati 1': 'Data Source 1',
      'data source 1 date': 'Data Source 1 Date',
      'data fonte 1': 'Data Source 1 Date',
      'data source 1 url': 'Data Source 1 URL',
      'url fonte 1': 'Data Source 1 URL',
      'data source 2': 'Data Source 2',
      'fonte dati 2': 'Data Source 2',
      'data source 2 date': 'Data Source 2 Date',
      'data fonte 2': 'Data Source 2 Date',
      'data source 2 url': 'Data Source 2 URL',
      'url fonte 2': 'Data Source 2 URL',
      'data source 3': 'Data Source 3',
      'fonte dati 3': 'Data Source 3',
      'data source 3 date': 'Data Source 3 Date',
      'data fonte 3': 'Data Source 3 Date',
      'data source 3 url': 'Data Source 3 URL',
      'url fonte 3': 'Data Source 3 URL',
    };

    // Try exact match first
    if (exactMatchMap[cleaned]) {
      return exactMatchMap[cleaned];
    }

    // Step 3: KEYWORD MATCHING - Search for keywords in column name
    const keywordMatches = [
      // Material ID/Name
      { keywords: ['id', 'codice'], target: 'Material ID' },
      { keywords: ['materiale', 'material', 'nome', 'name', 'denominazione'], target: 'Material Name' },
      { keywords: ['categoria', 'category', 'tipo', 'type'], target: 'Category' },

      // Emissions/CO2
      { keywords: ['co2', 'ghg', 'emissioni', 'emissions', 'carbonio', 'carbon'], target: 'GHG Emissions (kg CO2e/kg)' },

      // Water
      { keywords: ['acqua', 'water', 'idrico', 'idrica'], target: 'Water Consumption (L/kg)' },

      // Energy
      { keywords: ['energia', 'energy', 'energetico', 'energetica'], target: 'Energy Use (MJ/kg)' },

      // Land/Soil
      { keywords: ['suolo', 'land', 'terreno'], target: 'Land Use' },

      // Cost/Price
      { keywords: ['costo', 'cost', 'prezzo', 'price'], target: 'Cost Range ($/kg)' },

      // Sustainability
      { keywords: ['sostenibilita', 'sustainability', 'sostenibile', 'sustainable'], target: 'Sustainability Score' },

      // Durability
      { keywords: ['durabilita', 'durability', 'durata', 'resistenza'], target: 'Durability' },

      // Applications
      { keywords: ['applicazioni', 'applications', 'utilizzo', 'usi', 'use'], target: 'Primary Applications' },
    ];

    for (const match of keywordMatches) {
      for (const keyword of match.keywords) {
        if (cleaned.includes(keyword)) {
          return match.target;
        }
      }
    }

    // Step 4: FALLBACK - Return original trimmed name if no match found
    return name.trim();
  };

  // Parse CSV file using PapaParseJS (more robust)
  const parseCSVFile = (content) => {
    if (!content || content.trim().length === 0) {
      throw new Error('Empty file');
    }

    // Use PapaParseJS for robust CSV parsing
    const parseResult = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep all as strings for now
      transformHeader: (header) => {
        // Normalize column names
        return normalizeColumnName(header);
      },
      // Auto-detect delimiter (comma, semicolon, tab, pipe)
      delimiter: '',
      // Handle encoding issues
      encoding: 'UTF-8',
      // Handle escaped quotes properly
      quoteChar: '"',
      escapeChar: '"',
    });

    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors);
      // Only throw if critical errors
      const criticalErrors = parseResult.errors.filter(err => err.type === 'Quotes' || err.type === 'FieldMismatch');
      if (criticalErrors.length > 0) {
        throw new Error(`CSV parsing error: ${criticalErrors[0].message}`);
      }
    }

    const materials = parseResult.data.filter(row => {
      // Filter out completely empty rows
      return Object.values(row).some(val => val && val.toString().trim());
    });

    if (materials.length === 0) {
      throw new Error('No valid data rows found in CSV');
    }

    return materials;
  };

  // Handle file upload (supports both CSV and SQL)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. VALIDATE FILE SIZE (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
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

  // Handle preview confirmation
  const handlePreviewConfirm = () => {
    if (!previewData) return;

    setMaterials(previewData);
    setFilteredMaterials(previewData);
    setShowPreview(false);

    // RESET FILTERS to show all imported materials
    setFilterCategory('all');
    setSearchQuery('');
    setSortBy('name');

    toast.success(
      `Successfully imported ${previewData.length} material${previewData.length > 1 ? 's' : ''}!`,
      { duration: 4000 }
    );

    setPreviewData(null);
    setPreviewFileName('');
  };

  // Handle preview cancellation
  const handlePreviewCancel = () => {
    // First hide the modal
    setShowPreview(false);

    // Then clean up state and show toast after a small delay
    setTimeout(() => {
      setPreviewData(null);
      setPreviewFileName('');
      toast('Import cancelled', {
        icon: 'ℹ️',
      });
    }, 100);
  };

  // Handle reload Supabase database
  const handleReloadSupabase = () => {
    if (supabaseMaterials.length === 0) {
      toast.error('No sustAId database available. Please check your connection.');
      return;
    }

    // Restore original Supabase data
    setMaterials(supabaseMaterials);
    setFilteredMaterials(supabaseMaterials);

    // Reset filters
    setFilterCategory('all');
    setSearchQuery('');
    setSortBy('name');

    toast.success(`Reloaded ${supabaseMaterials.length} materials from sustAId database!`, {
      duration: 3000,
    });
  };

  // Handle confirm modal actions
  const handleConfirmOk = () => {
    setShowConfirm(false);
    if (confirmCallback) {
      confirmCallback();
      setConfirmCallback(null);
    }
    setConfirmMessage('');
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    setConfirmCallback(null);
    setConfirmMessage('');
    toast('Upload cancelled - existing data preserved', {
      icon: 'ℹ️',
    });
  };

  // Filter and search materials
  useEffect(() => {
    let filtered = [...materials]; // Create a copy to avoid mutations
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(m => m.Category === filterCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(m =>
        (m['Material Name'] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.Category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m['Primary Applications'] || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort materials
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = (a['Material Name'] || '').toLowerCase();
        const nameB = (b['Material Name'] || '').toLowerCase();
        return nameA.localeCompare(nameB);
      } else if (sortBy === 'sustainability') {
        const scoreA = parseFloat(a['Sustainability Score']) || 0;
        const scoreB = parseFloat(b['Sustainability Score']) || 0;
        return scoreB - scoreA; // Highest first
      }
      return 0;
    });
    
    setFilteredMaterials(filtered);
  }, [materials, searchQuery, filterCategory, sortBy]);



  // Dashboard metrics
  const totalMaterials = materials.length;
  const categories = new Set(materials.map(m => m.Category)).size;
  const avgSustainability = materials.length > 0 
    ? materials.reduce((sum, m) => sum + (parseFloat(m['Sustainability Score']) || 0), 0) / materials.length 
    : 0;
  const highSustainability = materials.filter(m => parseFloat(m['Sustainability Score']) === 6).length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-green-200 opacity-30 rounded-full blur-3xl"></div>
          <div className="hidden sm:block absolute bottom-0 right-0 w-48 h-48 bg-blue-200 opacity-30 rounded-full blur-3xl"></div>
          <div className="hidden sm:block absolute top-1/2 left-1/2 w-28 h-28 bg-emerald-200 opacity-30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <AccessGate
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onClearAuthError={() => setAuthError('')}
            authBusy={authBusy}
            authError={authError}
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
          <p className="text-lg text-gray-600">Processing materials database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col overflow-y-auto">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Confirm Dialog Modal */}
      {showConfirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={handleConfirmOk}
          onCancel={handleConfirmCancel}
        />
      )}

      {/* Data Preview Modal */}
      {showPreview && previewData && (
        <DataPreviewModal
          data={previewData}
          fileName={previewFileName}
          onConfirm={handlePreviewConfirm}
          onCancel={handlePreviewCancel}
        />
      )}

      {/* Header */}
      <Header
        handleFileUpload={handleFileUpload}
        handleReloadSupabase={handleReloadSupabase}
        supabaseMaterials={supabaseMaterials}
        userEmail={session?.user?.email || ''}
        onLogout={handleLogout}
      />

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {materials.length === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 sm:p-8 mb-6">
            <div className="text-center">
              <Database className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2">Upload Your Materials Database</h3>
              <p className="text-sm sm:text-base text-gray-600">Click "Upload Data" above to load your sustainable materials data.</p>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            totalMaterials={totalMaterials}
            categories={categories}
            avgSustainability={avgSustainability}
            highSustainability={highSustainability}
          />
        )}

        {activeTab === 'database' && materials.length > 0 && (
          <MaterialsDatabase
            materials={materials}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredMaterials={filteredMaterials}
            exportToCSV={exportToCSV}
            exportToJSON={exportToJSON}
            getSustainabilityColor={getSustainabilityColor}
            setSelectedMaterialDetail={setSelectedMaterialDetail}
            selectedMaterialDetail={selectedMaterialDetail}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
          />
        )}

        {activeTab === 'methodology' && (
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Methodology</h2>
                <a
                  href="/Methodology.pdf"
                  download
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>

              {/* PDF Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-4 bg-gray-50 p-2 sm:p-3 rounded-lg sticky top-0 z-10 shadow-md">
                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(Math.max(pageNumber - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="flex items-center justify-center w-7 h-7 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs sm:text-sm text-gray-700 min-w-[80px] sm:min-w-[100px] text-center">
                    Page {pageNumber} of {numPages || '...'}
                  </span>
                  <button
                    onClick={() => goToPage(Math.min(pageNumber + 1, numPages || pageNumber))}
                    disabled={pageNumber >= numPages}
                    className="flex items-center justify-center w-7 h-7 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                    disabled={scale <= 0.5}
                    className="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs sm:text-sm text-gray-700 min-w-[50px] sm:min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
                    disabled={scale >= 2.0}
                    className="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setScale(1.0)}
                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    title="Reset zoom"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => goToPage(1)}
                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ml-1 sm:ml-2"
                    title="Torna all'inizio"
                  >
                    ⬆ Top
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4 w-full">
                <Document
                  file="/Methodology.pdf"
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
                      <span className="ml-2 text-gray-600">Loading PDF...</span>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center py-8 text-red-600">
                      <AlertCircle className="w-8 h-8 mr-2" />
                      <span>Failed to load PDF</span>
                    </div>
                  }
                  className="w-full"
                >
                  <div className="border border-gray-200 rounded-lg overflow-auto shadow-sm w-full max-h-[85vh] sm:max-h-[70vh]">
                    <div className="flex flex-col items-center space-y-4 p-4">
                      {Array.from(new Array(numPages), (el, index) => (
                        <div
                          key={`page_${index + 1}`}
                          ref={el => pageRefs.current[index] = el}
                          className="shadow-lg"
                        >
                          <Page
                            pageNumber={index + 1}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="max-w-full"
                            width={(isSmallScreen ? Math.max(viewportWidth - 40, 280) : Math.min(viewportWidth - 200, 1400)) * scale}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Document>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'download' && <DownloadApp />}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {materials.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Upload your materials database to view LCA analytics.</p>
              </div>
            ) : (
              <>
                {/* Material Selection for Analytics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Select Materials to Analyze</h2>

                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search materials..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={analyticsSearchQuery}
                        onChange={(e) => setAnalyticsSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Materials Grid with Enhanced Scrollbar */}
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-2"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#10b981 #e5e7eb'
                    }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        width: 12px;
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
                    {materials
                      .filter(material =>
                        !analyticsSearchQuery ||
                        (material['Material Name'] || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase()) ||
                        (material.Category || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase())
                      )
                      .sort((a, b) => {
                        const nameA = (a['Material Name'] || '').toLowerCase();
                        const nameB = (b['Material Name'] || '').toLowerCase();
                        return nameA.localeCompare(nameB);
                      })
                      .map((material, index) => (
                        <label key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedAnalyticsMaterials.includes(material['Material Name'])}
                            onChange={(e) => {
                              const materialName = material['Material Name'];
                              if (e.target.checked) {
                                setSelectedAnalyticsMaterials(prev => [...prev, materialName]);
                              } else {
                                setSelectedAnalyticsMaterials(prev => prev.filter(name => name !== materialName));
                              }
                            }}
                            className="text-green-600 w-4 h-4"
                          />
                          <span className="text-xs text-gray-700 flex-1">{material['Material Name']}</span>
                        </label>
                      ))}
                  </div>

                  {/* Footer with counters and buttons */}
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {selectedAnalyticsMaterials.length} materials selected
                      {analyticsSearchQuery && (
                        <span className="ml-2 text-green-600">
                          ({materials.filter(m =>
                            (m['Material Name'] || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase()) ||
                            (m.Category || '').toLowerCase().includes(analyticsSearchQuery.toLowerCase())
                          ).length} found)
                        </span>
                      )}
                    </p>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedAnalyticsMaterials(selectedMaterials)}
                        disabled={selectedMaterials.length === 0}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          selectedMaterials.length === 0
                            ? 'bg-blue-300 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Load Compare ({selectedMaterials.length})
                      </button>
                      <button
                        onClick={() => setSelectedAnalyticsMaterials(materials.map(m => m['Material Name']))}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAnalyticsMaterials([]);
                          setAnalyticsSearchQuery('');
                        }}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>

                {selectedAnalyticsMaterials.length === 0 ? (
                  <div className="text-center py-8">
                    <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Select materials above to view comparative analytics.</p>
                  </div>
                ) : (
                  <>
                    {/* Category Distribution Pie Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6" id="category-distribution-chart">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                          Materials Distribution by Category
                        </h2>
                        <ChartExportButtons
                          chartId="category-distribution-chart"
                          filename="category_distribution"
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={400}>
                        <RechartsPieChart>
                          <Pie
                            data={(() => {
                              const categoryCount = {};
                              materials
                                .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                                .forEach(material => {
                                  const category = material.Category || 'Unknown';
                                  categoryCount[category] = (categoryCount[category] || 0) + 1;
                                });

                              const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

                              return Object.entries(categoryCount).map(([category, count], index) => ({
                                name: category,
                                value: count,
                                fill: colors[index % colors.length]
                              }));
                            })()}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={120}
                            dataKey="value"
                          >
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Environmental Impact Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* GHG Emissions */}
                      <div className="bg-white rounded-xl shadow-lg p-6" id="ghg-emissions-chart">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-bold text-gray-900">GHG Emissions Comparison</h2>
                          <ChartExportButtons
                            chartId="ghg-emissions-chart"
                            filename="ghg_emissions_comparison"
                          />
                        </div>
                        <MissingDataWarning
                          excludedMaterials={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .filter(material => {
                              const ghgStr = String(material['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                              // 0 is a valid value (zero emissions), only N/A or missing data is invalid
                              return ghgStr.includes('N/A') || !ghgStr.match(/[\d.]+/);
                            })
                            .map(material => ({ name: material['Material Name'], reason: 'no GHG data' }))}
                        />
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => ({
                              name: (material['Material Name'] || '').length > 8 ?
                                     (material['Material Name'] || '').substring(0, 8) + '...' :
                                     (material['Material Name'] || ''),
                              fullName: material['Material Name'] || '',
                              ghg: (() => {
                                const ghgStr = String(material['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                                // Check for N/A - return null to exclude from chart
                                if (ghgStr.includes('N/A') || !ghgStr.match(/[\d.]+/)) return null;
                                const match = ghgStr.match(/[\d.]+/);
                                return match ? parseFloat(match[0]) : null;
                              })()
                            }))
                            .filter(item => item.ghg !== null) // Include 0, exclude only null (N/A)
                            .sort((a, b) => a.ghg - b.ghg)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip unit="kg CO2e/kg" />} />
                            <Bar dataKey="ghg" fill="#ef4444" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Water Consumption */}
                      <div className="bg-white rounded-xl shadow-lg p-6" id="water-consumption-chart">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-bold text-gray-900">Water Consumption Comparison</h2>
                          <ChartExportButtons
                            chartId="water-consumption-chart"
                            filename="water_consumption_comparison"
                          />
                        </div>
                        <MissingDataWarning
                          excludedMaterials={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .filter(material => {
                              const waterStr = String(material['Water Consumption (L/kg)'] || '').toUpperCase();
                              // 0 is a valid value (zero water consumption), only N/A or missing data is invalid
                              return waterStr.includes('N/A') || !waterStr.match(/[\d.]+/);
                            })
                            .map(material => ({ name: material['Material Name'], reason: 'no water data' }))}
                        />
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => ({
                              name: (material['Material Name'] || '').length > 8 ?
                                     (material['Material Name'] || '').substring(0, 8) + '...' :
                                     (material['Material Name'] || ''),
                              fullName: material['Material Name'] || '',
                              water: (() => {
                                const waterStr = String(material['Water Consumption (L/kg)'] || '').toUpperCase();
                                // Check for N/A - return null to exclude from chart
                                if (waterStr.includes('N/A') || !waterStr.match(/[\d.]+/)) return null;
                                const match = waterStr.match(/[\d.]+/);
                                return match ? parseFloat(match[0]) : null;
                              })()
                            }))
                            .filter(item => item.water !== null) // Include 0, exclude only null (N/A)
                            .sort((a, b) => a.water - b.water)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip unit="L/kg" />} />
                            <Bar dataKey="water" fill="#06b6d4" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Energy Consumption */}
                      <div className="bg-white rounded-xl shadow-lg p-6" id="energy-consumption-chart">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-bold text-gray-900">Energy Consumption Comparison</h2>
                          <ChartExportButtons
                            chartId="energy-consumption-chart"
                            filename="energy_consumption_comparison"
                          />
                        </div>
                        <MissingDataWarning
                          excludedMaterials={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .filter(material => {
                              const energyStr = String(material['Energy Use (MJ/kg)'] || '').toUpperCase();
                              // 0 is a valid value (zero energy consumption), only N/A or missing data is invalid
                              return energyStr.includes('N/A') || !energyStr.match(/[\d.]+/);
                            })
                            .map(material => ({ name: material['Material Name'], reason: 'no energy data' }))}
                        />
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => ({
                              name: (material['Material Name'] || '').length > 8 ?
                                     (material['Material Name'] || '').substring(0, 8) + '...' :
                                     (material['Material Name'] || ''),
                              fullName: material['Material Name'] || '',
                              energy: (() => {
                                const energyStr = String(material['Energy Use (MJ/kg)'] || '').toUpperCase();
                                // Check for N/A - return null to exclude from chart
                                if (energyStr.includes('N/A') || !energyStr.match(/[\d.]+/)) return null;
                                const match = energyStr.match(/[\d.]+/);
                                return match ? parseFloat(match[0]) : null;
                              })()
                            }))
                            .filter(item => item.energy !== null) // Include 0, exclude only null (N/A)
                            .sort((a, b) => a.energy - b.energy)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip unit="MJ/kg" />} />
                            <Bar dataKey="energy" fill="#f59e0b" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Fossil Fuel Consumption */}
                      <div className="bg-white rounded-xl shadow-lg p-6" id="fuel-consumption-chart">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Fossil Fuel Consumption Comparison</h2>
                            <p className="text-sm text-gray-600">Fuel consumption levels (0=N/A, 1=Very Low, 6=Very High)</p>
                          </div>
                          <ChartExportButtons
                            chartId="fuel-consumption-chart"
                            filename="fuel_consumption_comparison"
                          />
                        </div>
                        {/* Fuel Consumption is qualitative - always present, no N/A warning needed */}
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => ({
                              name: (material['Material Name'] || '').length > 8 ?
                                     (material['Material Name'] || '').substring(0, 8) + '...' :
                                     (material['Material Name'] || ''),
                              fullName: material['Material Name'] || '',
                              fuel: (() => {
                                const fuelStr = String(material['Fuel Consumption (MJ/kg)'] || '').toLowerCase().trim();

                                // Check if it's a number first
                                const num = parseFloat(fuelStr);
                                if (!isNaN(num)) {
                                  return Math.max(1, Math.min(num, 6));
                                }

                                // Convert qualitative values to 1-6 scale
                                if (fuelStr.includes('veryhigh') || fuelStr.includes('very high')) return 6;
                                if (fuelStr.includes('high')) return 5;
                                if (fuelStr.includes('mediumhigh') || fuelStr.includes('medium-high') || fuelStr.includes('medium high')) return 4.5;
                                if (fuelStr.includes('medium') || fuelStr.includes('moderate')) return 3.5;
                                if (fuelStr.includes('mediumlow') || fuelStr.includes('medium-low') || fuelStr.includes('medium low')) return 2.5;
                                if (fuelStr.includes('low')) return 2;
                                if (fuelStr.includes('verylow') || fuelStr.includes('very low')) return 1;

                                return 0;
                              })()
                            }))
                            .filter(item => item.fuel > 0)
                            .sort((a, b) => a.fuel - b.fuel)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                            <YAxis domain={[0, 6]} />
                            <Tooltip content={<CustomTooltip unit="/6" />} />
                            <Bar dataKey="fuel" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Sustainability Score Evaluation */}
                    <div className="bg-white rounded-xl shadow-lg p-6" id="sustainability-evaluation-chart">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Sustainability Score Evaluation
                          </h2>
                          <p className="text-sm text-gray-600">Sustainability scores of selected materials</p>
                        </div>
                        <ChartExportButtons
                          chartId="sustainability-evaluation-chart"
                          filename="sustainability_score_evaluation"
                        />
                      </div>
                      <MissingDataWarning
                        excludedMaterials={materials
                          .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                          .filter(material => {
                            const score = parseFloat(material['Sustainability Score']) || 0;
                            const scoreStr = String(material['Sustainability Score'] || '').toUpperCase();
                            return score === 0 || scoreStr.includes('N/A');
                          })
                          .map(material => ({ name: material['Material Name'], reason: 'no sustainability score' }))}
                      />
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={(() => {
                          const selectedMats = materials.filter(m => selectedAnalyticsMaterials.includes(m['Material Name']));

                          return selectedMats.map(material => {
                            const score = parseFloat(material['Sustainability Score']) || 0;

                            // Determine color based on score
                            let color;
                            if (score >= 8) color = '#10b981'; // Green - High
                            else if (score >= 6) color = '#84cc16'; // Lime - Medium-High
                            else if (score >= 4) color = '#f59e0b'; // Yellow - Medium
                            else if (score >= 2) color = '#f97316'; // Orange - Low-Medium
                            else color = '#ef4444'; // Red - Low

                            return {
                              name: material['Material Name'],
                              fullName: material['Material Name'],
                              score: score,
                              fill: color
                            };
                          }).sort((a, b) => b.score - a.score); // Sort by score descending
                        })()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={120}
                            interval={0}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis
                            label={{ value: 'Sustainability Score', angle: -90, position: 'insideLeft', fontSize: 12 }}
                            domain={[0, 10]}
                          />
                          <Tooltip content={<CustomTooltip unit="" />} />
                          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                            {(() => {
                              const selectedMats = materials.filter(m => selectedAnalyticsMaterials.includes(m['Material Name']));
                              return selectedMats.map((material, index) => {
                                const score = parseFloat(material['Sustainability Score']) || 0;
                                let color;
                                if (score >= 8) color = '#10b981';
                                else if (score >= 6) color = '#84cc16';
                                else if (score >= 4) color = '#f59e0b';
                                else if (score >= 2) color = '#f97316';
                                else color = '#ef4444';
                                return <Cell key={`cell-${index}`} fill={color} />;
                              });
                            })()}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Interpretation:</strong> This chart displays the sustainability score for each selected material.
                          Materials are sorted from highest to lowest score. Green bars indicate highly sustainable materials (8-10), while red bars indicate low sustainability (0-2).
                        </p>
                      </div>
                    </div>

                    {/* Multi-criteria Analysis */}
                    <div className="bg-white rounded-xl shadow-lg p-6" id="multi-criteria-chart">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                          Multi-Criteria Analysis: Durability vs Environmental Impact
                        </h2>
                        <ChartExportButtons
                          chartId="multi-criteria-chart"
                          filename="multi_criteria_analysis"
                        />
                      </div>
                      {/* Multi-criteria uses only QUALITATIVE fields (Durability, Environmental Impact) - always present
                          No N/A warning needed since these fields are always populated */}
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={(() => {
                          // Map materials to data points
                          const dataPoints = materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => ({
                              name: material['Material Name'],
                              durability: (() => {
                                const durStr = (material['Durability'] || '').toLowerCase().trim();
                                if (durStr.includes('very high')) return 6;
                                if (durStr.includes('medium-high') || durStr.includes('medium high')) return 4;
                                if (durStr === 'high' || (durStr.includes('high') && !durStr.includes('medium'))) return 5;
                                if (durStr === 'medium' || (durStr.includes('medium') && !durStr.includes('low') && !durStr.includes('high'))) return 3;
                                if (durStr.includes('medium-low') || durStr.includes('medium low')) return 2;
                                if (durStr.includes('low') && !durStr.includes('medium')) return 1;
                                return 0;
                              })(),
                              durabilityLabel: material['Durability'] || 'N/A',
                              environmentalImpact: (() => {
                                const envStr = (material['Environmental_Sustainability'] || '').toLowerCase().trim();
                                if (envStr.includes('very high')) return 6;
                                if (envStr.includes('medium-high') || envStr.includes('medium high')) return 4;
                                if (envStr === 'high' || (envStr.includes('high') && !envStr.includes('medium'))) return 5;
                                if (envStr === 'medium' || (envStr.includes('medium') && !envStr.includes('low') && !envStr.includes('high'))) return 3;
                                if (envStr.includes('medium-low') || envStr.includes('medium low')) return 2;
                                if (envStr.includes('low') && !envStr.includes('medium')) return 1;
                                return 0;
                              })(),
                              environmentalImpactLabel: material['Environmental_Sustainability'] || 'N/A'
                            }))
                            .filter(item => item.environmentalImpact > 0 && item.durability > 0);

                          // Group materials with same coordinates
                          const grouped = {};
                          dataPoints.forEach(item => {
                            const key = `${item.durability}-${item.environmentalImpact}`;
                            if (!grouped[key]) {
                              grouped[key] = {
                                durability: item.durability,
                                environmentalImpact: item.environmentalImpact,
                                durabilityLabel: item.durabilityLabel,
                                environmentalImpactLabel: item.environmentalImpactLabel,
                                materials: []
                              };
                            }
                            grouped[key].materials.push(item.name);
                          });

                          return Object.values(grouped);
                        })()}>
                          <CartesianGrid />
                          <XAxis type="number" dataKey="durability" name="Durability" domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} />
                          <YAxis type="number" dataKey="environmentalImpact" name="Environmental Impact" domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs">
                                    <p className="font-bold text-gray-900 mb-2">
                                      {data.materials.length > 1
                                        ? `${data.materials.length} Materials`
                                        : data.materials[0]}
                                    </p>
                                    {data.materials.length > 1 && (
                                      <div className="mb-2 max-h-32 overflow-y-auto">
                                        {data.materials.map((mat, idx) => (
                                          <p key={idx} className="text-xs text-gray-600">• {mat}</p>
                                        ))}
                                      </div>
                                    )}
                                    <p className="text-sm text-gray-700">
                                      Durability: <span className="font-semibold">{data.durabilityLabel} ({data.durability}/6)</span>
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      Environmental Impact: <span className="font-semibold">{data.environmentalImpactLabel} ({data.environmentalImpact}/6)</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Scatter name="Materials" dataKey="environmentalImpact" fill="#3b82f6" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* ComposedChart: Cost vs Sustainability Correlation */}
                    <div className="bg-white rounded-xl shadow-lg p-6" id="cost-sustainability-chart">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Cost vs Sustainability Correlation
                          </h2>
                          <p className="text-sm text-gray-600">Analyzing the relationship between material cost and sustainability score</p>
                        </div>
                        <ChartExportButtons
                          chartId="cost-sustainability-chart"
                          filename="cost_sustainability_correlation"
                        />
                      </div>
                      {/* Warning for excluded materials */}
                      <MissingDataWarning
                        excludedMaterials={(() => {
                          const allMaterialsData = materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => {
                              const costStr = String(material['Cost Range ($/kg)'] || '').toUpperCase();
                              const sustainStr = String(material['Sustainability Score'] || '').toUpperCase();

                              return {
                                name: material['Material Name'],
                                cost: (() => {
                                  if (costStr.includes('N/A')) return 0;
                                  const match = costStr.match(/[\d.]+/);
                                  return match ? parseFloat(match[0]) : 0;
                                })(),
                                sustainability: (() => {
                                  if (sustainStr.includes('N/A')) return 0;
                                  return parseFloat(material['Sustainability Score']) || 0;
                                })(),
                                hasCostNA: costStr.includes('N/A'),
                                hasSustainNA: sustainStr.includes('N/A')
                              };
                            });

                          return allMaterialsData
                            .filter(item => item.cost <= 0 || item.sustainability <= 0)
                            .map(material => {
                              const reasons = [];
                              if (material.cost <= 0) reasons.push('no cost');
                              if (material.sustainability <= 0) reasons.push('no score');
                              return {
                                name: material.name,
                                reason: reasons.join(', ')
                              };
                            });
                        })()}
                      />
                      <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart
                          data={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => ({
                              name: (material['Material Name'] || '').length > 10 ?
                                     (material['Material Name'] || '').substring(0, 10) + '...' :
                                     (material['Material Name'] || ''),
                              fullName: material['Material Name'],
                              cost: (() => {
                                const costStr = material['Cost Range ($/kg)'] || '';
                                const match = costStr.match(/[\d.]+/);
                                return match ? parseFloat(match[0]) : 0;
                              })(),
                              sustainability: parseFloat(material['Sustainability Score']) || 0
                            }))
                            .filter(item => item.cost > 0 && item.sustainability > 0)
                            .sort((a, b) => b.cost - a.cost)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={10}
                            label={{ value: 'Material Name', position: 'insideBottom', offset: -10, fontSize: 12 }}
                          />
                          <YAxis
                            yAxisId="left"
                            label={{ value: 'Cost ($/kg)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 10]}
                            label={{ value: 'Sustainability Score', angle: 90, position: 'insideRight', fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value, name, props) => {
                              if (name === 'cost') {
                                return [`$${value}/kg`, 'Cost'];
                              } else if (name === 'sustainability') {
                                return [value, 'Sustainability Score'];
                              }
                              return [value, name];
                            }}
                            labelFormatter={(label, payload) => {
                              if (payload && payload.length > 0) {
                                return `Material: ${payload[0].payload.fullName}`;
                              }
                              return label;
                            }}
                          />
                          <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => {
                              if (value === 'cost') return 'Cost ($/kg)';
                              if (value === 'sustainability') return 'Sustainability Score';
                              return value;
                            }}
                          />
                          <Bar yAxisId="left" dataKey="cost" fill="#8b5cf6" name="cost" />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="sustainability"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', r: 5 }}
                            name="sustainability"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Interpretation:</strong> This chart shows the trade-off between cost and sustainability.
                          Higher sustainability scores with lower costs indicate optimal material choices.
                          Materials are sorted by cost from highest to lowest (left to right).
                        </p>
                      </div>
                    </div>

                    {/* Radar Charts Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Radar Charts - Material Profiles</h2>
                      <p className="text-sm text-gray-600 mb-6">Multi-dimensional comparison of material properties</p>
                    </div>

                    {/* Single Material Environmental Profile */}
                    {selectedAnalyticsMaterials.length > 0 && (
                      <div className="bg-white rounded-xl shadow-lg p-6" id="radar-single-chart">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                              Single Material Environmental Profile (Normalized)
                            </h2>
                            <p className="text-sm text-gray-600 mb-3">Select a material to view its environmental profile</p>
                            <select
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                              value={singleRadarMaterial}
                              onChange={(e) => setSingleRadarMaterial(e.target.value)}
                            >
                              <option value="">Choose a material...</option>
                              {selectedAnalyticsMaterials.map(matName => (
                                <option key={matName} value={matName}>{matName}</option>
                              ))}
                            </select>
                          </div>
                          {singleRadarMaterial && (
                            <ChartExportButtons
                              chartId="radar-single-chart"
                              filename="radar_single_material_profile"
                            />
                          )}
                        </div>
                        {singleRadarMaterial ? (
                          <>
                            <MissingDataWarning
                              excludedMaterials={(() => {
                                const selectedMat = materials.find(m => m['Material Name'] === singleRadarMaterial);
                                if (!selectedMat) return [];

                                const missingMetrics = [];
                                // Only check QUANTITATIVE fields (can be N/A)
                                const sustainability = parseFloat(selectedMat['Sustainability Score']) || 0;
                                const ghgStr = String(selectedMat['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                                const waterStr = String(selectedMat['Water Consumption (L/kg)'] || '').toUpperCase();
                                const energyStr = String(selectedMat['Energy Use (MJ/kg)'] || '').toUpperCase();

                                if (sustainability === 0 || String(selectedMat['Sustainability Score']).toUpperCase().includes('N/A')) {
                                  missingMetrics.push('Sustainability Score');
                                }
                                if (!ghgStr.match(/[\d.]+/) || ghgStr.includes('N/A')) {
                                  missingMetrics.push('GHG Emissions');
                                }
                                if (!waterStr.match(/[\d.]+/) || waterStr.includes('N/A')) {
                                  missingMetrics.push('Water Consumption');
                                }
                                if (!energyStr.match(/[\d.]+/) || energyStr.includes('N/A')) {
                                  missingMetrics.push('Energy Use');
                                }
                                // Fuel Consumption is QUALITATIVE - always present, no check needed

                                if (missingMetrics.length > 0) {
                                  return [{ name: singleRadarMaterial, reason: missingMetrics.join(', ') }];
                                }
                                return [];
                              })()}
                            />
                            <ResponsiveContainer width="100%" height={400}>
                            <RadarChart data={(() => {
                              const selectedMat = materials.find(m => m['Material Name'] === singleRadarMaterial);
                              if (!selectedMat) return [];

                              // Helper function to keep values on 0-6 scale
                              const normalize = (value) => {
                                if (!value) return 0;
                                // Check for explicit N/A string
                                if (String(value).toUpperCase().includes('N/A')) return 0;
                                const num = parseFloat(value);
                                if (!isNaN(num)) {
                                  return Math.max(0, Math.min(num, 6));
                                }
                                return 0;
                              };

                              return [
                                { metric: 'Sustainability', value: normalize(selectedMat['Sustainability Score']) },
                                { metric: 'Low GHG', value: (() => {
                                  const ghgStr = String(selectedMat['GHG Emissions (kg CO2e/kg)'] || '');
                                  // Check for N/A - return 0 (no data)
                                  if (ghgStr.toUpperCase().includes('N/A')) return 0;
                                  const match = ghgStr.match(/[\d.]+/);
                                  const ghg = match ? parseFloat(match[0]) : 0;
                                  return Math.max(0, Math.min(6, 7 - (ghg / 10)));
                                })() },
                                { metric: 'Low Water', value: (() => {
                                  const waterStr = String(selectedMat['Water Consumption (L/kg)'] || '');
                                  // Check for N/A - return 0 (no data)
                                  if (waterStr.toUpperCase().includes('N/A')) return 0;
                                  const match = waterStr.match(/[\d.]+/);
                                  const water = match ? parseFloat(match[0]) : 0;
                                  return Math.max(0, Math.min(6, 7 - (water / 200)));
                                })() },
                                { metric: 'Low Energy', value: (() => {
                                  const energyStr = String(selectedMat['Energy Use (MJ/kg)'] || '');
                                  // Check for N/A - return 0 (no data)
                                  if (energyStr.toUpperCase().includes('N/A')) return 0;
                                  const match = energyStr.match(/[\d.]+/);
                                  const energy = match ? parseFloat(match[0]) : 0;
                                  return Math.max(0, Math.min(6, 7 - (energy / 20)));
                                })() },
                                { metric: 'Low Fossil Fuel', value: (() => {
                                  const fuelStr = String(selectedMat['Fuel Consumption (MJ/kg)'] || '').toLowerCase().trim();

                                  // Check if it's a number first
                                  const match = fuelStr.match(/[\d.]+/);
                                  if (match) {
                                    const fuel = parseFloat(match[0]);
                                    return Math.max(0, Math.min(6, 7 - (fuel / 20)));
                                  }

                                  // Handle qualitative values (inverted: Very High fuel = Low score)
                                  if (fuelStr.includes('veryhigh') || fuelStr.includes('very high')) return 1;
                                  if (fuelStr.includes('high') && !fuelStr.includes('medium')) return 2;
                                  if (fuelStr.includes('mediumhigh') || fuelStr.includes('medium-high') || fuelStr.includes('medium high')) return 2.5;
                                  if (fuelStr.includes('medium') && !fuelStr.includes('low') && !fuelStr.includes('high')) return 3.5;
                                  if (fuelStr.includes('mediumlow') || fuelStr.includes('medium-low') || fuelStr.includes('medium low')) return 4.5;
                                  if (fuelStr.includes('low') && !fuelStr.includes('medium')) return 5;
                                  if (fuelStr.includes('verylow') || fuelStr.includes('very low')) return 6;

                                  return 0;
                                })() }
                              ];
                            })()}>
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis dataKey="metric" tick={{ fill: '#374151', fontSize: 12 }} />
                              <PolarRadiusAxis angle={90} domain={[0, 6]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                              <Radar
                                name={singleRadarMaterial}
                                dataKey="value"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.6}
                                strokeWidth={2}
                              />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Select a material from the dropdown above to view its profile</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Radar Type 1: Multi Material Environmental Profile (normalized values) */}
                    {selectedAnalyticsMaterials.length > 0 && (
                      <div className="bg-white rounded-xl shadow-lg p-6" id="radar-1-chart">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">
                              Multi Material Environmental Profile (Normalized)
                            </h2>
                            <p className="text-sm text-gray-600">Shows all selected materials with metrics on 1-6 scale</p>
                          </div>
                          <ChartExportButtons
                            chartId="radar-1-chart"
                            filename="radar_multi_material_profile"
                          />
                        </div>
                        <MissingDataWarning
                          excludedMaterials={materials
                            .filter(material => selectedAnalyticsMaterials.includes(material['Material Name']))
                            .map(material => {
                              const missingMetrics = [];
                              // Only check QUANTITATIVE fields (can be N/A)
                              const sustainability = parseFloat(material['Sustainability Score']) || 0;
                              const ghgStr = String(material['GHG Emissions (kg CO2e/kg)'] || '').toUpperCase();
                              const waterStr = String(material['Water Consumption (L/kg)'] || '').toUpperCase();
                              const energyStr = String(material['Energy Use (MJ/kg)'] || '').toUpperCase();

                              if (sustainability === 0 || String(material['Sustainability Score']).toUpperCase().includes('N/A')) {
                                missingMetrics.push('Sustainability');
                              }
                              if (!ghgStr.match(/[\d.]+/) || ghgStr.includes('N/A')) {
                                missingMetrics.push('GHG');
                              }
                              if (!waterStr.match(/[\d.]+/) || waterStr.includes('N/A')) {
                                missingMetrics.push('Water');
                              }
                              if (!energyStr.match(/[\d.]+/) || energyStr.includes('N/A')) {
                                missingMetrics.push('Energy');
                              }
                              // Fuel Consumption is QUALITATIVE - always present, no check needed

                              return { name: material['Material Name'], metrics: missingMetrics };
                            })
                            .filter(item => item.metrics.length > 0)
                            .map(item => ({ name: item.name, reason: item.metrics.join(', ') }))}
                        />
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart data={(() => {
                            const selectedMats = materials.filter(m => selectedAnalyticsMaterials.includes(m['Material Name']));

                            // Helper function to keep values on 0-6 scale
                            const normalize = (value) => {
                              if (!value) return 0;
                              // Check for explicit N/A string
                              if (String(value).toUpperCase().includes('N/A')) return 0;
                              const num = parseFloat(value);
                              if (!isNaN(num)) {
                                return Math.max(0, Math.min(num, 6));
                              }
                              return 0;
                            };

                            return [
                              { metric: 'Sustainability', ...Object.fromEntries(selectedMats.map(m => [m['Material Name'], normalize(m['Sustainability Score'])])) },
                              { metric: 'Low GHG', ...Object.fromEntries(selectedMats.map(m => {
                                const ghgStr = String(m['GHG Emissions (kg CO2e/kg)'] || '');
                                // Check for N/A - return 0 (no data)
                                if (ghgStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                                const match = ghgStr.match(/[\d.]+/);
                                const ghg = match ? parseFloat(match[0]) : 0;
                                return [m['Material Name'], Math.max(0, Math.min(6, 7 - (ghg / 10)))];
                              })) },
                              { metric: 'Low Water', ...Object.fromEntries(selectedMats.map(m => {
                                const waterStr = String(m['Water Consumption (L/kg)'] || '');
                                // Check for N/A - return 0 (no data)
                                if (waterStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                                const match = waterStr.match(/[\d.]+/);
                                const water = match ? parseFloat(match[0]) : 0;
                                return [m['Material Name'], Math.max(0, Math.min(6, 7 - (water / 200)))];
                              })) },
                              { metric: 'Low Energy', ...Object.fromEntries(selectedMats.map(m => {
                                const energyStr = String(m['Energy Use (MJ/kg)'] || '');
                                // Check for N/A - return 0 (no data)
                                if (energyStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                                const match = energyStr.match(/[\d.]+/);
                                const energy = match ? parseFloat(match[0]) : 0;
                                return [m['Material Name'], Math.max(0, Math.min(6, 7 - (energy / 20)))];
                              })) },
                              { metric: 'Low Fossil Fuel', ...Object.fromEntries(selectedMats.map(m => {
                                const fuelStr = String(m['Fuel Consumption (MJ/kg)'] || '').toLowerCase().trim();

                                // Check if it's a number first
                                const match = fuelStr.match(/[\d.]+/);
                                if (match) {
                                  const fuel = parseFloat(match[0]);
                                  return [m['Material Name'], Math.max(0, Math.min(6, 7 - (fuel / 20)))];
                                }

                                // Handle qualitative values (inverted: Very High fuel = Low score)
                                if (fuelStr.includes('veryhigh') || fuelStr.includes('very high')) return [m['Material Name'], 1];
                                if (fuelStr.includes('high') && !fuelStr.includes('medium')) return [m['Material Name'], 2];
                                if (fuelStr.includes('mediumhigh') || fuelStr.includes('medium-high') || fuelStr.includes('medium high')) return [m['Material Name'], 2.5];
                                if (fuelStr.includes('medium') && !fuelStr.includes('low') && !fuelStr.includes('high')) return [m['Material Name'], 3.5];
                                if (fuelStr.includes('mediumlow') || fuelStr.includes('medium-low') || fuelStr.includes('medium low')) return [m['Material Name'], 4.5];
                                if (fuelStr.includes('low') && !fuelStr.includes('medium')) return [m['Material Name'], 5];
                                if (fuelStr.includes('verylow') || fuelStr.includes('very low')) return [m['Material Name'], 6];

                                return [m['Material Name'], 0];
                              })) }
                            ];
                          })()}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: '#374151', fontSize: 12 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 6]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                            {selectedAnalyticsMaterials.map((matName, idx) => (
                              <Radar
                                key={matName}
                                name={matName}
                                dataKey={matName}
                                stroke={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'][idx % 8]}
                                fill={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'][idx % 8]}
                                fillOpacity={0.3}
                              />
                            ))}
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-6">
            {selectedMaterials.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Material Comparison</h2>
                <p className="text-gray-600">Select materials from the database to compare them here.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Comparison</h2>
                      <p className="text-sm text-gray-600">Comparing {selectedMaterials.length} materials</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const comparedMaterials = materials.filter(m => selectedMaterials.includes(m['Material Name']));
                          exportToCSV(comparedMaterials, 'materials_comparison');
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>CSV</span>
                      </button>
                      <button
                        onClick={() => {
                          const comparedMaterials = materials.filter(m => selectedMaterials.includes(m['Material Name']));
                          exportToJSON(comparedMaterials, 'materials_comparison');
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={() => setSelectedMaterials([])}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Comparison Table - FIRST */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Detailed Property Comparison</h2>
                    {selectedMaterials.length > 4 && (
                      <div className="flex items-center space-x-2 text-blue-600 animate-pulse">
                        <span className="text-sm font-medium">Scroll horizontally to view all materials</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    {/* Gradient shadows for scroll indication */}
                    {selectedMaterials.length > 4 && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
                      </>
                    )}
                    <div className="overflow-x-auto pb-2" style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#10b981 #e5e7eb'
                    }}>
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          height: 14px;
                        }
                        div::-webkit-scrollbar-track {
                          background: #f1f1f1;
                          border-radius: 10px;
                        }
                        div::-webkit-scrollbar-thumb {
                          background: #10b981;
                          border-radius: 10px;
                          border: 2px solid #f1f1f1;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                          background: #059669;
                        }
                      `}</style>
                    <table className={`divide-y divide-gray-200 ${selectedMaterials.length <= 4 ? 'w-full' : 'min-w-max'}`}>
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Property</th>
                          {selectedMaterials.map(materialName => (
                            <th key={materialName} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                              <div className="flex items-center justify-between">
                                <span>{materialName}</span>
                                <button
                                  onClick={() => setSelectedMaterials(prev => prev.filter(name => name !== materialName))}
                                  className="ml-2 text-red-600 hover:text-red-800 font-bold text-lg"
                                  title="Remove from comparison"
                                >
                                  ×
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          'Sustainability Score',
                          'Environmental_Sustainability',
                          'GHG Emissions (kg CO2e/kg)',
                          'Water Consumption (L/kg)',
                          'Energy Use (MJ/kg)',
                          'Social Sustainability',
                          'Governance',
                          'Durability',
                          'Tensile Strength (MPa)',
                          'Chemical Resistance',
                          'Comfort Level'
                        ].map(property => {
                          // Calculate the highest Sustainability Score for highlighting
                          let highestScore = -Infinity;
                          if (property === 'Sustainability Score') {
                            selectedMaterials.forEach(materialName => {
                              const material = materials.find(m => m['Material Name'] === materialName);
                              const score = parseFloat(material?.['Sustainability Score']) || 0;
                              if (score > highestScore) {
                                highestScore = score;
                              }
                            });
                          }

                          return (
                            <tr key={property}>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900 w-48">{property.replace('_', ' ')}</td>
                              {selectedMaterials.map(materialName => {
                                const material = materials.find(m => m['Material Name'] === materialName);
                                const value = material?.[property] || 'N/A';

                                // Check if this is the highest Sustainability Score
                                const isHighestScore = property === 'Sustainability Score' &&
                                  parseFloat(material?.['Sustainability Score']) === highestScore &&
                                  highestScore > 0;

                                // Apply fixed width for Comfort Level with wrapping
                                const cellClass = property === 'Comfort Level'
                                  ? 'px-6 py-4 text-sm max-w-xs'
                                  : 'px-6 py-4 whitespace-nowrap text-sm';

                                return (
                                  <td
                                    key={materialName}
                                    className={`${cellClass} ${isHighestScore ? 'bg-green-100 font-bold text-green-800' : 'text-gray-900'}`}
                                  >
                                    {value}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>

                {/* Radar Chart Comparison */}
                <div className="bg-white rounded-xl shadow-lg p-6" id="radar-comparison-chart">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Multi-Dimensional Radar Comparison</h2>
                      <p className="text-sm text-gray-600">Overall material profile comparison</p>
                    </div>
                    <ChartExportButtons
                      chartId="radar-comparison-chart"
                      filename="radar_comparison"
                    />
                  </div>
                  <MissingDataWarning
                    excludedMaterials={materials
                      .filter(material => selectedMaterials.includes(material['Material Name']))
                      .map(material => {
                        const missingMetrics = [];

                        // Only check QUANTITATIVE fields (can be N/A)
                        const sustainability = parseFloat(material['Sustainability Score']) || 0;
                        const sustainStr = String(material['Sustainability Score'] || '').toUpperCase();
                        const costStr = String(material['Cost Range ($/kg)'] || '').toUpperCase();

                        if (sustainability === 0 || sustainStr.includes('N/A')) {
                          missingMetrics.push('Sustain. Score');
                        }
                        if (!costStr.match(/[\d.]+/) || costStr.includes('N/A')) {
                          missingMetrics.push('Cost');
                        }

                        // QUALITATIVE fields (always present): Environmental_Sustainability, Social Sustainability,
                        // Governance, Durability - no check needed

                        return { name: material['Material Name'], metrics: missingMetrics };
                      })
                      .filter(item => item.metrics.length > 0)
                      .map(item => ({ name: item.name, reason: item.metrics.join(', ') }))}
                  />
                  <ResponsiveContainer width="100%" height={450}>
                    <RadarChart data={(() => {
                      const comparedMaterials = materials.filter(m => selectedMaterials.includes(m['Material Name']));

                      // Helper function to normalize values to 0-6 scale
                      const normalizeTextValue = (value) => {
                        if (!value) return 0;
                        const val = String(value).toLowerCase().trim();

                        // Check for explicit N/A string
                        if (val.includes('n/a')) return 0;

                        // Check if it's a number (0-6 scale)
                        const num = parseFloat(value);
                        if (!isNaN(num)) {
                          // Keep 0-6 scale as is
                          return Math.max(0, Math.min(num, 6));
                        }

                        // Text-based values mapped to 0-6 scale
                        if (val.includes('veryhigh') || val.includes('very high') || val.includes('excellent')) return 6;
                        if (val.includes('high')) return 5;
                        if (val.includes('mediumhigh') || val.includes('medium-high') || val.includes('medium high')) return 4.5;
                        if (val.includes('medium') || val.includes('moderate')) return 3.5;
                        if (val.includes('mediumlow') || val.includes('medium-low') || val.includes('medium low')) return 2.5;
                        if (val.includes('low')) return 2;
                        if (val.includes('verylow') || val.includes('very low') || val.includes('poor')) return 1;

                        return 0;
                      };

                      return [
                        {
                          metric: 'Sustainability\nScore',
                          ...Object.fromEntries(comparedMaterials.map(m => [
                            m['Material Name'],
                            normalizeTextValue(m['Sustainability Score'])
                          ]))
                        },
                        {
                          metric: 'Environmental\nSustainability',
                          ...Object.fromEntries(comparedMaterials.map(m => [
                            m['Material Name'],
                            normalizeTextValue(m['Environmental_Sustainability'])
                          ]))
                        },
                        {
                          metric: 'Social\nSustainability',
                          ...Object.fromEntries(comparedMaterials.map(m => [
                            m['Material Name'],
                            normalizeTextValue(m['Social Sustainability'])
                          ]))
                        },
                        {
                          metric: 'Governance',
                          ...Object.fromEntries(comparedMaterials.map(m => [
                            m['Material Name'],
                            normalizeTextValue(m['Governance'])
                          ]))
                        },
                        {
                          metric: 'Durability',
                          ...Object.fromEntries(comparedMaterials.map(m => [
                            m['Material Name'],
                            normalizeTextValue(m['Durability'])
                          ]))
                        },
                        {
                          metric: 'Cost\n(Affordability)',
                          ...Object.fromEntries(comparedMaterials.map(m => {
                            const costStr = String(m['Cost Range ($/kg)'] || '');
                            // Check for N/A - return 0 (no data)
                            if (costStr.toUpperCase().includes('N/A')) return [m['Material Name'], 0];
                            const match = costStr.match(/[\d.]+/);
                            const cost = match ? parseFloat(match[0]) : 0;
                            // Invert cost: lower cost = higher score (more affordable) - scale 0-6
                            return [m['Material Name'], cost > 0 ? Math.max(0, Math.min(6, 7 - (cost / 2))) : 0];
                          }))
                        }
                      ];
                    })()}>
                      <PolarGrid stroke="#d1d5db" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#1f2937', fontSize: 11, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 6]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                      {selectedMaterials.map((matName, idx) => (
                        <Radar
                          key={matName}
                          name={matName}
                          dataKey={matName}
                          stroke={['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][idx % 5]}
                          fill={['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][idx % 5]}
                          fillOpacity={0.4}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        )}
        </div>

        {/* Footer */}
        <footer className="mt-auto bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-600">
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
        </footer>
      </main>
    </div>
  );
};

export default SustainableMaterialsApp;
