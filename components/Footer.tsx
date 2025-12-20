import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../types';
import { ICONS, SOCIAL_LINKS, SOCIAL_URLS, WHATSAPP_COMMUNITY_LINK } from '../constants';

interface FooterProps {
  navigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const socialIcons = [
    { name: 'X', Icon: SOCIAL_LINKS.X, url: SOCIAL_URLS.X },
    { name: 'Facebook', Icon: SOCIAL_LINKS.Facebook, url: SOCIAL_URLS.Facebook },
    { name: 'YouTube', Icon: SOCIAL_LINKS.YouTube, url: SOCIAL_URLS.YouTube },
    { name: 'Instagram', Icon: SOCIAL_LINKS.Instagram, url: SOCIAL_URLS.Instagram },
    { name: 'LinkedIn', Icon: SOCIAL_LINKS.LinkedIn, url: SOCIAL_URLS.LinkedIn },
    { name: 'GitHub', Icon: SOCIAL_LINKS.GitHub, url: SOCIAL_URLS.GitHub },
    { name: 'TikTok', Icon: SOCIAL_LINKS.TikTok, url: SOCIAL_URLS.TikTok },
    { name: 'Reddit', Icon: SOCIAL_LINKS.Reddit, url: SOCIAL_URLS.Reddit },
    { name: 'Google', Icon: SOCIAL_LINKS.Google, url: SOCIAL_URLS.Google },
  ];

  const quickNav = {
    col1: [
      { label: 'Home', page: 'home' as Page },
      { label: 'AI Hub', page: 'menu' as Page },
      { label: 'Products' },
      { label: 'Blogs' },
      { label: 'About' },
      { label: 'Finance', page: 'dashboard' as Page },
    ],
    col2: [
      { label: 'AI Career', page: 'menu' as Page },
      { label: 'Bot & SaaS' },
      { label: 'Services', page: 'menu' as Page },
      { label: 'News' },
      { label: 'Contact', page: 'contact' },
      { label: 'HR', page: 'dashboard' as Page },
    ]
  };

  const getPath = (page: string) => page === 'home' ? '/' : `/${page}`;

  return (
    <footer className="bg-[#111214] text-gray-400 border-t border-gray-800/50">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand and Contact */}
          <div className="md:col-span-3 space-y-4">
            <Link to="/" className="flex items-center space-x-3 cursor-pointer">
              <ICONS.logo className="h-8 w-8 text-white" />
              <span className="text-xl font-semibold text-white">Gentle <span className="text-accent-cyan">Ω</span>mega AI</span>
            </Link>
            <p className="text-sm">Where every Artificial Intelligence counts for humans!</p>
            <address className="text-sm not-italic space-y-2">
              <p>2105 Vista Oeste NW, Suite E #3519, Albuquerque, NM 87120, USA</p>
              <p>Main Shahra-e-Faisal, near Nursery, Block-6, Karachi, Pakistan</p>
              <p>📧 <a href="mailto:press@gentleomegaai.space" className="hover:text-cyan-400 transition-colors">press@gentleomegaai.space</a></p>
              <p>📧 <a href="mailto:info@gentleomegaai.space" className="hover:text-cyan-400 transition-colors">info@gentleomegaai.space</a></p>
              <p>📧 <a href="mailto:support@gentleomegaai.space" className="hover:text-cyan-400 transition-colors">support@gentleomegaai.space</a></p>
              <p>📧 <a href="mailto:contact@gentleomegaai.space" className="hover:text-cyan-400 transition-colors">contact@gentleomegaai.space</a></p>
              <p>📧 <a href="mailto:fraud-alert@gentleomegaai.space" className="hover:text-cyan-400 transition-colors">fraud-alert@gentleomegaai.space</a></p>
              <p>📧 <a href="mailto:help@gentleomegaai.space" className="hover:text-cyan-400 transition-colors">help@gentleomegaai.space</a></p>
              <p>📱 <a href="tel:+19208066680" className="hover:text-cyan-400 transition-colors">+1 920 806 6680</a> (US)</p>
              <p>📱 <a href="tel:+923468066680" className="hover:text-cyan-400 transition-colors">+92 346 806 6680</a> (PAK)</p>
              <p>💬 <a href={SOCIAL_URLS.WhatsApp} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">WhatsApp Business</a></p>
              <p>💬 <a href={WHATSAPP_COMMUNITY_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">WhatsApp Community</a></p>
              <p>⏰ 12 PM–12 AM (Mon–Sun)</p>
            </address>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-white mb-4">Quick Navigation</h3>
            <div className="flex space-x-12">
              <ul className="space-y-2">
                {quickNav.col1.map(link => (
                  <li key={link.label}>
                    {link.page ? (
                      <Link to={getPath(link.page)} className="hover:text-white transition-colors text-sm">{link.label}</Link>
                    ) : (
                      <span className="hover:text-white transition-colors text-sm cursor-pointer">{link.label}</span>
                    )}
                  </li>
                ))}
                <li><Link to="/dashboard" className="hover:text-white transition-colors text-sm">Architecture</Link></li>
              </ul>
              <ul className="space-y-2">
                {quickNav.col2.map(link => (
                  <li key={link.label}>
                    {link.page ? (
                      <Link to={getPath(link.page)} className="hover:text-white transition-colors text-sm">{link.label}</Link>
                    ) : (
                      <span className="hover:text-white transition-colors text-sm cursor-pointer">{link.label}</span>
                    )}
                  </li>
                ))}
                <li><Link to="/admin" className="hover:text-white transition-colors text-sm">Admin</Link></li>
              </ul>
            </div>
          </div>

          {/* Follow Us */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-white mb-4">Follow Us</h3>
            <div className="grid grid-cols-3 gap-2">
              {socialIcons.map(({ name, Icon, url }) => (
                <a key={name} href={url} title={name} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 bg-gray-800 rounded-md hover:bg-cyan-500/20 text-gray-400 hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-sm mt-4 text-center">@GentleOmegaAI</p>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="font-semibold text-white mb-4">Join the AI Movement</h3>
            <p className="text-sm mb-4">Stay informed with AI evolution</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="Enter your email" className="flex-grow bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300">Subscribe Now</button>
            </form>
            <div className="flex items-center justify-end space-x-4 mt-8">
              <div>
                <label className="text-xs text-gray-500" htmlFor="lang-select">Language:</label>
                <select id="lang-select" className="bg-gray-800 border border-gray-700 rounded-md py-1 px-2 text-sm text-white focus:outline-none appearance-none">
                  <option>EN</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500" htmlFor="curr-select">Currency:</label>
                <select id="curr-select" className="bg-gray-800 border border-gray-700 rounded-md py-1 px-2 text-sm text-white focus:outline-none appearance-none">
                  <option>USD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-center sm:text-left mb-4 sm:mb-0">© 2025 GentleΩmega AI Career Center. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors cursor-pointer">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors cursor-pointer">Terms</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors cursor-pointer">Refund Policy</Link>
            <a href="#" className="hover:text-white">Cookie</a>
            <a href="#" className="hover:text-white">Data Ethics & AI Responsibility</a>
          </div>
        </div>
        <p className="text-center text-xs mt-4">Powered by GentleΩmega Ecosystem — Ethical, compliant, transparent. <span className="opacity-50 ml-2">v2.2</span></p>
      </div>
    </footer>
  );
};

export default Footer;