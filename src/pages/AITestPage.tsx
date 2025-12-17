import React, { useState } from 'react';
import { geminiService } from '../services/ai/gemini.service';
import { huggingFaceService } from '../services/ai/huggingface.service';
import { urlDiscoveryService } from '../services/urlDiscovery.service';
import type { NicheDiscoveryInput, NicheDiscoveryOutput } from '../services/ai/gemini.service';

const AITestPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [geminiConnected, setGeminiConnected] = useState<boolean | null>(null);
    const [hfConnected, setHfConnected] = useState<boolean | null>(null);
    const [nicheResult, setNicheResult] = useState<NicheDiscoveryOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Test form state
    const [industry, setIndustry] = useState('SaaS Marketing');
    const [targetAudience, setTargetAudience] = useState('B2B Tech Companies');
    const [language, setLanguage] = useState('English');

    const testConnections = async () => {
        setLoading(true);
        setError(null);

        try {
            // Test Gemini
            const geminiOk = await geminiService.testConnection();
            setGeminiConnected(geminiOk);

            // Test HuggingFace
            const hfOk = await huggingFaceService.testConnection();
            setHfConnected(hfOk);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Connection test failed');
        } finally {
            setLoading(false);
        }
    };

    const discoverNiches = async () => {
        setLoading(true);
        setError(null);
        setNicheResult(null);

        try {
            const input: NicheDiscoveryInput = {
                industry,
                targetAudience,
                language,
                location: 'Global',
            };

            const result = await geminiService.discoverNiches(input);
            setNicheResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Niche discovery failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-cyan-400 mb-8">
                    🤖 AI Services Test Page
                </h1>

                {/* Connection Status */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">Connection Status</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Gemini API:</span>
                            <span className={`px-3 py-1 rounded ${geminiConnected === null ? 'bg-gray-700 text-gray-400' :
                                geminiConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}>
                                {geminiConnected === null ? 'Not Tested' : geminiConnected ? '✅ Connected' : '❌ Failed'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">HuggingFace API:</span>
                            <span className={`px-3 py-1 rounded ${hfConnected === null ? 'bg-gray-700 text-gray-400' :
                                hfConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}>
                                {hfConnected === null ? 'Not Tested' : hfConnected ? '✅ Connected' : '❌ Failed'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={testConnections}
                        disabled={loading}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        {loading ? 'Testing...' : 'Test Connections'}
                    </button>
                </div>

                {/* Niche Discovery Test */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">Niche Discovery Test</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Industry</label>
                            <input
                                type="text"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-cyan-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Target Audience</label>
                            <input
                                type="text"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-cyan-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Language</label>
                            <input
                                type="text"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-cyan-500 outline-none"
                            />
                        </div>

                        <button
                            onClick={discoverNiches}
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
                        >
                            {loading ? 'Discovering...' : 'Discover Niches with AI'}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-200">❌ {error}</p>
                    </div>
                )}

                {/* Results Display */}
                {nicheResult && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">AI Discovery Results</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-cyan-400 mb-2">Suggested Niches</h3>
                                <div className="flex flex-wrap gap-2">
                                    {nicheResult.suggestedNiches.map((niche, i) => (
                                        <span key={i} className="bg-cyan-900/50 text-cyan-200 px-3 py-1 rounded-full text-sm">
                                            {niche}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-cyan-400 mb-2">Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {nicheResult.keywords.map((keyword, i) => (
                                        <span key={i} className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-cyan-400 mb-2">Target Domains</h3>
                                <ul className="space-y-1">
                                    {nicheResult.targetDomains.map((domain, i) => (
                                        <li key={i} className="text-gray-300">• {domain}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-cyan-400 mb-2">Confidence</h3>
                                <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full transition-all"
                                        style={{ width: `${nicheResult.confidence * 100}%` }}
                                    />
                                </div>
                                <p className="text-gray-400 text-sm mt-1">
                                    {(nicheResult.confidence * 100).toFixed(0)}% confident
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-cyan-400 mb-2">Reasoning</h3>
                                <p className="text-gray-300">{nicheResult.reasoning}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITestPage;
