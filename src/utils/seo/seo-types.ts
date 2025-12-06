/**
 * SEO Types and Interfaces
 * Comprehensive type definitions for the SEO automation engine
 */

// ============================================================================
// KEYWORD RESEARCH TYPES
// ============================================================================

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number; // 0-100
  cpc: number; // Cost per click
  competition: 'low' | 'medium' | 'high';
  trend: 'rising' | 'stable' | 'declining';
  relatedKeywords: string[];
  questions: string[];
  longtailVariations: string[];
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  seasonality?: {
    month: string;
    relativeVolume: number;
  }[];
}

export interface KeywordResearchRequest {
  seedKeyword: string;
  targetAudience?: string;
  industry?: string;
  location?: string;
  maxResults?: number;
}

export interface KeywordResearchResult {
  primaryKeywords: KeywordData[];
  secondaryKeywords: KeywordData[];
  longTailKeywords: KeywordData[];
  contentIdeas: ContentIdea[];
  totalOpportunityScore: number;
}

export interface ContentIdea {
  title: string;
  targetKeyword: string;
  estimatedTraffic: number;
  difficulty: number;
  suggestedHeadings: string[];
  contentType: 'how-to' | 'listicle' | 'guide' | 'comparison' | 'review' | 'news';
}

// ============================================================================
// COMPETITOR ANALYSIS TYPES
// ============================================================================

export interface CompetitorAnalysis {
  url: string;
  domain: string;
  title: string;
  metaDescription: string;
  wordCount: number;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  keywords: {
    keyword: string;
    frequency: number;
    density: number;
  }[];
  backlinks: number;
  domainAuthority: number;
  contentQuality: number; // 0-100
  readabilityScore: number;
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  contentGaps: string[];
  recommendedImprovements: string[];
}

export interface CompetitorComparisonRequest {
  targetKeyword: string;
  numberOfCompetitors?: number;
  yourContent?: string;
}

export interface CompetitorComparisonResult {
  competitors: CompetitorAnalysis[];
  aggregateInsights: {
    averageWordCount: number;
    commonTopics: string[];
    contentStructurePatterns: string[];
    keywordOpportunities: string[];
  };
  recommendations: string[];
}

// ============================================================================
// ON-PAGE SEO TYPES
// ============================================================================

export interface OnPageSEOAnalysis {
  title: SEOElement;
  metaDescription: SEOElement;
  headings: SEOElement;
  content: SEOElement;
  images: SEOElement;
  internalLinks: SEOElement;
  externalLinks: SEOElement;
  readability: SEOElement;
  keywordUsage: SEOElement;
  structuredData: SEOElement;
  overallScore: number; // 0-100
}

export interface SEOElement {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  issues: SEOIssue[];
  recommendations: string[];
  currentValue?: any;
  optimizedValue?: any;
}

export interface SEOIssue {
  type: 'critical' | 'warning' | 'info';
  message: string;
  fix?: string;
  priority: number; // 1-10
}

export interface OnPageOptimizationRequest {
  content: string;
  targetKeyword: string;
  secondaryKeywords?: string[];
  metadata?: {
    title?: string;
    description?: string;
    slug?: string;
  };
}

export interface OnPageOptimizationResult {
  analysis: OnPageSEOAnalysis;
  optimizedContent: string;
  optimizedMetadata: {
    title: string;
    description: string;
    slug: string;
    keywords: string[];
  };
  structuredData: any; // JSON-LD schema
  improvements: {
    before: number; // score before
    after: number; // score after
    changes: string[];
  };
}

// ============================================================================
// CONTENT QUALITY TYPES
// ============================================================================

export interface ContentQualityScore {
  overallScore: number; // 0-100
  dimensions: {
    readability: DimensionScore;
    seoOptimization: DimensionScore;
    engagement: DimensionScore;
    comprehensiveness: DimensionScore;
    originality: DimensionScore;
    technicalQuality: DimensionScore;
  };
  suggestions: ContentSuggestion[];
}

export interface DimensionScore {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'average' | 'poor';
  metrics: {
    name: string;
    value: number | string;
    ideal: number | string;
  }[];
  improvements: string[];
}

export interface ContentSuggestion {
  type: 'add' | 'modify' | 'remove';
  priority: 'high' | 'medium' | 'low';
  category: 'structure' | 'keywords' | 'links' | 'readability' | 'technical';
  message: string;
  example?: string;
  impact: string; // Expected impact on SEO
}

export interface ContentAnalysisRequest {
  content: string;
  targetKeyword: string;
  targetAudience?: string;
  contentType?: string;
}

// ============================================================================
// SEO AUTOMATION TYPES
// ============================================================================

export interface SEOAutomationConfig {
  autoOptimize: boolean;
  autoGenerateMetadata: boolean;
  autoAddInternalLinks: boolean;
  autoGenerateStructuredData: boolean;
  autoOptimizeImages: boolean;
  keywordDensityTarget: number; // 1-3%
  minWordCount: number;
  maxWordCount: number;
  readabilityLevel: 'basic' | 'intermediate' | 'advanced';
}

export interface SEOOptimizationTask {
  id: string;
  type: 'keyword-research' | 'competitor-analysis' | 'content-optimization' | 'technical-seo';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  completedAt?: Date;
  input: any;
  output?: any;
  error?: string;
}

// ============================================================================
// TECHNICAL SEO TYPES
// ============================================================================

export interface TechnicalSEOAudit {
  performance: {
    loadTime: number;
    timeToInteractive: number;
    firstContentfulPaint: number;
    score: number;
  };
  mobile: {
    mobileOptimized: boolean;
    viewportConfigured: boolean;
    touchTargetsAppropriate: boolean;
    score: number;
  };
  security: {
    httpsEnabled: boolean;
    mixedContentIssues: number;
    score: number;
  };
  crawlability: {
    robotsTxt: boolean;
    sitemapXml: boolean;
    canonicalTags: boolean;
    score: number;
  };
  overallScore: number;
  criticalIssues: TechnicalIssue[];
}

export interface TechnicalIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'performance' | 'mobile' | 'security' | 'crawlability';
  message: string;
  fix: string;
  impact: string;
}

// ============================================================================
// SEO TRACKING TYPES
// ============================================================================

export interface SEOMetrics {
  timestamp: Date;
  organicTraffic: number;
  keywordRankings: KeywordRanking[];
  backlinks: number;
  domainAuthority: number;
  pageAuthority: number;
  organicKeywords: number;
  averagePosition: number;
  clickThroughRate: number;
}

export interface KeywordRanking {
  keyword: string;
  position: number;
  previousPosition?: number;
  change: number;
  url: string;
  searchVolume: number;
  clicks: number;
  impressions: number;
  ctr: number;
}

export interface SEOReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalTraffic: number;
    trafficChange: number;
    totalKeywords: number;
    keywordsChange: number;
    averagePosition: number;
    positionChange: number;
  };
  topPerformingPages: {
    url: string;
    title: string;
    traffic: number;
    keywords: number;
  }[];
  topKeywords: KeywordRanking[];
  recommendations: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const SEO_SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  NEEDS_IMPROVEMENT: 50,
  POOR: 0
} as const;

export const READABILITY_LEVELS = {
  BASIC: {
    name: 'Basic',
    fleschScore: 90,
    description: 'Easy for 5th grader'
  },
  INTERMEDIATE: {
    name: 'Intermediate',
    fleschScore: 70,
    description: '8th-9th grade level'
  },
  ADVANCED: {
    name: 'Advanced',
    fleschScore: 50,
    description: 'College level'
  }
} as const;

export const KEYWORD_DIFFICULTY_RANGES = {
  EASY: { min: 0, max: 30 },
  MEDIUM: { min: 31, max: 60 },
  HARD: { min: 61, max: 100 }
} as const;

export const CONTENT_LENGTH_RECOMMENDATIONS = {
  'blog-post': { min: 1500, ideal: 2000, max: 3000 },
  'how-to': { min: 2000, ideal: 2500, max: 4000 },
  'listicle': { min: 1000, ideal: 1500, max: 2500 },
  'guide': { min: 3000, ideal: 4000, max: 6000 },
  'comparison': { min: 2000, ideal: 3000, max: 5000 },
  'review': { min: 1500, ideal: 2000, max: 3000 }
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SEOStatus = 'not-analyzed' | 'analyzing' | 'optimized' | 'needs-optimization';

export interface SEOCache {
  key: string;
  data: any;
  timestamp: Date;
  expiresAt: Date;
}

export interface SEOError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}
