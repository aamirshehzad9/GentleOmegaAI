import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../../../firebase/config';
import { isAdmin } from '../../../utils/admin-check';

const PublicHeader: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Listen to Auth State
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setUserIsAdmin(isAdmin(currentUser.email));
            }
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribe();
        };
    }, []);

    const navLinks = [
        { name: 'Home', path: '/go-aibob' },
        { name: 'Features', path: '/go-aibob/features' },
        { name: 'How It Works', path: '/go-aibob/how-it-works' },
        { name: 'Pricing', path: '/go-aibob/pricing' },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(37,99,235,0.1)]'
                : 'bg-transparent'
                }`}
        >
            {/* Blue Aura Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Area */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/go-aibob')}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300">
                                Ω
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                                GO-AIBOB
                            </h1>
                            <span className="text-[10px] text-cyan-400/80 font-medium tracking-widest uppercase">
                                by Gentle Omega AI
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => navigate(link.path)}
                                className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors group py-2"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
                            </button>
                        ))}
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="text-sm text-gray-400 mr-2">
                                    Hello, <span className="text-cyan-400 font-bold">{user.displayName || 'User'}</span>
                                </div>
                                {userIsAdmin && (
                                    <button
                                        onClick={() => navigate('/go-aibob/Admin')}
                                        className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold shadow-lg transition-all"
                                    >
                                        Admin Panel
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/dashboard')} // Or generic user dashboard
                                    className="px-5 py-2 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors font-medium"
                                >
                                    Dashboard
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2 text-gray-300 hover:text-white hover:text-shadow-cyan transition-all font-medium text-sm"
                                >
                                    Login
                                </button>
                                <motion.button
                                    onClick={() => navigate('/signup')}
                                    className="relative overflow-hidden group px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all border border-white/10"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="relative z-10 transition-colors">Get Started Free</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity blur-md"></div>
                                </motion.button>
                            </>
                        )}
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
                            {navLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        navigate(link.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium text-left"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
                                {user ? (
                                    <>
                                        {userIsAdmin && (
                                            <button
                                                onClick={() => {
                                                    navigate('/go-aibob/Admin');
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                                            >
                                                Admin Panel
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                navigate('/dashboard');
                                                setMobileMenuOpen(false);
                                            }}
                                            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium"
                                        >
                                            Dashboard
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate('/login');
                                                setMobileMenuOpen(false);
                                            }}
                                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium text-center border border-gray-700 rounded-lg"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate('/signup');
                                                setMobileMenuOpen(false);
                                            }}
                                            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium text-sm"
                                        >
                                            Get Started Free
                                        </button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
};

export default PublicHeader;
