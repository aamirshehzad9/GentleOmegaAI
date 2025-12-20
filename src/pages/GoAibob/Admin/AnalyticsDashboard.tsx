import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import { generatePDFReport } from '../../../utils/pdfGenerator';
import { useAuth } from '../../../../contexts/AuthContext';

const AnalyticsDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dateRange, setDateRange] = useState('7days');
    const { userProfile } = useAuth();

    const stats = [
        {
            label: 'Total Outreach',
            value: '245',
            change: '+12%',
            icon: '📧',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            label: 'Response Rate',
            value: '18%',
            change: '+3%',
            icon: '📈',
            color: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Placements',
            value: '42',
            change: '+8%',
            icon: '✅',
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Avg DA',
            value: '52',
            change: '+2',
            icon: '🎯',
            color: 'from-orange-500 to-red-500',
        },
    ];

    const topPerformers = [
        { site: 'example-blog.com', placements: 12, da: 65, responseRate: '25%' },
        { site: 'marketing-insights.com', placements: 8, da: 58, responseRate: '22%' },
        { site: 'tech-today.com', placements: 6, da: 48, responseRate: '18%' },
    ];

    const handleExport = () => {
        generatePDFReport(
            {
                title: 'Analytics Performance Report',
                subtitle: `Period: ${dateRange.replace('days', ' Days').replace('year', 'Year')}`,
                userName: userProfile?.displayName || 'Admin User',
                // Future: Add brandName from user settings if White-Label is enabled in Pro Tier
            },
            [
                {
                    title: 'Key Performance Indicators',
                    head: [['Metric', 'Value', 'Growth']],
                    body: stats.map(s => [s.label, s.value, s.change])
                },
                {
                    title: 'Top Performing Sites',
                    head: [['Site URL', 'Placements', 'Domain Authority', 'Response Rate']],
                    body: topPerformers.map(s => [s.site, s.placements, s.da, s.responseRate])
                }
            ]
        );
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 overflow-auto">
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                            <p className="text-gray-400">Track your guest blogging performance</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExport}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all font-medium"
                            >
                                <span>📄</span> Export Report
                            </motion.button>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            >
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="90days">Last 90 Days</option>
                                <option value="1year">Last Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-2xl`}
                                        >
                                            {stat.icon}
                                        </div>
                                        <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts Placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Outreach Trend</h3>
                                <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
                                    <p className="text-gray-400">📊 Chart visualization coming soon</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Response Rate</h3>
                                <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
                                    <p className="text-gray-400">📈 Chart visualization coming soon</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Performers */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Top Performing Sites</h3>
                            <div className="space-y-4">
                                {topPerformers.map((site, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{site.site}</p>
                                                <p className="text-gray-400 text-sm">DA {site.da}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-8 text-sm">
                                            <div>
                                                <p className="text-gray-400">Placements</p>
                                                <p className="text-white font-semibold">{site.placements}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Response Rate</p>
                                                <p className="text-green-400 font-semibold">{site.responseRate}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
