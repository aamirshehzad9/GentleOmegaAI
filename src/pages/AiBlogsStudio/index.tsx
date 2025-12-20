/**
 * AI Blogs Studio - Main Entry Point & Router
 * Luxury AI-powered blogging platform with autonomous monetization
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import BlogEditor from './BlogEditor';
import Analytics from './Analytics';
import SEODashboard from './SEODashboard';
import Earnings from './Earnings';
import Marketplace from './Marketplace';
import Settings from './Settings';
import Pricing from './Pricing';
import AuthPage from './pages/AuthPage';

export type AiBlogsPage = 'landing' | 'login' | 'signup' | 'dashboard' | 'editor' | 'analytics' | 'seo' | 'earnings' | 'marketplace' | 'settings' | 'pricing';

const AiBlogsStudio: React.FC = () => {
  console.log("AiBlogsStudio Component MOUNTED");
  const [currentPage, setCurrentPage] = useState<AiBlogsPage>('landing');
  const { currentUser, isAuthenticated } = useAuth();

  // Redirect to landing if not authenticated and trying to access protected pages
  React.useEffect(() => {
    const protectedPages: AiBlogsPage[] = ['dashboard', 'editor', 'analytics', 'seo', 'earnings', 'marketplace', 'settings'];
    if (!isAuthenticated && protectedPages.includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [isAuthenticated, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <AuthPage onNavigate={setCurrentPage} mode="login" />;
      case 'signup':
        return <AuthPage onNavigate={setCurrentPage} mode="signup" />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'editor':
        return <BlogEditor onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics onNavigate={setCurrentPage} />;
      case 'seo':
        return <SEODashboard onNavigate={setCurrentPage} />;
      case 'earnings':
        return <Earnings onNavigate={setCurrentPage} />;
      case 'marketplace':
        return <Marketplace onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      case 'pricing':
        return <Pricing onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AiBlogsStudio;