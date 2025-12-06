/**
 * SEO Dashboard - Advanced SEO Automation Engine
 * Keyword research, competitor analysis, content optimization
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';
import { useSEO } from '../../utils/seo';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';

interface SEODashboardProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const SEODashboard: React.FC<SEODashboardProps> = ({ onNavigate }) => {
  const seo = useSEO();
  const [activeTab, setActiveTab] = useState<'research' | 'competitor' | 'optimize' | 'audit'>('research');
  const [loading, setLoading] = useState(false);

  // Keyword Research State
  const [seedKeyword, setSeedKeyword] = useState('');
  const [keywordResults, setKeywordResults] = useState<any>(null);

  // Competitor Analysis State
  const [competitorKeyword, setCompetitorKeyword] = useState('');
  const [competitorResults, setCompetitorResults] = useState<any>(null);

  // Content Optimization State
  const [contentToOptimize, setContentToOptimize] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [optimizationResults, setOptimizationResults] = useState<any>(null);

  // Content Audit State
  const [auditContent, setAuditContent] = useState('');
  const [auditKeyword, setAuditKeyword] = useState('');
  const [auditResults, setAuditResults] = useState<any>(null);

  // ============================================================================
  // KEYWORD RESEARCH
  // ============================================================================

  const handleKeywordResearch = async () => {
    if (!seedKeyword.trim()) return;
    
    setLoading(true);
    try {
      const results = await seo.researchKeywords({
        seedKeyword: seedKeyword.trim(),
      });
      setKeywordResults(results);
    } catch (error) {
      console.error('Keyword research error:', error);
      alert('Failed to complete keyword research. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // COMPETITOR ANALYSIS
  // ============================================================================

  const handleCompetitorAnalysis = async () => {
    if (!competitorKeyword.trim()) return;
    
    setLoading(true);
    try {
      const results = await seo.analyzeCompetitors({
        targetKeyword: competitorKeyword.trim(),
        numberOfCompetitors: 5,
      });
      setCompetitorResults(results);
    } catch (error) {
      console.error('Competitor analysis error:', error);
      alert('Failed to analyze competitors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // CONTENT OPTIMIZATION
  // ============================================================================

  const handleContentOptimization = async () => {
    if (!contentToOptimize.trim() || !targetKeyword.trim()) return;
    
    setLoading(true);
    try {
      const results = await seo.optimizeBlogPost({
        title: targetKeyword,
        content: contentToOptimize,
        targetKeyword: targetKeyword.trim(),
      });
      setOptimizationResults(results);
    } catch (error) {
      console.error('Content optimization error:', error);
      alert('Failed to optimize content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // CONTENT AUDIT
  // ============================================================================

  const handleContentAudit = async () => {
    if (!auditContent.trim() || !auditKeyword.trim()) return;
    
    setLoading(true);
    try {
      const results = await seo.auditContent({
        content: auditContent,
        targetKeyword: auditKeyword.trim(),
      });
      setAuditResults(results);
    } catch (error) {
      console.error('Content audit error:', error);
      alert('Failed to audit content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'text-green-500';
    if (difficulty <= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <BlogsHeader onNavigate={onNavigate} currentPage="SEO" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Advanced SEO Engine
          </h1>
          <p className="text-gray-300">
            AI-powered keyword research, competitor analysis, and content optimization
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-8 flex-wrap"
        >
          {[
            { id: 'research', label: '🔍 Keyword Research', icon: '📊' },
            { id: 'competitor', label: '🎯 Competitor Analysis', icon: '📈' },
            { id: 'optimize', label: '✨ Content Optimizer', icon: '🎨' },
            { id: 'audit', label: '🔬 Content Audit', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* KEYWORD RESEARCH TAB */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">🔍 Keyword Research</h2>
                <p className="text-gray-300 mb-6">
                  Discover high-value keywords, analyze search intent, and find content opportunities
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Seed Keyword
                    </label>
                    <input
                      type="text"
                      value={seedKeyword}
                      onChange={(e) => setSeedKeyword(e.target.value)}
                      placeholder="e.g., AI content writing"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleKeywordResearch()}
                    />
                  </div>

                  <button
                    onClick={handleKeywordResearch}
                    disabled={loading || !seedKeyword.trim()}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Researching Keywords...' : 'Start Research'}
                  </button>
                </div>

                {keywordResults && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Opportunity Score */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-purple-200 mb-1">Opportunity Score</div>
                          <div className="text-4xl font-bold text-white">
                            {keywordResults.totalOpportunityScore}/100
                          </div>
                        </div>
                        <div className="text-6xl">🎯</div>
                      </div>
                    </div>

                    {/* Primary Keywords */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">
                        Primary Keywords ({keywordResults.primaryKeywords.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {keywordResults.primaryKeywords.map((kw: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="text-lg font-semibold text-white">{kw.keyword}</div>
                                <div className="text-sm text-gray-400">{kw.intent}</div>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  kw.competition === 'low'
                                    ? 'bg-green-900 text-green-300'
                                    : kw.competition === 'medium'
                                    ? 'bg-yellow-900 text-yellow-300'
                                    : 'bg-red-900 text-red-300'
                                }`}
                              >
                                {kw.competition}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400">Search Volume</div>
                                <div className="text-white font-semibold">
                                  {kw.searchVolume.toLocaleString()}/mo
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">Difficulty</div>
                                <div className={`font-semibold ${getDifficultyColor(kw.difficulty)}`}>
                                  {kw.difficulty}/100
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">CPC</div>
                                <div className="text-white font-semibold">${kw.cpc.toFixed(2)}</div>
                              </div>
                            </div>
                            {kw.relatedKeywords.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-700">
                                <div className="text-xs text-gray-400 mb-2">Related:</div>
                                <div className="flex flex-wrap gap-2">
                                  {kw.relatedKeywords.slice(0, 5).map((rel: string, i: number) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300"
                                    >
                                      {rel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content Ideas */}
                    {keywordResults.contentIdeas.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                          📝 Content Ideas ({keywordResults.contentIdeas.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {keywordResults.contentIdeas.slice(0, 6).map((idea: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">
                                  {idea.contentType === 'how-to' && '📚'}
                                  {idea.contentType === 'listicle' && '📝'}
                                  {idea.contentType === 'guide' && '📖'}
                                  {idea.contentType === 'comparison' && '⚖️'}
                                  {idea.contentType === 'review' && '⭐'}
                                  {idea.contentType === 'news' && '📰'}
                                </span>
                                <div className="text-sm font-medium text-purple-400">
                                  {idea.contentType}
                                </div>
                              </div>
                              <h4 className="text-white font-semibold mb-2">{idea.title}</h4>
                              <div className="flex items-center justify-between text-sm">
                                <div className="text-gray-400">
                                  Est. Traffic: <span className="text-white">{idea.estimatedTraffic}/mo</span>
                                </div>
                                <div className={getDifficultyColor(idea.difficulty)}>
                                  Difficulty: {idea.difficulty}/100
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* COMPETITOR ANALYSIS TAB */}
          {activeTab === 'competitor' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">🎯 Competitor Analysis</h2>
                <p className="text-gray-300 mb-6">
                  Analyze top-ranking competitors and identify content gaps and opportunities
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Keyword
                    </label>
                    <input
                      type="text"
                      value={competitorKeyword}
                      onChange={(e) => setCompetitorKeyword(e.target.value)}
                      placeholder="e.g., best AI writing tools"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleCompetitorAnalysis()}
                    />
                  </div>

                  <button
                    onClick={handleCompetitorAnalysis}
                    disabled={loading || !competitorKeyword.trim()}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Analyzing Competitors...' : 'Analyze Competitors'}
                  </button>
                </div>

                {competitorResults && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Aggregate Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Avg Word Count</div>
                        <div className="text-2xl font-bold text-white">
                          {competitorResults.aggregateInsights.averageWordCount}
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Common Topics</div>
                        <div className="text-2xl font-bold text-white">
                          {competitorResults.aggregateInsights.commonTopics.length}
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Competitors Analyzed</div>
                        <div className="text-2xl font-bold text-white">
                          {competitorResults.competitors.length}
                        </div>
                      </div>
                    </div>

                    {/* Competitors */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Top Competitors</h3>
                      <div className="space-y-4">
                        {competitorResults.competitors.map((comp: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-gray-900 rounded-lg p-5 border border-gray-700"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="text-lg font-semibold text-white mb-1">
                                  {comp.domain}
                                </div>
                                <div className="text-sm text-gray-400">{comp.title}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-400">Quality Score</div>
                                <div className={`text-xl font-bold ${getScoreColor(comp.contentQuality)}`}>
                                  {comp.contentQuality}/100
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                              <div>
                                <div className="text-gray-400">Words</div>
                                <div className="text-white font-semibold">{comp.wordCount}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Backlinks</div>
                                <div className="text-white font-semibold">{comp.backlinks}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">DA</div>
                                <div className="text-white font-semibold">{comp.domainAuthority}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Readability</div>
                                <div className="text-white font-semibold">{comp.readabilityScore}</div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                              <div>
                                <div className="text-xs text-green-400 font-medium mb-2">Strengths</div>
                                <ul className="space-y-1">
                                  {comp.strengthsAndWeaknesses.strengths.slice(0, 3).map((s: string, i: number) => (
                                    <li key={i} className="text-xs text-gray-300">✓ {s}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-xs text-red-400 font-medium mb-2">Weaknesses</div>
                                <ul className="space-y-1">
                                  {comp.strengthsAndWeaknesses.weaknesses.slice(0, 3).map((w: string, i: number) => (
                                    <li key={i} className="text-xs text-gray-300">✗ {w}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {competitorResults.recommendations.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-white mb-4">💡 Strategic Recommendations</h3>
                        <ul className="space-y-2">
                          {competitorResults.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="text-gray-200 flex items-start">
                              <span className="text-purple-400 mr-2">→</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* CONTENT OPTIMIZER TAB */}
          {activeTab === 'optimize' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">✨ Content Optimizer</h2>
                <p className="text-gray-300 mb-6">
                  AI-powered content optimization for maximum SEO impact
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Keyword
                    </label>
                    <input
                      type="text"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      placeholder="e.g., content marketing strategy"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content to Optimize
                    </label>
                    <textarea
                      value={contentToOptimize}
                      onChange={(e) => setContentToOptimize(e.target.value)}
                      placeholder="Paste your content here..."
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleContentOptimization}
                    disabled={loading || !contentToOptimize.trim() || !targetKeyword.trim()}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Optimizing Content...' : 'Optimize Content'}
                  </button>
                </div>

                {optimizationResults && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Score Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-2">Quality Score</div>
                        <div className={`text-4xl font-bold ${getScoreColor(optimizationResults.qualityScore.overallScore)}`}>
                          {optimizationResults.qualityScore.overallScore}/100
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {getScoreStatus(optimizationResults.qualityScore.overallScore)}
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-2">SEO Score</div>
                        <div className={`text-4xl font-bold ${getScoreColor(optimizationResults.seoScore)}`}>
                          {optimizationResults.seoScore}/100
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {getScoreStatus(optimizationResults.seoScore)}
                        </div>
                      </div>
                    </div>

                    {/* Optimized Metadata */}
                    <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-4">📋 Optimized Metadata</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Title ({optimizationResults.metadata.title.length} chars)</div>
                          <div className="text-white">{optimizationResults.metadata.title}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Description ({optimizationResults.metadata.description.length} chars)</div>
                          <div className="text-gray-300">{optimizationResults.metadata.description}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Slug</div>
                          <div className="text-purple-400">{optimizationResults.metadata.slug}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Keywords</div>
                          <div className="flex flex-wrap gap-2">
                            {optimizationResults.metadata.keywords.map((kw: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Optimized Content Preview */}
                    <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-4">✨ Optimized Content</h3>
                      <div className="bg-gray-950 rounded p-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                          {optimizationResults.optimizedContent}
                        </pre>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {optimizationResults.suggestions.length > 0 && (
                      <div className="bg-purple-900/30 rounded-lg p-5 border border-purple-700">
                        <h3 className="text-lg font-bold text-white mb-4">💡 Suggestions</h3>
                        <ul className="space-y-2">
                          {optimizationResults.suggestions.map((suggestion: string, idx: number) => (
                            <li key={idx} className="text-gray-200 flex items-start">
                              <span className="text-purple-400 mr-2">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* CONTENT AUDIT TAB */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">🔬 Content Audit</h2>
                <p className="text-gray-300 mb-6">
                  Comprehensive content analysis with quality scoring and actionable recommendations
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Keyword
                    </label>
                    <input
                      type="text"
                      value={auditKeyword}
                      onChange={(e) => setAuditKeyword(e.target.value)}
                      placeholder="e.g., SEO optimization"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content to Audit
                    </label>
                    <textarea
                      value={auditContent}
                      onChange={(e) => setAuditContent(e.target.value)}
                      placeholder="Paste your content here..."
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleContentAudit}
                    disabled={loading || !auditContent.trim() || !auditKeyword.trim()}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Auditing Content...' : 'Audit Content'}
                  </button>
                </div>

                {auditResults && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Overall Health */}
                    <div className={`rounded-lg p-6 ${
                      auditResults.overallHealth === 'excellent' ? 'bg-green-900/30 border-green-700' :
                      auditResults.overallHealth === 'good' ? 'bg-blue-900/30 border-blue-700' :
                      auditResults.overallHealth === 'needs-work' ? 'bg-yellow-900/30 border-yellow-700' :
                      'bg-red-900/30 border-red-700'
                    } border`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-300 mb-2">Overall Health</div>
                          <div className="text-3xl font-bold text-white capitalize">
                            {auditResults.overallHealth.replace('-', ' ')}
                          </div>
                        </div>
                        <div className="text-6xl">
                          {auditResults.overallHealth === 'excellent' && '🌟'}
                          {auditResults.overallHealth === 'good' && '👍'}
                          {auditResults.overallHealth === 'needs-work' && '⚠️'}
                          {auditResults.overallHealth === 'poor' && '🚨'}
                        </div>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-2">Quality Score</div>
                        <div className={`text-3xl font-bold ${getScoreColor(auditResults.qualityScore.overallScore)}`}>
                          {auditResults.qualityScore.overallScore}/100
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-2">SEO Score</div>
                        <div className={`text-3xl font-bold ${getScoreColor(auditResults.seoAnalysis.overallScore)}`}>
                          {auditResults.seoAnalysis.overallScore}/100
                        </div>
                      </div>
                    </div>

                    {/* Quality Dimensions */}
                    <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-4">📊 Quality Breakdown</h3>
                      <div className="space-y-3">
                        {Object.entries(auditResults.qualityScore.dimensions).map(([key, dim]: [string, any]) => (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className={`text-sm font-semibold ${getScoreColor(dim.score)}`}>
                                {dim.score}/100
                              </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  dim.score >= 85 ? 'bg-green-500' :
                                  dim.score >= 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${dim.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content Gaps */}
                    {auditResults.contentGaps.length > 0 && (
                      <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">🔍 Content Gaps ({auditResults.contentGaps.length})</h3>
                        <ul className="space-y-2">
                          {auditResults.contentGaps.slice(0, 10).map((gap: string, idx: number) => (
                            <li key={idx} className="text-gray-300 flex items-start">
                              <span className="text-yellow-400 mr-2">▸</span>
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Priority Actions */}
                    {auditResults.priorityActions.length > 0 && (
                      <div className="bg-red-900/30 rounded-lg p-5 border border-red-700">
                        <h3 className="text-lg font-bold text-white mb-4">🚨 Priority Actions</h3>
                        <ul className="space-y-2">
                          {auditResults.priorityActions.map((action: string, idx: number) => (
                            <li key={idx} className="text-gray-200 flex items-start">
                              <span className="text-red-400 mr-2">→</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <BlogsFooter />
    </div>
  );
};

export default SEODashboard;
