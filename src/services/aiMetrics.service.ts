import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import type {
    AIMetric,
    AIService,
    AIOperation,
    TimeRange,
    MetricsSummary,
    ServiceMetrics,
    TimelineDataPoint,
    CostBreakdown,
    AccuracyMetrics,
} from '../types/aiMetrics.types';

const METRICS_COLLECTION = 'aiMetrics';

export class AIMetricsService {
    /**
     * Record an API call
     */
    async recordAPICall(
        service: AIService,
        operation: AIOperation,
        success: boolean,
        responseTime: number,
        options?: {
            confidence?: number;
            tokensUsed?: number;
            error?: string;
            suggestionId?: string;
            userId?: string;
        }
    ): Promise<void> {
        try {
            const metric: Omit<AIMetric, 'id'> = {
                timestamp: Timestamp.now(),
                service,
                operation,
                success,
                responseTime,
                estimatedCost: this.calculateCost(service, options?.tokensUsed || 0),
                ...options,
            };

            await addDoc(collection(db, METRICS_COLLECTION), metric);
        } catch (error) {
            console.error('Error recording metric:', error);
            // Don't throw - metrics shouldn't break the app
        }
    }

    /**
     * Calculate estimated cost
     */
    private calculateCost(service: AIService, tokensUsed: number): number {
        // Currently both services are free
        // But we track for future cost projections
        if (service === 'groq') {
            // Groq: Free tier (30 req/min)
            return 0;
        } else {
            // HuggingFace: Free tier
            return 0;
        }
    }

    /**
     * Get metrics summary for a time range
     */
    async getMetricsSummary(timeRange: TimeRange = '24h'): Promise<MetricsSummary> {
        try {
            const { startDate, endDate } = this.getDateRange(timeRange);

            const q = query(
                collection(db, METRICS_COLLECTION),
                where('timestamp', '>=', Timestamp.fromDate(startDate)),
                where('timestamp', '<=', Timestamp.fromDate(endDate)),
                orderBy('timestamp', 'desc')
            );

            const snapshot = await getDocs(q);
            const metrics = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as AIMetric));

            return this.calculateSummary(metrics, timeRange, startDate, endDate);
        } catch (error) {
            console.error('Error getting metrics summary:', error);
            return this.getEmptySummary(timeRange);
        }
    }

    /**
     * Calculate summary from metrics
     */
    private calculateSummary(
        metrics: AIMetric[],
        timeRange: TimeRange,
        startDate: Date,
        endDate: Date
    ): MetricsSummary {
        const totalRequests = metrics.length;
        const successfulRequests = metrics.filter(m => m.success).length;
        const failedRequests = totalRequests - successfulRequests;
        const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

        const avgResponseTime = totalRequests > 0
            ? metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests
            : 0;

        const totalCost = metrics.reduce((sum, m) => sum + m.estimatedCost, 0);

        const confidenceMetrics = metrics.filter(m => m.confidence !== undefined);
        const avgConfidence = confidenceMetrics.length > 0
            ? confidenceMetrics.reduce((sum, m) => sum + (m.confidence || 0), 0) / confidenceMetrics.length
            : 0;

        const highConfidenceCount = confidenceMetrics.filter(m => (m.confidence || 0) > 0.8).length;
        const mediumConfidenceCount = confidenceMetrics.filter(m => {
            const conf = m.confidence || 0;
            return conf >= 0.6 && conf <= 0.8;
        }).length;
        const lowConfidenceCount = confidenceMetrics.filter(m => (m.confidence || 0) < 0.6).length;

        // Service breakdown
        const groqMetrics = metrics.filter(m => m.service === 'groq');
        const hfMetrics = metrics.filter(m => m.service === 'huggingface');

        return {
            timeRange,
            startDate,
            endDate,
            totalRequests,
            successfulRequests,
            failedRequests,
            successRate,
            avgResponseTime,
            totalCost,
            avgConfidence,
            highConfidenceCount,
            mediumConfidenceCount,
            lowConfidenceCount,
            groq: this.calculateServiceMetrics('groq', groqMetrics),
            huggingface: this.calculateServiceMetrics('huggingface', hfMetrics),
        };
    }

    /**
     * Calculate service-specific metrics
     */
    private calculateServiceMetrics(service: AIService, metrics: AIMetric[]): ServiceMetrics {
        const totalRequests = metrics.length;
        const successfulRequests = metrics.filter(m => m.success).length;
        const failedRequests = totalRequests - successfulRequests;
        const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

        const avgResponseTime = totalRequests > 0
            ? metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests
            : 0;

        const totalCost = metrics.reduce((sum, m) => sum + m.estimatedCost, 0);

        const confidenceMetrics = metrics.filter(m => m.confidence !== undefined);
        const avgConfidence = confidenceMetrics.length > 0
            ? confidenceMetrics.reduce((sum, m) => sum + (m.confidence || 0), 0) / confidenceMetrics.length
            : undefined;

        return {
            service,
            totalRequests,
            successfulRequests,
            failedRequests,
            successRate,
            avgResponseTime,
            totalCost,
            avgConfidence,
        };
    }

    /**
     * Get timeline data
     */
    async getRequestTimeline(timeRange: TimeRange = '24h'): Promise<TimelineDataPoint[]> {
        try {
            const { startDate, endDate } = this.getDateRange(timeRange);

            const q = query(
                collection(db, METRICS_COLLECTION),
                where('timestamp', '>=', Timestamp.fromDate(startDate)),
                where('timestamp', '<=', Timestamp.fromDate(endDate)),
                orderBy('timestamp', 'asc')
            );

            const snapshot = await getDocs(q);
            const metrics = snapshot.docs.map(doc => doc.data() as AIMetric);

            return this.groupMetricsByTime(metrics, timeRange);
        } catch (error) {
            console.error('Error getting timeline:', error);
            return [];
        }
    }

    /**
     * Group metrics by time intervals
     */
    private groupMetricsByTime(metrics: AIMetric[], timeRange: TimeRange): TimelineDataPoint[] {
        const intervalMs = this.getIntervalMs(timeRange);
        const groups = new Map<number, AIMetric[]>();

        metrics.forEach(metric => {
            const timestamp = metric.timestamp.toDate().getTime();
            const intervalKey = Math.floor(timestamp / intervalMs) * intervalMs;

            if (!groups.has(intervalKey)) {
                groups.set(intervalKey, []);
            }
            groups.get(intervalKey)!.push(metric);
        });

        return Array.from(groups.entries())
            .sort(([a], [b]) => a - b)
            .map(([timestamp, groupMetrics]) => {
                const successful = groupMetrics.filter(m => m.success).length;
                const total = groupMetrics.length;
                const avgResponseTime = groupMetrics.reduce((sum, m) => sum + m.responseTime, 0) / total;

                const confidenceMetrics = groupMetrics.filter(m => m.confidence !== undefined);
                const avgConfidence = confidenceMetrics.length > 0
                    ? confidenceMetrics.reduce((sum, m) => sum + (m.confidence || 0), 0) / confidenceMetrics.length
                    : undefined;

                return {
                    timestamp: new Date(timestamp),
                    requests: total,
                    successRate: (successful / total) * 100,
                    avgResponseTime,
                    avgConfidence,
                };
            });
    }

    /**
     * Get cost breakdown
     */
    async getCostBreakdown(): Promise<CostBreakdown> {
        try {
            const summary = await this.getMetricsSummary('30d');

            // Groq: 30 requests/minute = 43,200 requests/day = 1,296,000 requests/month
            const groqFreeLimit = 1296000;
            const groqUsage = (summary.groq.totalRequests / groqFreeLimit) * 100;

            // HuggingFace: Varies by model, assume 1000 requests/day = 30,000/month
            const hfFreeLimit = 30000;
            const hfUsage = (summary.huggingface.totalRequests / hfFreeLimit) * 100;

            return {
                groq: {
                    requests: summary.groq.totalRequests,
                    cost: summary.groq.totalCost,
                    freeLimit: groqFreeLimit,
                    usagePercentage: Math.min(groqUsage, 100),
                },
                huggingface: {
                    requests: summary.huggingface.totalRequests,
                    cost: summary.huggingface.totalCost,
                    freeLimit: hfFreeLimit,
                    usagePercentage: Math.min(hfUsage, 100),
                },
                total: summary.totalCost,
                projectedMonthly: summary.totalCost * (30 / this.getDaysInRange('30d')),
            };
        } catch (error) {
            console.error('Error getting cost breakdown:', error);
            return {
                groq: { requests: 0, cost: 0, freeLimit: 1296000, usagePercentage: 0 },
                huggingface: { requests: 0, cost: 0, freeLimit: 30000, usagePercentage: 0 },
                total: 0,
                projectedMonthly: 0,
            };
        }
    }

    /**
     * Get accuracy metrics
     */
    async getAccuracyMetrics(): Promise<AccuracyMetrics> {
        try {
            const summary = await getMetricsSummary('30d');

            // Get approval/rejection data from aiSuggestions collection
            const suggestionsSnapshot = await getDocs(collection(db, 'aiSuggestions'));
            const suggestions = suggestionsSnapshot.docs.map(doc => doc.data());

            const total = suggestions.length;
            const approved = suggestions.filter(s => s.status === 'approved').length;
            const rejected = suggestions.filter(s => s.status === 'rejected').length;
            const processingSuccess = suggestions.filter(s => s.status === 'completed').length;
            const processingTotal = suggestions.filter(s =>
                s.status === 'completed' || s.status === 'failed'
            ).length;

            return {
                avgConfidence: summary.avgConfidence,
                confidenceDistribution: {
                    high: summary.highConfidenceCount,
                    medium: summary.mediumConfidenceCount,
                    low: summary.lowConfidenceCount,
                },
                approvalRate: total > 0 ? (approved / total) * 100 : 0,
                rejectionRate: total > 0 ? (rejected / total) * 100 : 0,
                processingSuccessRate: processingTotal > 0 ? (processingSuccess / processingTotal) * 100 : 0,
            };
        } catch (error) {
            console.error('Error getting accuracy metrics:', error);
            return {
                avgConfidence: 0,
                confidenceDistribution: { high: 0, medium: 0, low: 0 },
                approvalRate: 0,
                rejectionRate: 0,
                processingSuccessRate: 0,
            };
        }
    }

    /**
     * Get date range for time range
     */
    private getDateRange(timeRange: TimeRange): { startDate: Date; endDate: Date } {
        const endDate = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case '24h':
                startDate.setHours(startDate.getHours() - 24);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'all':
                startDate.setFullYear(2020); // Far back enough
                break;
        }

        return { startDate, endDate };
    }

    /**
     * Get interval in milliseconds
     */
    private getIntervalMs(timeRange: TimeRange): number {
        switch (timeRange) {
            case '24h':
                return 60 * 60 * 1000; // 1 hour
            case '7d':
                return 24 * 60 * 60 * 1000; // 1 day
            case '30d':
                return 24 * 60 * 60 * 1000; // 1 day
            default:
                return 24 * 60 * 60 * 1000; // 1 day
        }
    }

    /**
     * Get days in range
     */
    private getDaysInRange(timeRange: TimeRange): number {
        switch (timeRange) {
            case '24h': return 1;
            case '7d': return 7;
            case '30d': return 30;
            default: return 30;
        }
    }

    /**
     * Get empty summary
     */
    private getEmptySummary(timeRange: TimeRange): MetricsSummary {
        const { startDate, endDate } = this.getDateRange(timeRange);

        return {
            timeRange,
            startDate,
            endDate,
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            successRate: 0,
            avgResponseTime: 0,
            totalCost: 0,
            avgConfidence: 0,
            highConfidenceCount: 0,
            mediumConfidenceCount: 0,
            lowConfidenceCount: 0,
            groq: {
                service: 'groq',
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                successRate: 0,
                avgResponseTime: 0,
                totalCost: 0,
            },
            huggingface: {
                service: 'huggingface',
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                successRate: 0,
                avgResponseTime: 0,
                totalCost: 0,
            },
        };
    }
}

// Export singleton instance
export const aiMetricsService = new AIMetricsService();

// Helper function to get metrics summary
export const getMetricsSummary = async (timeRange: TimeRange = '24h') => {
    return aiMetricsService.getMetricsSummary(timeRange);
};
