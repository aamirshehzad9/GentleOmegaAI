import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';

const PublicLanding: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Manual Outreach ka zamana gaya—
                            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Meet GO-AIBOB
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            AI-Powered Guest Blogging Platform that transforms how you discover niches,
                            find opportunities, and build high-quality backlinks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                onClick={() => navigate('/go-aibob/signup')}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold text-lg shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Free Today
                            </motion.button>
                            <motion.button
                                onClick={() => navigate('/go-aibob/how-it-works')}
                                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg border border-gray-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                See How It Works
                            </motion.button>
                        </div>
                        <p className="text-gray-400 mt-6">
                            ✨ No credit card required • 🚀 5 free outreach/month • ⚡ Setup in 2 minutes
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Traditional Guest Blogging is Broken
                        </h2>
                        <p className="text-xl text-gray-300">Here's why manual outreach doesn't work anymore</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '⏰', title: 'Time-Consuming', desc: 'Hours spent finding relevant websites manually' },
                            { icon: '📧', title: 'Generic Emails', desc: 'Copy-paste templates that end up in spam' },
                            { icon: '📉', title: 'Low Response Rate', desc: 'Less than 5% conversion on cold outreach' },
                            { icon: '💸', title: 'Expensive Tools', desc: 'Pay $100+/month for basic features' },
                        ].map((problem, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-red-900/20 border border-red-700/50 rounded-lg p-6"
                            >
                                <div className="text-4xl mb-4">{problem.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                                <p className="text-gray-300">{problem.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Solution Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            GO-AIBOB: The AI-Powered Solution
                        </h2>
                        <p className="text-xl text-gray-300">Automate what's boring, personalize what matters</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🤖',
                                title: 'AI-Automated Discovery',
                                desc: 'Our AI scans millions of websites to find perfect guest posting opportunities in your niche',
                                color: 'from-cyan-500 to-blue-500'
                            },
                            {
                                icon: '✍️',
                                title: 'Personalized Outreach',
                                desc: 'Generate custom, human-like pitches that actually get responses—no more spam folder',
                                color: 'from-blue-500 to-purple-500'
                            },
                            {
                                icon: '📊',
                                title: 'Real-Time Analytics',
                                desc: 'Track every outreach, monitor responses, and optimize your strategy with data',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: '⚡',
                                title: 'Lightning Fast',
                                desc: 'What takes days manually, GO-AIBOB does in minutes with higher accuracy',
                                color: 'from-pink-500 to-red-500'
                            },
                            {
                                icon: '💰',
                                title: 'Cost-Effective',
                                desc: 'Start free, scale affordably. No hidden fees, no expensive contracts',
                                color: 'from-red-500 to-orange-500'
                            },
                            {
                                icon: '🎯',
                                title: 'Quality Focused',
                                desc: 'AI vets every opportunity for domain authority, relevance, and engagement',
                                color: 'from-orange-500 to-yellow-500'
                            },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-3xl mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-300">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How GO-AIBOB Works
                        </h2>
                        <p className="text-xl text-gray-300">5 simple steps to guest blogging success</p>
                    </motion.div>

                    <div className="space-y-8">
                        {[
                            { step: '1', title: 'AI Finds Relevant Websites', desc: 'Enter your niche and target audience. Our AI scans the web for high-quality guest posting opportunities.' },
                            { step: '2', title: 'Analyzes Their Content', desc: 'GO-AIBOB reads their existing content, understands their style, and identifies what topics they need.' },
                            { step: '3', title: 'Generates Personalized Pitches', desc: 'Creates custom email templates that reference their content and explain why your guest post is perfect for them.' },
                            {
                                step: '4', title: 'Tracks Responses', desc: 'Monitor all your outreach in one dashboard. See who opened, who replied, and who&apos;s interested.'
                            },
                            { step: '5', title: 'Manages Placements', desc: 'Keep track of accepted pitches, deadlines, and published posts. Build your backlink portfolio.' },
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-6 items-start"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {step.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-300 text-lg">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <motion.button
                            onClick={() => navigate('/go-aibob/how-it-works')}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold text-lg shadow-xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            See Detailed Walkthrough →
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-2xl p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Guest Blogging?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of marketers who've automated their outreach with GO-AIBOB
                        </p>
                        <motion.button
                            onClick={() => navigate('/go-aibob/signup')}
                            className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold text-xl shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Your Free Trial Now
                        </motion.button>
                        <p className="text-gray-400 mt-4">
                            No credit card required • Cancel anytime • Full access to all features
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default PublicLanding;
