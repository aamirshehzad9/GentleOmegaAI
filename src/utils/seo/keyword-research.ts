/**
 * AI-Powered Keyword Research Engine
 * Uses Gemini AI for intelligent keyword discovery and analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  KeywordData,
  KeywordResearchRequest,
  KeywordResearchResult,
  ContentIdea,
} from './seo-types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class KeywordResearchEngine {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private cache: Map<string, { data: KeywordResearchResult; timestamp: number }>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.cache = new Map();
  }

  /**
   * Main keyword research function
   */
  async researchKeywords(request: KeywordResearchRequest): Promise<KeywordResearchResult> {
    const cacheKey = this.getCacheKey(request);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Generate comprehensive keyword analysis using AI
      const [primaryKeywords, secondaryKeywords, longTailKeywords, contentIdeas] = 
        await Promise.all([
          this.generatePrimaryKeywords(request),
          this.generateSecondaryKeywords(request),
          this.generateLongTailKeywords(request),
          this.generateContentIdeas(request),
        ]);

      const result: KeywordResearchResult = {
        primaryKeywords,
        secondaryKeywords,
        longTailKeywords,
        contentIdeas,
        totalOpportunityScore: this.calculateOpportunityScore(
          primaryKeywords,
          secondaryKeywords,
          longTailKeywords
        ),
      };

      this.saveToCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Keyword research error:', error);
      throw new Error('Failed to complete keyword research');
    }
  }

  /**
   * Generate primary keyword candidates
   */
  private async generatePrimaryKeywords(request: KeywordResearchRequest): Promise<KeywordData[]> {
    const prompt = `
You are an expert SEO keyword researcher. Analyze the following seed keyword and provide 10 primary keyword variations.

Seed Keyword: "${request.seedKeyword}"
${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}
${request.industry ? `Industry: ${request.industry}` : ''}
${request.location ? `Location: ${request.location}` : ''}

For each keyword, provide:
1. The exact keyword phrase
2. Estimated monthly search volume (be realistic)
3. Keyword difficulty (0-100 scale)
4. Average CPC in USD
5. Competition level (low/medium/high)
6. Trend (rising/stable/declining)
7. 3-5 related keywords
8. 2-3 common questions people ask
9. Search intent (informational/commercial/transactional/navigational)

Return ONLY valid JSON array with this exact structure:
[
  {
    "keyword": "exact keyword phrase",
    "searchVolume": 5000,
    "difficulty": 45,
    "cpc": 2.50,
    "competition": "medium",
    "trend": "rising",
    "relatedKeywords": ["keyword1", "keyword2", "keyword3"],
    "questions": ["question1?", "question2?"],
    "intent": "informational"
  }
]

Important: Return ONLY the JSON array, no explanations, no markdown, no code blocks.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const keywords = this.parseAIResponse<any[]>(text);

    return keywords.map(k => ({
      ...k,
      longtailVariations: [],
    }));
  }

  /**
   * Generate secondary keyword opportunities
   */
  private async generateSecondaryKeywords(request: KeywordResearchRequest): Promise<KeywordData[]> {
    const prompt = `
You are an SEO expert. Generate 15 secondary keywords related to: "${request.seedKeyword}"

These should be:
- Closely related but not exact matches
- Lower competition than primary keywords
- Support the main topic
- Include semantic variations

Return ONLY valid JSON array:
[
  {
    "keyword": "keyword phrase",
    "searchVolume": 3000,
    "difficulty": 35,
    "cpc": 1.80,
    "competition": "low",
    "trend": "stable",
    "relatedKeywords": ["rel1", "rel2"],
    "questions": ["q1?"],
    "intent": "informational"
  }
]

No explanations, ONLY JSON array.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const keywords = this.parseAIResponse<any[]>(text);

    return keywords.map(k => ({
      ...k,
      longtailVariations: [],
    }));
  }

  /**
   * Generate long-tail keyword variations
   */
  private async generateLongTailKeywords(request: KeywordResearchRequest): Promise<KeywordData[]> {
    const prompt = `
Generate 20 long-tail keywords (3-5 words) for: "${request.seedKeyword}"

Focus on:
- Question-based keywords (how, what, why, when)
- Problem-solving keywords
- Comparison keywords (vs, versus, compared to)
- Location-specific if relevant
- Low competition, high intent

Return ONLY valid JSON array:
[
  {
    "keyword": "long tail keyword phrase",
    "searchVolume": 500,
    "difficulty": 15,
    "cpc": 1.20,
    "competition": "low",
    "trend": "stable",
    "relatedKeywords": ["rel1"],
    "questions": ["question?"],
    "intent": "informational"
  }
]

ONLY JSON, no other text.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const keywords = this.parseAIResponse<any[]>(text);

    return keywords.map(k => ({
      ...k,
      longtailVariations: [],
    }));
  }

  /**
   * Generate content ideas based on keywords
   */
  private async generateContentIdeas(request: KeywordResearchRequest): Promise<ContentIdea[]> {
    const prompt = `
Create 10 high-value content ideas for the keyword: "${request.seedKeyword}"

Each idea should have:
1. Compelling title
2. Target keyword
3. Estimated monthly traffic potential
4. Difficulty score (0-100)
5. 5-7 suggested H2 headings
6. Content type (how-to, listicle, guide, comparison, review, news)

Return ONLY valid JSON array:
[
  {
    "title": "Title of the article",
    "targetKeyword": "main keyword",
    "estimatedTraffic": 2000,
    "difficulty": 40,
    "suggestedHeadings": ["Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5"],
    "contentType": "how-to"
  }
]

ONLY JSON array, nothing else.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse<ContentIdea[]>(text);
  }

  /**
   * Find keyword opportunities by analyzing gaps
   */
  async findKeywordOpportunities(
    targetKeyword: string,
    competitorKeywords: string[]
  ): Promise<KeywordData[]> {
    const prompt = `
Analyze these competitor keywords and find untapped opportunities related to "${targetKeyword}":

Competitor Keywords: ${competitorKeywords.join(', ')}

Find 15 keywords that:
- Are related but NOT in the competitor list
- Have good search volume (500+)
- Have low to medium difficulty (0-60)
- Represent gaps in content coverage

Return ONLY valid JSON array:
[
  {
    "keyword": "opportunity keyword",
    "searchVolume": 1500,
    "difficulty": 35,
    "cpc": 1.50,
    "competition": "low",
    "trend": "rising",
    "relatedKeywords": ["rel1", "rel2"],
    "questions": ["q1?"],
    "intent": "informational"
  }
]
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const keywords = this.parseAIResponse<any[]>(text);

    return keywords.map(k => ({
      ...k,
      longtailVariations: [],
    }));
  }

  /**
   * Get keyword suggestions for content expansion
   */
  async getKeywordSuggestions(
    currentContent: string,
    targetKeyword: string
  ): Promise<string[]> {
    const prompt = `
Analyze this content and suggest 10 relevant keywords to naturally incorporate:

Target Keyword: "${targetKeyword}"

Content (first 500 chars): "${currentContent.substring(0, 500)}"

Suggest keywords that:
- Are semantically related
- Would improve topical authority
- Can be naturally integrated
- Support the main keyword

Return ONLY a JSON array of keyword strings:
["keyword1", "keyword2", "keyword3", ...]

No explanations, ONLY the array.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse<string[]>(text);
  }

  /**
   * Analyze keyword intent and user expectations
   */
  async analyzeKeywordIntent(keyword: string): Promise<{
    intent: string;
    userExpectations: string[];
    contentRequirements: string[];
    competitiveFactors: string[];
  }> {
    const prompt = `
Deep analysis of search intent for: "${keyword}"

Provide:
1. Primary search intent
2. What users expect to find (5 points)
3. Content requirements to satisfy intent (5 points)
4. Competitive factors to consider (5 points)

Return ONLY valid JSON:
{
  "intent": "primary intent type",
  "userExpectations": ["expect1", "expect2", "expect3", "expect4", "expect5"],
  "contentRequirements": ["req1", "req2", "req3", "req4", "req5"],
  "competitiveFactors": ["factor1", "factor2", "factor3", "factor4", "factor5"]
}

ONLY JSON, no other text.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Parse AI response and handle JSON extraction
   */
  private parseAIResponse<T>(text: string): T {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      // Find JSON array or object
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

  /**
   * Calculate overall opportunity score
   */
  private calculateOpportunityScore(
    primary: KeywordData[],
    secondary: KeywordData[],
    longTail: KeywordData[]
  ): number {
    const allKeywords = [...primary, ...secondary, ...longTail];
    
    const totalVolume = allKeywords.reduce((sum, k) => sum + k.searchVolume, 0);
    const avgDifficulty = allKeywords.reduce((sum, k) => sum + k.difficulty, 0) / allKeywords.length;
    const lowCompCount = allKeywords.filter(k => k.competition === 'low').length;
    
    // Score formula: High volume, low difficulty, low competition = high opportunity
    const volumeScore = Math.min(totalVolume / 1000, 100);
    const difficultyScore = 100 - avgDifficulty;
    const competitionScore = (lowCompCount / allKeywords.length) * 100;
    
    return Math.round((volumeScore + difficultyScore + competitionScore) / 3);
  }

  /**
   * Cache management
   */
  private getCacheKey(request: KeywordResearchRequest): string {
    return `${request.seedKeyword}:${request.targetAudience}:${request.industry}:${request.location}`;
  }

  private getFromCache(key: string): KeywordResearchResult | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private saveToCache(key: string, data: KeywordResearchResult): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const keywordResearch = new KeywordResearchEngine();
