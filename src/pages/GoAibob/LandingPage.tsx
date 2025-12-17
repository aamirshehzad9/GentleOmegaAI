/**
 * GO-AIBOB Landing Page
 * Public-facing page for visitors (non-authenticated users)
 * Shows what GO-AIBOB is and prompts for login
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
    onLoginClick: () => void;
}

const GoAibobLandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-gray-900 to-[#0D0D0D] flex items-center justify-center px-4 relative">
            {/* Back to Home Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
            >
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back to Home</span>
            </motion.button>

            <div className="max-w-4xl w-full">{/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    {/* Logo/Icon */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/50 mb-6">
                            <span className="text-5xl font-bold text-white">Ω</span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-6xl font-bold text-white mb-4"
                    >
                        GO-AIBOB
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-cyan-400 mb-6"
                    >
                        Guest Opportunity Bot
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        AI-powered platform for discovering and managing guest posting opportunities.
                        Automated backlink marketplace with real-time analytics and intelligent site scoring.
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    <FeatureCard
                        icon="🤖"
                        title="AI-Powered"
                        description="Automated site discovery and quality scoring"
                        delay={0.7}
                    />
                    <FeatureCard
                        icon="📊"
                        title="Real-time Analytics"
                        description="Live statistics and performance tracking"
                        delay={0.8}
                    />
                    <FeatureCard
                        icon="💰"
                        title="Backlink Marketplace"
                        description="Buy and sell high-quality backlinks"
                        delay={0.9}
                    />
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center"
                >
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-4">
                            <span className="text-2xl">🔒</span>
                            <span className="text-cyan-400 font-semibold">Admin Access Required</span>
                        </div>
                        <p className="text-gray-300 text-lg">
                            GO-AIBOB is an admin-only platform for managing guest posting operations.
                        </p>
                    </div>

                    {/* Login Button */}
                    <motion.button
                        onClick={onLoginClick}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
                    >
                        Login to Access Dashboard
                    </motion.button>

                    <p className="text-gray-500 text-sm mt-4">
                        Don't have access? Contact your administrator.
                    </p>
                </motion.div>

                {/* Stats Preview (Optional) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-12 grid grid-cols-3 gap-4 text-center"
                >
                    <StatBox label="Sites Analyzed" value="10,000+" />
                    <StatBox label="Avg. Domain Rating" value="65+" />
                    <StatBox label="Success Rate" value="94%" />
                </motion.div>
            </div>
        </div>
    );
};

// Feature Card Component
const FeatureCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    delay: number;
}> = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(6, 182, 212, 0.3)" }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300"
    >
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
);

// Stat Box Component
const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
        <div className="text-cyan-400 text-2xl font-bold mb-1">{value}</div>
        <div className="text-gray-500 text-xs uppercase tracking-wide">{label}</div>
    </div>
);

export default GoAibobLandingPage;
