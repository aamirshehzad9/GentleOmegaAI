import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

interface Order {
    id: string;
    siteUrl: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    amount: number;
    createdDate: string;
    completedDate?: string;
    niche: string;
}

const OrdersManagement: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const [orders] = useState<Order[]>([
        {
            id: '1',
            siteUrl: 'https://example-blog.com',
            status: 'completed',
            amount: 150,
            createdDate: '2025-12-10',
            completedDate: '2025-12-15',
            niche: 'Technology',
        },
        {
            id: '2',
            siteUrl: 'https://marketing-insights.com',
            status: 'in-progress',
            amount: 200,
            createdDate: '2025-12-14',
            niche: 'Marketing',
        },
        {
            id: '3',
            siteUrl: 'https://business-today.com',
            status: 'pending',
            amount: 175,
            createdDate: '2025-12-17',
            niche: 'Business',
        },
    ]);

    const filteredOrders = orders.filter(
        (order) => filterStatus === 'all' || order.status === filterStatus
    );

    const stats = [
        {
            label: 'Total Orders',
            value: orders.length,
            icon: '📦',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            label: 'Completed',
            value: orders.filter((o) => o.status === 'completed').length,
            icon: '✅',
            color: 'from-green-500 to-emerald-500',
        },
        {
            label: 'In Progress',
            value: orders.filter((o) => o.status === 'in-progress').length,
            icon: '⏳',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            label: 'Total Revenue',
            value: `$${orders.reduce((acc, o) => acc + o.amount, 0)}`,
            icon: '💰',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 overflow-auto">
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
                        <p className="text-gray-400">Track and manage guest post placements</p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Stats */}
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
                                    </div>
                                    <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Filter */}
                        <div className="flex gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            {filteredOrders.map((order, idx) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-semibold text-white">{order.siteUrl}</h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'completed'
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                            : order.status === 'in-progress'
                                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                                                : order.status === 'pending'
                                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                                                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-400">Amount</p>
                                                    <p className="text-white font-semibold">${order.amount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Niche</p>
                                                    <p className="text-white font-semibold">{order.niche}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Created</p>
                                                    <p className="text-white font-semibold">{order.createdDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Completed</p>
                                                    <p className="text-white font-semibold">
                                                        {order.completedDate || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersManagement;
