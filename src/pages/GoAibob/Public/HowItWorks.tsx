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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            How GO-AIBOB{' '}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Transforms
                            </span>{' '}
                            Your Business
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            From manual outreach to AI-powered automation. See how our platform helps content writers earn more and GBOB owners scale faster.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 6-Step Process */}
            <section className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            The 6-Step Process
                        </h2>
                        <p className="text-xl text-gray-300">Simple, automated, and effective</p>
                    </motion.div>

                    <div className="space-y-12">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    } gap-8 items-center`}
                            >
                                {/* Icon & Number */}
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-2xl flex flex-col items-center justify-center shadow-2xl relative`}
                                    >
                                        <div className="text-5xl mb-2">{step.icon}</div>
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold text-xl shadow-lg">
                                            {step.number}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-cyan-500/50 transition-all">
                                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Earning Potential Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            💰 Earning Potential with GO-AIBOB
                        </h2>
                        <p className="text-xl text-gray-300">
                            Whether you're a content writer or GBOB owner, our platform helps you earn more
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
                                className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-br ${model.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`}
                                    >
                                        {model.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{model.title}</h3>
                                        <p className="text-cyan-400 font-semibold text-lg">{model.earnings}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6">{model.description}</p>
                                <ul className="space-y-3">
                                    {model.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                                            <span className="text-gray-300">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Before vs After Transformation */}
            <section className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            ⚡ The AI Transformation
                        </h2>
                        <p className="text-xl text-gray-300">
                            See how GO-AIBOB revolutionizes your GBOB workflow
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
                                className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <div className="mb-4">
                                    <p className="text-red-400 line-through text-sm mb-1">{item.before}</p>
                                    <p className="text-green-400 font-semibold">{item.after}</p>
                                </div>
                                <div className="bg-cyan-600/20 border border-cyan-500/50 rounded-lg py-2 px-3">
                                    <p className="text-cyan-400 font-bold text-sm">{item.time}</p>
                                </div>
                            </motion.div>
                        ))}
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
                            Ready to Transform Your Guest Blogging Business?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join content writers earning $500-$2,000/month and GBOB owners scaling to $10,000/month
                        </p>
                        <motion.button
                            onClick={() => navigate('/signup')}
                            className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold text-xl shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Earning Today - Free Trial
                        </motion.button>
                        <p className="text-gray-400 mt-4">
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
