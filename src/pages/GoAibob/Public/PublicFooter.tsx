import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicFooter: React.FC = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Features', path: '/go-aibob/features' },
            { label: 'Pricing', path: '/go-aibob/pricing' },
            { label: 'How It Works', path: '/go-aibob/how-it-works' },
            { label: 'Admin Dashboard', path: '/go-aibob/Admin' },
        ],
        company: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
            { label: 'Careers', path: '/careers' },
            { label: 'Blog', path: '/blog' },
        ],
        legal: [
            { label: 'Privacy Policy', path: '/privacy-policy' },
            { label: 'Terms of Service', path: '/terms-of-service' },
            { label: 'Cookie Policy', path: '/cookies' },
            { label: 'GDPR', path: '/gdpr' },
        ],
        support: [
            { label: 'Help Center', path: '/go-aibob/Admin/help' },
            { label: 'Documentation', path: '/docs' },
            { label: 'API Reference', path: '/api' },
            { label: 'Status', path: '/status' },
        ],
    };

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg">
                                Ω
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">GO-AIBOB</h3>
                                <p className="text-gray-400 text-xs">AI-Powered Guest Blogging</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Transform your guest blogging with AI automation. Discover, pitch, and manage placements effortlessly.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {['twitter', 'linkedin', 'github', 'youtube'].map((social) => (
                                <motion.a
                                    key={social}
                                    href={`#${social}`}
                                    className="w-9 h-9 bg-gray-800 hover:bg-gradient-to-br hover:from-cyan-600 hover:to-blue-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {social[0].toUpperCase()}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Legal Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Newsletter Subscription */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border-t border-gray-800 pt-8 mb-8"
                >
                    <div className="max-w-md mx-auto text-center">
                        <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Get the latest updates on AI-powered guest blogging
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                            />
                            <motion.button
                                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} GO-AIBOB by Gentle Omega AI. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                                Sitemap
                            </button>
                            <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                                Accessibility
                            </button>
                            <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                                Cookie Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Background Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
        </footer>
    );
};

export default PublicFooter;
