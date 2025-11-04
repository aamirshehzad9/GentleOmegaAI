import React from 'react';
import { DEALS_DATA, ICONS } from '../../constants';

const tagColors: { [key: string]: string } = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const Deals: React.FC = () => {
  return (
    <section className="bg-[#111214] py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Daily <span className="text-cyan-500">Combo Deals</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Complete these incentivized mini-tasks today and earn valuable AI Points to unlock premium features and services.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DEALS_DATA.map((deal, index) => (
            <div key={index} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 text-cyan-400">
                    <deal.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tagColors[deal.tagColor]}`}>{deal.tag}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{deal.title}</h3>
              <p className="text-gray-400 text-sm mb-5 flex-grow">{deal.description}</p>
              <div className="space-y-3 text-sm border-t border-b border-gray-800 py-4 my-4">
                <div className="flex justify-between items-center text-green-400 font-semibold"><p>{deal.points}</p><span>{deal.time}</span></div>
                <p className="text-gray-500">{deal.participants}</p>
              </div>
              <button className="w-full mt-auto py-3 font-semibold rounded-lg text-white cta-gradient cta-gradient-hover transition-all duration-300">
                Start Challenge
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-[#1a1a1a] border border-yellow-500/30 rounded-lg p-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-300">
                    <ICONS.bonus className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-white font-semibold">Complete all 4 challenges today</p>
                    <p className="text-yellow-400 font-bold text-lg">Bonus: +2000 AI Points</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Deals;
