import React from 'react';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            number: 1,
            title: 'Define Your Niche',
            description: 'Tell GO-AIBOB about your industry, target audience, and content focus',
            details: [
                'Enter your niche keywords',
                'Specify target audience demographics',
                'Set your content preferences',
                'Define quality criteria (DA, traffic, etc.)'
            ],
            icon: '🎯'
        },
        {
            number: 2,
            title: 'AI Discovers Opportunities',
            description: 'Our AI scans millions of websites to find perfect guest posting matches',
            details: [
                'AI analyzes website content and style',
                'Checks domain authority and metrics',
                'Identifies content gaps and needs',
                'Filters out low-quality sites automatically'
            ],
            icon: '🔍'
        },
        {
            number: 3,
            title: 'Review & Select',
            description: 'Browse AI-curated opportunities and choose which ones to pursue',
            details: [
                'See detailed site analytics',
                'Read AI-generated insights',
                'Filter by DA, traffic, niche relevance',
                'Save favorites for later'
            ],
            icon: '✅'
        },
        {
            number: 4,
            title: 'Generate Personalized Pitches',
            description: 'AI creates custom email templates that reference their actual content',
            details: [
                'AI reads their recent posts',
                'Identifies their writing style',
                'Suggests relevant topics',
                'Creates personalized outreach email'
            ],
            icon: '✍️'
        },
        {
            number: 5,
            title: 'Send & Track',
            description: 'Launch your campaign and monitor responses in real-time',
            details: [
                'Send emails directly or export',
                'Track opens and clicks',
                'Get notified of responses',
                'Automated follow-up sequences'
            ],
            icon: '📧'
        },
        {
            number: 6,
            title: 'Manage Placements',
            description: 'Keep track of accepted pitches, deadlines, and published posts',
            details: [
                'Organize by status (pending, accepted, published)',
                'Set reminders for deadlines',
                'Track backlink status',
                'Measure ROI and performance'
            ],
            icon: '📊'
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
                            How GO-AIBOB Works
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            From niche discovery to backlink placement in 6 simple steps
                        </p>
                    </motion.div>

                    <div className="space-y-12">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                <div className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Step Number & Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <div className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
                                                <div className="text-6xl">{step.icon}</div>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-900 border-4 border-cyan-500 rounded-full flex items-center justify-center">
                                                <span className="text-2xl font-bold text-white">{step.number}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-8">
                                        <h2 className="text-3xl font-bold text-white mb-3">{step.title}</h2>
                                        <p className="text-xl text-gray-300 mb-6">{step.description}</p>
                                        <ul className="space-y-3">
                                            {step.details.map((detail, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <svg className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-gray-300">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block absolute left-16 top-32 w-0.5 h-12 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Video Demo Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center"
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">See It In Action</h2>
                        <p className="text-gray-300 mb-8">Watch a 2-minute demo of GO-AIBOB in action</p>
                        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🎥</div>
                                <p className="text-gray-400">Video demo coming soon</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
