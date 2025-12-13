import React from 'react';

interface TermsOfServiceProps {
  navigate: (page: string) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ navigate }) => {
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg">
            GentleOmegaAI - Legal Agreement for Platform Use
          </p>
          <div className="mt-4 inline-block bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-purple-400 font-semibold">Effective Date:</span>
            <span className="text-gray-300 ml-2">December 8, 2025</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <p className="text-gray-300 leading-relaxed mb-4">
            Welcome to <span className="text-purple-400 font-semibold">GentleOmegaAI</span> ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our AI-powered platform, website, and services (collectively, the "Services") located at <span className="text-purple-400 font-semibold">gentleomegaai.space</span>.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services. We reserve the right to modify these Terms at any time, and your continued use of the Services constitutes acceptance of any changes.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Acceptance of Terms",
              "Eligibility and Account Registration",
              "User Responsibilities",
              "Services Description",
              "Subscription and Payments",
              "Intellectual Property Rights",
              "User Content and AI Interactions",
              "Prohibited Activities",
              "Privacy and Data Protection",
              "Third-Party Services",
              "Disclaimers and Warranties",
              "Limitation of Liability",
              "Indemnification",
              "Termination and Suspension",
              "Dispute Resolution",
              "Governing Law",
              "Changes to Terms",
              "Contact Information"
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
                className="text-gray-400 hover:text-purple-400 transition-colors flex items-center"
              >
                <span className="text-purple-400 mr-2">{index + 1}.</span>
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <section id="section-1" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            1. Acceptance of Terms
          </h2>
          <div className="space-y-4 text-gray-300">
            <p>
              By creating an account, accessing, or using GentleOmegaAI's Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, along with our Privacy Policy.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you (the "User" or "you") and GentleOmegaAI. If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
            </p>
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-800">
              <p className="text-white font-semibold">
                ⚠️ Important: If you do not agree with any part of these Terms, you must immediately cease using our Services.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Eligibility and Account Registration */}
        <section id="section-2" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            2. Eligibility and Account Registration
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">2.1 Age Requirement</h3>
              <p className="text-gray-300 mb-3">You must be at least 13 years of age (or 16 in the European Economic Area) to use our Services. By using the Services, you represent and warrant that you meet this age requirement.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">2.2 Account Creation</h3>
              <p className="text-gray-300 mb-3">To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">2.3 Account Security</h3>
              <p className="text-gray-300">
                You are solely responsible for maintaining the confidentiality of your account credentials. We are not liable for any loss or damage arising from your failure to protect your account information.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: User Responsibilities */}
        <section id="section-3" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            3. User Responsibilities
          </h2>
          
          <p className="text-gray-300 mb-4">As a user of our Services, you agree to:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>Use the Services only for lawful purposes</li>
            <li>Comply with all applicable local, state, national, and international laws</li>
            <li>Not impersonate any person or entity</li>
            <li>Not interfere with or disrupt the Services</li>
            <li>Not attempt to gain unauthorized access to our systems</li>
            <li>Not use automated systems (bots, scrapers) without permission</li>
            <li>Respect intellectual property rights of others</li>
            <li>Maintain appropriate and respectful communication</li>
          </ul>
        </section>

        {/* Section 4: Services Description */}
        <section id="section-4" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            4. Services Description
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">4.1 AI-Powered Services</h3>
              <p className="text-gray-300 mb-3">GentleOmegaAI provides the following services:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">AI Chatbot:</span> Intelligent conversational AI assistant</li>
                <li><span className="text-purple-300 font-semibold">GO-AIBOB:</span> Advanced AI-powered business operations bot</li>
                <li><span className="text-purple-300 font-semibold">AI Blogs Studio:</span> Content generation and blogging tools</li>
                <li><span className="text-purple-300 font-semibold">WhatsApp Integration:</span> AI assistant via WhatsApp messaging</li>
                <li><span className="text-purple-300 font-semibold">Admin Dashboard:</span> User management and analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">4.2 Service Availability</h3>
              <p className="text-gray-300">
                We strive to provide uninterrupted access to our Services, but we do not guarantee 100% uptime. We reserve the right to modify, suspend, or discontinue any part of the Services at any time with or without notice.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">4.3 AI Limitations</h3>
              <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
                <p className="text-gray-300 mb-3">Our AI services are provided "as is" and may:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Produce inaccurate or incomplete information</li>
                  <li>Generate biased or offensive content unintentionally</li>
                  <li>Fail to understand complex or ambiguous queries</li>
                  <li>Experience performance variations based on input quality</li>
                </ul>
                <p className="text-purple-300 mt-3 font-semibold">
                  You should not rely solely on AI-generated content for critical decisions without independent verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Subscription and Payments */}
        <section id="section-5" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            5. Subscription and Payments
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">5.1 Subscription Plans</h3>
              <p className="text-gray-300 mb-3">We offer various subscription tiers:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">Free Tier:</span> Limited access to basic features</li>
                <li><span className="text-purple-300 font-semibold">Premium Plans:</span> Enhanced features and higher usage limits</li>
                <li><span className="text-purple-300 font-semibold">Enterprise:</span> Custom solutions for businesses</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">5.2 Payment Terms</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>All fees are in US Dollars (USD) unless otherwise stated</li>
                <li>Subscriptions are billed monthly or annually based on your plan</li>
                <li>Payment is due at the beginning of each billing cycle</li>
                <li>We accept major credit cards and other payment methods</li>
                <li>All payments are processed securely through third-party processors</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">5.3 Automatic Renewal</h3>
              <p className="text-gray-300">
                Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date. You authorize us to charge your payment method for the renewal.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">5.4 Refund Policy</h3>
              <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li><span className="text-purple-300 font-semibold">7-Day Money-Back Guarantee:</span> Available for first-time subscribers</li>
                  <li><span className="text-purple-300 font-semibold">Pro-rata Refunds:</span> Not available for partial billing periods</li>
                  <li><span className="text-purple-300 font-semibold">Cancellation:</span> You may cancel anytime; access continues until period end</li>
                  <li><span className="text-purple-300 font-semibold">Disputes:</span> Contact support within 30 days for billing issues</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">5.5 Price Changes</h3>
              <p className="text-gray-300">
                We reserve the right to modify subscription prices with 30 days' advance notice. Price changes will not affect your current billing cycle.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Intellectual Property Rights */}
        <section id="section-6" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            6. Intellectual Property Rights
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">6.1 Our Intellectual Property</h3>
              <p className="text-gray-300 mb-3">
                All content, features, functionality, software, code, designs, logos, trademarks, and materials on the Services are owned by GentleOmegaAI and are protected by international copyright, trademark, patent, and other intellectual property laws.
              </p>
              <p className="text-gray-300">
                You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Services for personal or internal business purposes only.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">6.2 Restrictions</h3>
              <p className="text-gray-300 mb-3">You may not:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Copy, modify, or create derivative works of our Services</li>
                <li>Reverse engineer, decompile, or disassemble our software</li>
                <li>Remove or alter any copyright, trademark, or proprietary notices</li>
                <li>Sell, rent, lease, or sublicense access to our Services</li>
                <li>Use our Services to develop competing products or services</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">6.3 Trademarks</h3>
              <p className="text-gray-300">
                "GentleOmegaAI," "GO-AIBOB," and associated logos are trademarks of GentleOmegaAI. You may not use these marks without our prior written permission.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: User Content and AI Interactions */}
        <section id="section-7" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            7. User Content and AI Interactions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">7.1 User-Generated Content</h3>
              <p className="text-gray-300 mb-3">
                You retain ownership of any content you submit to the Services ("User Content"). However, by submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, transferable license to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Use, reproduce, and distribute your content to provide the Services</li>
                <li>Improve our AI models and algorithms (in anonymized form)</li>
                <li>Display your content within the Services</li>
                <li>Create derivative works for service improvement</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">7.2 AI-Generated Content</h3>
              <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
                <p className="text-gray-300 mb-3">
                  Content generated by our AI ("AI Output") is provided to you under the following terms:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>You may use AI Output for your personal or commercial purposes</li>
                  <li>We do not claim ownership of AI Output generated in response to your inputs</li>
                  <li>However, AI Output may not be unique and could be generated for other users</li>
                  <li>You are responsible for reviewing and verifying AI Output before use</li>
                  <li>We are not liable for inaccuracies in AI-generated content</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">7.3 Content Standards</h3>
              <p className="text-gray-300 mb-3">You agree that your User Content will not:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Contain harmful, offensive, or inappropriate material</li>
                <li>Include personal information of others without consent</li>
                <li>Contain malware, viruses, or malicious code</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8: Prohibited Activities */}
        <section id="section-8" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            8. Prohibited Activities
          </h2>
          
          <p className="text-gray-300 mb-4">You expressly agree not to:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h4 className="text-pink-400 font-semibold mb-3">Security Violations</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Hack, breach, or circumvent security</li>
                <li>Access unauthorized accounts or data</li>
                <li>Probe or scan for vulnerabilities</li>
                <li>Use automated tools without permission</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h4 className="text-pink-400 font-semibold mb-3">Abusive Behavior</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Harass or threaten other users</li>
                <li>Send spam or unsolicited messages</li>
                <li>Impersonate others or entities</li>
                <li>Engage in fraudulent activities</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h4 className="text-pink-400 font-semibold mb-3">Misuse of Services</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Overload or disrupt our infrastructure</li>
                <li>Interfere with other users' access</li>
                <li>Create multiple accounts to abuse limits</li>
                <li>Use Services for illegal purposes</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h4 className="text-pink-400 font-semibold mb-3">Intellectual Property Violations</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Copy or redistribute our content</li>
                <li>Reverse engineer our software</li>
                <li>Use our trademarks without permission</li>
                <li>Create competing services using our IP</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-800">
            <p className="text-white font-semibold">
              ⚠️ Warning: Violation of these prohibitions may result in immediate account termination and legal action.
            </p>
          </div>
        </section>

        {/* Section 9: Privacy and Data Protection */}
        <section id="section-9" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            9. Privacy and Data Protection
          </h2>
          
          <p className="text-gray-300 mb-4">
            Your use of the Services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our{' '}
            <button
              onClick={() => navigate('/privacy-policy')}
              className="text-purple-400 underline hover:text-purple-300"
            >
              Privacy Policy
            </button>
            {' '}to understand how we collect, use, and protect your personal information.
          </p>
          
          <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
            <h3 className="text-lg font-semibold mb-3 text-pink-400">Key Privacy Points:</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>We collect personal information to provide and improve Services</li>
              <li>Your data is protected with industry-standard security measures</li>
              <li>We use third-party services (Firebase, Gemini AI, Twilio, HuggingFace)</li>
              <li>You have rights to access, delete, and export your data</li>
              <li>We comply with GDPR, CCPA, and other privacy regulations</li>
            </ul>
          </div>
        </section>

        {/* Section 10: Third-Party Services */}
        <section id="section-10" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            10. Third-Party Services
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">10.1 Third-Party Integrations</h3>
              <p className="text-gray-300 mb-3">Our Services integrate with third-party platforms:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">Firebase:</span> Authentication and database services</li>
                <li><span className="text-purple-300 font-semibold">Google Gemini AI:</span> AI language processing</li>
                <li><span className="text-purple-300 font-semibold">Twilio:</span> WhatsApp messaging integration</li>
                <li><span className="text-purple-300 font-semibold">HuggingFace:</span> AI model services</li>
                <li><span className="text-purple-300 font-semibold">Payment Processors:</span> Secure payment processing</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">10.2 Third-Party Terms</h3>
              <p className="text-gray-300">
                Your use of third-party services is subject to their respective terms and conditions. We are not responsible for the actions, content, or policies of third-party services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">10.3 Links to Third-Party Websites</h3>
              <p className="text-gray-300">
                Our Services may contain links to external websites. We do not control and are not responsible for the content or practices of third-party websites.
              </p>
            </div>
          </div>
        </section>

        {/* Section 11: Disclaimers and Warranties */}
        <section id="section-11" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            11. Disclaimers and Warranties
          </h2>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-300 mb-4 font-semibold uppercase">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>We do not warrant that the Services will be uninterrupted or error-free</li>
              <li>We do not guarantee the accuracy, completeness, or reliability of AI-generated content</li>
              <li>We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose</li>
              <li>We do not warrant that the Services will meet your specific requirements</li>
              <li>We are not responsible for any content, data, or information provided by users</li>
              <li>AI outputs may contain errors, biases, or inaccuracies</li>
            </ul>
          </div>
        </section>

        {/* Section 12: Limitation of Liability */}
        <section id="section-12" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            12. Limitation of Liability
          </h2>
          
          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-lg p-6 border border-red-800">
            <p className="text-white mb-4 font-semibold uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3 ml-4">
              <li>
                GentleOmegaAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              </li>
              <li>
                Our total liability for any claim arising out of these Terms shall not exceed the amount you paid us in the 12 months preceding the claim
              </li>
              <li>
                We are not liable for losses resulting from unauthorized access to your account
              </li>
              <li>
                We are not responsible for any decisions you make based on AI-generated content
              </li>
              <li>
                We are not liable for third-party services, content, or conduct
              </li>
            </ul>
            <p className="text-purple-200 mt-4 italic">
              Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.
            </p>
          </div>
        </section>

        {/* Section 13: Indemnification */}
        <section id="section-13" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            13. Indemnification
          </h2>
          
          <p className="text-gray-300 mb-4">
            You agree to indemnify, defend, and hold harmless GentleOmegaAI, its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>Your use or misuse of the Services</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another party</li>
            <li>Your User Content or AI-generated content you use</li>
            <li>Your breach of any applicable laws or regulations</li>
          </ul>
        </section>

        {/* Section 14: Termination and Suspension */}
        <section id="section-14" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            14. Termination and Suspension
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">14.1 Your Right to Terminate</h3>
              <p className="text-gray-300">
                You may terminate your account at any time by contacting our support team or using the account deletion feature in your dashboard. Upon termination, your access to the Services will cease.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">14.2 Our Right to Terminate</h3>
              <p className="text-gray-300 mb-3">
                We reserve the right to suspend or terminate your account and access to the Services at any time, with or without notice, for:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Abusive or harmful behavior</li>
                <li>Any reason at our sole discretion</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">14.3 Effect of Termination</h3>
              <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
                <p className="text-gray-300 mb-3">Upon termination:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Your right to access the Services immediately ceases</li>
                  <li>We may delete your account data after a reasonable period</li>
                  <li>You remain liable for any outstanding payments</li>
                  <li>Sections of these Terms that should survive will remain in effect</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 15: Dispute Resolution */}
        <section id="section-15" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            15. Dispute Resolution
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">15.1 Informal Resolution</h3>
              <p className="text-gray-300">
                Before filing a formal dispute, you agree to contact us at{' '}
                <a href="mailto:support@gentleomegaai.space" className="text-purple-400 underline">
                  support@gentleomegaai.space
                </a>
                {' '}to attempt to resolve the issue informally.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">15.2 Arbitration</h3>
              <p className="text-gray-300 mb-3">
                If informal resolution fails, disputes shall be resolved through binding arbitration rather than in court, except where prohibited by law.
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Arbitration will be conducted by a neutral arbitrator</li>
                <li>Each party will bear their own costs and attorneys' fees</li>
                <li>Arbitration decisions are final and binding</li>
                <li>Class action waiver: disputes must be resolved individually</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">15.3 Exceptions</h3>
              <p className="text-gray-300">
                Either party may seek injunctive relief in court for intellectual property infringement or confidentiality breaches.
              </p>
            </div>
          </div>
        </section>

        {/* Section 16: Governing Law */}
        <section id="section-16" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            16. Governing Law
          </h2>
          
          <p className="text-gray-300 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
          <p className="text-gray-300">
            For users in the European Union, you also benefit from any mandatory provisions of consumer protection laws in your country of residence.
          </p>
        </section>

        {/* Section 17: Changes to Terms */}
        <section id="section-17" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            17. Changes to Terms
          </h2>
          
          <p className="text-gray-300 mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of material changes by:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
            <li>Email notification to your registered email address</li>
            <li>Prominent notice on our website</li>
            <li>In-app notification</li>
          </ul>
          <p className="text-gray-300 mt-4">
            Your continued use of the Services after changes become effective constitutes acceptance of the revised Terms. If you do not agree with the changes, you must stop using the Services.
          </p>
        </section>

        {/* Section 18: General Provisions */}
        <section id="section-18" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            18. General Provisions
          </h2>
          
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-pink-400">Entire Agreement</h3>
              <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and GentleOmegaAI.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-pink-400">Severability</h3>
              <p>If any provision is found unenforceable, the remaining provisions will remain in full effect.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-pink-400">Waiver</h3>
              <p>Our failure to enforce any right or provision does not constitute a waiver of that right or provision.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-pink-400">Assignment</h3>
              <p>You may not assign or transfer these Terms without our consent. We may assign our rights without restriction.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-pink-400">Force Majeure</h3>
              <p>We are not liable for delays or failures due to circumstances beyond our reasonable control.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="section-19" className="mb-10">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-8 border border-purple-700">
            <h2 className="text-3xl font-bold mb-6 text-white">Contact Information</h2>
            <p className="text-purple-200 mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <p className="font-semibold">Company Name:</p>
                <p className="text-purple-200">GentleOmegaAI</p>
              </div>
              <div>
                <p className="font-semibold">Website:</p>
                <a href="https://gentleomegaai.space" className="text-purple-200 underline">
                  gentleomegaai.space
                </a>
              </div>
              <div>
                <p className="font-semibold">Legal Email:</p>
                <a href="mailto:legal@gentleomegaai.space" className="text-purple-200 underline">
                  legal@gentleomegaai.space
                </a>
              </div>
              <div>
                <p className="font-semibold">Support Email:</p>
                <a href="mailto:support@gentleomegaai.space" className="text-purple-200 underline">
                  support@gentleomegaai.space
                </a>
              </div>
              <div>
                <p className="font-semibold">WhatsApp:</p>
                <p className="text-purple-200">+92 346 806 6680</p>
              </div>
              <div>
                <p className="font-semibold">Business Address:</p>
                <p className="text-purple-200">[Your Business Address]</p>
              </div>
            </div>
          </div>
        </section>

        {/* Acknowledgment */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">Acknowledgment</h3>
          <p className="text-gray-300 leading-relaxed">
            By using GentleOmegaAI's Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You also acknowledge that you have read and understood our Privacy Policy.
          </p>
          <div className="mt-4 flex items-center text-green-400">
            <span className="mr-2">✓</span>
            <span className="font-semibold">I agree to the Terms of Service</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
