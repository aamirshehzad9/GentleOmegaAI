/**
 * AI Blogs Studio - Luxury Landing Page
 * Premium positioning, revenue calculator, pricing tiers
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';

interface LandingPageProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [revenueCalc, setRevenueCalc] = useState({
    blogs: 50,
    avgViews: 1000,
    cpc: 0.5
  });

  const calculateRevenue = () => {
    const monthlyAdRevenue = revenueCalc.blogs * revenueCalc.avgViews * (revenueCalc.cpc / 1000);
    const affiliateRevenue = revenueCalc.blogs * 10; // $10 avg per blog
    const total = monthlyAdRevenue + affiliateRevenue;
    return {
      ads: monthlyAdRevenue.toFixed(2),
      affiliate: affiliateRevenue.toFixed(2),
      total: total.toFixed(2),
      annual: (total * 12).toFixed(2)
    };
  };

  const revenue = calculateRevenue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      <BlogsHeader context="landing" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-[#F7B731]/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#5F27CD]/10 rounded-full blur-3xl top-40 -right-20 animate-pulse delay-1000"></div>
          <div className="absolute w-96 h-96 bg-[#00D2D3]/10 rounded-full blur-3xl -bottom-20 left-1/3 animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#F7B731]/20 to-[#5F27CD]/20 border border-[#F7B731]/30 rounded-full mb-8"
            >
              <span className="text-2xl">✨</span>
              <span className="text-[#F7B731] font-semibold">The Future of AI Content Creation</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight">
              Create. Publish.
              <span className="block bg-gradient-to-r from-[#F7B731] via-[#00D2D3] to-[#5F27CD] bg-clip-text text-transparent">
                Earn. Repeat.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[#A8B2D1] mb-8 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-white">Revolutionary AI-Powered Blog Platform</strong> that transforms content creation into <strong className="text-[#00D2D3]">passive income streams</strong>. Generate high-quality, SEO-optimized articles in seconds with Google Gemini AI, monetize instantly through Google AdSense & AdWords automation, and earn from 10+ revenue streams simultaneously.
            </p>
            <p className="text-lg md:text-xl text-[#F7B731] font-bold mb-12">
              🚀 Join 10,000+ Professional Bloggers Making $10K-$100K/Month | Zero Technical Skills Required | Start Free Today
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('dashboard')}
                className="px-10 py-5 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white font-bold text-lg rounded-xl shadow-2xl shadow-[#F7B731]/50 hover:shadow-[#F7B731]/70 transition-all"
              >
                🚀 Start Earning Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all"
              >
                📊 Watch Demo
              </motion.button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '$3.84M', label: 'Annual Revenue Target', icon: '💰' },
                { value: '50+', label: 'Content Niches', icon: '🎯' },
                { value: '10', label: 'Revenue Streams', icon: '💵' },
                { value: '99.9%', label: 'Uptime SLA', icon: '⚡' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-[#A8B2D1]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revenue Calculator - SEO Enhanced */}
      <section id="calculator" className="py-20 px-4 bg-gradient-to-b from-transparent to-[#1A1F3A]/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1A1F3A] to-[#0D1226] border border-[#F7B731]/20 rounded-3xl p-10 shadow-2xl"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">
                💎 Calculate Your Passive Income Potential
              </h2>
              <p className="text-lg text-[#A8B2D1]">
                <strong className="text-[#F7B731]">Real-Time Earnings Calculator</strong> - Discover how AI-powered content creation, Google AdSense monetization, and affiliate marketing can generate <strong className="text-[#00D2D3]">$5K-$50K monthly income</strong>. Adjust sliders to see your personalized revenue forecast instantly!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Input Sliders */}
              <div className="space-y-8">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Blogs per Month: <span className="text-[#F7B731]">{revenueCalc.blogs}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={revenueCalc.blogs}
                    onChange={(e) => setRevenueCalc({ ...revenueCalc, blogs: parseInt(e.target.value) })}
                    className="w-full h-3 bg-[#0A0E27] rounded-lg appearance-none cursor-pointer accent-[#F7B731]"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    Avg Views per Blog: <span className="text-[#F7B731]">{revenueCalc.avgViews.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={revenueCalc.avgViews}
                    onChange={(e) => setRevenueCalc({ ...revenueCalc, avgViews: parseInt(e.target.value) })}
                    className="w-full h-3 bg-[#0A0E27] rounded-lg appearance-none cursor-pointer accent-[#F7B731]"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    Cost per Click: <span className="text-[#F7B731]">${revenueCalc.cpc}</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={revenueCalc.cpc}
                    onChange={(e) => setRevenueCalc({ ...revenueCalc, cpc: parseFloat(e.target.value) })}
                    className="w-full h-3 bg-[#0A0E27] rounded-lg appearance-none cursor-pointer accent-[#F7B731]"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-[#0A0E27] rounded-2xl p-8 border border-[#F7B731]/30">
                <div className="text-center mb-6">
                  <div className="text-sm text-[#A8B2D1] mb-2">Estimated Monthly Earnings</div>
                  <div className="text-6xl font-bold bg-gradient-to-r from-[#F7B731] to-[#00D2D3] bg-clip-text text-transparent">
                    ${revenue.total}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-[#A8B2D1]">📊 Ad Revenue</span>
                    <span className="text-white font-bold">${revenue.ads}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-[#A8B2D1]">🔗 Affiliate Income</span>
                    <span className="text-white font-bold">${revenue.affiliate}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#F7B731]/20 to-[#5F27CD]/20 rounded-lg border border-[#F7B731]/30">
                    <span className="text-white font-bold">💰 Annual Projection</span>
                    <span className="text-[#F7B731] font-bold text-xl">${revenue.annual}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('dashboard')}
                  className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  🚀 Start Creating Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
              Choose Your <span className="text-[#F7B731]">Premium Plan</span>
            </h2>
            <p className="text-xl text-[#A8B2D1] max-w-3xl mx-auto">
              <strong className="text-white">Professional AI Blogging Subscriptions</strong> starting at $29/month. All plans include <strong className="text-[#00D2D3]">unlimited AI content generation</strong>, automatic Google AdSense integration, SEO optimization tools, affiliate marketing features, and multi-stream monetization. <span className="text-[#26DE81]">14-day free trial</span> on all plans. <strong className="text-[#F7B731]">No credit card required!</strong>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Creator',
                price: '$29',
                badge: 'For Hobbyists',
                color: 'from-gray-600 to-gray-700',
                features: [
                  '50 AI articles/month',
                  'Basic SEO optimization',
                  '3 niches maximum',
                  '70% ad revenue share',
                  'Standard support'
                ]
              },
              {
                name: 'Professional',
                price: '$99',
                badge: '⭐ Most Popular',
                color: 'from-[#F7B731] to-[#F39C12]',
                features: [
                  'Unlimited AI articles',
                  'Advanced SEO + AdWords',
                  'Unlimited niches',
                  '80% ad revenue share',
                  'Affiliate marketplace',
                  'Priority support'
                ],
                popular: true
              },
              {
                name: 'Studio',
                price: '$299',
                badge: 'For Teams',
                color: 'from-[#5F27CD] to-[#341F97]',
                features: [
                  'Everything in Pro',
                  'Custom AI training',
                  'White-label option',
                  'Team collaboration (5)',
                  '90% ad revenue share',
                  'Dedicated manager'
                ]
              },
              {
                name: 'Enterprise',
                price: '$499',
                badge: 'For Agencies',
                color: 'from-[#00D2D3] to-[#0097A7]',
                features: [
                  'Everything in Studio',
                  'Multi-brand management',
                  'Custom AI models',
                  '95% ad revenue share',
                  'API access',
                  'White-glove service'
                ]
              }
            ].map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-gradient-to-br ${tier.popular ? 'from-[#1A1F3A] to-[#0D1226] border-2 border-[#F7B731] scale-105' : 'from-[#1A1F3A]/50 to-[#0D1226]/50 border border-white/10'} rounded-2xl p-8 hover:scale-105 transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#F7B731] to-[#F39C12] rounded-full text-white font-bold text-sm shadow-xl">
                    {tier.badge}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`text-sm font-semibold mb-2 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {!tier.popular && tier.badge}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-5xl font-bold text-white mb-1">{tier.price}</div>
                  <div className="text-[#A8B2D1] text-sm">per month</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-[#A8B2D1]">
                      <span className="text-[#26DE81] mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('dashboard')}
                  className={`w-full px-6 py-4 bg-gradient-to-r ${tier.color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#1A1F3A]/50 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
              Why Creators <span className="text-[#F7B731]">Love Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Content',
                description: 'Generate 2,000-5,000 word articles in 60 seconds with multi-model AI (Gemini, Claude, GPT-4o)'
              },
              {
                icon: '💰',
                title: '10 Revenue Streams',
                description: 'Google AdWords, AdSense, Affiliate, Sponsored Content, Paywall, Licensing & more'
              },
              {
                icon: '📊',
                title: 'Real-Time Analytics',
                description: 'Track earnings, views, CTR, ROI with ML-powered revenue predictions'
              },
              {
                icon: '🎯',
                title: '50+ Niches',
                description: 'Entertainment, Tech, Travel, Science, Education, Business, Lifestyle & more'
              },
              {
                icon: '⚡',
                title: 'SEO Optimization',
                description: 'Auto-generate meta tags, schema markup, keywords, internal links'
              },
              {
                icon: '🔒',
                title: 'Enterprise Security',
                description: '99.99% uptime SLA, DDoS protection, automated backups'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-[#1A1F3A] to-[#0D1226] border border-white/10 rounded-2xl p-8 hover:border-[#F7B731]/50 transition-all"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[#A8B2D1] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#F7B731] via-[#F39C12] to-[#5F27CD] p-1 rounded-3xl"
          >
            <div className="bg-[#0A0E27] rounded-3xl p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
                Ready to Transform Your <br />
                <span className="bg-gradient-to-r from-[#F7B731] to-[#00D2D3] bg-clip-text text-transparent">
                  Content into Cash?
                </span>
              </h2>
              <p className="text-xl text-[#A8B2D1] mb-10 max-w-2xl mx-auto">
                Join 1,000+ creators earning $10K-100K/month with autonomous AI monetization
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('dashboard')}
                className="px-12 py-6 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-[#F7B731]/70 transition-all"
              >
                🚀 Start Earning Today - It's Free!
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <BlogsFooter context="landing" onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;