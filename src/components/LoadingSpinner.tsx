import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center">
                {/* Spinning gradient circle */}
                <div className="relative inline-block">
                    <div className="w-16 h-16 border-4 border-gray-700 border-t-cyan-500 border-r-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>

                {/* Loading text */}
                <p className="mt-6 text-gray-300 text-lg font-medium animate-pulse">
                    Loading...
                </p>

                {/* Subtle hint */}
                <p className="mt-2 text-gray-500 text-sm">
                    Preparing your experience
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
