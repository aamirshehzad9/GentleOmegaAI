import React, { useState, useEffect, useRef } from 'react';
import { Page, NavItem } from '../types';
import { NAV_LINKS, ICONS, WHATSAPP_LINK } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/admin-check';
import { logout } from '../firebase/auth';

interface HeaderProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{ item: NavItem, navigate: (page: Page) => void }> = ({ item, navigate }) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
        const dropdownWidth = item.label === 'Respect us' ? 'w-80' : 'w-72';
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    // Add small delay to allow click event to complete
    if (showUserMenu) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('home');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0D0D]/90 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
             <img src="/logo.png" alt="Gentle Omega AI Logo" className="h-10 w-10 object-contain" />
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

            {/* User Menu or Login/Signup Buttons */}
            {isAuthenticated && currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-cyan-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-white font-medium">
                    {currentUser.displayName || 'User'}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </button>
                    
                    {/* Admin Panel - Only for Admins */}
                    {isAdmin(currentUser?.email || null) && (
                      <button
                        onClick={() => {
                          navigate('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-cyan-400 hover:bg-gray-800 hover:text-cyan-300 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Admin Panel
                      </button>
                    )}
                    
                    <div className="border-t border-gray-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('login')}
                  className="hidden sm:block px-6 py-2.5 text-sm font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('signup')}
                  className="hidden sm:block px-6 py-2.5 text-sm font-semibold text-black rounded-md cta-gradient-yellow hover:opacity-90 transition-opacity duration-300 shadow-md hover:shadow-lg hover:shadow-yellow-500/30"
                >
                  Sign Up
                </button>
              </>
            )}

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
             <button 
               onClick={() => { navigate('login'); setIsMenuOpen(false); }} 
               className="w-full px-6 py-3 text-sm font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300"
             >
              Log In
            </button>
            <button 
              onClick={() => { navigate('signup'); setIsMenuOpen(false); }} 
              className="w-full px-6 py-3 text-sm font-semibold text-black rounded-md cta-gradient-yellow hover:opacity-90 transition-opacity duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;