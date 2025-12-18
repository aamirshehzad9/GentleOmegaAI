import { Timestamp } from 'firebase/firestore';

/**
 * AI Suggestion Status
 */
export type SuggestionStatus =
    | 'pending'      // Waiting for admin review
    | 'approved'     // Approved by admin
    | 'rejected'     // Rejected by admin
    | 'processing'   // Currently being processed
    | 'completed'    // Processing completed
    | 'failed';      // Processing failed

/**
 * Input data for AI niche discovery
 */
export interface NicheDiscoveryInput {
    industry: string;
    targetAudience: string;
    language: string;
    location?: string;
}

/**
 * AI-generated output
 */
export interface NicheDiscoveryOutput {
    suggestedNiches: string[];
    keywords: string[];
    targetDomains: string[];
    confidence: number;
    reasoning: string;
}

/**
 * URL Analysis Result
 */
export interface URLAnalysis {
    url: string;
    status: 'success' | 'failed';
    quality?: number;
    category?: string;
    guestPostLikelihood?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
    keyTopics?: string[];
    recommendedAction?: 'approve' | 'review' | 'reject';
    error?: string;
    analyzedAt: Date;
}

/**
 * Main AI Suggestion document
 */
export interface AISuggestion {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    status: SuggestionStatus;

    // Input data
    input: NicheDiscoveryInput;

    // AI Output
    output: NicheDiscoveryOutput;

    // Metadata
    aiModel: string;           // e.g., "groq-llama-3.3-70b"
    processingTime: number;    // milliseconds
    createdBy?: string;        // user ID who created this

    // Admin review
    reviewedBy?: string;       // admin user ID
    reviewedAt?: Timestamp;
    reviewNotes?: string;

    // Processing results
    discoveredURLs?: string[];
    urlAnalyses?: URLAnalysis[];
    processedCount?: number;
    successCount?: number;
    failureCount?: number;

    // Progress tracking
    processingProgress?: number; // 0-100
    processingStartedAt?: Timestamp;
    processingCompletedAt?: Timestamp;
    processingError?: string;
}

/**
 * Queue statistics
 */
export interface QueueStats {
    pending: number;
    approved: number;
    rejected: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
    averageConfidence: number;
    averageProcessingTime: number;
}

/**
 * Processing result
 */
export interface ProcessingResult {
    success: boolean;
    suggestionId: string;
    urlsDiscovered: number;
    urlsAnalyzed: number;
    successfulAnalyses: number;
    failedAnalyses: number;
    processingTime: number;
    error?: string;
}

/**
 * Processing status
 */
export interface ProcessingStatus {
    status: SuggestionStatus;
    progress: number;
    currentStep: string;
    startedAt?: Date;
    estimatedCompletion?: Date;
    error?: string;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ id: string; error: string }>;
}

/**
 * Filter options for suggestions
 */
export interface SuggestionFilters {
    status?: SuggestionStatus[];
    minConfidence?: number;
    maxConfidence?: number;
    dateFrom?: Date;
    dateTo?: Date;
    aiModel?: string;
    reviewedBy?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
    limit: number;
    offset?: number;
    lastDoc?: any; // Firestore DocumentSnapshot
}

/**
 * Sort options
 */
export interface SortOptions {
    field: 'createdAt' | 'updatedAt' | 'confidence' | 'status';
    direction: 'asc' | 'desc';
}
