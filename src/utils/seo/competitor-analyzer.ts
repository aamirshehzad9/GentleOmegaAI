/**
 * Competitor Content Analyzer
 * Analyzes competitor content to identify opportunities and gaps
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  CompetitorAnalysis,
  CompetitorComparisonRequest,
  CompetitorComparisonResult,
} from './seo-types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class CompetitorAnalyzer {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Analyze competitor content for a target keyword
   */
  async analyzeCompetitors(
    request: CompetitorComparisonRequest
  ): Promise<CompetitorComparisonResult> {
    try {
      // First, find competitor URLs
      const competitorUrls = await this.findCompetitorUrls(
        request.targetKeyword,
        request.numberOfCompetitors || 5
      );

      // Analyze each competitor
      const competitors = await Promise.all(
        competitorUrls.map(url => this.analyzeCompetitorPage(url, request.targetKeyword))
      );

      // Generate aggregate insights
      const aggregateInsights = this.generateAggregateInsights(competitors);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        competitors,
        aggregateInsights,
        request.yourContent
      );

      return {
        competitors,
        aggregateInsights,
        recommendations,
      };
    } catch (error) {
      console.error('Competitor analysis error:', error);
      throw new Error('Failed to analyze competitors');
    }
  }

  /**
   * Find top competitor URLs for a keyword
   */
  private async findCompetitorUrls(
    keyword: string,
    count: number
  ): Promise<string[]> {
    const prompt = `
You are an SEO expert. Find the top ${count} competitor URLs that rank for: "${keyword}"

These should be:
- High-quality, authoritative sites
- Actually ranking on page 1 of Google
- Comprehensive content about the topic
- Not Wikipedia or generic sites

Return ONLY a JSON array of URLs:
["https://example1.com/article", "https://example2.com/page", ...]

No explanations, ONLY the JSON array.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse<string[]>(text);
  }

  /**
   * Analyze a single competitor page
   */
  private async analyzeCompetitorPage(
    url: string,
    targetKeyword: string
  ): Promise<CompetitorAnalysis> {
    const prompt = `
Analyze this competitor page for the keyword "${targetKeyword}":

URL: ${url}

As an SEO expert, analyze and provide:
1. Domain name
2. Page title
3. Meta description (estimate if needed)
4. Word count (estimate reasonably)
5. Main H1, 5 H2s, 3 H3s
6. Top 10 keywords with frequency and density
7. Estimated backlinks (0-10000)
8. Domain authority estimate (0-100)
9. Content quality score (0-100)
10. Readability score (0-100)
11. 5 content strengths
12. 5 content weaknesses
13. 5 content gaps (topics not covered)
14. 5 recommended improvements

Return ONLY valid JSON:
{
  "url": "${url}",
  "domain": "example.com",
  "title": "Page Title",
  "metaDescription": "Description",
  "wordCount": 2500,
  "headings": {
    "h1": ["Main H1"],
    "h2": ["H2-1", "H2-2", "H2-3", "H2-4", "H2-5"],
    "h3": ["H3-1", "H3-2", "H3-3"]
  },
  "keywords": [
    {"keyword": "keyword1", "frequency": 15, "density": 2.5},
    {"keyword": "keyword2", "frequency": 10, "density": 1.7}
  ],
  "backlinks": 500,
  "domainAuthority": 75,
  "contentQuality": 85,
  "readabilityScore": 70,
  "strengthsAndWeaknesses": {
    "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
    "weaknesses": ["weakness1", "weakness2", "weakness3", "weakness4", "weakness5"]
  },
  "contentGaps": ["gap1", "gap2", "gap3", "gap4", "gap5"],
  "recommendedImprovements": ["imp1", "imp2", "imp3", "imp4", "imp5"]
}

ONLY JSON, no other text.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse<CompetitorAnalysis>(text);
  }

  /**
   * Generate aggregate insights from all competitors
   */
  private generateAggregateInsights(competitors: CompetitorAnalysis[]): {
    averageWordCount: number;
    commonTopics: string[];
    contentStructurePatterns: string[];
    keywordOpportunities: string[];
  } {
    // Calculate average word count
    const averageWordCount = Math.round(
      competitors.reduce((sum, c) => sum + c.wordCount, 0) / competitors.length
    );

    // Extract common topics from all H2s
    const allH2s = competitors.flatMap(c => c.headings.h2);
    const h2Counts = allH2s.reduce((acc, h2) => {
      acc[h2] = (acc[h2] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonTopics = Object.entries(h2Counts)
      .filter(([_, count]) => count >= 2)
      .map(([topic]) => topic)
      .slice(0, 10);

    // Identify content structure patterns
    const contentStructurePatterns = [
      `Average content length: ${averageWordCount} words`,
      `Common headings: ${commonTopics.length} recurring topics`,
      `Average H2 count: ${Math.round(allH2s.length / competitors.length)}`,
      `Typical structure: Introduction → ${commonTopics.slice(0, 3).join(' → ')}`,
    ];

    // Find keyword opportunities (keywords used by competitors)
    const allKeywords = competitors
      .flatMap(c => c.keywords.map(k => k.keyword))
      .filter((k, i, arr) => arr.indexOf(k) === i)
      .slice(0, 15);

    return {
      averageWordCount,
      commonTopics,
      contentStructurePatterns,
      keywordOpportunities: allKeywords,
    };
  }

  /**
   * Generate strategic recommendations
   */
  private async generateRecommendations(
    competitors: CompetitorAnalysis[],
    insights: any,
    yourContent?: string
  ): Promise<string[]> {
    const competitorSummary = competitors.map(c => ({
      domain: c.domain,
      wordCount: c.wordCount,
      quality: c.contentQuality,
      strengths: c.strengthsAndWeaknesses.strengths,
    }));

    const prompt = `
As an SEO strategist, analyze these competitors and generate 10 strategic recommendations:

Competitor Summary:
${JSON.stringify(competitorSummary, null, 2)}

Aggregate Insights:
- Average Word Count: ${insights.averageWordCount}
- Common Topics: ${insights.commonTopics.join(', ')}
- Keyword Opportunities: ${insights.keywordOpportunities.join(', ')}

${yourContent ? `Your Current Content (first 300 chars): "${yourContent.substring(0, 300)}"` : ''}

Provide specific, actionable recommendations to:
1. Outrank these competitors
2. Fill content gaps
3. Improve content quality
4. Target better keywords
5. Enhance user experience

Return ONLY a JSON array of recommendation strings:
["recommendation1", "recommendation2", ...]

No explanations, ONLY the array.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse<string[]>(text);
  }

  /**
   * Find content gaps compared to competitors
   */
  async findContentGaps(
    targetKeyword: string,
    yourContent: string
  ): Promise<string[]> {
    const prompt = `
Compare this content against what competitors are writing for "${targetKeyword}":

Your Content (first 500 chars):
"${yourContent.substring(0, 500)}"

Identify 10 important topics/subtopics that:
- Competitors likely cover
- Are missing from your content
- Would improve topical authority
- Users expect to see

Return ONLY a JSON array of gap strings:
["gap1", "gap2", ...]

ONLY the array, no other text.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse<string[]>(text);
  }

  /**
   * Analyze competitor backlink strategies
   */
  async analyzeBacklinkStrategies(competitors: CompetitorAnalysis[]): Promise<{
    totalBacklinks: number;
    averageDA: number;
    strategies: string[];
    opportunities: string[];
  }> {
    const totalBacklinks = competitors.reduce((sum, c) => sum + c.backlinks, 0);
    const averageDA = Math.round(
      competitors.reduce((sum, c) => sum + c.domainAuthority, 0) / competitors.length
    );

    const prompt = `
Analyze backlink profiles of these competitors:
${competitors.map(c => `${c.domain}: ${c.backlinks} backlinks, DA ${c.domainAuthority}`).join('\n')}

Provide:
1. 5 common backlink strategies they use
2. 5 link building opportunities

Return ONLY valid JSON:
{
  "strategies": ["strategy1", "strategy2", "strategy3", "strategy4", "strategy5"],
  "opportunities": ["opp1", "opp2", "opp3", "opp4", "opp5"]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const data = this.parseAIResponse<{ strategies: string[]; opportunities: string[] }>(text);

    return {
      totalBacklinks,
      averageDA,
      ...data,
    };
  }

  /**
   * Compare your content against top performer
   */
  async compareWithTopPerformer(
    yourContent: string,
    targetKeyword: string
  ): Promise<{
    gaps: string[];
    strengths: string[];
    improvements: string[];
    scoreComparison: {
      yours: number;
      topPerformer: number;
      difference: number;
    };
  }> {
    const prompt = `
Compare this content against the top-ranking page for "${targetKeyword}":

Your Content (first 500 chars):
"${yourContent.substring(0, 500)}"

Provide:
1. 5 gaps (what top performer has that you don't)
2. 5 strengths (what you do better)
3. 5 specific improvements needed
4. Quality score for your content (0-100)
5. Estimated score for top performer (0-100)

Return ONLY valid JSON:
{
  "gaps": ["gap1", "gap2", "gap3", "gap4", "gap5"],
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "improvements": ["imp1", "imp2", "imp3", "imp4", "imp5"],
  "yourScore": 75,
  "topPerformerScore": 90
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const data = this.parseAIResponse<any>(text);

    return {
      gaps: data.gaps,
      strengths: data.strengths,
      improvements: data.improvements,
      scoreComparison: {
        yours: data.yourScore,
        topPerformer: data.topPerformerScore,
        difference: data.topPerformerScore - data.yourScore,
      },
    };
  }

  /**
   * Parse AI response
   */
  private parseAIResponse<T>(text: string): T {
    try {
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      const jsonMatch = cleanText.match(/[\[\{][\s\S]*[\]\}]/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Failed to parse AI response:', text);
      throw new Error('Invalid AI response format');
    }
  }
}

// Export singleton instance
export const competitorAnalyzer = new CompetitorAnalyzer();
