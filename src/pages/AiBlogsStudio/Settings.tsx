/**
 * AI Blogs Studio - Settings
 * Account settings, subscription management
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';

interface SettingsProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0A0E27] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8">
          ⚙️ Settings (Coming Soon)
        </h1>
        <p className="text-[#A8B2D1] mb-6">
          Your account settings, subscription tier, and payment methods will appear here.
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

export default Settings;