import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { approvalQueueService } from '../../services/approvalQueue.service';
import { processingPipelineService } from '../../services/processingPipeline.service';
import SuggestionCard from './SuggestionCard';
import SuggestionDetails from './SuggestionDetails';
import type { AISuggestion, QueueStats, SuggestionStatus } from '../../types/aiSuggestion.types';

const AIReviewDashboard: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [selectedTab, setSelectedTab] = useState<SuggestionStatus>('pending');
    const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    // Load data
    useEffect(() => {
        loadData();
    }, [selectedTab]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load stats
            const queueStats = await approvalQueueService.getQueueStats();
            setStats(queueStats);

            // Load suggestions based on tab
            let data: AISuggestion[] = [];
            switch (selectedTab) {
                case 'pending':
                    data = await approvalQueueService.getPendingSuggestions();
                    break;
                case 'approved':
                    data = await approvalQueueService.getApprovedSuggestions();
                    break;
                case 'rejected':
                    data = await approvalQueueService.getRejectedSuggestions();
                    break;
                case 'processing':
                    data = await approvalQueueService.getProcessingSuggestions();
                    break;
                default:
                    data = await approvalQueueService.getPendingSuggestions();
            }

            setSuggestions(data);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Handle approve
    const handleApprove = async (id: string, notes?: string) => {
        if (!user) return;

        try {
            await approvalQueueService.approveSuggestion(id, user.uid, notes);
            await loadData();
            setDetailsModalOpen(false);
        } catch (err) {
            console.error('Error approving:', err);
            setError(err instanceof Error ? err.message : 'Failed to approve');
        }
    };

    // Handle reject
    const handleReject = async (id: string, notes?: string) => {
        if (!user) return;

        try {
            await approvalQueueService.rejectSuggestion(id, user.uid, notes);
            await loadData();
            setDetailsModalOpen(false);
        } catch (err) {
            console.error('Error rejecting:', err);
            setError(err instanceof Error ? err.message : 'Failed to reject');
        }
    };

    // Handle bulk approve
    const handleBulkApprove = async () => {
        if (!user || selectedSuggestions.size === 0) return;

        try {
            const ids = Array.from(selectedSuggestions);
            await approvalQueueService.bulkApprove(ids, user.uid);
            setSelectedSuggestions(new Set());
            await loadData();
        } catch (err) {
            console.error('Error bulk approving:', err);
            setError(err instanceof Error ? err.message : 'Failed to bulk approve');
        }
    };

    // Handle bulk reject
    const handleBulkReject = async () => {
        if (!user || selectedSuggestions.size === 0) return;

        try {
            const ids = Array.from(selectedSuggestions);
            await approvalQueueService.bulkReject(ids, user.uid);
            setSelectedSuggestions(new Set());
            await loadData();
        } catch (err) {
            console.error('Error bulk rejecting:', err);
            setError(err instanceof Error ? err.message : 'Failed to bulk reject');
        }
    };

    // Handle start processing
    const handleStartProcessing = async (id: string) => {
        try {
            setProcessingIds(prev => new Set(prev).add(id));
            await processingPipelineService.processSuggestion(id);
            await loadData();
            setDetailsModalOpen(false);
        } catch (err) {
            console.error('Error processing:', err);
            setError(err instanceof Error ? err.message : 'Failed to process');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    // Handle view details
    const handleViewDetails = (id: string) => {
        const suggestion = suggestions.find(s => s.id === id);
        if (suggestion) {
            setSelectedSuggestion(suggestion);
            setDetailsModalOpen(true);
        }
    };

    // Handle select suggestion
    const handleSelectSuggestion = (id: string) => {
        setSelectedSuggestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedSuggestions.size === suggestions.length) {
            setSelectedSuggestions(new Set());
        } else {
            setSelectedSuggestions(new Set(suggestions.map(s => s.id)));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">🤖 AI Review Dashboard</h1>
                    <p className="text-gray-400">Review and manage AI-generated niche suggestions</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                            <div className="text-sm text-yellow-300 mt-1">Pending</div>
                        </div>
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                            <div className="text-3xl font-bold text-green-400">{stats.approved}</div>
                            <div className="text-sm text-green-300 mt-1">Approved</div>
                        </div>
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                            <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
                            <div className="text-sm text-red-300 mt-1">Rejected</div>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                            <div className="text-3xl font-bold text-blue-400">{stats.processing}</div>
                            <div className="text-sm text-blue-300 mt-1">Processing</div>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                            <div className="text-3xl font-bold text-purple-400">{stats.completed}</div>
                            <div className="text-sm text-purple-300 mt-1">Completed</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="text-3xl font-bold text-white">{stats.total}</div>
                            <div className="text-sm text-gray-300 mt-1">Total</div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {(['pending', 'approved', 'rejected', 'processing'] as SuggestionStatus[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setSelectedTab(tab);
                                setSelectedSuggestions(new Set());
                            }}
                            className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${selectedTab === tab
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {stats && ` (${stats[tab]})`}
                        </button>
                    ))}
                </div>

                {/* Bulk Actions */}
                {selectedTab === 'pending' && suggestions.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSelectAll}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition"
                            >
                                {selectedSuggestions.size === suggestions.length ? 'Deselect All' : 'Select All'}
                            </button>
                            <span className="text-gray-400">
                                {selectedSuggestions.size} selected
                            </span>
                        </div>

                        {selectedSuggestions.size > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleBulkApprove}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
                                >
                                    ✓ Approve Selected ({selectedSuggestions.size})
                                </button>
                                <button
                                    onClick={handleBulkReject}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
                                >
                                    ✗ Reject Selected ({selectedSuggestions.size})
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-200">❌ {error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                    </div>
                )}

                {/* Suggestions Grid */}
                {!loading && suggestions.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {suggestions.map(suggestion => (
                            <SuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onViewDetails={handleViewDetails}
                                isSelected={selectedSuggestions.has(suggestion.id)}
                                onSelect={selectedTab === 'pending' ? handleSelectSuggestion : undefined}
                                isProcessing={processingIds.has(suggestion.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && suggestions.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No {selectedTab} suggestions</h3>
                        <p className="text-gray-400">
                            {selectedTab === 'pending'
                                ? 'All suggestions have been reviewed!'
                                : `No ${selectedTab} suggestions found.`}
                        </p>
                    </div>
                )}

                {/* Details Modal */}
                {selectedSuggestion && (
                    <SuggestionDetails
                        suggestion={selectedSuggestion}
                        isOpen={detailsModalOpen}
                        onClose={() => {
                            setDetailsModalOpen(false);
                            setSelectedSuggestion(null);
                        }}
                        onApprove={selectedTab === 'pending' ? handleApprove : undefined}
                        onReject={selectedTab === 'pending' ? handleReject : undefined}
                        onStartProcessing={selectedTab === 'approved' ? handleStartProcessing : undefined}
                    />
                )}
            </div>
        </div>
    );
};

export default AIReviewDashboard;
