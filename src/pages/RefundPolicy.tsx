import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RefundPolicy: React.FC = () => {
    const navigate = (path: string) => {
        window.location.href = path === 'home' ? '/' : `/${path}`;
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-sans">
            <Header navigate={navigate} currentPage="refund-policy" />

            <main className="container mx-auto px-4 py-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
                        Refund Policy
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Last updated: December 20, 2025
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8 text-gray-300 leading-relaxed"
                >
                    <section className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-4">30-Day Money-Back Guarantee</h2>
                        <p className="mb-4">
                            At GentleOmega AI, we want you to be completely satisfied with our products. That's why we offer a
                            <strong> 30-day money-back guarantee</strong> on all our paid subscriptions and one-time purchases.
                        </p>
                        <p>
                            If you are not satisfied with your purchase for any reason, you may request a full refund within 30 days
                            of the initial transaction date. No questions asked.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Eligibility for Refunds</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>The refund request is made within 30 days of the purchase date.</li>
                            <li>The account has not been suspended for violation of our Terms of Service.</li>
                            <li>For credit-based services, usage must not exceed 25% of the purchased credits to be eligible for a full refund.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">How to Request a Refund</h2>
                        <p className="mb-4">
                            To initiate a refund, please contact our support team with your order details:
                        </p>
                        <div className="bg-black/30 p-4 rounded-lg border border-gray-700/50 inline-block">
                            <p>📧 Email: <a href="mailto:help@gentleomegaai.space" className="text-cyan-400 hover:text-cyan-300">help@gentleomegaai.space</a></p>
                            <p>Subject: Refund Request - [Order ID]</p>
                        </div>
                        <p className="mt-4">
                            We aim to process all refund requests within 3-5 business days. Once approved, the funds will be returned
                            to your original payment method within 5-10 business days, depending on your bank.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Cancellations</h2>
                        <p>
                            You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing cycle.
                            You will retain access to paid features until the cancellations becomes effective. We do not provide prorated
                            refunds for unused time in the current billing cycle unless compliant with the 30-day guarantee.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                        <p>
                            If you have any questions about this Refund Policy, please contact us at:
                        </p>
                        <address className="not-italic mt-2 text-gray-400">
                            GentleOmega AI<br />
                            Email: <a href="mailto:contact@gentleomegaai.space" className="text-cyan-400">contact@gentleomegaai.space</a><br />
                            Wyoming, USA / Karachi, Pakistan
                        </address>
                    </section>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default RefundPolicy;
