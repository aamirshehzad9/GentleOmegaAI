import React, { useState, useEffect } from 'react';
import { aiMetricsService } from '../../services/aiMetrics.service';
import { alertSystemService } from '../../services/alertSystem.service';
import type {
    MetricsSummary,
    TimeRange,
    TimelineDataPoint,
    CostBreakdown,
    AccuracyMetrics,
    Alert,
} from '../../types/aiMetrics.types';

const AIMetricsDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('24h');
    const [summary, setSummary] = useState<MetricsSummary | null>(null);
    const [timeline, setTimeline] = useState<TimelineDataPoint[]>([]);
    const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
    const [accuracyMetrics, setAccuracyMetrics] = useState<AccuracyMetrics | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        loadData();
    }, [timeRange]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [summaryData, timelineData, costData, accuracyData, alertsData] = await Promise.all([
                aiMetricsService.getMetricsSummary(timeRange),
                aiMetricsService.getRequestTimeline(timeRange),
                aiMetricsService.getCostBreakdown(),
                aiMetricsService.getAccuracyMetrics(),
                alertSystemService.getUnacknowledgedAlerts(),
            ]);

            setSummary(summaryData);
            setTimeline(timelineData);
            setCostBreakdown(costData);
            setAccuracyMetrics(accuracyData);
            setAlerts(alertsData);
        } catch (error) {
            console.error('Error loading metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(Math.round(num));
    };

    const formatTime = (ms: number) => {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">📊 AI Performance Monitoring</h1>
                    <p className="text-gray-400">Real-time metrics and analytics for AI services</p>
                </div>

                {/* Time Range Selector */}
                <div className="flex gap-2 mb-6">
                    {(['24h', '7d', '30d'] as TimeRange[]).map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-2 rounded-lg font-medium transition ${timeRange === range
                                ? 'bg-cyan-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                        </button>
                    ))}
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
                        <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Active Alerts ({alerts.length})</h3>
                        <div className="space-y-2">
                            {alerts.slice(0, 3).map(alert => (
                                <div key={alert.id} className="text-yellow-200 text-sm">
                                    • {alert.message}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                    </div>
                ) : summary ? (
                    <>
                        {/* Overview Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                                <div className="text-3xl font-bold text-blue-400">{formatNumber(summary.totalRequests)}</div>
                                <div className="text-sm text-blue-300 mt-1">Total Requests</div>
                            </div>
                            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                                <div className="text-3xl font-bold text-green-400">{summary.successRate.toFixed(1)}%</div>
                                <div className="text-sm text-green-300 mt-1">Success Rate</div>
                            </div>
                            <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                                <div className="text-3xl font-bold text-purple-400">{formatTime(summary.avgResponseTime)}</div>
                                <div className="text-sm text-purple-300 mt-1">Avg Response Time</div>
                            </div>
                            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
                                <div className="text-3xl font-bold text-cyan-400">{(summary.avgConfidence * 100).toFixed(0)}%</div>
                                <div className="text-sm text-cyan-300 mt-1">Avg Confidence</div>
                            </div>
                        </div>

                        {/* Service Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Groq Stats */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-4">🚀 Groq (Llama 3.3 70B)</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Requests:</span>
                                        <span className="text-white font-medium">{formatNumber(summary.groq.totalRequests)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Success Rate:</span>
                                        <span className="text-green-400 font-medium">{summary.groq.successRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Avg Response:</span>
                                        <span className="text-white font-medium">{formatTime(summary.groq.avgResponseTime)}</span>
                                    </div>
                                    {summary.groq.avgConfidence && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Avg Confidence:</span>
                                            <span className="text-cyan-400 font-medium">{(summary.groq.avgConfidence * 100).toFixed(0)}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* HuggingFace Stats */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-4">🤗 HuggingFace</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Requests:</span>
                                        <span className="text-white font-medium">{formatNumber(summary.huggingface.totalRequests)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Success Rate:</span>
                                        <span className="text-green-400 font-medium">{summary.huggingface.successRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Avg Response:</span>
                                        <span className="text-white font-medium">{formatTime(summary.huggingface.avgResponseTime)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cost & Accuracy */}
                        {costBreakdown && accuracyMetrics && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Cost Breakdown */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-xl font-semibold text-white mb-4">💰 Cost Tracking</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Groq Usage:</span>
                                                <span className="text-white">{costBreakdown.groq.usagePercentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-cyan-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(costBreakdown.groq.usagePercentage, 100)}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatNumber(costBreakdown.groq.requests)} / {formatNumber(costBreakdown.groq.freeLimit)} free tier
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">HuggingFace Usage:</span>
                                                <span className="text-white">{costBreakdown.huggingface.usagePercentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(costBreakdown.huggingface.usagePercentage, 100)}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatNumber(costBreakdown.huggingface.requests)} / {formatNumber(costBreakdown.huggingface.freeLimit)} estimated limit
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-700">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total Cost:</span>
                                                <span className="text-2xl font-bold text-green-400">${costBreakdown.total.toFixed(2)}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 text-right">
                                                (Free tier - $0/month 🎉)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Accuracy Metrics */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-xl font-semibold text-white mb-4">🎯 Accuracy Metrics</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Avg Confidence:</span>
                                                <span className="text-white font-bold">{(accuracyMetrics.avgConfidence * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all"
                                                    style={{ width: `${accuracyMetrics.avgConfidence * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-green-900/30 rounded p-2">
                                                <div className="text-lg font-bold text-green-400">{accuracyMetrics.confidenceDistribution.high}</div>
                                                <div className="text-xs text-green-300">High (&gt;80%)</div>
                                            </div>
                                            <div className="bg-yellow-900/30 rounded p-2">
                                                <div className="text-lg font-bold text-yellow-400">{accuracyMetrics.confidenceDistribution.medium}</div>
                                                <div className="text-xs text-yellow-300">Med (60-80%)</div>
                                            </div>
                                            <div className="bg-red-900/30 rounded p-2">
                                                <div className="text-lg font-bold text-red-400">{accuracyMetrics.confidenceDistribution.low}</div>
                                                <div className="text-xs text-red-300">Low (&lt;60%)</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-2 border-t border-gray-700">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Approval Rate:</span>
                                                <span className="text-green-400">{accuracyMetrics.approvalRate.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Processing Success:</span>
                                                <span className="text-blue-400">{accuracyMetrics.processingSuccessRate.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline Chart */}
                        {timeline.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-4">📈 Request Timeline</h3>
                                <div className="h-64 flex items-end justify-between gap-1">
                                    {timeline.map((point, idx) => {
                                        const maxRequests = Math.max(...timeline.map(p => p.requests));
                                        const height = (point.requests / maxRequests) * 100;

                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center group relative">
                                                <div
                                                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all hover:from-cyan-500 hover:to-cyan-300"
                                                    style={{ height: `${height}%` }}
                                                />
                                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                                    {point.requests} requests<br />
                                                    {point.successRate.toFixed(0)}% success
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-xs text-gray-500 mt-2 text-center">
                                    Hover over bars for details
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
                        <p className="text-gray-400">Start using AI services to see metrics here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIMetricsDashboard;
