import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicHeader: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', path: '/go-aibob' },
        { label: 'Features', path: '/go-aibob/features' },
        { label: 'How It Works', path: '/go-aibob/how-it-works' },
        { label: 'Pricing', path: '/go-aibob/pricing' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/go-aibob')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg">
                            Ω
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">GO-AIBOB</h1>
                            <p className="text-gray-400 text-xs">AI-Powered Guest Blogging</p>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 text-white hover:text-cyan-400 transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-300 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden py-4 border-t border-gray-800"
                    >
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium text-left"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => {
                                        navigate('/go-aibob/login');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium text-center border border-gray-700 rounded-lg"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/go-aibob/signup');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium text-sm"
                                >
                                    Get Started Free
                                </button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </div>
        </header>
    );
};

export default PublicHeader;
