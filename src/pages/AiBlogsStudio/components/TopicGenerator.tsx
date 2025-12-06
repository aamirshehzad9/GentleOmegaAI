/**
 * AI Blogs Studio - Topic Generator
 * Generate trending blog topic ideas using AI
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateTopicIdeas } from '../api/gemini';

interface TopicGeneratorProps {
  onSelectTopic: (topic: string) => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ onSelectTopic }) => {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [error, setError] = useState('');

  const niches = [
    'Technology', 'Travel', 'Food', 'Health & Fitness', 'Business',
    'Finance', 'Fashion', 'Entertainment', 'Education', 'Science',
    'Lifestyle', 'Gaming', 'Sports', 'Parenting', 'Photography',
    'Music', 'Art & Design', 'Home & Garden', 'DIY & Crafts', 'Pets'
  ];

  const handleGenerate = async () => {
    if (!niche) {
      setError('Please select a niche first');
      return;
    }

    setLoading(true);
    setError('');
    setTopics([]);

    try {
      const result = await generateTopicIdeas(niche, 10);
      
      if (result.success) {
        setTopics(result.topics);
      } else {
        setError(result.error || 'Failed to generate topics');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1F3A] border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">💡</span>
        <div>
          <h2 className="text-2xl font-bold text-white">Topic Generator</h2>
          <p className="text-gray-400 text-sm">Get AI-powered blog topic ideas</p>
        </div>
      </div>

      {/* Niche Selection */}
      <div className="mb-4">
        <label className="block text-white font-semibold mb-2">Select Niche</label>
        <select
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F7B731]"
        >
          <option value="">Choose a niche...</option>
          {niches.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !niche}
        className="w-full px-4 py-3 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Generating Topics...
          </span>
        ) : (
          '✨ Generate Topic Ideas'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Topics List */}
      {topics.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-white font-semibold mb-3">Generated Topics:</h3>
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-[#0A0E27] border border-gray-600 rounded-lg hover:border-[#F7B731] transition-colors group cursor-pointer"
              onClick={() => onSelectTopic(topic)}
            >
              <span className="text-[#F7B731] font-bold flex-shrink-0">{index + 1}.</span>
              <p className="text-gray-300 flex-1 group-hover:text-white">{topic}</p>
              <button className="text-gray-500 group-hover:text-[#F7B731] transition-colors">
                →
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {topics.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-400">
          <p>Select a niche and click generate to get topic ideas</p>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;
