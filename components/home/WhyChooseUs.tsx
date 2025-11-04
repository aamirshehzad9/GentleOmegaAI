import React from 'react';
import { motion } from 'framer-motion';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
        {children}
    </div>
);

const features = [
  { 
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
    title: "Fresh AI Projects", 
    description: "Cutting-edge AI solutions and innovative projects that push the boundaries of artificial intelligence technology." 
  },
  { 
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    title: "Fast AI Services", 
    description: "Lightning-fast deployment and implementation of AI services with optimized performance and reliability." 
  },
  { 
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    title: "Trust AI", 
    description: "Ethical, transparent, and responsible AI development with robust security and privacy protection." 
  },
  { 
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    title: "Loved Globally", 
    description: "Trusted by thousands of users worldwide for delivering exceptional AI-powered career solutions." 
  },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};


const WhyChooseUs: React.FC = () => {
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
                Why Choose <span className="text-cyan-500">Gentle</span><span className="text-blue-600">Ωmega</span> AI?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the future of AI-powered career development with our comprehensive ecosystem designed for human success.
            </p>
        </motion.div>
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col">
              <IconWrapper>{feature.icon}</IconWrapper>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;