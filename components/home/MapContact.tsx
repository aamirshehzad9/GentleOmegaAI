import React from 'react';
import { CONTACT_CARDS, SOCIAL_LINKS } from '../../constants';

const MapContact: React.FC = () => {
  const socialIcons = [
    { name: 'Facebook', Icon: SOCIAL_LINKS.Facebook },
    { name: 'Instagram', Icon: SOCIAL_LINKS.Instagram },
    { name: 'TikTok', Icon: SOCIAL_LINKS.TikTok },
    { name: 'LinkedIn', Icon: SOCIAL_LINKS.LinkedIn },
    { name: 'X', Icon: SOCIAL_LINKS.X },
    { name: 'YouTube', Icon: SOCIAL_LINKS.YouTube },
  ];

  return (
    <section className="bg-white text-gray-800 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Get in <span className="text-cyan-500">Touch</span></h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Connect with our global AI community. We're here to support your journey in artificial intelligence and career development.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Map & Visit */}
            <div className="space-y-8">
                <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden p-4">
                     <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198309.6521575005!2d-104.89552145!3d41.14087955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876f3f7499d3d3c7%3A0xfddc09be04433ad9!2sCheyenne%2C%20WY%2C%20USA!5e0!3m2!1sen!2s!4v1672532598381!5m2!1sen!2s"
                        width="100%"
                        height="400"
                        className="rounded-xl"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="GentleOmega Location Wyoming"
                    ></iframe>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Visit Our Offices</h3>
                    <p className="text-gray-600">Our global presence ensures we're always close to our community. Schedule a visit to experience our AI ecosystem firsthand.</p>
                </div>
            </div>

            {/* Right Column: Contact Cards */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {CONTACT_CARDS.map((card, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white p-3 rounded-full">
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{card.title}</h4>
                                    {card.lines.map((line, i) => (
                                        <p key={i} className="text-sm text-gray-600">{line}</p>
                                    ))}
                                    {card.link && card.linkLabel && (
                                        <a href={card.link} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold mt-1 inline-block">{card.linkLabel}</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">Follow Us</h4>
                    <div className="flex items-center gap-3">
                        {socialIcons.map(({name, Icon}) => (
                           <a key={name} href="#" title={name} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-cyan-100 hover:text-cyan-600 transition-colors">
                                <Icon className="w-5 h-5" />
                           </a>
                        ))}
                         <span className="text-sm text-gray-500 ml-2">@GentleOmegaAI</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-2xl shadow-xl text-white">
                    <h3 className="text-2xl font-bold">Ready to Start Your AI Journey?</h3>
                    <p className="mt-2 mb-4 opacity-90">Book a consultation with our AI experts and discover how we can accelerate your career growth.</p>
                    <button className="px-6 py-2.5 font-semibold bg-white text-blue-600 rounded-lg hover:bg-opacity-90 transition-all">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MapContact;