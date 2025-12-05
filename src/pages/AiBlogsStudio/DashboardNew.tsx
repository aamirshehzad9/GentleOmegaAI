/**
 * AI Blogs Studio - User Dashboard (Complete)
 * Creator's main workspace with earnings, blogs, and AI assistant
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';
import { AiBlogsPage } from './index';
import { generateTopicIdeas } from './services/aiService';

interface DashboardProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Mock user (will use AuthContext later)
  const currentUser = { displayName: 'Creator' };
  
  const [topicIdeas, setTopicIdeas] = useState<Array<{ title: string; description: string; keywords: string[] }>>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Mock data (will be replaced with Firestore data)
  const stats = {
    totalEarnings: 0,
    thisMonth: 0,
    totalBlogs: 0,
    totalViews: 0,
  };

  const loadTopicIdeas = async () => {
    setLoadingTopics(true);
    try {
      const ideas = await generateTopicIdeas('Technology', 5);
      setTopicIdeas(ideas);
    } catch (error) {
      console.error('Failed to load topic ideas:', error);
    } finally {
      setLoadingTopics(false);
    }
  };

  useEffect(() => {
    // Auto-load on mount
    // loadTopicIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <BlogsHeader context="user" onNavigate={onNavigate} currentPage="dashboard" />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {currentUser?.displayName || 'Creator'}! 👋
          </h1>
          <p className="text-gray-400">
            Ready to create amazing content and earn money?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#F7B731] to-[#5F27CD] p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-semibold">Total Earnings</h3>
              <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
            <p className="text-white/70 text-sm mt-2">Lifetime</p>
          </motion.div>

          {/* This Month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1F3A] border border-[#F7B731]/20 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 text-sm font-semibold">This Month</h3>
              <svg className="w-8 h-8 text-[#26DE81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-white text-3xl font-bold">${stats.thisMonth.toFixed(2)}</p>
            <p className="text-[#26DE81] text-sm mt-2">+$0.00 vs last month</p>
          </motion.div>

          {/* Total Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1A1F3A] border border-[#F7B731]/20 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 text-sm font-semibold">Total Blogs</h3>
              <svg className="w-8 h-8 text-[#00D2D3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-white text-3xl font-bold">{stats.totalBlogs}</p>
            <p className="text-gray-400 text-sm mt-2">Published articles</p>
          </motion.div>

          {/* Total Views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1A1F3A] border border-[#F7B731]/20 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 text-sm font-semibold">Total Views</h3>
              <svg className="w-8 h-8 text-[#5F27CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-white text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-2">All time</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[#F7B731]/10 to-[#5F27CD]/10 border border-[#F7B731]/20 rounded-xl p-6 mb-8"
        >
          <h2 className="text-white text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('editor')}
              className="bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#F7B731]/50 transition flex items-center justify-center space-x-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Blog</span>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className="bg-[#1A1F3A] border border-[#F7B731]/20 text-white py-4 rounded-lg font-semibold hover:border-[#F7B731] transition flex items-center justify-center space-x-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>View Analytics</span>
            </button>

            <button
              onClick={() => onNavigate('earnings')}
              className="bg-[#1A1F3A] border border-[#26DE81]/20 text-white py-4 rounded-lg font-semibold hover:border-[#26DE81] transition flex items-center justify-center space-x-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Withdraw Earnings</span>
            </button>
          </div>
        </motion.div>

        {/* AI Topic Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1A1F3A] border border-[#F7B731]/20 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold">🤖 AI Topic Suggestions</h2>
              <p className="text-gray-400 text-sm mt-1">Trending topics powered by Google Gemini</p>
            </div>
            <button
              onClick={loadTopicIdeas}
              disabled={loadingTopics}
              className="px-4 py-2 bg-[#5F27CD] text-white rounded-lg text-sm font-semibold hover:bg-[#5F27CD]/80 transition disabled:opacity-50"
            >
              {loadingTopics ? 'Loading...' : 'Generate Ideas'}
            </button>
          </div>

          <div className="space-y-4">
            {loadingTopics ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7B731]"></div>
                <p className="text-gray-400 mt-4">Generating ideas with AI...</p>
              </div>
            ) : topicIdeas.length > 0 ? (
              topicIdeas.map((topic, index) => (
                <div key={index} className="bg-[#0A0E27] p-4 rounded-lg border border-gray-800 hover:border-[#F7B731]/50 transition">
                  <h3 className="text-white font-semibold mb-2">{topic.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topic.keywords.map((keyword, kIndex) => (
                      <span key={kIndex} className="px-3 py-1 bg-[#5F27CD]/20 text-[#F7B731] text-xs rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onNavigate('editor')}
                    className="w-full py-2 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                  >
                    Create Blog from This Topic
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-white mb-2">Click "Generate Ideas" to get AI-powered topic suggestions</p>
                <p className="text-gray-500 text-sm">Powered by Google Gemini Pro</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1A1F3A] border border-[#F7B731]/20 rounded-xl p-6"
        >
          <h2 className="text-white text-xl font-bold mb-6">Recent Blogs</h2>
          
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 mb-4">You haven't created any blogs yet</p>
            <button
              onClick={() => onNavigate('editor')}
              className="px-6 py-3 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Create Your First Blog
            </button>
          </div>
        </motion.div>
      </div>

      <BlogsFooter context="user" onNavigate={onNavigate} />
    </div>
  );
};

export default Dashboard;
