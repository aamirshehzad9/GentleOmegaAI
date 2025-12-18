import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const PublicLanding: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            <PublicHeader />

            {/* Blue Aura Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-8 hover:bg-cyan-900/20 transition-colors cursor-pointer group">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        AI-Powered Guest Blogging Revolution
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
                        Manual Outreach <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                            Is Obsolete.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        Meet <span className="text-white font-semibold">GO-AIBOB</span>. The autonomous AI agent that discovers niches, identifies opportunities, and secures high-quality backlinks while you sleep.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <motion.button
                            onClick={() => navigate('/signup')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Free Today
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </motion.button>

                        <motion.button
                            onClick={() => navigate('/go-aibob/how-it-works')}
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-lg border border-white/10 hover:border-cyan-500/50 backdrop-blur-md transition-all duration-300 flex items-center gap-2 group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </span>
                            See How It Works
                        </motion.button>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            5 free outreach/month
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Setup in 2 minutes
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Glassmorphic Stats Section */}
            <section className="relative z-10 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-colors duration-500">
                        {[
                            { value: '50M+', label: 'Websites Scanned' },
                            { value: '98%', label: 'Placement Rate' },
                            { value: '5x', label: 'ROI Improvement' },
                            { value: '24/7', label: 'Autonomous Agents' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center group">
                                <h3 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-300">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem/Solution Cards with Holographic Effect */}
            <section className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Traditional Outreach is <span className="text-red-500/80 line-through decoration-red-500/50">Broken</span>
                        </h2>
                        <p className="text-xl text-gray-400">Stop wasting hundreds of hours on manual work.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '⏰', title: 'Time Drain', desc: '8+ hours/week identifying sites manually.' },
                            { icon: '📉', title: 'Zero Replies', desc: 'Generic templates get <2% response rate.' },
                            { icon: '🔍', title: 'Low Quality', desc: 'Risk of toxic backlinks hurting your SEO.' },
                            { icon: '💸', title: 'Expensive', desc: '$2000+ monthly for agencies or tools.' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative group bg-gray-900/40 border border-white/5 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-300">{item.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Solution Section */}
            <section className="relative z-10 py-20 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            The Intelligent <span className="text-cyan-400">Solution</span>
                        </h2>
                        <p className="text-xl text-gray-400">GO-AIBOB automates the entire process with autonomous agents.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Smart Discovery',
                                desc: 'AI scans millions of sites to find DA 30+ opportunities in your exact niche.',
                                color: 'from-cyan-500 to-blue-500',
                            },
                            {
                                title: 'Hyper-Personalization',
                                desc: 'Generates unique pitches referencing specific articles on the target blog.',
                                color: 'from-purple-500 to-pink-500',
                            },
                            {
                                title: 'Automated Follow-ups',
                                desc: 'Intelligent follow-up sequences that triple your response rates.',
                                color: 'from-orange-500 to-red-500',
                            },
                        ].map((solution, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="group bg-gray-900/40 border border-white/5 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:border-cyan-500/30 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${solution.color} opacity-5 blur-[50px] group-hover:opacity-10 transition-opacity`}></div>
                                <div className={`w-12 h-12 bg-gradient-to-br ${solution.color} rounded-xl mb-6 shadow-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{solution.title}</h3>
                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{solution.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="relative z-10 py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/20 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/10 blur-[100px] rounded-full"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-20 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                            Ready to Scale?
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                            Join the new era of autonomous guest blogging. Stop searching, start scaling.
                        </p>
                        <motion.button
                            onClick={() => navigate('/signup')}
                            className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Your Free 14-Day Trial
                        </motion.button>
                        <p className="text-gray-500 mt-6 text-sm">
                            Limited spots available for beta pricing.
                        </p>
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default PublicLanding;
