import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const AdminSettings: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [settings, setSettings] = useState({
        siteName: 'GO-AIBOB',
        adminEmail: 'admin@goaibob.com',
        autoApprove: false,
        emailNotifications: true,
        aiConfidenceThreshold: 80,
        maxOutreachPerDay: 50,
    });

    const handleSave = () => {
        // Save settings logic
        alert('Settings saved successfully!');
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 overflow-auto">
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
                        <p className="text-gray-400">Configure platform preferences</p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* General Settings */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">General Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Admin Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.adminEmail}
                                        onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* AI Settings */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">AI Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Auto-Approve Suggestions</p>
                                        <p className="text-gray-400 text-sm">
                                            Automatically approve AI suggestions above threshold
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSettings({ ...settings, autoApprove: !settings.autoApprove })
                                        }
                                        className={`w-14 h-8 rounded-full transition-colors ${settings.autoApprove ? 'bg-cyan-600' : 'bg-gray-700'
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.autoApprove ? 'translate-x-7' : 'translate-x-1'
                                                }`}
                                        ></div>
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        AI Confidence Threshold ({settings.aiConfidenceThreshold}%)
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={settings.aiConfidenceThreshold}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                aiConfidenceThreshold: parseInt(e.target.value),
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Outreach Settings */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Outreach Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Max Outreach Per Day
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.maxOutreachPerDay}
                                        onChange={(e) =>
                                            setSettings({ ...settings, maxOutreachPerDay: parseInt(e.target.value) })
                                        }
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Email Notifications</p>
                                        <p className="text-gray-400 text-sm">Receive email updates on responses</p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSettings({
                                                ...settings,
                                                emailNotifications: !settings.emailNotifications,
                                            })
                                        }
                                        className={`w-14 h-8 rounded-full transition-colors ${settings.emailNotifications ? 'bg-cyan-600' : 'bg-gray-700'
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                                                }`}
                                        ></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
