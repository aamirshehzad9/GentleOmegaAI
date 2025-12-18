import React from 'react';
import type { AISuggestion } from '../../types/aiSuggestion.types';

interface SuggestionCardProps {
    suggestion: AISuggestion;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onViewDetails: (id: string) => void;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    isProcessing?: boolean;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
    suggestion,
    onApprove,
    onReject,
    onViewDetails,
    isSelected = false,
    onSelect,
    isProcessing = false
}) => {
    const { id, input, output, status, createdAt, aiModel } = suggestion;
    const confidence = output.confidence * 100;

    // Confidence color
    const getConfidenceColor = (conf: number) => {
        if (conf >= 80) return 'bg-green-500';
        if (conf >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Status badge
    const getStatusBadge = () => {
        const badges = {
            pending: 'bg-yellow-600 text-yellow-100',
            approved: 'bg-green-600 text-green-100',
            rejected: 'bg-red-600 text-red-100',
            processing: 'bg-blue-600 text-blue-100 animate-pulse',
            completed: 'bg-purple-600 text-purple-100',
            failed: 'bg-red-700 text-red-100'
        };
        return badges[status] || 'bg-gray-600 text-gray-100';
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`bg-gray-800 rounded-lg p-6 border-2 transition-all ${isSelected ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-gray-700 hover:border-gray-600'
            }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                    {/* Checkbox for bulk selection */}
                    {onSelect && status === 'pending' && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect(id)}
                            className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-gray-800 cursor-pointer"
                        />
                    )}

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">{input.industry}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge()}`}>
                                {status.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-1">
                            <span className="font-medium">Target:</span> {input.targetAudience}
                        </p>

                        <p className="text-xs text-gray-500">
                            {formatDate(createdAt)} • {aiModel}
                        </p>
                    </div>
                </div>
            </div>

            {/* Confidence Score */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Confidence Score</span>
                    <span className="text-sm font-bold text-white">{confidence.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full transition-all ${getConfidenceColor(confidence)}`}
                        style={{ width: `${confidence}%` }}
                    />
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-900/50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">{output.suggestedNiches.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Niches</div>
                </div>
                <div className="bg-gray-900/50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{output.keywords.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Keywords</div>
                </div>
                <div className="bg-gray-900/50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{output.targetDomains.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Domains</div>
                </div>
            </div>

            {/* Preview */}
            <div className="mb-4 p-3 bg-gray-900/30 rounded border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Top Niches:</p>
                <div className="flex flex-wrap gap-2">
                    {output.suggestedNiches.slice(0, 3).map((niche, idx) => (
                        <span key={idx} className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-xs">
                            {niche}
                        </span>
                    ))}
                    {output.suggestedNiches.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                            +{output.suggestedNiches.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Processing Progress */}
            {status === 'processing' && suggestion.processingProgress !== undefined && (
                <div className="mb-4 p-3 bg-blue-900/20 rounded border border-blue-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-300">Processing...</span>
                        <span className="text-sm font-bold text-blue-200">{suggestion.processingProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-900/30 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all animate-pulse"
                            style={{ width: `${suggestion.processingProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => onViewDetails(id)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition"
                >
                    View Details
                </button>

                {status === 'pending' && !isProcessing && (
                    <>
                        <button
                            onClick={() => onApprove(id)}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
                        >
                            ✓ Approve
                        </button>
                        <button
                            onClick={() => onReject(id)}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
                        >
                            ✗ Reject
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SuggestionCard;
