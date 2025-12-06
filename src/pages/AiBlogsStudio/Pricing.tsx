/**
 * AI Blogs Studio - Stripe Pricing & Subscription
 * 4 Subscription tiers with Stripe integration
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';
import { useAuth } from '../../../contexts/AuthContext';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';

interface PricingProps {
  onNavigate: (page: AiBlogsPage) => void;
}

interface PricingTier {
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  revenueShare: number;
  articleLimit: number | 'unlimited';
  highlighted: boolean;
  stripePriceId: string;
  yearlyStripePriceId: string;
}

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const tiers: PricingTier[] = [
    {
      name: 'Creator',
      price: 29,
      yearlyPrice: 290,
      description: 'Perfect for individual bloggers getting started',
      features: [
        '50 AI-generated articles/month',
        '70% revenue share',
        'Basic SEO optimization',
        'Standard templates',
        'Email support',
        'Google AdSense integration',
        '1 website',
        'Draft autosave'
      ],
      revenueShare: 70,
      articleLimit: 50,
      highlighted: false,
      stripePriceId: 'price_creator_monthly',
      yearlyStripePriceId: 'price_creator_yearly'
    },
    {
      name: 'Professional',
      price: 99,
      yearlyPrice: 990,
      description: 'Most popular for serious content creators',
      features: [
        'Unlimited AI articles',
        '85% revenue share',
        'Advanced SEO suite',
        'Premium templates',
        'Priority support',
        'Google AdSense + AdWords automation',
        'Up to 5 websites',
        'Advanced analytics',
        'Custom branding',
        'Team collaboration (3 members)'
      ],
      revenueShare: 85,
      articleLimit: 'unlimited',
      highlighted: true,
      stripePriceId: 'price_professional_monthly',
      yearlyStripePriceId: 'price_professional_yearly'
    },
    {
      name: 'Studio',
      price: 299,
      yearlyPrice: 2990,
      description: 'For agencies and content studios',
      features: [
        'Unlimited AI articles',
        '90% revenue share',
        'Enterprise SEO tools',
        'All premium templates',
        'Dedicated support',
        'Full ad automation suite',
        'Unlimited websites',
        'White-label options',
        'Advanced team features (10 members)',
        'API access',
        'Custom integrations'
      ],
      revenueShare: 90,
      articleLimit: 'unlimited',
      highlighted: false,
      stripePriceId: 'price_studio_monthly',
      yearlyStripePriceId: 'price_studio_yearly'
    },
    {
      name: 'Enterprise',
      price: 999,
      yearlyPrice: 9990,
      description: 'Custom solutions for large organizations',
      features: [
        'Unlimited everything',
        '95% revenue share',
        'Custom AI models',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom ad strategies',
        'Unlimited websites & users',
        'Full white-label',
        'Custom features',
        'SLA guarantee',
        'On-premise deployment option',
        'Training & onboarding'
      ],
      revenueShare: 95,
      articleLimit: 'unlimited',
      highlighted: false,
      stripePriceId: 'price_enterprise_monthly',
      yearlyStripePriceId: 'price_enterprise_yearly'
    }
  ];

  const handleSubscribe = async (tier: PricingTier) => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    setLoading(true);
    try {
      // Simulated Stripe checkout (replace with actual Stripe API)
      const priceId = billingCycle === 'monthly' ? tier.stripePriceId : tier.yearlyStripePriceId;
      
      // In production, redirect to Stripe Checkout:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId, userId: currentUser?.uid })
      // });
      // const { url } = await response.json();
      // window.location.href = url;

      alert(`Stripe Checkout would open for ${tier.name} plan (${billingCycle})\nPrice ID: ${priceId}\n\nIntegration coming soon!`);
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      <BlogsHeader context={isAuthenticated ? 'authenticated' : 'landing'} onNavigate={onNavigate} />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7B731] to-[#F39C12]">Growth Plan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#A8B2D1] text-xl max-w-2xl mx-auto"
          >
            Start earning from your content immediately. No hidden fees, no commitments.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-[#F7B731] rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'transform translate-x-8' : ''
              }`} />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Yearly
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
              Save up to 17%
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier, index) => {
            const price = billingCycle === 'monthly' ? tier.price : tier.yearlyPrice;
            const savings = calculateSavings(tier.price, tier.yearlyPrice);

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative bg-[#1A1F3A] rounded-2xl p-6 border-2 transition-all hover:scale-105 ${
                  tier.highlighted
                    ? 'border-[#F7B731] shadow-2xl shadow-[#F7B731]/20'
                    : 'border-gray-700 hover:border-[#F7B731]/50'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white text-sm font-bold rounded-full">
                    ⭐ MOST POPULAR
                  </div>
                )}

                {billingCycle === 'yearly' && savings.amount > 0 && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    Save ${savings.amount}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-[#A8B2D1] text-sm">{tier.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">${price}</span>
                    <span className="text-[#A8B2D1]">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-400 mt-1">
                      ${Math.round(tier.yearlyPrice / 12)}/month billed annually
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white hover:opacity-90'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Processing...' : 'Get Started'}
                </button>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-700">
                    <span className="text-3xl font-bold text-[#F7B731]">{tier.revenueShare}%</span>
                    <span className="text-[#A8B2D1] text-sm">Revenue Share</span>
                  </div>
                  
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#F7B731] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#A8B2D1] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto bg-[#1A1F3A] rounded-2xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            💰 Calculate Your Potential Earnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[#A8B2D1] mb-2">Articles per month</label>
              <input
                type="number"
                defaultValue={50}
                className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-[#A8B2D1] mb-2">Avg views per article</label>
              <input
                type="number"
                defaultValue={1000}
                className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-[#A8B2D1] mb-2">Avg CPC ($)</label>
              <input
                type="number"
                step="0.01"
                defaultValue={0.50}
                className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#F7B731]/20 to-[#F39C12]/20 rounded-lg p-6 text-center">
            <p className="text-[#A8B2D1] mb-2">Estimated Monthly Earnings</p>
            <p className="text-5xl font-bold text-[#F7B731]">$2,500</p>
            <p className="text-sm text-[#A8B2D1] mt-2">Based on industry averages</p>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does revenue sharing work?',
                a: 'You keep 70-95% of all revenue generated from your content (ads, affiliates, sponsorships). We only take a small platform fee.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! No contracts or commitments. Cancel your subscription anytime from your billing portal.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and digital wallets through Stripe.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Start with a 7-day free trial on any plan. No credit card required.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[#1A1F3A] rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-[#A8B2D1]">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-16"
        >
          <p className="text-[#A8B2D1] mb-4">
            Need a custom plan? Contact our sales team for enterprise solutions.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            Contact Sales
          </button>
        </motion.div>
      </div>

      <BlogsFooter />
    </div>
  );
};

export default Pricing;