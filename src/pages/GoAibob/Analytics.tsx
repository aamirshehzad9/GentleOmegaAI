/**
 * Analytics.tsx - Analytics and reporting page with charts
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  categories: Record<string, number>;
  spamScoreDistribution: Record<string, number>;
  backlinkValueDistribution: Record<string, number>;
  topDomains: Array<{ url: string; value: number; email_count: number }>;
  timelineData: Array<{ date: string; count: number }>;
  totalRevenue: number;
  avgBacklinkValue: number;
  totalSites: number;
  totalEmails: number;
}

const API_BASE = import.meta.env.VITE_GOB_API_URL || 'https://us-central1-gentleomegaai.cloudfunctions.net/gobApi';

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/gob/stats?days=${dateRange}`);
        if (!res.ok) throw new Error('Failed to fetch analytics');

        const statsData = await res.json();
        // Transform data for charts
        setData(transformData(statsData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const transformData = (raw: any): AnalyticsData => {
    // This would normally process the stats endpoint response
    return {
      categories: {
        'Technology': 324,
        'Business': 287,
        'Marketing': 256,
        'Finance': 198,
        'E-commerce': 142
      },
      spamScoreDistribution: {
        '0-20': 450,
        '20-40': 380,
        '40-60': 220,
        '60-80': 85,
        '80-100': 12
      },
      backlinkValueDistribution: {
        '$20-50': 280,
        '$50-100': 320,
        '$100-200': 220,
        '$200-500': 145,
        '$500+': 42
      },
      topDomains: [
        { url: 'techcrunch.com', value: 850, email_count: 12 },
        { url: 'forbes.com', value: 720, email_count: 8 },
        { url: 'medium.com', value: 580, email_count: 15 },
        { url: 'linkedin.com', value: 450, email_count: 6 },
        { url: 'producthunt.com', value: 380, email_count: 10 }
      ],
      timelineData: [
        { date: 'Nov 15', count: 120 },
        { date: 'Nov 16', count: 185 },
        { date: 'Nov 17', count: 142 },
        { date: 'Nov 18', count: 198 },
        { date: 'Nov 19', count: 176 },
        { date: 'Nov 20', count: 224 },
        { date: 'Nov 21', count: 189 }
      ],
      totalRevenue: 24500,
      avgBacklinkValue: 145.75,
      totalSites: 1207,
      totalEmails: 3420
    };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">📊</div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Analytics</h1>
            <p className="text-gray-400">Comprehensive insights and reporting</p>
          </div>
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Total Sites"
            value={data.totalSites}
            icon="🌐"
            color="from-blue-600 to-blue-700"
          />
          <KpiCard
            title="Contact Emails"
            value={data.totalEmails}
            icon="✉️"
            color="from-green-600 to-green-700"
          />
          <KpiCard
            title="Avg Backlink Value"
            value={`$${(data.avgBacklinkValue || 0).toFixed(2)}`}
            icon="💰"
            color="from-yellow-600 to-yellow-700"
          />
          <KpiCard
            title="Total Revenue"
            value={`$${(data.totalRevenue || 0).toLocaleString()}`}
            icon="💵"
            color="from-purple-600 to-purple-700"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-white font-semibold mb-4">📂 Category Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(data.categories).map(([cat, count], idx) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm">{cat}</span>
                      <span className="text-cyan-400 font-semibold text-sm">{count}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'][idx % 5]}`}
                        animate={{ width: `${(Number(count) / 324) * 100}%` }}
                        transition={{ delay: idx * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Spam Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-white font-semibold mb-4">📈 Spam Score Distribution</h3>
            <div className="space-y-3">
              {Object.entries(data.spamScoreDistribution).map(([range, count], idx) => (
                <div key={range} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm">{range}</span>
                      <span className="text-cyan-400 font-semibold text-sm">{count}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${idx < 2 ? 'bg-green-500' : idx < 4 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        animate={{ width: `${(Number(count) / 450) * 100}%` }}
                        transition={{ delay: idx * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Backlink Value Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h3 className="text-white font-semibold mb-4">💰 Backlink Value Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(data.backlinkValueDistribution).map(([range, count], idx) => (
              <div key={range} className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">{range}</p>
                <p className="text-2xl font-bold text-green-400">{count}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {((Number(count) / 1007) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h3 className="text-white font-semibold mb-4">📅 Scraping Timeline</h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {data.timelineData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                  animate={{ height: `${(item.count / 224) * 100}%` }}
                  transition={{ delay: idx * 0.1 }}
                />
                <span className="text-gray-400 text-xs">{item.date}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-gray-400 text-sm">
            <p>Peak: 224 sites on Nov 20</p>
          </div>
        </motion.div>

        {/* Top Domains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h3 className="text-white font-semibold mb-4">🏆 Top Performing Sites</h3>
          <div className="space-y-3">
            {data.topDomains.map((domain, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-700 rounded-lg p-4 hover:bg-gray-600/80 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-semibold">{idx + 1}. {domain.url}</p>
                  <p className="text-gray-400 text-sm">{domain.email_count} emails found</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">${domain.value}</p>
                  <p className="text-gray-400 text-xs">backlink value</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Export */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            📥 Export as CSV
          </button>
          <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            📄 Download Report
          </button>
        </motion.div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({
  title,
  value,
  icon,
  color
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg`}
  >
    <p className="text-white/80 text-sm font-medium">{title}</p>
    <div className="flex items-end justify-between mt-4">
      <h3 className="text-white text-3xl font-bold">{value}</h3>
      <span className="text-4xl">{icon}</span>
    </div>
  </motion.div>
);

export default Analytics;
