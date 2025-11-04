import React from 'react';
import { WHATSAPP_LINK } from '../../constants';
import { Page } from '../../types';

interface HeroProps {
  navigate: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ navigate }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-4xl max-h-4xl bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-[70vw] h-[70vw] max-w-3xl max-h-3xl bg-blue-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="relative z-20 container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
          Welcome to<br />Gentle <span className="text-accent-cyan">Ω</span>mega AI Space
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Where every <span className="text-white font-semibold">Artificial Intelligence</span> counts for humans!
        </p>
        <p className="mt-4 text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
          Bear AI. Aware AI. Gear AI. – Your gateway to the future of AI-powered career development and intelligent automation.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Book Your Slot Now
          </a>
           <button onClick={() => navigate('menu')} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white rounded-md border-2 border-cyan-500/50 bg-black/20 hover:bg-cyan-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.074 6.808 5 7 5c.192 0 .488.074.757.221.269.147.485.33.645.545l.01.01.004.005 1.59 2.226a1 1 0 01.05.242l.002.002.002.003a1 1 0 01-.22 1.095l-.445.445a.5.5 0 00-.03.693l1.53 1.53a.5.5 0 00.693-.03l.445-.445a1 1 0 011.096-.22l.002.002.003.002.05.01a1 1 0 01.242.05l2.226 1.59.005.004.01.01c.215.16.4.376.545.645C14.926 12.512 15 12.808 15 13a1 1 0 01-1 1c-.192 0-.488-.074-.757-.221a6.022 6.022 0 01-2.706-1.912 6.022 6.022 0 01-1.912-2.706C8.074 8.512 8 8.192 8 8a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Explore AI Hub
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
