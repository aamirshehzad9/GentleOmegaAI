/**
 * AI BLOGS STUDIO - DYNAMIC HEADER
 * Different headers for: Landing, User Dashboard, Admin Dashboard
 */

import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

interface BlogsHeaderProps {
  context: 'landing' | 'user' | 'admin';
  onNavigate?: (page: string) => void;
  currentPage?: string;
  showBackButton?: boolean;
}

const BlogsHeader: React.FC<BlogsHeaderProps> = ({ context, onNavigate, currentPage, showBackButton }) => {
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      onNavigate?.('landing');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Landing Page Header (Public)
  if (context === 'landing') {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    return (
      <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E27]/90 backdrop-blur-lg border-b border-[#F7B731]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => onNavigate?.('landing')}>
            <img src="/logo.png" alt="GentleΩmegaAI" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg sm:text-xl">AI Blogs Studio</span>
              <span className="text-[#F7B731] text-xs font-semibold">by GentleΩmegaAI</span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-[#F7B731] transition">Features</a>
            <button onClick={() => onNavigate?.('pricing')} className="text-gray-300 hover:text-[#F7B731] transition">Pricing</button>
            <a href="#testimonials" className="text-gray-300 hover:text-[#F7B731] transition">Success Stories</a>
            <a href="#faq" className="text-gray-300 hover:text-[#F7B731] transition">FAQ</a>
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && currentUser.uid ? (
              <button
                onClick={() => onNavigate?.('dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#F7B731]/50 transition"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="text-gray-300 hover:text-white transition font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="px-6 py-2 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#F7B731]/50 transition"
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-40 bg-[#0A0E27]/95 backdrop-blur-lg border-b border-[#F7B731]/20 max-h-[calc(100vh-72px)] overflow-y-auto md:hidden">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-[#F7B731] transition py-2 text-lg">Features</a>
              <button onClick={() => { onNavigate?.('pricing'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-[#F7B731] transition py-2 text-lg text-left">Pricing</button>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-[#F7B731] transition py-2 text-lg">Success Stories</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-[#F7B731] transition py-2 text-lg">FAQ</a>
            </nav>
            
            {/* Mobile CTA Buttons */}
            <div className="pt-4 border-t border-[#F7B731]/20 space-y-3">
              {currentUser && currentUser.uid ? (
                <button
                  onClick={() => { onNavigate?.('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { window.location.href = '/login'; }}
                    className="w-full px-6 py-3 text-white border border-[#F7B731] rounded-lg font-semibold hover:bg-[#F7B731]/10 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { window.location.href = '/signup'; }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold"
                  >
                    Start Free Trial
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  // User Dashboard Header
  if (context === 'user') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E27]/95 backdrop-blur-xl border-b border-[#F7B731]/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo + Quick Nav */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F7B731] to-[#5F27CD] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-semibold">AI Blogs Studio</span>
            </div>

            {/* Quick Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => onNavigate?.('dashboard')}
                className={`text-sm font-medium transition ${
                  currentPage === 'dashboard'
                    ? 'text-[#F7B731]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate?.('editor')}
                className={`text-sm font-medium transition ${
                  currentPage === 'editor'
                    ? 'text-[#F7B731]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Blog
              </button>
              <button
                onClick={() => onNavigate?.('analytics')}
                className={`text-sm font-medium transition ${
                  currentPage === 'analytics'
                    ? 'text-[#F7B731]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => onNavigate?.('seo')}
                className={`text-sm font-medium transition ${
                  currentPage === 'seo'
                    ? 'text-[#F7B731]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SEO Tools
              </button>
              <button
                onClick={() => onNavigate?.('earnings')}
                className={`text-sm font-medium transition ${
                  currentPage === 'earnings'
                    ? 'text-[#F7B731]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => onNavigate?.('marketplace')}
                className={`text-sm font-medium transition ${
                  currentPage === 'marketplace'
                    ? 'text-[#F7B731]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Marketplace
              </button>
            </nav>
          </div>

          {/* Right Side: Earnings + Profile */}
          <div className="flex items-center space-x-6">
            {/* Quick Earnings Display */}
            <div className="hidden md:flex items-center space-x-2 bg-[#1A1F3A] px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-sm">This Month:</span>
              <span className="text-[#26DE81] font-bold">$0.00</span>
            </div>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3">
              <img
                src={currentUser?.photoURL || 'https://via.placeholder.com/40'}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-[#F7B731]"
              />
              <div className="hidden md:block">
                <p className="text-white text-sm font-semibold">{currentUser?.displayName || 'User'}</p>
                <p className="text-gray-400 text-xs">Professional Tier</p>
              </div>
            </div>

            {/* Settings Icon */}
            <button
              onClick={() => onNavigate?.('settings')}
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
              title="Sign Out"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Admin Dashboard Header
  if (context === 'admin') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#5F27CD] to-[#F7B731] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo + Admin Badge */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#5F27CD] font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-bold">AI Blogs Studio</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold">
              ADMIN
            </span>
          </div>

          {/* Admin Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <button className="text-white/80 hover:text-white text-sm font-medium transition">
              All Users
            </button>
            <button className="text-white/80 hover:text-white text-sm font-medium transition">
              All Blogs
            </button>
            <button className="text-white/80 hover:text-white text-sm font-medium transition">
              Revenue Reports
            </button>
            <button className="text-white/80 hover:text-white text-sm font-medium transition">
              AI Usage
            </button>
            <button className="text-white/80 hover:text-white text-sm font-medium transition">
              Support Tickets
            </button>
          </nav>

          {/* Admin Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white text-sm">Platform Revenue:</span>
              <span className="text-white font-bold">$0.00</span>
            </div>
            <img
              src={currentUser?.photoURL || 'https://via.placeholder.com/40'}
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <button
              onClick={logout}
              className="text-white/80 hover:text-white transition"
              title="Logout"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return null;
};

export default BlogsHeader;
