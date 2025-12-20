import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/go-aibob/Admin' },
        {
            id: 'ai-services',
            label: 'AI Services',
            icon: '🤖',
            children: [
                { id: 'ai-test', label: 'Test Connection', icon: '🔌', path: '/go-aibob/Admin/ai-test' },
                { id: 'ai-review', label: 'Review Suggestions', icon: '✅', path: '/go-aibob/Admin/ai-review' },
                { id: 'ai-metrics', label: 'Performance Metrics', icon: '📈', path: '/go-aibob/Admin/ai-metrics' },
            ],
        },
        { id: 'sites', label: 'Sites Management', icon: '🌐', path: '/go-aibob/Admin/sites' },
        { id: 'import', label: 'Import/Export', icon: '📤', path: '/go-aibob/Admin/import' },
        { id: 'orders', label: 'Orders', icon: '💰', path: '/go-aibob/Admin/orders' },
        { id: 'analytics', label: 'Analytics', icon: '📊', path: '/go-aibob/Admin/analytics' },
        { id: 'api-access', label: 'API Access', icon: '🔑', path: '/go-aibob/Admin/api-access' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/go-aibob/Admin/settings' },
        { id: 'help', label: 'Help & Support', icon: '🔧', path: '/go-aibob/Admin/help' },
    ];

    const [expandedItems, setExpandedItems] = React.useState<string[]>(['ai-services']);

    const toggleExpand = (itemId: string) => {
        setExpandedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.div
            animate={{ width: isOpen ? 280 : 80 }}
            className="bg-gray-900 border-r border-gray-700 overflow-hidden transition-all duration-300 relative flex flex-col h-screen"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between">
                    {isOpen && (
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => navigate('/go-aibob')}
                            >
                                Ω
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">GO-AIBOB</h2>
                                <p className="text-gray-400 text-xs">Admin Panel</p>
                            </div>
                        </div>
                    )}
                    {!isOpen && (
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg mx-auto cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => navigate('/go-aibob')}
                        >
                            Ω
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="text-gray-400 hover:text-white transition-colors ml-auto"
                    >
                        {isOpen ? '◄' : '►'}
                    </button>
                </div>
            </div>

            {/* Back to Public Site */}
            {isOpen && (
                <div className="px-4 pt-4">
                    <motion.button
                        onClick={() => navigate('/go-aibob')}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all flex items-center gap-2 text-sm border border-gray-700/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>←</span>
                        <span>Back to Public Site</span>
                    </motion.button>
                </div>
            )}

            {/* Navigation */}
            <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                    <div key={item.id}>
                        {item.children ? (
                            // Parent with children
                            <div>
                                <motion.button
                                    onClick={() => toggleExpand(item.id)}
                                    className="w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-left hover:bg-gray-800 text-gray-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                                    {isOpen && (
                                        <>
                                            <span className="flex-1">{item.label}</span>
                                            <span className="text-sm">
                                                {expandedItems.includes(item.id) ? '▼' : '►'}
                                            </span>
                                        </>
                                    )}
                                </motion.button>

                                {/* Children */}
                                {expandedItems.includes(item.id) && isOpen && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        {item.children.map((child) => (
                                            <motion.button
                                                key={child.id}
                                                onClick={() => navigate(child.path)}
                                                className={`w-full px-4 py-2 rounded-lg transition-all flex items-center gap-3 text-left text-sm ${isActive(child.path)
                                                    ? 'bg-cyan-600/20 border border-cyan-500 text-cyan-400'
                                                    : 'hover:bg-gray-800 text-gray-300'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <span className="text-lg flex-shrink-0">{child.icon}</span>
                                                <span>{child.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Single item
                            <motion.button
                                onClick={() => navigate(item.path!)}
                                className={`w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-left ${isActive(item.path!)
                                    ? 'bg-cyan-600/20 border border-cyan-500 text-cyan-400'
                                    : 'hover:bg-gray-800 text-gray-300'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                {isOpen && <span className="block">{item.label}</span>}
                            </motion.button>
                        )}
                    </div>
                ))}
            </nav>

            {/* Help Tip */}
            {isOpen && (
                <div className="p-4 flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-300 backdrop-blur-sm"
                    >
                        <p className="font-semibold mb-1 flex items-center gap-2">
                            <span>💡</span> Quick Tip
                        </p>
                        <p className="text-xs text-blue-200">
                            Use Help & Support for detailed guides and troubleshooting
                        </p>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default AdminSidebar;
