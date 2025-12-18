import { Timestamp } from 'firebase/firestore';

/**
 * AI Service Types
 */
export type AIService = 'groq' | 'huggingface';

/**
 * AI Operation Types
 */
export type AIOperation =
    | 'niche_discovery'
    | 'content_analysis'
    | 'sentiment_analysis'
    | 'classification'
    | 'search_query_generation';

/**
 * Time Range for Metrics
 */
export type TimeRange = '24h' | '7d' | '30d' | 'all';

/**
 * Alert Types
 */
export type AlertType =
    | 'high_error_rate'
    | 'slow_response'
    | 'low_confidence'
    | 'rate_limit_warning'
    | 'processing_failure';

/**
 * Alert Severity
 */
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Individual AI Metric Record
 */
export interface AIMetric {
    id: string;
    timestamp: Timestamp;
    service: AIService;
    operation: AIOperation;

    // Request data
    success: boolean;
    responseTime: number; // milliseconds
    error?: string;

    // Cost data
    tokensUsed?: number;
    estimatedCost: number;

    // Quality data
    confidence?: number;

    // Metadata
    suggestionId?: string;
    userId?: string;
}

/**
 * Service-specific metrics
 */
export interface ServiceMetrics {
    service: AIService;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRate: number;
    avgResponseTime: number;
    totalCost: number;
    avgConfidence?: number;
}

/**
 * Metrics Summary
 */
export interface MetricsSummary {
    timeRange: TimeRange;
    startDate: Date;
    endDate: Date;

    // Overall metrics
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRate: number;
    avgResponseTime: number;
    totalCost: number;

    // Service breakdown
    groq: ServiceMetrics;
    huggingface: ServiceMetrics;

    // Accuracy metrics
    avgConfidence: number;
    highConfidenceCount: number; // >80%
    mediumConfidenceCount: number; // 60-80%
    lowConfidenceCount: number; // <60%
}

/**
 * Timeline Data Point
 */
export interface TimelineDataPoint {
    timestamp: Date;
    requests: number;
    successRate: number;
    avgResponseTime: number;
    avgConfidence?: number;
}

/**
 * Cost Breakdown
 */
export interface CostBreakdown {
    groq: {
        requests: number;
        cost: number;
        freeLimit: number;
        usagePercentage: number;
    };
    huggingface: {
        requests: number;
        cost: number;
        freeLimit: number;
        usagePercentage: number;
    };
    total: number;
    projectedMonthly: number;
}

/**
 * Accuracy Metrics
 */
export interface AccuracyMetrics {
    avgConfidence: number;
    confidenceDistribution: {
        high: number; // >80%
        medium: number; // 60-80%
        low: number; // <60%
    };
    approvalRate: number;
    rejectionRate: number;
    processingSuccessRate: number;
}

/**
 * Alert
 */
export interface Alert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    message: string;
    timestamp: Timestamp;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Timestamp;
    metadata?: Record<string, any>;
}

/**
 * Performance Report
 */
export interface PerformanceReport {
    id: string;
    generatedAt: Timestamp;
    period: 'daily' | 'weekly' | 'monthly';
    startDate: Timestamp;
    endDate: Timestamp;

    summary: MetricsSummary;
    alerts: Alert[];
    recommendations: string[];

    // Top performers
    topNiches?: string[];
    topKeywords?: string[];
}

/**
 * Chart Data
 */
export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
    }[];
}
