import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const AdminDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const stats = [
        {
            label: 'Total Sites',
            value: '0',
            change: '+0%',
            icon: '🌐',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            label: 'AI Suggestions',
            value: '0',
            change: '+0%',
            icon: '🤖',
            color: 'from-blue-500 to-purple-500',
        },
        {
            label: 'Active Orders',
            value: '0',
            change: '+0%',
            icon: '💰',
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Success Rate',
            value: '0%',
            change: '+0%',
            icon: '📈',
            color: 'from-pink-500 to-red-500',
        },
    ];

    const recentActivity = [
        {
            type: 'info',
            message: 'Welcome to GO-AIBOB Admin Dashboard',
            time: 'Just now',
            icon: '👋',
        },
        {
            type: 'success',
            message: 'System initialized successfully',
            time: '1 minute ago',
            icon: '✅',
        },
    ];

    const quickActions = [
        {
            label: 'Test AI Services',
            description: 'Verify AI connections',
            icon: '🔌',
            path: '/go-aibob/Admin/ai-test',
            color: 'from-cyan-600 to-blue-600',
        },
        {
            label: 'Review Suggestions',
            description: 'Approve AI-generated content',
            icon: '✅',
            path: '/go-aibob/Admin/ai-review',
            color: 'from-blue-600 to-purple-600',
        },
        {
            label: 'View Metrics',
            description: 'Check performance data',
            icon: '📊',
            path: '/go-aibob/Admin/ai-metrics',
            color: 'from-purple-600 to-pink-600',
        },
        {
            label: 'Manage Sites',
            description: 'Add or edit websites',
            icon: '🌐',
            path: '/go-aibob/Admin/sites',
            color: 'from-pink-600 to-red-600',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Welcome back! Here's what's happening with GO-AIBOB</p>
                    </div>
                </div>

                {/* Content */}
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
                                    className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                                            {stat.icon}
                                        </div>
                                        <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {quickActions.map((action, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={action.path}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer group"
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                            {action.icon}
                                        </div>
                                        <h3 className="text-white font-semibold mb-1">{action.label}</h3>
                                        <p className="text-gray-400 text-sm">{action.description}</p>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                                <div className="space-y-4">
                                    {recentActivity.map((activity, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-4 pb-4 border-b border-gray-700 last:border-0 last:pb-0"
                                        >
                                            <div className="text-2xl">{activity.icon}</div>
                                            <div className="flex-1">
                                                <p className="text-white">{activity.message}</p>
                                                <p className="text-gray-400 text-sm mt-1">{activity.time}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">System Status</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'AI Services', status: 'Operational', color: 'green' },
                                    { label: 'Database', status: 'Operational', color: 'green' },
                                    { label: 'API', status: 'Operational', color: 'green' },
                                ].map((system, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-medium">{system.label}</span>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full bg-${system.color}-500 animate-pulse`}></div>
                                                <span className={`text-${system.color}-400 text-sm`}>{system.status}</span>
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

export default AdminDashboard;
