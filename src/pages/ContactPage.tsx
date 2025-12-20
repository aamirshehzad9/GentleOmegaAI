import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header'; // Adjust path if needed (root components vs src/components)
import Footer from '../../components/Footer';

// Since Header/Footer are in root components, we need to make sure we import them correctly.
// Based on file structure: d:\Pro\GentleOmegaAI\GentleOmegaAI\components\Header.tsx
// This file will be d:\Pro\GentleOmegaAI\GentleOmegaAI\src\pages\ContactPage.tsx
// So imports should be ../../components/Header

const ContactPage: React.FC = () => {
    const navigate = (path: string) => {
        window.location.href = path === 'home' ? '/' : `/${path}`;
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-sans">
            <Header navigate={navigate} currentPage="contact" />

            <main className="container mx-auto px-4 py-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-gray-400 text-lg">
                        We are here to assist you with any inquiries or support needs.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">📧</span> Email Support
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-black/30 rounded-xl border border-gray-700/50">
                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">General Inquiries</p>
                                <a href="mailto:info@gentleomegaai.space" className="text-cyan-400 hover:text-cyan-300 text-lg font-medium">info@gentleomegaai.space</a>
                            </div>
                            <div className="p-4 bg-black/30 rounded-xl border border-gray-700/50">
                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Customer Support</p>
                                <a href="mailto:support@gentleomegaai.space" className="text-cyan-400 hover:text-cyan-300 text-lg font-medium">support@gentleomegaai.space</a>
                            </div>
                            <div className="p-4 bg-black/30 rounded-xl border border-gray-700/50">
                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Business Contact</p>
                                <a href="mailto:contact@gentleomegaai.space" className="text-cyan-400 hover:text-cyan-300 text-lg font-medium">contact@gentleomegaai.space</a>
                            </div>
                            <div className="p-4 bg-black/30 rounded-xl border border-gray-700/50">
                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Press & Media</p>
                                <a href="mailto:press@gentleomegaai.space" className="text-cyan-400 hover:text-cyan-300 text-lg font-medium">press@gentleomegaai.space</a>
                            </div>
                            <div className="p-4 bg-black/30 rounded-xl border border-gray-700/50">
                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Fraud Alerts</p>
                                <a href="mailto:fraud-alert@gentleomegaai.space" className="text-cyan-400 hover:text-cyan-300 text-lg font-medium">fraud-alert@gentleomegaai.space</a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location & Phone Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">📍</span> Offices & Phone
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">United States</h3>
                                <p className="text-gray-400 mb-2">2105 Vista Oeste NW, Suite E #3519,<br />Albuquerque, NM 87120</p>
                                <a href="tel:+19208066680" className="text-white hover:text-cyan-400 flex items-center gap-2">
                                    <span>📱</span> +1 920 806 6680
                                </a>
                            </div>

                            <div className="h-px bg-gray-800" />

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Pakistan</h3>
                                <p className="text-gray-400 mb-2">Main Shahra-e-Faisal, near Nursery,<br />Block-6, Karachi</p>
                                <a href="tel:+923468066680" className="text-white hover:text-cyan-400 flex items-center gap-2">
                                    <span>📱</span> +92 346 806 6680
                                </a>
                            </div>

                            <div className="pt-4">
                                <a
                                    href="https://chat.whatsapp.com/HtgZw6ZrPyVGV2wIXGx6G7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] text-black px-4 py-2 rounded-lg font-bold hover:brightness-110 transition-all"
                                >
                                    <span>💬</span> Join WhatsApp Community
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Support Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-xl"
                >
                    <p className="text-cyan-200">
                        <span className="font-bold">Support Hours:</span> 12 PM – 12 AM (Mon–Sun)
                    </p>
                </motion.div>

            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
