import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase/config';
import PublicHeader from './PublicHeader';

const LoginPortal: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to user dashboard or admin based on role
            navigate('/go-aibob/Admin');
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <PublicHeader />

            <section className="py-20">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 border border-gray-700 rounded-2xl p-8"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-gray-400">Login to your GO-AIBOB account</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-900/20 border border-red-700 rounded-lg p-4">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded border-gray-700 bg-gray-900 text-cyan-600 focus:ring-cyan-500" />
                                    <span className="text-sm text-gray-400">Remember me</span>
                                </label>
                                <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300">
                                    Forgot password?
                                </button>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => navigate('/go-aibob/signup')}
                                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                                >
                                    Sign up free
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LoginPortal;
