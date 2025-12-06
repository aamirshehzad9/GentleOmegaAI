/**
 * AI Blogs Studio - Earnings & Payouts
 * Revenue tracking, payout management, and analytics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';
import { useAuth } from '../../../contexts/AuthContext';

interface EarningsProps {
  onNavigate: (page: AiBlogsPage) => void;
}

interface EarningRecord {
  id: string;
  date: string;
  source: string;
  amount: number;
  status: 'pending' | 'paid' | 'processing';
  description: string;
}

const Earnings: React.FC<EarningsProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [earningsData, setEarningsData] = useState<EarningRecord[]>([]);

  // Mock data - Replace with actual Firestore queries
  useEffect(() => {
    const mockData: EarningRecord[] = [
      { id: '1', date: '2024-12-15', source: 'Google AdSense', amount: 45.32, status: 'paid', description: '150 clicks, 5,000 impressions' },
      { id: '2', date: '2024-12-14', source: 'Amazon Associates', amount: 89.50, status: 'processing', description: '3 product sales' },
      { id: '3', date: '2024-12-13', source: 'Sponsored Post', amount: 500.00, status: 'paid', description: 'Brand collaboration' },
      { id: '4', date: '2024-12-10', source: 'ShareASale', amount: 32.80, status: 'paid', description: '8 affiliate conversions' },
      { id: '5', date: '2024-12-08', source: 'Google AdSense', amount: 38.20, status: 'paid', description: '125 clicks, 4,200 impressions' },
    ];
    setEarningsData(mockData);
  }, [currentUser]);

  const totalEarnings = earningsData.reduce((sum, record) => sum + record.amount, 0);
  const pendingEarnings = earningsData.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const paidEarnings = earningsData.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400';
      case 'pending': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <BlogsHeader context="user" onNavigate={onNavigate} currentPage="earnings" showBackButton={true} />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💰 Earnings Dashboard</h1>
          <p className="text-[#A8B2D1]">Track your revenue, manage payouts, and grow your income</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#26DE81] to-[#20BF6B] p-6 rounded-xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 text-sm font-semibold">Total Earnings</span>
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">${totalEarnings.toFixed(2)}</h2>
            <p className="text-white/70 text-sm">This month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#5F27CD] to-[#341F97] p-6 rounded-xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 text-sm font-semibold">Paid Out</span>
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">${paidEarnings.toFixed(2)}</h2>
            <p className="text-white/70 text-sm">Completed payments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#F7B731] to-[#F39C12] p-6 rounded-xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 text-sm font-semibold">Pending</span>
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">${pendingEarnings.toFixed(2)}</h2>
            <p className="text-white/70 text-sm">Processing</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1A1F3A] p-6 rounded-xl border border-[#F7B731]/20">
            <h3 className="text-xl font-bold text-white mb-4">💳 Payment Methods</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-[#F7B731]/50 transition text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Stripe Connect</p>
                    <p className="text-gray-400 text-sm">Not connected</p>
                  </div>
                  <span className="text-[#F7B731] group-hover:text-[#F39C12]">Connect →</span>
                </div>
              </button>
              <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-[#F7B731]/50 transition text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">PayPal</p>
                    <p className="text-gray-400 text-sm">Not connected</p>
                  </div>
                  <span className="text-[#F7B731] group-hover:text-[#F39C12]">Connect →</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-[#1A1F3A] p-6 rounded-xl border border-[#F7B731]/20">
            <h3 className="text-xl font-bold text-white mb-4">📊 Revenue Sources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">AdSense</span>
                <span className="text-[#26DE81] font-bold">$83.52</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">Affiliates</span>
                <span className="text-[#26DE81] font-bold">$122.30</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">Sponsored</span>
                <span className="text-[#26DE81] font-bold">$500.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings History */}
        <div className="bg-[#1A1F3A] p-6 rounded-xl border border-[#F7B731]/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">📜 Earnings History</h3>
            <div className="flex gap-2">
              {(['week', 'month', 'year', 'all'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    selectedPeriod === period
                      ? 'bg-[#F7B731] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {earningsData.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">No earnings yet</p>
              <p className="text-gray-500 text-sm">Start creating content and monetizing your blog!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Source</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Description</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-4 text-gray-300">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-white font-semibold">{record.source}</td>
                      <td className="py-4 px-4 text-gray-400 text-sm">{record.description}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-[#26DE81] font-bold text-lg">${record.amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-[#F7B731]/10 to-[#5F27CD]/10 p-6 rounded-xl border border-[#F7B731]/20">
          <div className="flex items-start gap-4">
            <svg className="w-8 h-8 text-[#F7B731] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-white font-bold text-lg mb-2">💡 Maximize Your Earnings</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Connect multiple revenue streams (AdSense, affiliates, sponsorships)</li>
                <li>• Publish consistently (2-4 posts per week)</li>
                <li>• Optimize content with SEO tools for higher traffic</li>
                <li>• Build email list for direct audience connection</li>
                <li>• Create digital products (eBooks, courses) for passive income</li>
              </ul>
              <button
                onClick={() => window.open('/docs/USER_GUIDE.md#monetization-strategies', '_blank')}
                className="mt-4 px-6 py-2 bg-[#F7B731] hover:bg-[#F39C12] text-white rounded-lg font-semibold transition"
              >
                Read Monetization Guide →
              </button>
            </div>
          </div>
        </div>
      </div>

      <BlogsFooter />
    </div>
  );
};

export default Earnings;
