import React from 'react';
import { Page } from '../types';
import { ICONS, SOCIAL_LINKS } from '../constants';

interface FooterProps {
  navigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const socialIcons = [
    { name: 'Facebook', Icon: SOCIAL_LINKS.Facebook },
    { name: 'Instagram', Icon: SOCIAL_LINKS.Instagram },
    { name: 'TikTok', Icon: SOCIAL_LINKS.TikTok },
    { name: 'LinkedIn', Icon: SOCIAL_LINKS.LinkedIn },
    { name: 'X', Icon: SOCIAL_LINKS.X },
    { name: 'YouTube', Icon: SOCIAL_LINKS.YouTube },
    { name: 'GitHub', Icon: SOCIAL_LINKS.GitHub },
    { name: 'Reddit', Icon: SOCIAL_LINKS.Reddit },
    { name: 'Google', Icon: SOCIAL_LINKS.Google },
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
        { label: 'Contact' },
        { label: 'HR', page: 'dashboard' as Page },
    ]
  };

  return (
    <footer className="bg-[#111214] text-gray-400 border-t border-gray-800/50">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand and Contact */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
                <ICONS.logo className="h-8 w-8 text-white" />
                <span className="text-xl font-semibold text-white">Gentle <span className="text-accent-cyan">Ω</span>mega AI</span>
            </div>
            <p className="text-sm">Where every Artificial Intelligence counts for humans!</p>
            <address className="text-sm not-italic space-y-2">
                <p>Wyoming, USA / Main Shahra-e-Faisal, near Nursery, Block-6, Karachi, Pakistan</p>
                <p>📧 contact@gentleomegaai.space</p>
                <p>📱 +923468066680</p>
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
                            <a href="#" onClick={(e) => { e.preventDefault(); if (link.page) navigate(link.page); }} className="hover:text-white transition-colors text-sm">{link.label}</a>
                        </li>
                    ))}
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }} className="hover:text-white transition-colors text-sm">Architecture</a></li>
                </ul>
                <ul className="space-y-2">
                    {quickNav.col2.map(link => (
                        <li key={link.label}>
                            <a href="#" onClick={(e) => { e.preventDefault(); if (link.page) navigate(link.page); }} className="hover:text-white transition-colors text-sm">{link.label}</a>
                        </li>
                    ))}
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }} className="hover:text-white transition-colors text-sm">Admin</a></li>
                </ul>
             </div>
          </div>
          
          {/* Follow Us */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-white mb-4">Follow Us</h3>
            <div className="grid grid-cols-3 gap-2">
                {socialIcons.slice(0, 9).map(({name, Icon}) => (
                    <a key={name} href="#" title={name} className="flex items-center justify-center p-2 bg-gray-800 rounded-md hover:bg-cyan-500/20 text-gray-400 hover:text-white transition-colors">
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
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookie</a>
            <a href="#" className="hover:text-white">Data Ethics & AI Responsibility</a>
          </div>
        </div>
        <p className="text-center text-xs mt-4">Powered by GentleΩmega Ecosystem — Ethical, compliant, transparent.</p>
      </div>
    </footer>
  );
};

export default Footer;