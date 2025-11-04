
import React from 'react';
import { SERVICES, WHATSAPP_LINK } from '../constants';

const MenuPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">Our AI Services</h1>
        <p className="mt-4 text-lg text-gray-400">Explore our suite of AI-powered solutions designed for growth and efficiency.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service, index) => (
          <div key={index} className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden shadow-lg shadow-black/30 transform hover:-translate-y-2 transition-transform duration-300 group">
            <img src={service.image} alt={service.name} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-accent-yellow">{service.price}</span>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-5 py-2 text-sm font-semibold text-white rounded-md cta-gradient cta-gradient-hover transition-all duration-300">
                  Subscribe
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
