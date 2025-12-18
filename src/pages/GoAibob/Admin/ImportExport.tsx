import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const ImportExport: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');

    const handleExport = (type: string) => {
        // Mock export functionality
        const data = {
            sites: [],
            suggestions: [],
            orders: [],
            analytics: [],
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `goaibob-${type}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 overflow-auto">
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Import / Export</h1>
                        <p className="text-gray-400">Bulk operations for your data</p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Tabs */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('import')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'import'
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                📥 Import Data
                            </button>
                            <button
                                onClick={() => setActiveTab('export')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'export'
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                📤 Export Data
                            </button>
                        </div>

                        {activeTab === 'import' ? (
                            <div className="space-y-6">
                                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                                    <div className="text-6xl mb-4">📥</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Import Your Data</h3>
                                    <p className="text-gray-400 mb-6">
                                        Upload JSON or CSV files to import sites, suggestions, or orders
                                    </p>
                                    <input
                                        type="file"
                                        accept=".json,.csv"
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold cursor-pointer transition-all"
                                    >
                                        Choose File
                                    </label>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-6">
                                    <h4 className="text-lg font-semibold text-blue-400 mb-2">📝 Import Guidelines</h4>
                                    <ul className="text-blue-300 space-y-2 text-sm">
                                        <li>• Supported formats: JSON, CSV</li>
                                        <li>• Maximum file size: 10MB</li>
                                        <li>• Duplicate entries will be skipped</li>
                                        <li>• Invalid data will be logged for review</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {[
                                    { type: 'sites', label: 'Sites Database', icon: '🌐', desc: 'All target websites' },
                                    { type: 'suggestions', label: 'AI Suggestions', icon: '🤖', desc: 'AI-generated content' },
                                    { type: 'orders', label: 'Orders', icon: '💰', desc: 'Guest post placements' },
                                    { type: 'analytics', label: 'Analytics', icon: '📊', desc: 'Performance data' },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={item.type}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl">{item.icon}</div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white">{item.label}</h3>
                                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleExport(item.type)}
                                                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
                                            >
                                                Export JSON
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportExport;
