import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../../../contexts/AuthContext'; // Correct path

interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: Date;
    lastUsed: Date | null;
    status: 'active' | 'revoked';
}

const ApiAccess: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // Mock state for now - in real app, fetch from Firestore
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([
        {
            id: '1',
            name: 'Development Key',
            key: 'go_aibob_test_k8s92...9d2x',
            createdAt: new Date('2024-12-01'),
            lastUsed: new Date(),
            status: 'active'
        }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);
    const [generatedKey, setGeneratedKey] = useState('');

    const handleGenerateKey = () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            const rawKey = 'go_aibob_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const newKey: ApiKey = {
                id: Date.now().toString(),
                name: newKeyName || 'New API Key',
                key: rawKey,
                createdAt: new Date(),
                lastUsed: null,
                status: 'active'
            };
            setApiKeys([newKey, ...apiKeys]);
            setGeneratedKey(rawKey);
            setIsGenerating(false);
            setShowNewKeyModal(false);
            setNewKeyName(''); // Reset
        }, 1000);
    };

    const handleRevoke = (id: string) => {
        if (confirm('Are you sure you want to revoke this key? This action cannot be undone.')) {
            setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 overflow-auto">
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">API Access</h1>
                            <p className="text-gray-400">Manage your API keys for programmatic access</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNewKeyModal(true)}
                            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2"
                        >
                            <span>+</span> Generate New Key
                        </motion.button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Active Keys List */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700">
                                <h3 className="text-xl font-semibold text-white">Your API Keys</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {apiKeys.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        No API keys found. Generate one to get started.
                                    </div>
                                ) : (
                                    apiKeys.map((key) => (
                                        <motion.div
                                            key={key.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`flex items-center justify-between p-4 rounded-lg border ${key.status === 'active' ? 'bg-gray-900 border-gray-700' : 'bg-red-900/10 border-red-900/30'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className={`font-medium ${key.status === 'active' ? 'text-white' : 'text-gray-500'}`}>{key.name}</h4>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${key.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                        }`}>
                                                        {key.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 font-mono text-sm text-gray-400">
                                                    <span>{key.key}</span>
                                                    {key.status === 'active' && !key.key.includes('...') && (
                                                        <button
                                                            onClick={() => copyToClipboard(key.key)}
                                                            className="text-cyan-400 hover:text-cyan-300"
                                                        >
                                                            📋
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2 flex gap-4">
                                                    <span>Created: {key.createdAt.toLocaleDateString()}</span>
                                                    <span>Last used: {key.lastUsed ? key.lastUsed.toLocaleDateString() : 'Never'}</span>
                                                </div>
                                            </div>

                                            {key.status === 'active' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleRevoke(key.id)}
                                                        className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors text-sm"
                                                    >
                                                        Revoke
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Usage (Placeholder) */}
                        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Usage Limits</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Daily Requests</p>
                                    <p className="text-2xl font-bold text-white">452 <span className="text-gray-500 text-sm font-normal">/ 10,000</span></p>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
                                        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '4.5%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Errors (24h)</p>
                                    <p className="text-2xl font-bold text-green-400">0%</p>
                                </div>
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Avg Latency</p>
                                    <p className="text-2xl font-bold text-white">124ms</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Key Modal */}
                <AnimatePresence>
                    {showNewKeyModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">Create New API Key</h2>
                                <p className="text-gray-400 mb-6">Enter a name for this key to identify it later.</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Key Name</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="e.g., Production Server, Mobile App"
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setShowNewKeyModal(false)}
                                            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleGenerateKey}
                                            disabled={!newKeyName.trim() || isGenerating}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isGenerating ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                            ) : (
                                                'Create Key'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Success Reveal Modal */}
                <AnimatePresence>
                    {generatedKey && !showNewKeyModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-gray-900 border border-green-500/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-cyan-500"></div>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎉</div>
                                    <h2 className="text-2xl font-bold text-white mb-2">API Key Generated</h2>
                                    <p className="text-gray-400 text-sm">Please copy this key immediately. It will not be shown again.</p>
                                </div>

                                <div className="bg-black/50 border border-gray-700 rounded-xl p-4 mb-6 flex items-center justify-between group relative">
                                    <code className="text-green-400 font-mono text-sm break-all">{generatedKey}</code>
                                    <button
                                        onClick={() => copyToClipboard(generatedKey)}
                                        className="ml-4 p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        📋
                                    </button>
                                </div>

                                <button
                                    onClick={() => setGeneratedKey('')}
                                    className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    I have saved the key
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ApiAccess;
