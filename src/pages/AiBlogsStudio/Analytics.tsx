/**
 * AI Blogs Studio - Analytics Dashboard
 * Performance metrics, revenue tracking
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';

interface AnalyticsProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0A0E27] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8">
          📈 Analytics (Coming Soon)
        </h1>
        <p className="text-[#A8B2D1] mb-6">
          Real-time earnings tracker, blog performance, and AdWords campaigns will appear here.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-[#F7B731] text-white rounded-lg hover:bg-[#F39C12] transition-colors"
        >
          ← Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default Analytics;