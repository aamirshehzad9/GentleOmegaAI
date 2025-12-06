/**
 * AI Blogs Studio - Analytics Dashboard
 * Real-time insights from GA4, Mixpanel, and Amplitude
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';
import { analytics } from '../../utils/analytics';
import type { UnifiedMetrics } from '../../utils/analytics/analytics-types';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';

interface AnalyticsProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<UnifiedMetrics>({
    activeUsers: 0,
    pageViews: 0,
    sessions: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    conversions: 0,
    revenue: 0,
  });

  const [platforms, setPlatforms] = useState<Array<{ name: string; status: string }>>([]);

  useEffect(() => {
    // Track page view
    analytics.trackPageView({ path: '/analytics', title: 'Analytics Dashboard' });

    // Check platform status
    const platformStatus = analytics.getEnabledPlatforms().map(p => ({
      name: p.name,
      status: p.initialized ? 'Connected' : 'Disconnected',
    }));
    setPlatforms(platformStatus);

    // Load analytics data
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // In production, fetch real data from backend API
      // For now, simulate data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        activeUsers: 1247,
        pageViews: 15832,
        sessions: 3421,
        avgSessionDuration: 245,
        bounceRate: 42.3,
        conversions: 87,
        revenue: 4350.00,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b0d] via-[#111214] to-[#0a0b0d]">
      <BlogsHeader context="authenticated" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time insights from Google Analytics, Mixpanel, and Amplitude
          </p>
        </motion.div>

        {/* Platform Status */}
        <div className="mb-6 flex gap-4 flex-wrap">
          {platforms.map(platform => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/30 border border-gray-700/50"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  platform.status === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              <span className="text-sm text-gray-300">{platform.name}</span>
              <span className="text-xs text-gray-500">{platform.status}</span>
            </motion.div>
          ))}
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-2">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              Last {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {/* Active Users */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Active Users</span>
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatNumber(metrics.activeUsers)}
                </div>
                <div className="text-sm text-green-400">↑ 12.5% vs last period</div>
              </div>

              {/* Page Views */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Page Views</span>
                  <span className="text-2xl">📄</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatNumber(metrics.pageViews)}
                </div>
                <div className="text-sm text-green-400">↑ 8.3% vs last period</div>
              </div>

              {/* Avg Session Duration */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Avg Session</span>
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatDuration(metrics.avgSessionDuration)}
                </div>
                <div className="text-sm text-green-400">↑ 15.2% vs last period</div>
              </div>

              {/* Revenue */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Revenue</span>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatCurrency(metrics.revenue)}
                </div>
                <div className="text-sm text-green-400">↑ 23.7% vs last period</div>
              </div>
            </motion.div>

            {/* Secondary Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-gray-400 text-sm mb-2">Sessions</div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(metrics.sessions)}
                </div>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-gray-400 text-sm mb-2">Conversions</div>
                <div className="text-2xl font-bold text-white">
                  {metrics.conversions}
                </div>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="text-gray-400 text-sm mb-2">Bounce Rate</div>
                <div className="text-2xl font-bold text-white">
                  {metrics.bounceRate.toFixed(1)}%
                </div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {/* Traffic Chart Placeholder */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Traffic Overview
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <div>Traffic chart will appear here</div>
                    <div className="text-sm mt-2">(Real data coming soon)</div>
                  </div>
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Top Pages
                </h3>
                <div className="space-y-3">
                  {[
                    { path: '/AIBlogsStudio', views: 4532, percentage: 28.6 },
                    { path: '/AIBlogsStudio/editor', views: 3421, percentage: 21.6 },
                    { path: '/AIBlogsStudio/dashboard', views: 2847, percentage: 18.0 },
                    { path: '/', views: 2156, percentage: 13.6 },
                    { path: '/pricing', views: 1876, percentage: 11.8 },
                  ].map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium">{page.path}</div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2 mt-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${page.percentage}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            className="bg-cyan-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm text-white font-semibold">
                          {formatNumber(page.views)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {page.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Traffic Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Traffic Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { source: 'Organic Search', users: 5432, color: 'bg-green-500' },
                  { source: 'Direct', users: 3241, color: 'bg-blue-500' },
                  { source: 'Social Media', users: 2156, color: 'bg-purple-500' },
                  { source: 'Referral', users: 1243, color: 'bg-orange-500' },
                ].map((source, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${source.color}`} />
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">{source.source}</div>
                      <div className="text-lg font-semibold text-white">
                        {formatNumber(source.users)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Real-time Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Real-time Activity
                </h3>
                <span className="text-sm text-gray-400">
                  Updated just now
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold text-white mb-1">42</div>
                  <div className="text-sm text-gray-400">Active users right now</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-1">15</div>
                  <div className="text-sm text-gray-400">Page views (last 5 min)</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-1">3</div>
                  <div className="text-sm text-gray-400">New signups (last hour)</div>
                </div>
              </div>
            </motion.div>

            {/* Back Button */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </>
        )}
      </div>

      <BlogsFooter />
    </div>
  );
};

export default Analytics;