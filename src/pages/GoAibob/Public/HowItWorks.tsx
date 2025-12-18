import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const HowItWorks: React.FC = () => {
    const navigate = useNavigate();

    const steps = [
        {
            number: '1',
            title: 'Define Your Niche & Audience',
            description: 'Enter your target niche, keywords, and audience preferences. Our AI understands your requirements and quality criteria.',
            icon: '🎯',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            number: '2',
            title: 'AI Discovers Premium Opportunities',
            description: 'GO-AIBOB scans millions of websites, analyzes Domain Authority (DA 30+), checks content relevance, and identifies high-quality guest posting opportunities.',
            icon: '🔍',
            color: 'from-blue-500 to-purple-500',
        },
        {
            number: '3',
            title: 'Review AI-Generated Insights',
            description: 'Browse curated opportunities with detailed analytics, read AI-powered insights about each site, filter by DA/niche, and save your favorites.',
            icon: '✅',
            color: 'from-purple-500 to-pink-500',
        },
        {
            number: '4',
            title: 'Generate Personalized Pitches',
            description: 'AI reads their existing content, identifies their writing style, suggests relevant topics, and creates custom email templates that actually get responses.',
            icon: '✍️',
            color: 'from-pink-500 to-red-500',
        },
        {
            number: '5',
            title: 'Send & Track Outreach',
            description: 'Send emails directly or export templates, track opens and clicks in real-time, get instant notifications on responses, and automated follow-ups.',
            icon: '📧',
            color: 'from-red-500 to-orange-500',
        },
        {
            number: '6',
            title: 'Manage Placements & ROI',
            description: 'Organize accepted pitches by status, set deadlines and reminders, track published backlinks, and measure your ROI with detailed analytics.',
            icon: '📊',
            color: 'from-orange-500 to-yellow-500',
        },
    ];

    const earningModels = [
        {
            title: 'For Content Writers',
            icon: '✍️',
            color: 'from-green-500 to-emerald-500',
            earnings: '$500 - $2,000/month',
            description: 'Monetize your writing skills by creating high-quality guest posts',
            benefits: [
                'Get discovered by GBOB owners looking for quality writers',
                'Set your own rates ($50-$200 per article)',
                'Build your portfolio with published backlinks',
                'Work on diverse topics across multiple niches',
                'Flexible schedule - work from anywhere',
                'Direct payments through the platform',
            ],
        },
        {
            title: 'For GBOB Owners',
            icon: '💼',
            color: 'from-blue-500 to-cyan-500',
            earnings: '$2,000 - $10,000/month',
            description: 'Scale your guest blogging outreach business with AI automation',
            benefits: [
                'Automate 90% of manual discovery work',
                'Handle 10x more clients with same team',
                'AI-powered quality control and vetting',
                'Real-time analytics for client reporting',
                'White-label platform for your brand',
                'Subscription + commission revenue model',
            ],
        },
    ];

    const transformation = [
        {
            before: 'Manual Search',
            after: 'AI Discovery',
            time: '8 hours → 5 minutes',
            icon: '🔍',
        },
        {
            before: 'Generic Templates',
            after: 'Personalized Pitches',
            time: '2 hours → 30 seconds',
            icon: '✍️',
            isSpecial: true,
        },
        {
            before: '5% Response Rate',
            after: '25% Response Rate',
            time: '5x Improvement',
            icon: '📈',
        },
        {
            before: '$100/month Tools',
            after: '$29/month All-in-One',
            time: '70% Cost Savings',
            icon: '💰',
        },
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

            {/* Hero Section */}
            <section className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            How GO-AIBOB <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                Transforms
                            </span>{' '}
                            Your Business
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            From manual outreach to autonomous AI agents. See how our platform helps content writers earn more and GBOB owners scale faster.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 6-Step Process */}
            <section className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            The 6-Step Autonomous Process
                        </h2>
                        <p className="text-xl text-gray-400">Sit back and watch the AI work</p>
                    </motion.div>

                    <div className="space-y-24">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    } gap-12 items-center`}
                            >
                                {/* Icon & Number */}
                                <div className="flex-shrink-0 group">
                                    <div
                                        className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-3xl flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                                    >
                                        <div className="text-5xl mb-2 drop-shadow-md">{step.icon}</div>
                                        <div className="absolute -top-6 -right-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-900 font-bold text-2xl shadow-xl transform group-hover:-translate-y-2 transition-transform">
                                            {step.number}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-10 hover:border-cyan-500/30 transition-all hover:bg-gray-800/60 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/5 to-transparent blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{step.title}</h3>
                                    <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Earning Potential Section */}
            <section className="relative z-10 py-32 bg-white/5 border-y border-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            💰 Unlock Your Earning Potential
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Whether you're a content writer or GBOB owner, our platform is built to maximize your revenue.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {earningModels.map((model, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-black/60 border border-white/10 rounded-3xl p-10 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_50px_rgba(6,182,212,0.1)] group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div
                                            className={`w-20 h-20 bg-gradient-to-br ${model.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-white/20`}
                                        >
                                            {model.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{model.title}</h3>
                                            <p className="text-cyan-400 font-bold text-xl">{model.earnings}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-8 text-lg font-light leading-relaxed border-b border-white/10 pb-8">{model.description}</p>
                                    <ul className="space-y-4">
                                        {model.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-green-400 text-sm font-bold">✓</span>
                                                </div>
                                                <span className="text-gray-300 font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Before vs After Transformation */}
            <section className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            The AI Transformation Effect
                        </h2>
                        <p className="text-xl text-gray-400">
                            See the difference AI automation makes
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {transformation.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-900/50 border border-white/5 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-all hover:bg-gray-800 group"
                            >
                                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                                <div className="mb-6 space-y-2">
                                    <p className="text-red-400/70 line-through text-sm font-medium">{item.before}</p>
                                    <div className="h-6 w-0.5 bg-gray-700 mx-auto my-1"></div>
                                    <p className="text-green-400 font-bold text-lg">{item.after}</p>
                                </div>
                                <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl py-3 px-4">
                                    <p className="text-cyan-300 font-bold text-sm tracking-wide">{item.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-20 shadow-[0_0_60px_rgba(6,182,212,0.15)] relative"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join content writers earning $500-$2,000/month and GBOB owners scaling to $10,000/month.
                        </p>
                        <motion.button
                            onClick={() => navigate('/signup')}
                            className="px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Earning Today - Free Trial
                        </motion.button>
                        <p className="text-gray-500 mt-6 text-sm font-medium">
                            No credit card required • 5 free outreach • Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <PublicFooter />
        </div>
    );
};

export default HowItWorks;
