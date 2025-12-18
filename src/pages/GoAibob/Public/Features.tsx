import React from 'react';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const Features: React.FC = () => {
    const features = [
        {
            category: 'AI-Powered Discovery',
            icon: '🤖',
            items: [
                {
                    title: 'Smart Niche Detection',
                    description: 'AI analyzes millions of websites to find perfect guest posting opportunities in your specific niche',
                    benefit: 'Save 10+ hours per week on manual research'
                },
                {
                    title: 'Domain Authority Analysis',
                    description: 'Automatically checks DA, traffic, and engagement metrics for every opportunity',
                    benefit: 'Only reach out to high-quality websites'
                },
                {
                    title: 'Content Gap Identification',
                    description: 'AI reads their existing content and suggests topics they need',
                    benefit: 'Higher acceptance rates with relevant pitches'
                }
            ]
        },
        {
            category: 'Personalized Outreach',
            icon: '✍️',
            items: [
                {
                    title: 'AI Email Generation',
                    description: 'Creates custom, human-like pitches that reference their actual content',
                    benefit: 'Escape the spam folder, land in inbox'
                },
                {
                    title: 'Multi-Template System',
                    description: 'Choose from proven templates or create your own with AI assistance',
                    benefit: 'A/B test different approaches automatically'
                },
                {
                    title: 'Follow-up Automation',
                    description: 'Smart follow-ups that know when and how to re-engage',
                    benefit: '3x response rate with automated sequences'
                }
            ]
        },
        {
            category: 'Analytics & Tracking',
            icon: '📊',
            items: [
                {
                    title: 'Real-Time Dashboard',
                    description: 'Track opens, clicks, responses, and conversions in one place',
                    benefit: 'Know exactly what\'s working'
                },
                {
                    title: 'Performance Insights',
                    description: 'AI analyzes your campaigns and suggests improvements',
                    benefit: 'Continuously optimize your strategy'
                },
                {
                    title: 'ROI Calculator',
                    description: 'Track the value of every backlink and guest post placement',
                    benefit: 'Prove the value of your outreach efforts'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 selection:text-cyan-200">
            <PublicHeader />

            {/* Blue Aura Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"></div>
            </div>

            <section className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Modern Marketers</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Everything you need to automate guest blogging and build high-quality backlinks at scale, all powered by autonomous AI agents.
                        </p>
                    </motion.div>

                    <div className="space-y-32">
                        {features.map((category, catIdx) => (
                            <div key={catIdx}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-6 mb-12"
                                >
                                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.1)] text-5xl">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-4xl font-bold text-white">{category.category}</h2>
                                </motion.div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {category.items.map((item, itemIdx) => (
                                        <motion.div
                                            key={itemIdx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: itemIdx * 0.1 }}
                                            className="group bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-gray-800/60 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.15)] relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                            <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300">{item.description}</p>

                                            <div className="flex items-start gap-3 bg-black/40 border border-white/5 rounded-xl p-4 group-hover:border-cyan-500/20 transition-colors">
                                                <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <p className="text-cyan-300 text-sm font-medium">{item.benefit}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Features Grid */}
                    <div className="mt-32">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold text-white mb-4">But Wait, There's More...</h2>
                            <p className="text-gray-400">Designed for enterprise scale and individual efficiency</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: '⚡', title: 'Lightning Fast', desc: 'Process 100+ opportunities in minutes' },
                                { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and protected' },
                                { icon: '🌍', title: 'Multi-Language', desc: 'Support for 50+ languages' },
                                { icon: '📱', title: 'Mobile Ready', desc: 'Manage campaigns on the go' },
                                { icon: '🔗', title: 'API Access', desc: 'Integrate with your tools' },
                                { icon: '👥', title: 'Team Collaboration', desc: 'Work together seamlessly' },
                                { icon: '📈', title: 'Growth Tracking', desc: 'Monitor your backlink portfolio' },
                                { icon: '🎯', title: 'Smart Targeting', desc: 'AI finds your ideal prospects' },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <PublicFooter />
        </div>
    );
};

export default Features;
