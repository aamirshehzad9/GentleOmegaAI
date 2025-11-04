
import React from 'react';

const DashboardPlaceholder: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center container mx-auto px-4 py-16">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-12 shadow-2xl shadow-black/40">
        <h1 className="text-4xl font-bold text-accent-yellow mb-4">Internal Module</h1>
        <p className="text-xl text-gray-300 mb-6">This console is available to authenticated users.</p>
        <p className="text-gray-400 mb-8">Please log in to access the Finance Dashboard, AI/ML Hub, HR Analytics, System Architecture, or Admin Console.</p>
        <div className="flex justify-center space-x-4">
            <button className="px-8 py-3 text-base font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
              Log In
            </button>
            <button className="px-8 py-3 text-base font-semibold text-black rounded-md cta-gradient-yellow hover:opacity-90 transition-opacity duration-300 shadow-md hover:shadow-lg hover:shadow-yellow-500/30">
              Sign Up
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPlaceholder;
