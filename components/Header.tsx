import React, { useState } from 'react';
import { Page, NavItem } from '../types';
import { NAV_LINKS, ICONS, WHATSAPP_LINK } from '../constants';

interface HeaderProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{ item: NavItem, navigate: (page: Page) => void }> = ({ item, navigate }) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
        const dropdownWidth = item.label === 'About GΩHQ' ? 'w-80' : 'w-72';
        return (
            <div className="group relative">
                <button className="flex items-center space-x-1 py-4 text-white hover:text-accent-yellow transition-colors duration-300">
                    <span>{item.label}</span>
                    <ICONS.chevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className={`absolute top-full left-1/2 -translate-x-1/2 ${dropdownWidth} bg-[#13171D] rounded-lg shadow-2xl shadow-black/50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top z-50 border border-gray-700/50 p-2`}>
                    <div className="space-y-1">
                        {item.children.map((child, index) => (
                            <a
                                key={index}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (child.href) navigate(child.href);
                                    if (child.isDashboard) navigate('dashboard');
                                }}
                                className="flex items-start p-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 w-full text-left"
                            >
                                <span className="mt-1.5 w-1.5 h-1.5 bg-accent-yellow rounded-full flex-shrink-0"></span>
                                <div className="ml-3">
                                    <p className="font-semibold text-white leading-tight">{child.label}</p>
                                    <p className="text-sm text-gray-400 leading-tight">{child.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                if (item.href) navigate(item.href);
            }}
            className="py-4 text-white hover:text-accent-yellow transition-colors duration-300"
        >
            {item.label}
        </a>
    );
};

const Header: React.FC<HeaderProps> = ({ navigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0D0D]/90 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
             <div className="text-white relative w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md" style={{filter: 'drop-shadow(0 0 5px #C0C0C0)'}}>
                <ICONS.logo className="h-7 w-7 text-black" />
             </div>
            <span className="text-xl font-semibold text-white tracking-wider">Gentle <span className="text-accent-cyan">Ω</span>mega AI</span>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link, index) => (
              <NavLink key={index} item={link} navigate={navigate} />
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="hidden sm:block text-white hover:text-accent-yellow transition-colors">
              <ICONS.search className="w-5 h-5" />
            </button>
            <button className="hidden sm:block px-6 py-2.5 text-sm font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
              Log In
            </button>
            <button className="hidden sm:block px-6 py-2.5 text-sm font-semibold text-black rounded-md cta-gradient-yellow hover:opacity-90 transition-opacity duration-300 shadow-md hover:shadow-lg hover:shadow-yellow-500/30">
              Sign Up
            </button>
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-white hover:text-accent-yellow transition-colors">
                {isDarkMode ? <ICONS.moon className="w-6 h-6" /> : <ICONS.sun className="w-6 h-6" />}
             </button>
             <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <ICONS.menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
       {/* Mobile Menu */}
       <div className={`lg:hidden absolute top-20 left-0 w-full bg-[#0D0D0D] transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen border-t border-gray-800' : 'max-h-0'}`}>
        <div className="flex flex-col p-4 space-y-2">
          {NAV_LINKS.map((link, index) => (
            <div key={index} className="w-full">
              {link.children ? (
                <>
                  <p className="text-gray-400 font-semibold px-2">{link.label}</p>
                  <div className="pl-2">
                    {link.children.map((child, childIndex) => (
                       <a key={childIndex} href="#" onClick={(e) => { e.preventDefault(); if (child.href) navigate(child.href); if(child.isDashboard) navigate('dashboard'); setIsMenuOpen(false); }} className="block py-2 px-2 rounded-md text-white hover:bg-gray-500/10 hover:text-accent-yellow">{child.label}</a>
                    ))}
                  </div>
                </>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); if(link.href) navigate(link.href); setIsMenuOpen(false); }} className="block py-2 px-2 rounded-md text-white hover:bg-gray-500/10 hover:text-accent-yellow font-semibold">{link.label}</a>
              )}
            </div>
          ))}
          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
             <button className="w-full px-6 py-3 text-sm font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300">
              Log In
            </button>
            <button className="w-full px-6 py-3 text-sm font-semibold text-black rounded-md cta-gradient-yellow hover:opacity-90 transition-opacity duration-300">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;