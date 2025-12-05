/**
 * AI BLOGS STUDIO - DYNAMIC FOOTER
 * Different footers for: Landing, User Dashboard, Admin Dashboard
 */

import React from 'react';

interface BlogsFooterProps {
  context: 'landing' | 'user' | 'admin';
  onNavigate?: (page: string) => void;
}

const BlogsFooter: React.FC<BlogsFooterProps> = ({ context, onNavigate }) => {
  const currentYear = new Date().getFullYear();

  // Landing Page Footer (Full Featured)
  if (context === 'landing') {
    return (
      <footer className="bg-[#0A0E27] border-t border-[#F7B731]/20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F7B731] to-[#5F27CD] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <span className="text-white font-bold text-xl">AI Blogs Studio</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The world's most advanced AI-powered blogging platform that pays creators. Generate premium content, earn from multiple revenue streams.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#F7B731] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F7B731] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F7B731] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">API Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Changelog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Roadmap</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Video Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Community Forum</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Case Studies</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#F7B731] text-sm transition">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              <p>© {currentYear} <strong className="text-[#F7B731]">AI Blogs Studio</strong>. All rights reserved.</p>
              <p className="mt-1">Powered by <strong className="text-white">GentleΩmegaAI</strong> — Enterprise AI Solutions</p>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Powered by Google Gemini</span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">99.99% Uptime SLA</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // User Dashboard Footer (Minimal)
  if (context === 'user') {
    return (
      <footer className="bg-[#0A0E27] border-t border-[#F7B731]/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} AI Blogs Studio. Made with ❤️ for creators.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-[#F7B731] text-sm transition">Help Center</a>
              <a href="#" className="text-gray-500 hover:text-[#F7B731] text-sm transition">API Docs</a>
              <a href="#" className="text-gray-500 hover:text-[#F7B731] text-sm transition">Community</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Admin Dashboard Footer (Minimal)
  if (context === 'admin') {
    return (
      <footer className="bg-[#0A0E27] border-t border-[#5F27CD]/20 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} AI Blogs Studio Admin Panel
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">System Status: </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-500 text-sm font-semibold">Operational</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return null;
};

export default BlogsFooter;
