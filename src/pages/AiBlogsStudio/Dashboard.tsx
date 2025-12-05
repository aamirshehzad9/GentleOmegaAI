/**
 * AI Blogs Studio - Creator Dashboard
 * Earnings overview, blog management, quick actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';

interface DashboardProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0A0E27] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8">
          📊 Dashboard (Coming Soon)
        </h1>
        <p className="text-[#A8B2D1] mb-6">
          Your earnings overview, blog performance, and AI assistant will appear here.
        </p>
        <button
          onClick={() => onNavigate('landing')}
          className="px-6 py-3 bg-[#F7B731] text-white rounded-lg hover:bg-[#F39C12] transition-colors"
        >
          ← Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;