import React from 'react';
import type { AISuggestion } from '../../types/aiSuggestion.types';

interface SuggestionDetailsProps {
    suggestion: AISuggestion;
    isOpen: boolean;
    onClose: () => void;
    onApprove?: (id: string, notes?: string) => void;
    onReject?: (id: string, notes?: string) => void;
    onStartProcessing?: (id: string) => void;
}

const SuggestionDetails: React.FC<SuggestionDetailsProps> = ({
    suggestion,
    isOpen,
    onClose,
    onApprove,
    onReject,
    onStartProcessing
}) => {
    const [notes, setNotes] = React.useState('');
    const { input, output, status, aiModel, processingTime, createdAt, reviewedBy, reviewedAt, reviewNotes } = suggestion;

    if (!isOpen) return null;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{input.industry}</h2>
                        <p className="text-sm text-gray-400">{input.targetAudience}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 transition"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Input Details */}
                    <section>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Input Parameters</h3>
                        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Industry:</span>
                                <span className="text-white font-medium">{input.industry}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Target Audience:</span>
                                <span className="text-white font-medium">{input.targetAudience}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Language:</span>
                                <span className="text-white font-medium">{input.language}</span>
                            </div>
                            {input.location && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Location:</span>
                                    <span className="text-white font-medium">{input.location}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* AI Output */}
                    <section>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-3">AI Analysis Results</h3>

                        {/* Confidence */}
                        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">Confidence Score</span>
                                <span className="text-2xl font-bold text-white">{(output.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-4">
                                <div
                                    className={`h-full rounded-full transition-all ${output.confidence >= 0.8 ? 'bg-green-500' :
                                            output.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${output.confidence * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Suggested Niches */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-white mb-2">Suggested Niches ({output.suggestedNiches.length})</h4>
                            <div className="flex flex-wrap gap-2">
                                {output.suggestedNiches.map((niche, idx) => (
                                    <span key={idx} className="px-3 py-2 bg-cyan-900/30 text-cyan-200 rounded-lg text-sm border border-cyan-700">
                                        {niche}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-white mb-2">Keywords ({output.keywords.length})</h4>
                            <div className="flex flex-wrap gap-2">
                                {output.keywords.map((keyword, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-900/30 text-blue-200 rounded text-sm">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Target Domains */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-white mb-2">Target Domains ({output.targetDomains.length})</h4>
                            <ul className="space-y-2">
                                {output.targetDomains.map((domain, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-300">
                                        <span className="text-purple-400">•</span>
                                        <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
                                            {domain}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Reasoning */}
                        <div className="bg-gray-900/50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-white mb-2">AI Reasoning</h4>
                            <p className="text-gray-300 leading-relaxed">{output.reasoning}</p>
                        </div>
                    </section>

                    {/* Metadata */}
                    <section>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Metadata</h3>
                        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">AI Model:</span>
                                <span className="text-white font-mono text-sm">{aiModel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Processing Time:</span>
                                <span className="text-white">{(processingTime / 1000).toFixed(2)}s</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Created:</span>
                                <span className="text-white">{formatDate(createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${status === 'approved' ? 'bg-green-600 text-green-100' :
                                        status === 'rejected' ? 'bg-red-600 text-red-100' :
                                            status === 'processing' ? 'bg-blue-600 text-blue-100' :
                                                status === 'completed' ? 'bg-purple-600 text-purple-100' :
                                                    'bg-yellow-600 text-yellow-100'
                                    }`}>
                                    {status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Review History */}
                    {reviewedBy && (
                        <section>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Review History</h3>
                            <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reviewed By:</span>
                                    <span className="text-white">{reviewedBy}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reviewed At:</span>
                                    <span className="text-white">{formatDate(reviewedAt)}</span>
                                </div>
                                {reviewNotes && (
                                    <div>
                                        <span className="text-gray-400 block mb-1">Notes:</span>
                                        <p className="text-white bg-gray-800 p-3 rounded">{reviewNotes}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Processing Results */}
                    {suggestion.discoveredURLs && suggestion.discoveredURLs.length > 0 && (
                        <section>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Processing Results</h3>
                            <div className="bg-gray-900/50 rounded-lg p-4">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-cyan-400">{suggestion.discoveredURLs.length}</div>
                                        <div className="text-xs text-gray-400">URLs Discovered</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-400">{suggestion.successCount || 0}</div>
                                        <div className="text-xs text-gray-400">Successful</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-400">{suggestion.failureCount || 0}</div>
                                        <div className="text-xs text-gray-400">Failed</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Admin Actions */}
                    {status === 'pending' && (onApprove || onReject) && (
                        <section>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Admin Actions</h3>
                            <div className="space-y-3">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add review notes (optional)..."
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                                    rows={3}
                                />
                                <div className="flex gap-3">
                                    {onApprove && (
                                        <button
                                            onClick={() => {
                                                onApprove(suggestion.id, notes);
                                                setNotes('');
                                            }}
                                            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                                        >
                                            ✓ Approve Suggestion
                                        </button>
                                    )}
                                    {onReject && (
                                        <button
                                            onClick={() => {
                                                onReject(suggestion.id, notes);
                                                setNotes('');
                                            }}
                                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                                        >
                                            ✗ Reject Suggestion
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Start Processing */}
                    {status === 'approved' && onStartProcessing && !suggestion.discoveredURLs && (
                        <section>
                            <button
                                onClick={() => onStartProcessing(suggestion.id)}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                            >
                                🚀 Start Auto-Processing
                            </button>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuggestionDetails;
