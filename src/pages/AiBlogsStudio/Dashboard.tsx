/**
 * AI Blogs Studio - Creator Dashboard
 * Earnings overview, blog management, quick actions, topic generator
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';
import TopicGenerator from './components/TopicGenerator';
import { useAuth } from '../../../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    // Could show a modal or toast here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      <BlogsHeader context="user" onNavigate={onNavigate} currentPage="dashboard" />
      
      <div className="container mx-auto px-4 py-16 pt-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7B731] to-[#F39C12]">{currentUser?.displayName || 'Creator'}</span>! 👋
          </h1>
          <p className="text-[#A8B2D1] text-lg">
            Ready to create amazing content today?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1F3A] border border-gray-700 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">📈 Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0A0E27] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-[#F7B731]">$0.00</p>
              </div>
              <div className="bg-[#0A0E27] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Published Blogs</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-[#0A0E27] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Views</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-[#0A0E27] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Ad Revenue</p>
                <p className="text-3xl font-bold text-[#26DE81]">$0.00</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1F3A] border border-gray-700 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">⚡ Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('editor')}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-left flex items-center gap-3"
              >
                <span className="text-2xl">✍️</span>
                <div>
                  <p className="font-bold">New Blog Post</p>
                  <p className="text-sm opacity-80">Start writing with AI assistance</p>
                </div>
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className="w-full px-6 py-4 bg-[#5F27CD] text-white font-semibold rounded-lg hover:bg-[#4A1FA8] transition-colors text-left flex items-center gap-3"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-bold">View Analytics</p>
                  <p className="text-sm opacity-80">Track your performance</p>
                </div>
              </button>
              <button
                onClick={() => onNavigate('earnings')}
                className="w-full px-6 py-4 bg-[#26DE81] text-white font-semibold rounded-lg hover:bg-[#1DBE68] transition-colors text-left flex items-center gap-3"
              >
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-bold">Earnings</p>
                  <p className="text-sm opacity-80">Check your revenue</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Topic Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TopicGenerator onSelectTopic={handleSelectTopic} />
        </motion.div>

        {/* Selected Topic */}
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-[#F7B731]/20 border border-[#F7B731] rounded-lg"
          >
            <p className="text-white mb-2">
              <span className="font-semibold">Selected Topic:</span> {selectedTopic}
            </p>
            <button
              onClick={() => {
                // In the future, this could pre-fill the editor with the topic
                onNavigate('editor');
              }}
              className="px-4 py-2 bg-[#F7B731] text-white rounded-lg hover:bg-[#F39C12] transition-colors"
            >
              Start Writing →
            </button>
          </motion.div>
        )}
      </div>

      <BlogsFooter />
    </div>
  );
};

export default Dashboard;
