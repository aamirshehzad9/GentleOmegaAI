/**
 * index.tsx - Main GO-AIBOB entry point with routing and navigation
 * Protected: Admin-only access via Firebase UID whitelist
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { isAdmin } from '../../../utils/admin-check';
import Dashboard from './Dashboard';
import SitesTable from './SitesTable';
import ImportInterface from './ImportInterface';
import BuyBacklinkForm from './BuyBacklinkForm';
import AdminSettings from './AdminSettings';
import Analytics from './Analytics';
import Troubleshooting from './Troubleshooting';

type PageType = 'dashboard' | 'sites' | 'import' | 'buy' | 'settings' | 'analytics' | 'troubleshooting';

const GoAibobIndex: React.FC = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check admin access
  const userIsAdmin = isAdmin(currentUser?.email || null);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated or not admin
  if (!isAuthenticated || !userIsAdmin) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-xl p-8 text-center"
        >
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            {!isAuthenticated 
              ? 'You must be logged in to access GO-AIBOB admin panel.'
              : 'You do not have admin permissions to access GO-AIBOB.'}
          </p>
          <div className="space-y-3">
            {!isAuthenticated ? (
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                Go to Login
              </button>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Contact administrator to request access:
                </p>
                <p className="text-cyan-400 font-mono text-sm break-all">
                  {currentUser?.email}
                </p>
              </>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

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
        return <Dashboard />;
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
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg">
                  Ω
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">GO-AIBOB</h2>
                  <p className="text-gray-400 text-xs">Guest Blogging</p>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg mx-auto">
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

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-left ${
                currentPage === item.id
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

export default GoAibobIndex;
