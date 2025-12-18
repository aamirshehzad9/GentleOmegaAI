import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const HelpSupport: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');

    const sections = [
        { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
        { id: 'features', label: 'Feature Guides', icon: '📚' },
        { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' },
        { id: 'faqs', label: 'FAQs', icon: '❓' },
    ];

    const gettingStartedContent = [
        {
            title: 'Welcome to GO-AIBOB',
            content: `GO-AIBOB is your AI-powered guest blogging platform that automates niche discovery, 
      content generation, and outreach management. This guide will help you get started quickly.`,
        },
        {
            title: 'Platform Overview',
            content: `GO-AIBOB consists of two main areas:
      
      1. **Public Landing** (/go-aibob) - For visitors and new users
      2. **Admin Dashboard** (/go-aibob/Admin) - For administrators
      
      The admin dashboard provides full control over AI services, sites management, and analytics.`,
        },
        {
            title: 'First Steps',
            steps: [
                'Login to the admin dashboard at /go-aibob/Admin',
                'Test AI connections using the AI Test page',
                'Configure your niche preferences',
                'Start discovering guest posting opportunities',
                'Review AI-generated suggestions',
                'Monitor performance metrics',
            ],
        },
        {
            title: 'Quick Navigation',
            content: `Use the sidebar to navigate between different sections:
      
      - **Dashboard**: Overview of your stats and quick actions
      - **AI Services**: Test, review, and monitor AI performance
      - **Sites Management**: Add and manage target websites
      - **Import/Export**: Bulk operations for data
      - **Orders**: Track guest post placements
      - **Analytics**: Detailed performance insights
      - **Settings**: Configure platform preferences`,
        },
    ];

    const featureGuides = [
        {
            title: 'AI Services',
            icon: '🤖',
            sections: [
                {
                    subtitle: 'Test Connection',
                    content: `The AI Test page allows you to verify connections to Groq and HuggingFace APIs.
          
          **How to use:**
          1. Navigate to AI Services → Test Connection
          2. Click "Test Connections" button
          3. Wait for results (usually 3-5 seconds)
          4. Green checkmarks indicate successful connections
          
          **Troubleshooting:**
          - Red X means API key is invalid or missing
          - Check your .env.local file for correct API keys
          - Ensure API keys have proper permissions`,
                },
                {
                    subtitle: 'Review Suggestions',
                    content: `Review and approve AI-generated niche suggestions before they go live.
          
          **Features:**
          - Filter by status (Pending, Approved, Rejected)
          - View detailed suggestion cards
          - Approve or reject with one click
          - See AI confidence scores
          
          **Best Practices:**
          - Review suggestions daily
          - Check confidence scores (>80% recommended)
          - Reject low-quality suggestions
          - Provide feedback for AI improvement`,
                },
                {
                    subtitle: 'Performance Metrics',
                    content: `Monitor AI performance, costs, and accuracy in real-time.
          
          **Key Metrics:**
          - Total Requests: Number of AI calls made
          - Success Rate: Percentage of successful requests
          - Average Response Time: Speed of AI responses
          - Average Confidence: Quality of AI outputs
          
          **Cost Tracking:**
          - Groq: Free tier (no cost)
          - HuggingFace: Free tier (no cost)
          - Monitor usage to stay within limits`,
                },
            ],
        },
        {
            title: 'Sites Management',
            icon: '🌐',
            sections: [
                {
                    subtitle: 'Adding Sites',
                    content: `Add target websites for guest posting opportunities.
          
          **Required Information:**
          - Website URL
          - Domain Authority (DA)
          - Niche/Category
          - Contact Email
          
          **Tips:**
          - Focus on DA 30+ websites
          - Choose relevant niches
          - Verify contact information`,
                },
            ],
        },
        {
            title: 'Analytics Dashboard',
            icon: '📊',
            sections: [
                {
                    subtitle: 'Understanding Metrics',
                    content: `Track your guest blogging performance with detailed analytics.
          
          **Available Metrics:**
          - Outreach sent vs. responses
          - Conversion rates
          - Backlink quality scores
          - ROI calculations
          
          **How to Use:**
          - Set date ranges for analysis
          - Compare different campaigns
          - Export data for reporting`,
                },
            ],
        },
    ];

    const troubleshooting = [
        {
            issue: 'AI Services Not Connecting',
            solution: `**Possible Causes:**
      1. Invalid API keys
      2. Network connectivity issues
      3. API rate limits exceeded
      
      **Solutions:**
      - Verify API keys in .env.local file
      - Check internet connection
      - Wait 1 hour if rate limited
      - Test with different AI service`,
        },
        {
            issue: 'Dashboard Not Loading',
            solution: `**Possible Causes:**
      1. Not logged in
      2. Not an admin user
      3. Firebase connection issues
      
      **Solutions:**
      - Login at /go-aibob/login
      - Verify admin role in Firestore
      - Check Firebase configuration
      - Clear browser cache and reload`,
        },
        {
            issue: 'Firestore Permission Denied',
            solution: `**Possible Causes:**
      1. Security rules not deployed
      2. User not authenticated
      3. Missing admin role
      
      **Solutions:**
      - Deploy Firestore rules: firebase deploy --only firestore:rules
      - Login with admin credentials
      - Check user role in Firestore database`,
        },
        {
            issue: 'Slow Performance',
            solution: `**Possible Causes:**
      1. Large dataset
      2. Network latency
      3. Too many concurrent requests
      
      **Solutions:**
      - Use pagination for large lists
      - Optimize Firestore queries
      - Implement caching
      - Reduce concurrent AI requests`,
        },
    ];

    const faqs = [
        {
            question: 'How do I get admin access?',
            answer: `Admin access is controlled by the isAdmin() function in utils/admin-check.ts. 
      Add your email to the admin list in that file, or update Firestore to set role: 'admin' 
      for your user document.`,
        },
        {
            question: 'What AI services does GO-AIBOB use?',
            answer: `GO-AIBOB currently integrates with:
      - Groq (Llama 3.1 70B) for niche discovery
      - HuggingFace for content analysis
      
      Both services offer free tiers suitable for testing and small-scale use.`,
        },
        {
            question: 'How do I add new API keys?',
            answer: `API keys are stored in the .env.local file:
      1. Open .env.local in your project root
      2. Add or update: VITE_GROQ_API_KEY=your_key_here
      3. Restart the development server
      4. Test connection in AI Test page`,
        },
        {
            question: 'Can I use GO-AIBOB for multiple niches?',
            answer: `Yes! GO-AIBOB supports multiple niches. Simply:
      1. Configure different niche keywords
      2. Create separate campaigns
      3. Track performance per niche
      4. Use filters to view niche-specific data`,
        },
        {
            question: 'How do I export data?',
            answer: `Data export is available in the Import/Export section:
      1. Navigate to Import/Export
      2. Select data type (sites, suggestions, etc.)
      3. Choose format (CSV, JSON)
      4. Click Export button
      5. Download file to your computer`,
        },
        {
            question: 'What browsers are supported?',
            answer: `GO-AIBOB works best on:
      - Chrome (recommended)
      - Firefox
      - Edge
      - Safari
      
      Minimum versions: Released within last 2 years`,
        },
        {
            question: 'How do I report bugs?',
            answer: `To report bugs:
      1. Check if issue exists in GitHub Issues
      2. Create new issue with detailed description
      3. Include screenshots if applicable
      4. Mention browser and OS version
      5. Describe steps to reproduce`,
        },
        {
            question: 'Is my data secure?',
            answer: `Yes! GO-AIBOB implements:
      - Firebase authentication
      - Firestore security rules
      - Encrypted data transmission
      - Admin-only access controls
      - Regular security audits`,
        },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'getting-started':
                return (
                    <div className="space-y-8">
                        {gettingStartedContent.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                            >
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                {item.content && (
                                    <p className="text-gray-300 whitespace-pre-line">{item.content}</p>
                                )}
                                {item.steps && (
                                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                                        {item.steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                )}
                            </motion.div>
                        ))}
                    </div>
                );

            case 'features':
                return (
                    <div className="space-y-8">
                        {featureGuides.map((guide, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-4xl">{guide.icon}</span>
                                    <h3 className="text-2xl font-bold text-white">{guide.title}</h3>
                                </div>
                                <div className="space-y-6">
                                    {guide.sections.map((section, i) => (
                                        <div key={i} className="border-l-4 border-cyan-500 pl-4">
                                            <h4 className="text-xl font-semibold text-cyan-400 mb-2">
                                                {section.subtitle}
                                            </h4>
                                            <p className="text-gray-300 whitespace-pre-line">{section.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'troubleshooting':
                return (
                    <div className="space-y-6">
                        {troubleshooting.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <span className="text-2xl">⚠️</span>
                                    <h3 className="text-xl font-bold text-white">{item.issue}</h3>
                                </div>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <p className="text-gray-300 whitespace-pre-line">{item.solution}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'faqs':
                return (
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="text-xl">❓</span>
                                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                </div>
                                <p className="text-gray-300 ml-8">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-gray-900 border-b border-gray-700 p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Help & Support Center</h1>
                        <p className="text-gray-400">
                            Everything you need to know about GO-AIBOB platform
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Search Bar */}
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for help..."
                                    className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                                <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>
                        </div>

                        {/* Section Tabs */}
                        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeSection === section.id
                                            ? 'bg-cyan-600 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="mr-2">{section.icon}</span>
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        {renderContent()}

                        {/* Contact Support */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-xl p-8 text-center"
                        >
                            <h3 className="text-2xl font-bold text-white mb-2">Still Need Help?</h3>
                            <p className="text-gray-300 mb-6">
                                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors">
                                    Contact Support
                                </button>
                                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                                    View Documentation
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
