import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';

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
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-gray-300">
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
                                className={`relative bg-gray-800 rounded-2xl p-8 border-2 ${tier.popular ? 'border-cyan-500' : 'border-gray-700'
                                    } hover:border-cyan-500/50 transition-all`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-5xl font-bold text-white">{tier.price}</span>
                                        <span className="text-gray-400 ml-2">{tier.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <motion.button
                                    onClick={() => navigate('/go-aibob/signup')}
                                    className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${tier.color} hover:opacity-90 transition-opacity`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {tier.cta}
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                                    a: 'No contracts. Pay monthly and cancel anytime with no penalties.',
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
                                    className="bg-gray-800 rounded-lg p-6"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                                    <p className="text-gray-300">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
