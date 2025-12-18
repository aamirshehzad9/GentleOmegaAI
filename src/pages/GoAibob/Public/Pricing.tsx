import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const Pricing: React.FC = () => {
    const navigate = useNavigate();

    const tiers = [
        {
            name: 'Free Forever',
            price: '$0',
            period: 'forever',
            description: 'Perfect for trying out GO-AIBOB',
            features: [
                '5 AI-powered outreach/month',
                'Basic niche discovery',
                'Email template generation',
                'Response tracking',
                'Community support',
                'Basic analytics',
            ],
            cta: 'Start Free',
            popular: false,
            color: 'from-gray-600 to-gray-700',
        },
        {
            name: 'Starter',
            price: '$29',
            period: '/month',
            description: 'For freelancers and solo marketers',
            features: [
                '50 AI-powered outreach/month',
                'Advanced niche discovery',
                'Personalized pitch generation',
                'Full analytics dashboard',
                'Email support',
                'Template library access',
                'CSV export',
            ],
            cta: 'Get Started',
            popular: false,
            color: 'from-blue-600 to-blue-700',
        },
        {
            name: 'Professional',
            price: '$99',
            period: '/month',
            description: 'For growing agencies and teams',
            features: [
                '200 AI-powered outreach/month',
                'Priority AI processing',
                'Custom templates',
                'Advanced analytics',
                'Priority support',
                'API access',
                'Team collaboration (3 users)',
                'White-label reports',
            ],
            cta: 'Go Pro',
            popular: true,
            color: 'from-cyan-600 to-blue-600',
        },
        {
            name: 'Agency',
            price: '$299',
            period: '/month',
            description: 'For established agencies',
            features: [
                '1000 AI-powered outreach/month',
                'Dedicated AI resources',
                'Unlimited templates',
                'Enterprise analytics',
                'Dedicated support',
                'Full API access',
                'Unlimited team members',
                'White-label platform',
                'Custom integrations',
            ],
            cta: 'Contact Sales',
            popular: false,
            color: 'from-purple-600 to-pink-600',
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

            <section className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Pricing</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Start free, scale as you grow. No hidden fees, cancel anytime.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tiers.map((tier, idx) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative bg-gray-900/40 backdrop-blur-md rounded-2xl p-8 border ${tier.popular ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.15)] transform scale-105 z-10' : 'border-white/10 hover:border-cyan-500/30'
                                    } transition-all duration-300 hover:bg-gray-800/60 flex flex-col`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                                        <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg border border-white/20">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-8 pt-2">
                                    <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                    <p className="text-gray-400 text-sm mb-6 h-10 flex items-center justify-center">{tier.description}</p>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-5xl font-bold text-white tracking-tight">{tier.price}</span>
                                        <span className="text-gray-400 ml-2 font-medium">{tier.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <motion.button
                                    onClick={() => navigate('/signup')}
                                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r ${tier.color} hover:brightness-110 transition-all border border-white/10`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {tier.cta}
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-32 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: 'Can I change plans later?',
                                    a: 'Yes! Upgrade or downgrade anytime. Changes take effect immediately.',
                                },
                                {
                                    q: 'What happens to unused credits?',
                                    a: 'Unused credits roll over to the next month (up to 2x your monthly limit).',
                                },
                                {
                                    q: 'Is there a contract?',
                                    answer: 'No contracts. Pay monthly or yearly and cancel anytime with no penalties.',
                                },
                                {
                                    q: 'Do you offer refunds?',
                                    a: '30-day money-back guarantee if you\'re not satisfied.',
                                },
                            ].map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/10 hover:border-cyan-500/20 transition-all cursor-default"
                                >
                                    <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
                                    <p className="text-gray-400 leading-relaxed">{faq.answer || faq.a}</p>
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

export default Pricing;
