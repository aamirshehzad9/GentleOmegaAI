/**
 * Help Tooltip Component
 * Reusable tooltip for providing contextual help throughout the platform
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  learnMoreLink?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  content, 
  position = 'top',
  size = 'md',
  learnMoreLink 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const tooltipPositions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-180',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 -rotate-90',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 rotate-90'
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-[#F7B731] hover:text-[#F39C12] transition-colors cursor-help"
        aria-label="Help"
      >
        <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${tooltipPositions[position]}`}
          >
            {/* Tooltip Arrow */}
            <div className={`absolute ${arrowPositions[position]} w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#1A1F3A]`} />
            
            {/* Tooltip Content */}
            <div className="bg-[#1A1F3A] border border-[#F7B731]/30 rounded-lg shadow-2xl p-4 max-w-xs">
              <div className="text-gray-200 text-sm leading-relaxed">
                {content}
              </div>
              {learnMoreLink && (
                <a
                  href={learnMoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-[#F7B731] hover:text-[#F39C12] text-sm font-semibold transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  Learn More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpTooltip;
