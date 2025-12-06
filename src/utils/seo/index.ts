/**
 * SEO Optimization Manager
 * Unified interface for all SEO automation features
 */

import { keywordResearch } from './keyword-research';
import { competitorAnalyzer } from './competitor-analyzer';
import { onPageOptimizer } from './onpage-optimizer';
import { contentQualityAnalyzer } from './content-quality';
import type {
  KeywordResearchRequest,
  KeywordResearchResult,
  CompetitorComparisonRequest,
  CompetitorComparisonResult,
  OnPageOptimizationRequest,
  OnPageOptimizationResult,
  ContentAnalysisRequest,
  ContentQualityScore,
  SEOAutomationConfig,
} from './seo-types';

class SEOManager {
  private config: SEOAutomationConfig = {
    autoOptimize: true,
    autoGenerateMetadata: true,
    autoAddInternalLinks: false,
    autoGenerateStructuredData: true,
    autoOptimizeImages: false,
    keywordDensityTarget: 1.5,
    minWordCount: 1500,
    maxWordCount: 4000,
    readabilityLevel: 'intermediate',
  };

  /**
   * Configure SEO automation settings
   */
  configure(config: Partial<SEOAutomationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): SEOAutomationConfig {
    return { ...this.config };
  }

  // ============================================================================
  // KEYWORD RESEARCH
  // ============================================================================

  /**
   * Research keywords for a topic
   */
  async researchKeywords(request: KeywordResearchRequest): Promise<KeywordResearchResult> {
    return keywordResearch.researchKeywords(request);
  }

  /**
   * Find keyword opportunities
   */
  async findKeywordOpportunities(
    targetKeyword: string,
    competitorKeywords: string[]
  ): Promise<any> {
    return keywordResearch.findKeywordOpportunities(targetKeyword, competitorKeywords);
  }

  /**
   * Get keyword suggestions for content
   */
  async getKeywordSuggestions(
    content: string,
    targetKeyword: string
  ): Promise<string[]> {
    return keywordResearch.getKeywordSuggestions(content, targetKeyword);
  }

  /**
   * Analyze keyword intent
   */
  async analyzeKeywordIntent(keyword: string): Promise<any> {
    return keywordResearch.analyzeKeywordIntent(keyword);
  }

  // ============================================================================
  // COMPETITOR ANALYSIS
  // ============================================================================

  /**
   * Analyze competitor content
   */
  async analyzeCompetitors(
    request: CompetitorComparisonRequest
  ): Promise<CompetitorComparisonResult> {
    return competitorAnalyzer.analyzeCompetitors(request);
  }

  /**
   * Find content gaps
   */
  async findContentGaps(
    targetKeyword: string,
    yourContent: string
  ): Promise<string[]> {
    return competitorAnalyzer.findContentGaps(targetKeyword, yourContent);
  }

  /**
   * Compare with top performer
   */
  async compareWithTopPerformer(
    yourContent: string,
    targetKeyword: string
  ): Promise<any> {
    return competitorAnalyzer.compareWithTopPerformer(yourContent, targetKeyword);
  }

  /**
   * Analyze backlink strategies
   */
  async analyzeBacklinkStrategies(competitors: any[]): Promise<any> {
    return competitorAnalyzer.analyzeBacklinkStrategies(competitors);
  }

  // ============================================================================
  // ON-PAGE OPTIMIZATION
  // ============================================================================

  /**
   * Optimize content for SEO
   */
  async optimizeContent(
    request: OnPageOptimizationRequest
  ): Promise<OnPageOptimizationResult> {
    return onPageOptimizer.optimize(request);
  }

  /**
   * Analyze on-page SEO
   */
  async analyzeOnPageSEO(
    content: string,
    targetKeyword: string,
    metadata?: any
  ): Promise<any> {
    return onPageOptimizer.analyzeOnPageSEO(content, targetKeyword, metadata);
  }

  /**
   * Optimize images
   */
  async optimizeImages(
    images: Array<{ src: string; alt?: string }>,
    targetKeyword: string,
    contentContext: string
  ): Promise<any> {
    return onPageOptimizer.optimizeImages(images, targetKeyword, contentContext);
  }

  /**
   * Suggest internal links
   */
  async suggestInternalLinks(
    content: string,
    targetKeyword: string,
    existingPages: Array<{ url: string; title: string; keywords: string[] }>
  ): Promise<any> {
    return onPageOptimizer.suggestInternalLinks(content, targetKeyword, existingPages);
  }

  /**
   * Check keyword cannibalization
   */
  async checkKeywordCannibalization(
    targetKeyword: string,
    existingPages: Array<{ url: string; title: string; targetKeyword: string }>
  ): Promise<any> {
    return onPageOptimizer.checkKeywordCannibalization(targetKeyword, existingPages);
  }

  // ============================================================================
  // CONTENT QUALITY
  // ============================================================================

  /**
   * Analyze content quality
   */
  async analyzeContentQuality(
    request: ContentAnalysisRequest
  ): Promise<ContentQualityScore> {
    return contentQualityAnalyzer.analyzeQuality(request);
  }

  /**
   * Quick quality score
   */
  async quickScore(content: string, targetKeyword: string): Promise<number> {
    return contentQualityAnalyzer.quickScore(content, targetKeyword);
  }

  /**
   * Compare content versions
   */
  async compareVersions(
    original: string,
    modified: string,
    targetKeyword: string
  ): Promise<any> {
    return contentQualityAnalyzer.compareVersions(original, modified, targetKeyword);
  }

  // ============================================================================
  // AUTOMATED WORKFLOWS
  // ============================================================================

  /**
   * Full SEO workflow: Research → Analyze → Optimize
   */
  async fullSEOWorkflow(params: {
    seedKeyword: string;
    content?: string;
    targetAudience?: string;
    industry?: string;
  }): Promise<{
    keywordResearch: KeywordResearchResult;
    competitorAnalysis?: CompetitorComparisonResult;
    optimization?: OnPageOptimizationResult;
    qualityScore?: ContentQualityScore;
    recommendations: string[];
  }> {
    const workflow: any = {
      recommendations: [],
    };

    try {
      // Step 1: Keyword Research
      workflow.recommendations.push('🔍 Starting keyword research...');
      workflow.keywordResearch = await this.researchKeywords({
        seedKeyword: params.seedKeyword,
        targetAudience: params.targetAudience,
        industry: params.industry,
      });
      workflow.recommendations.push(
        `✅ Found ${workflow.keywordResearch.primaryKeywords.length} primary keywords with opportunity score ${workflow.keywordResearch.totalOpportunityScore}`
      );

      // Step 2: Competitor Analysis
      workflow.recommendations.push('🔍 Analyzing competitors...');
      workflow.competitorAnalysis = await this.analyzeCompetitors({
        targetKeyword: params.seedKeyword,
        yourContent: params.content,
      });
      workflow.recommendations.push(
        `✅ Analyzed ${workflow.competitorAnalysis.competitors.length} competitors`
      );

      // Step 3: Content Optimization (if content provided)
      if (params.content) {
        workflow.recommendations.push('🔍 Optimizing content...');
        
        // Get quality score first
        workflow.qualityScore = await this.analyzeContentQuality({
          content: params.content,
          targetKeyword: params.seedKeyword,
          targetAudience: params.targetAudience,
        });
        workflow.recommendations.push(
          `📊 Current quality score: ${workflow.qualityScore.overallScore}/100`
        );

        // Optimize if auto-optimize is enabled and score is below 80
        if (this.config.autoOptimize && workflow.qualityScore.overallScore < 80) {
          workflow.optimization = await this.optimizeContent({
            content: params.content,
            targetKeyword: params.seedKeyword,
            secondaryKeywords: workflow.keywordResearch.secondaryKeywords
              .slice(0, 5)
              .map(k => k.keyword),
          });
          workflow.recommendations.push(
            `✅ Content optimized: ${workflow.optimization.improvements.before} → ${workflow.optimization.improvements.after}`
          );
        }
      }

      // Final recommendations
      workflow.recommendations.push('');
      workflow.recommendations.push('📋 Key Recommendations:');
      
      if (workflow.keywordResearch.totalOpportunityScore > 70) {
        workflow.recommendations.push('• High opportunity keywords identified - prioritize content creation');
      }
      
      if (workflow.competitorAnalysis.recommendations.length > 0) {
        workflow.recommendations.push(
          `• ${workflow.competitorAnalysis.recommendations[0]}`
        );
      }
      
      if (workflow.qualityScore && workflow.qualityScore.overallScore < 70) {
        workflow.recommendations.push(
          '• Content quality needs improvement - focus on comprehensiveness and engagement'
        );
      }

      return workflow;
    } catch (error) {
      console.error('SEO workflow error:', error);
      throw error;
    }
  }

  /**
   * Blog optimization workflow
   */
  async optimizeBlogPost(params: {
    title: string;
    content: string;
    targetKeyword: string;
    tags?: string[];
  }): Promise<{
    optimizedContent: string;
    metadata: any;
    structuredData: any;
    qualityScore: ContentQualityScore;
    seoScore: number;
    suggestions: string[];
  }> {
    try {
      // Analyze current quality
      const qualityScore = await this.analyzeContentQuality({
        content: params.content,
        targetKeyword: params.targetKeyword,
      });

      // Optimize content
      const optimization = await this.optimizeContent({
        content: params.content,
        targetKeyword: params.targetKeyword,
        metadata: {
          title: params.title,
        },
      });

      // Generate suggestions
      const suggestions: string[] = [];
      
      if (qualityScore.overallScore < 80) {
        suggestions.push('Consider improving content quality before publishing');
      }
      
      if (optimization.improvements.after < 85) {
        suggestions.push('Add more comprehensive information to boost SEO score');
      }
      
      qualityScore.suggestions.forEach(s => {
        if (s.priority === 'high') {
          suggestions.push(s.message);
        }
      });

      return {
        optimizedContent: optimization.optimizedContent,
        metadata: optimization.optimizedMetadata,
        structuredData: optimization.structuredData,
        qualityScore,
        seoScore: optimization.analysis.overallScore,
        suggestions: suggestions.slice(0, 5),
      };
    } catch (error) {
      console.error('Blog optimization error:', error);
      throw error;
    }
  }

  /**
   * Content audit workflow
   */
  async auditContent(params: {
    content: string;
    targetKeyword: string;
    existingPages?: Array<{ url: string; title: string; targetKeyword: string }>;
  }): Promise<{
    qualityScore: ContentQualityScore;
    seoAnalysis: any;
    cannibalization?: any;
    contentGaps: string[];
    overallHealth: 'excellent' | 'good' | 'needs-work' | 'poor';
    priorityActions: string[];
  }> {
    try {
      // Run multiple audits in parallel
      const [qualityScore, seoAnalysis, contentGaps] = await Promise.all([
        this.analyzeContentQuality({
          content: params.content,
          targetKeyword: params.targetKeyword,
        }),
        this.analyzeOnPageSEO(params.content, params.targetKeyword),
        this.findContentGaps(params.targetKeyword, params.content),
      ]);

      // Check cannibalization if pages provided
      let cannibalization;
      if (params.existingPages) {
        cannibalization = await this.checkKeywordCannibalization(
          params.targetKeyword,
          params.existingPages
        );
      }

      // Determine overall health
      const avgScore = (qualityScore.overallScore + seoAnalysis.overallScore) / 2;
      let overallHealth: 'excellent' | 'good' | 'needs-work' | 'poor';
      if (avgScore >= 85) overallHealth = 'excellent';
      else if (avgScore >= 70) overallHealth = 'good';
      else if (avgScore >= 50) overallHealth = 'needs-work';
      else overallHealth = 'poor';

      // Generate priority actions
      const priorityActions: string[] = [];
      
      if (cannibalization?.hasConflict) {
        priorityActions.push(`🚨 CRITICAL: ${cannibalization.recommendation}`);
      }
      
      if (qualityScore.overallScore < 70) {
        priorityActions.push('Improve content quality (currently below target)');
      }
      
      if (seoAnalysis.overallScore < 70) {
        priorityActions.push('Optimize on-page SEO elements');
      }
      
      if (contentGaps.length > 5) {
        priorityActions.push(
          `Fill ${contentGaps.length} content gaps to improve comprehensiveness`
        );
      }

      return {
        qualityScore,
        seoAnalysis,
        cannibalization,
        contentGaps,
        overallHealth,
        priorityActions: priorityActions.slice(0, 5),
      };
    } catch (error) {
      console.error('Content audit error:', error);
      throw error;
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    keywordResearch.clearCache();
  }

  /**
   * Get system status
   */
  getStatus(): {
    initialized: boolean;
    config: SEOAutomationConfig;
    version: string;
  } {
    return {
      initialized: true,
      config: this.config,
      version: '1.0.0',
    };
  }
}

// Export singleton instance
export const seoManager = new SEOManager();

// Export convenience hook for React components
export function useSEO() {
  return {
    // Keyword Research
    researchKeywords: (request: KeywordResearchRequest) =>
      seoManager.researchKeywords(request),
    findKeywordOpportunities: (keyword: string, competitors: string[]) =>
      seoManager.findKeywordOpportunities(keyword, competitors),
    getKeywordSuggestions: (content: string, keyword: string) =>
      seoManager.getKeywordSuggestions(content, keyword),

    // Competitor Analysis
    analyzeCompetitors: (request: CompetitorComparisonRequest) =>
      seoManager.analyzeCompetitors(request),
    findContentGaps: (keyword: string, content: string) =>
      seoManager.findContentGaps(keyword, content),

    // Content Optimization
    optimizeContent: (request: OnPageOptimizationRequest) =>
      seoManager.optimizeContent(request),
    analyzeContentQuality: (request: ContentAnalysisRequest) =>
      seoManager.analyzeContentQuality(request),
    quickScore: (content: string, keyword: string) =>
      seoManager.quickScore(content, keyword),

    // Workflows
    fullSEOWorkflow: (params: any) => seoManager.fullSEOWorkflow(params),
    optimizeBlogPost: (params: any) => seoManager.optimizeBlogPost(params),
    auditContent: (params: any) => seoManager.auditContent(params),

    // Config
    configure: (config: Partial<SEOAutomationConfig>) => seoManager.configure(config),
    getConfig: () => seoManager.getConfig(),
    getStatus: () => seoManager.getStatus(),
  };
}
