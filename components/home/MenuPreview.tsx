import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES, WHATSAPP_LINK } from '../../constants';
import { Page } from '../../types';

interface MenuPreviewProps {
  navigate: (page: Page) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            ease: "easeOut"
        }
    })
};


const MenuPreview: React.FC<MenuPreviewProps> = ({ navigate }) => {
  const previewServices = SERVICES.slice(0, 8);

  return (
    <section className="bg-white text-gray-800 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
          {/* FIX: Added tracking-tight for better kerning on large text. */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            AI Services <span className="text-cyan-500">Menu Preview</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of AI-powered tools and services designed to accelerate your career and business growth.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {previewServices.map((service, index) => (
            <motion.div 
                key={index} 
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
              <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{service.description}</p>
                <div className="flex justify-between items-center mb-5">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    <StarRating rating={service.rating} />
                </div>
                <button
                  onClick={() => navigate('checkout')}
                  className="w-full mt-auto px-5 py-3 text-sm font-semibold text-white rounded-lg cta-gradient cta-gradient-hover transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/40"
                >
                  Book Your Slot Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
         <div className="text-center mt-16">
            <button 
              onClick={() => navigate('menu')} 
              className="px-8 py-3.5 text-base font-semibold text-cyan-600 rounded-lg border-2 border-cyan-500 bg-white hover:bg-cyan-50 transition-all duration-300"
            >
                → View Complete Menu
            </button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;