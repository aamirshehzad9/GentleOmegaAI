import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

interface Site {
    id: string;
    url: string;
    domainAuthority: number;
    niche: string;
    contactEmail: string;
    status: 'active' | 'pending' | 'rejected';
    addedDate: string;
    lastContact?: string;
}

const SitesManagement: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - will be replaced with Firestore
    const [sites, setSites] = useState<Site[]>([
        {
            id: '1',
            url: 'https://example-blog.com',
            domainAuthority: 45,
            niche: 'Technology',
            contactEmail: 'editor@example-blog.com',
            status: 'active',
            addedDate: '2025-12-15',
            lastContact: '2025-12-17',
        },
        {
            id: '2',
            url: 'https://marketing-insights.com',
            domainAuthority: 62,
            niche: 'Marketing',
            contactEmail: 'contact@marketing-insights.com',
            status: 'pending',
            addedDate: '2025-12-16',
        },
    ]);

    const [newSite, setNewSite] = useState({
        url: '',
        domainAuthority: 0,
        niche: '',
        contactEmail: '',
    });

    const handleAddSite = () => {
        const site: Site = {
            id: Date.now().toString(),
            ...newSite,
            status: 'pending',
            addedDate: new Date().toISOString().split('T')[0],
        };
        setSites([...sites, site]);
        setNewSite({ url: '', domainAuthority: 0, niche: '', contactEmail: '' });
        setShowAddModal(false);
    };

    const handleDeleteSite = (id: string) => {
        setSites(sites.filter((site) => site.id !== id));
    };

    const handleStatusChange = (id: string, status: 'active' | 'pending' | 'rejected') => {
        setSites(sites.map((site) => (site.id === id ? { ...site, status } : site)));
    };

    const filteredSites = sites.filter((site) => {
        const matchesStatus = filterStatus === 'all' || site.status === filterStatus;
        const matchesSearch =
            site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            site.niche.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = [
        { label: 'Total Sites', value: sites.length, icon: '🌐', color: 'from-cyan-500 to-blue-500' },
        {
            label: 'Active',
            value: sites.filter((s) => s.status === 'active').length,
            icon: '✅',
            color: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Pending',
            value: sites.filter((s) => s.status === 'pending').length,
            icon: '⏳',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            label: 'Avg DA',
            value: Math.round(sites.reduce((acc, s) => acc + s.domainAuthority, 0) / sites.length || 0),
            icon: '📊',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Sites Management</h1>
                        <p className="text-gray-400">Manage your target websites for guest posting</p>
                    </div>
                </div>

                {/* Content */}
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

                        {/* Filters & Actions */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex gap-4 flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search sites..."
                                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
                            >
                                + Add New Site
                            </button>
                        </div>

                        {/* Sites List */}
                        <div className="space-y-4">
                            {filteredSites.map((site, idx) => (
                                <motion.div
                                    key={site.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-semibold text-white">{site.url}</h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${site.status === 'active'
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                            : site.status === 'pending'
                                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                                                : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                        }`}
                                                >
                                                    {site.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-400">Domain Authority</p>
                                                    <p className="text-white font-semibold">DA {site.domainAuthority}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Niche</p>
                                                    <p className="text-white font-semibold">{site.niche}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Contact</p>
                                                    <p className="text-white font-semibold">{site.contactEmail}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Added</p>
                                                    <p className="text-white font-semibold">{site.addedDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {site.status !== 'active' && (
                                                <button
                                                    onClick={() => handleStatusChange(site.id, 'active')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {site.status !== 'rejected' && (
                                                <button
                                                    onClick={() => handleStatusChange(site.id, 'rejected')}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteSite(site.id)}
                                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Site Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-2xl w-full"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Site</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                                <input
                                    type="url"
                                    value={newSite.url}
                                    onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Domain Authority (DA)
                                </label>
                                <input
                                    type="number"
                                    value={newSite.domainAuthority}
                                    onChange={(e) =>
                                        setNewSite({ ...newSite, domainAuthority: parseInt(e.target.value) })
                                    }
                                    placeholder="0-100"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Niche</label>
                                <input
                                    type="text"
                                    value={newSite.niche}
                                    onChange={(e) => setNewSite({ ...newSite, niche: e.target.value })}
                                    placeholder="Technology, Marketing, etc."
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={newSite.contactEmail}
                                    onChange={(e) => setNewSite({ ...newSite, contactEmail: e.target.value })}
                                    placeholder="editor@example.com"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleAddSite}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
                            >
                                Add Site
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SitesManagement;
