/**
 * AI Blogs Studio - Authentication Page
 * Luxury login/signup for AI Blogs Studio users
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  loginWithEmail, 
  registerWithEmail,
  loginWithGoogle, 
  loginWithGithub, 
  loginWithMicrosoft 
} from '../../../../firebase/auth';
import BlogsHeader from '../components/BlogsHeader';
import BlogsFooter from '../components/BlogsFooter';
import { AiBlogsPage } from '../index';

interface AuthPageProps {
  onNavigate: (page: AiBlogsPage) => void;
  mode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, mode: initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          throw new Error('Please enter your name');
        }
        await registerWithEmail(email, password, displayName);
        setSuccess('🎉 Account created! Redirecting to dashboard...');
        setTimeout(() => onNavigate('dashboard'), 2000);
      } else {
        await loginWithEmail(email, password);
        setSuccess('✅ Login successful! Redirecting...');
        setTimeout(() => onNavigate('dashboard'), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github' | 'microsoft') => {
    setError('');
    setLoading(true);

    try {
      if (provider === 'google') await loginWithGoogle();
      else if (provider === 'github') await loginWithGithub();
      else if (provider === 'microsoft') await loginWithMicrosoft();
      
      setSuccess('✅ Login successful! Redirecting...');
      setTimeout(() => onNavigate('dashboard'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      <BlogsHeader context="landing" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Start Your Journey'}
            </h1>
            <p className="text-gray-400">
              {mode === 'login' 
                ? 'Sign in to access your AI Blogs Studio dashboard' 
                : 'Create your account and start earning today'
              }
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1F3A]/50 backdrop-blur-xl border border-[#F7B731]/20 rounded-2xl p-8 shadow-2xl"
          >
            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 text-sm">{success}</p>
              </motion.div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleSocialAuth('github')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-[#24292e] text-white rounded-lg font-semibold hover:bg-[#2f363d] transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>Continue with GitHub</span>
              </button>

              <button
                onClick={() => handleSocialAuth('microsoft')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-[#00A4EF] text-white rounded-lg font-semibold hover:bg-[#0078D4] transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                <span>Continue with Microsoft</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F7B731]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1A1F3A] text-gray-400">Or with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20 transition"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20 transition"
                  placeholder="••••••••"
                />
                {mode === 'signup' && (
                  <p className="mt-2 text-xs text-gray-500">Must be at least 6 characters</p>
                )}
              </div>

              {mode === 'signup' && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-[#F7B731] bg-[#0A0E27] border-[#F7B731]/20 rounded focus:ring-[#F7B731]"
                  />
                  <label className="ml-3 text-sm text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-[#F7B731] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#F7B731] hover:underline">Privacy Policy</a>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#F7B731]/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-[#F7B731] font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign up for free' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>

          {/* Benefits */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-white font-semibold text-sm">AI-Powered</p>
                <p className="text-gray-500 text-xs">Content Generation</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-white font-semibold text-sm">Auto-Monetization</p>
                <p className="text-gray-500 text-xs">Multiple Revenue Streams</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-white font-semibold text-sm">SEO Optimized</p>
                <p className="text-gray-500 text-xs">Rank Higher on Google</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BlogsFooter context="landing" onNavigate={onNavigate} />
    </div>
  );
};

export default AuthPage;
