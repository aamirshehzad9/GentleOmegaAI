import React from 'react';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';

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
                    benefit: 'Know exactly what&apos;s working'
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <PublicHeader />

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Powerful Features for Modern Marketers
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Everything you need to automate guest blogging and build high-quality backlinks at scale
                        </p>
                    </motion.div>

                    <div className="space-y-20">
                        {features.map((category, catIdx) => (
                            <div key={catIdx}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4 mb-8"
                                >
                                    <div className="text-5xl">{category.icon}</div>
                                    <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                                </motion.div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {category.items.map((item, itemIdx) => (
                                        <motion.div
                                            key={itemIdx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: itemIdx * 0.1 }}
                                            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                                        >
                                            <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                            <p className="text-gray-300 mb-4">{item.description}</p>
                                            <div className="flex items-start gap-2 bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-3">
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
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">And Much More...</h2>
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
                                    className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center"
                                >
                                    <div className="text-4xl mb-3">{feature.icon}</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
