import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center bg-white p-10 sm:p-16 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Stay Ahead with <span className="text-cyan-500">AI Evolution</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest insights, trends, and opportunities in artificial intelligence delivered to your inbox.
            </p>
            <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow bg-gray-100 border border-gray-200 rounded-lg py-3.5 px-5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400" 
                />
                <button 
                  type="submit" 
                  className="px-8 py-3.5 font-semibold text-white rounded-lg cta-gradient cta-gradient-hover transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/40"
                >
                    Subscribe Now
                </button>
            </form>
             <p className="mt-4 text-sm text-gray-500">
                Join 10,000+ AI professionals. Unsubscribe anytime.
            </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;