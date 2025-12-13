import React from 'react';

interface PrivacyPolicyProps {
  navigate: (page: string) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ navigate }) => {
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            GentleOmegaAI - Your Privacy Matters to Us
          </p>
          <div className="mt-4 inline-block bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-purple-400 font-semibold">Last Updated:</span>
            <span className="text-gray-300 ml-2">December 8, 2025</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <p className="text-gray-300 leading-relaxed mb-4">
            Welcome to GentleOmegaAI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered platform at <span className="text-purple-400 font-semibold">gentleomegaai.space</span>.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Information We Collect",
              "How We Use Your Information",
              "Legal Basis for Processing",
              "Data Sharing and Disclosure",
              "Data Security",
              "Data Retention",
              "Your Privacy Rights",
              "Cookies and Tracking",
              "Children's Privacy",
              "International Data Transfers",
              "AI and Automated Decisions",
              "Third-Party Links",
              "Changes to This Policy",
              "Data Protection Officer",
              "Complaints and Disputes",
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

        {/* Section 1: Information We Collect */}
        <section id="section-1" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            1. Information We Collect
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">1.1 Personal Information</h3>
              <p className="text-gray-300 mb-3">We collect personal information that you voluntarily provide when you:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Register for an account</li>
                <li>Use our AI chatbot services</li>
                <li>Make a payment or purchase</li>
                <li>Contact our customer support</li>
                <li>Subscribe to our newsletter</li>
              </ul>
              <p className="text-gray-300 mt-4 mb-2">The personal information we may collect includes:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">Identity Data:</span> Name, username, email address, phone number</li>
                <li><span className="text-purple-300 font-semibold">Account Credentials:</span> Username, password (encrypted)</li>
                <li><span className="text-purple-300 font-semibold">Financial Data:</span> Payment card details, billing address</li>
                <li><span className="text-purple-300 font-semibold">Contact Data:</span> Email address, phone number, WhatsApp number</li>
                <li><span className="text-purple-300 font-semibold">Profile Data:</span> Preferences, interests, feedback, and survey responses</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">1.2 Automatically Collected Information</h3>
              <p className="text-gray-300 mb-3">When you access our platform, we automatically collect:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">Technical Data:</span> IP address, browser type, device information, operating system</li>
                <li><span className="text-purple-300 font-semibold">Usage Data:</span> Pages visited, time spent, click patterns, features used</li>
                <li><span className="text-purple-300 font-semibold">Location Data:</span> Approximate geographic location based on IP address</li>
                <li><span className="text-purple-300 font-semibold">Cookies and Tracking:</span> Session cookies, preference cookies, analytics cookies</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">1.3 AI Interaction Data</h3>
              <p className="text-gray-300 mb-3">To provide and improve our AI services, we collect:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Chat conversations with our AI assistant</li>
                <li>Query inputs and AI-generated responses</li>
                <li>User feedback on AI interactions</li>
                <li>Training data to improve AI model performance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">1.4 Third-Party Integrations</h3>
              <p className="text-gray-300 mb-3">We integrate with the following third-party services:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">Firebase:</span> Authentication, database, hosting</li>
                <li><span className="text-purple-300 font-semibold">Google Gemini AI:</span> AI language processing</li>
                <li><span className="text-purple-300 font-semibold">Twilio:</span> WhatsApp messaging integration</li>
                <li><span className="text-purple-300 font-semibold">HuggingFace:</span> AI model services</li>
                <li><span className="text-purple-300 font-semibold">Payment Processors:</span> Secure payment processing</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section id="section-2" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            2. How We Use Your Information
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">2.1 Service Delivery</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Create and manage user accounts</li>
                <li>Process payments and transactions</li>
                <li>Provide AI chatbot and assistant services</li>
                <li>Enable WhatsApp integration features</li>
                <li>Deliver customer support</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">2.2 Service Improvement</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Analyze usage patterns to improve user experience</li>
                <li>Train and optimize AI models</li>
                <li>Develop new features and functionalities</li>
                <li>Conduct research and analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">2.3 Communication</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Send service-related notifications</li>
                <li>Provide updates about new features</li>
                <li>Send marketing communications (with consent)</li>
                <li>Respond to inquiries and support requests</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">2.4 Security and Compliance</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Protect against fraud and unauthorized access</li>
                <li>Enforce our Terms of Service</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and troubleshoot issues</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Legal Basis for Processing */}
        <section id="section-3" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            3. Legal Basis for Processing (GDPR)
          </h2>
          <p className="text-gray-300 mb-4">For users in the European Economic Area (EEA), we process personal data based on:</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-800">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-3 text-left text-purple-400">Purpose</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-purple-400">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Account creation and service delivery</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Contract performance</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Payment processing</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Contract performance</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Marketing communications</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Consent</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Service improvement and analytics</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Legitimate interest</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Security and fraud prevention</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Legitimate interest</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Legal compliance</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Legal obligation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Data Sharing */}
        <section id="section-4" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            4. Data Sharing and Disclosure
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">4.1 Third-Party Service Providers</h3>
              <p className="text-gray-300 mb-3">We share your information with trusted service providers:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">Firebase (Google):</span> Authentication, database storage, hosting</li>
                <li><span className="text-purple-300 font-semibold">Google Gemini AI:</span> Natural language processing and AI responses</li>
                <li><span className="text-purple-300 font-semibold">Twilio:</span> WhatsApp messaging and communication services</li>
                <li><span className="text-purple-300 font-semibold">HuggingFace:</span> AI model inference and processing</li>
                <li><span className="text-purple-300 font-semibold">Payment Processors:</span> Secure payment and billing services</li>
                <li><span className="text-purple-300 font-semibold">Cloud Hosting:</span> Railway, Neon, Upstash for infrastructure</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-800">
              <p className="text-white font-semibold">
                ⚠️ Important: We do NOT sell your personal information to third parties for their marketing purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Data Security */}
        <section id="section-5" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            5. Data Security
          </h2>
          <p className="text-gray-300 mb-4">We implement industry-standard security measures:</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-pink-400">5.1 Technical Safeguards</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><span className="text-purple-300 font-semibold">Encryption:</span> Data encrypted in transit (TLS/SSL) and at rest</li>
                <li><span className="text-purple-300 font-semibold">Firebase Security:</span> Secure authentication and database rules</li>
                <li><span className="text-purple-300 font-semibold">API Security:</span> API key restrictions and rate limiting</li>
                <li><span className="text-purple-300 font-semibold">Access Controls:</span> Role-based access to sensitive data</li>
                <li><span className="text-purple-300 font-semibold">Regular Audits:</span> Security assessments and vulnerability testing</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <p className="text-gray-400 italic">
                <span className="text-purple-400 font-semibold">Note:</span> While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Data Retention */}
        <section id="section-6" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            6. Data Retention
          </h2>
          <p className="text-gray-300 mb-4">We retain your personal information for as long as necessary to provide our services and comply with legal obligations.</p>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-3 text-pink-400">Retention Periods:</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li><span className="text-purple-300 font-semibold">Account Data:</span> While account is active + 3 years after deletion</li>
              <li><span className="text-purple-300 font-semibold">Chat Conversations:</span> 2 years (anonymized after 1 year)</li>
              <li><span className="text-purple-300 font-semibold">Payment Records:</span> 7 years (legal requirement)</li>
              <li><span className="text-purple-300 font-semibold">Marketing Data:</span> Until you withdraw consent</li>
              <li><span className="text-purple-300 font-semibold">Analytics Data:</span> Aggregated and anonymized after 26 months</li>
            </ul>
          </div>
        </section>

        {/* Section 7: Your Privacy Rights */}
        <section id="section-7" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            7. Your Privacy Rights
          </h2>
          <p className="text-gray-300 mb-6">You have the following rights regarding your personal information:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-pink-400">Access & Portability</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Request a copy of your data</li>
                <li>Receive data in machine-readable format</li>
                <li>Transfer data to another provider</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-pink-400">Correction & Deletion</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Update inaccurate information</li>
                <li>Request data deletion</li>
                <li>Restrict or object to processing</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-pink-400">GDPR Rights (EEA)</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Right to access</li>
                <li>Right to erasure</li>
                <li>Right to data portability</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-pink-400">CCPA Rights (California)</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
                <li>Right to know</li>
                <li>Right to delete</li>
                <li>Right to opt-out</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-800">
            <p className="text-white">
              <span className="font-semibold">Exercise Your Rights:</span> Contact us at{' '}
              <a href="mailto:privacy@gentleomegaai.space" className="text-purple-400 underline">
                privacy@gentleomegaai.space
              </a>
              {' '}to exercise any of these rights. We will respond within 30 days.
            </p>
          </div>
        </section>

        {/* Section 8: Cookies */}
        <section id="section-8" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            8. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-300 mb-4">We use cookies and similar tracking technologies to enhance your experience.</p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-gray-800">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-3 text-left text-purple-400">Cookie Type</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-purple-400">Purpose</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-purple-400">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Essential</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Authentication, security</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Performance</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Analyze usage</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">2 years</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Functional</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Remember preferences</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3 text-gray-300">Marketing</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">Relevant advertisements</td>
                  <td className="border border-gray-700 px-4 py-3 text-gray-400">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Remaining sections in condensed format */}
        <section id="section-9" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            9. Children's Privacy
          </h2>
          <p className="text-gray-300">
            Our services are not intended for children under 13 years of age (or 16 in the EEA). We do not knowingly collect personal information from children. If you believe your child has provided us with personal information, please contact us immediately.
          </p>
        </section>

        <section id="section-10" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            10. International Data Transfers
          </h2>
          <p className="text-gray-300 mb-4">
            Your information may be transferred to countries other than your residence, including the United States and European Union. We ensure appropriate safeguards through Standard Contractual Clauses and compliance with data privacy frameworks.
          </p>
        </section>

        <section id="section-11" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            11. AI and Automated Decision-Making
          </h2>
          <p className="text-gray-300 mb-4">
            Our platform uses AI technology to provide intelligent responses. Your conversations may be used to train and improve our AI models. This data is anonymized and cannot be traced back to you individually.
          </p>
        </section>

        <section id="section-12" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-gray-800 pb-3">
            12. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-300">
            We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of material changes by email or prominent notice on our website.
          </p>
        </section>

        {/* Contact Section */}
        <section id="section-16" className="mb-10">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-8 border border-purple-700">
            <h2 className="text-3xl font-bold mb-6 text-white">Contact Information</h2>
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
                <p className="font-semibold">Privacy Email:</p>
                <a href="mailto:privacy@gentleomegaai.space" className="text-purple-200 underline">
                  privacy@gentleomegaai.space
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
                <p className="font-semibold">Data Protection Officer:</p>
                <a href="mailto:dpo@gentleomegaai.space" className="text-purple-200 underline">
                  dpo@gentleomegaai.space
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Box */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">Summary of Key Points</h3>
          <ul className="space-y-2">
            {[
              "We collect personal, usage, and AI interaction data",
              "Your data is used to provide and improve services",
              "We share data only with trusted service providers",
              "We do NOT sell your personal information",
              "You have full control over your data (access, delete, export)",
              "We use industry-standard security measures",
              "You can opt-out of marketing anytime",
              "Contact us with any privacy concerns"
            ].map((point, index) => (
              <li key={index} className="flex items-start text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
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

export default PrivacyPolicy;
