/**
 * index.tsx - Main GO-AIBOB entry point with routing and navigation
 * Public landing page for visitors, admin dashboard for authenticated users
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../../firebase/auth';
import { isAdmin } from '../../../utils/admin-check';
import ErrorBoundary from './ErrorBoundary';
import GoAibobLandingPage from './LandingPage';
import Dashboard from './Dashboard';
import SitesTable from './SitesTable';
import ImportInterface from './ImportInterface';
import BuyBacklinkForm from './BuyBacklinkForm';
import AdminSettings from './AdminSettings';
import Analytics from './Analytics';
import Troubleshooting from './Troubleshooting';

type PageType = 'dashboard' | 'sites' | 'import' | 'buy' | 'settings' | 'analytics' | 'troubleshooting';

const GoAibobIndex: React.FC = () => {
  console.log('🚀 GO-AIBOB Index component rendering');
  
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔍 Current state:', { loading, error, currentUser: !!currentUser });

  // Direct Firebase Auth - bypass AuthContext
  useEffect(() => {
    console.log('🔐 Initializing auth listener');
    
    // Check if auth is available
    if (!auth) {
      console.error('❌ Firebase auth is not initialized');
      setError('Firebase authentication is not initialized. Please check your configuration.');
      setLoading(false);
      return;
    }

    console.log('✅ Auth object is available');

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('🔄 Auth state changed:', user ? `User logged in: ${user.email}` : 'No user');
        setCurrentUser(user);
        setLoading(false);
      }, (error) => {
        console.error('❌ Auth error:', error);
        setError('Authentication error. Please try refreshing the page.');
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.error('❌ Failed to initialize auth:', err);
      setError('Failed to initialize. Please refresh the page.');
      setLoading(false);
    }
  }, []);

  // Check admin access
  const userIsAdmin = isAdmin(currentUser?.email || null);
  console.log('👤 Admin check:', { email: currentUser?.email, isAdmin: userIsAdmin });

  // Show error state if something went wrong
  if (error) {
    console.log('⚠️ Rendering error state');
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking auth
  if (loading) {
    console.log('⏳ Rendering loading state');
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users or non-admin users
  if (!currentUser || !userIsAdmin) {
    console.log('🏠 Rendering landing page (not authenticated or not admin)');
    return (
      <GoAibobLandingPage
        onLoginClick={() => navigate('/login')}
      />
    );
  }

  console.log('📊 Rendering admin dashboard');

  const navItems: Array<{ id: PageType; label: string; icon: string; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'sites', label: 'Sites', icon: '🌐' },
    { id: 'import', label: 'Import', icon: '📤' },
    { id: 'buy', label: 'Orders', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'troubleshooting', label: 'Help', icon: '🔧' }
  ];

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard onNavigate={setCurrentPage} />;
        case 'sites':
          return <SitesTable />;
        case 'import':
          return <ImportInterface />;
        case 'buy':
          return <BuyBacklinkForm />;
        case 'settings':
          return <AdminSettings />;
        case 'analytics':
          return <Analytics />;
        case 'troubleshooting':
          return <Troubleshooting />;
        default:
          return <Dashboard onNavigate={setCurrentPage} />;
      }
    } catch (err) {
      console.error('Error rendering page:', err);
      return (
        <div className="p-8 text-center">
          <div className="text-red-400 text-xl mb-4">Failed to load page</div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-gray-900 border-r border-gray-700 overflow-hidden transition-all duration-300 relative flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/')}>
                  Ω
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">GO-AIBOB</h2>
                  <p className="text-gray-400 text-xs">Guest Blogging</p>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg mx-auto cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/')}>
                Ω
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors ml-auto"
            >
              {sidebarOpen ? '◄' : '►'}
            </button>
          </div>
        </div>

        {/* Back to Home button */}
        {sidebarOpen && (
          <div className="px-4 pt-4">
            <motion.button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all flex items-center gap-2 text-sm border border-gray-700/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>←</span>
              <span>Back to Home</span>
            </motion.button>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-left ${currentPage === item.id
                ? 'bg-cyan-600/20 border border-cyan-500 text-cyan-400'
                : 'hover:bg-gray-800 text-gray-300'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <div className="flex-1">
                  <span className="block">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded mt-1 inline-block">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Help Tip */}
        {sidebarOpen && (
          <div className="p-4 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-300 backdrop-blur-sm"
            >
              <p className="font-semibold mb-1 flex items-center gap-2">
                <span>💡</span> Tip
              </p>
              <p className="text-xs text-blue-200">Use the Help menu to troubleshoot issues</p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 overflow-auto"
        key={currentPage}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderPage()}
      </motion.div>
    </div>
  );
};

// Wrap with ErrorBoundary to catch any rendering errors
// Temporarily disabled to debug core issue
// const GoAibobWithErrorBoundary: React.FC = () => (
//   <ErrorBoundary>
//     <GoAibobIndex />
//   </ErrorBoundary>
// );

export default GoAibobIndex;
