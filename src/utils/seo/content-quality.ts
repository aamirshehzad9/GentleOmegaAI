/**
 * Content Quality Scoring System
 * Evaluates content across multiple dimensions for SEO and user experience
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  ContentQualityScore,
  DimensionScore,
  ContentSuggestion,
  ContentAnalysisRequest,
} from './seo-types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class ContentQualityAnalyzer {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Analyze content quality across all dimensions
   */
  async analyzeQuality(request: ContentAnalysisRequest): Promise<ContentQualityScore> {
    try {
      // Analyze all dimensions in parallel
      const [
        readability,
        seoOptimization,
        engagement,
        comprehensiveness,
        originality,
        technicalQuality,
      ] = await Promise.all([
        this.analyzeReadability(request.content),
        this.analyzeSEOOptimization(request.content, request.targetKeyword),
        this.analyzeEngagement(request.content, request.targetAudience),
        this.analyzeComprehensiveness(request.content, request.targetKeyword),
        this.analyzeOriginality(request.content),
        this.analyzeTechnicalQuality(request.content),
      ]);

      // Calculate overall score
      const overallScore = Math.round(
        (readability.score +
          seoOptimization.score +
          engagement.score +
          comprehensiveness.score +
          originality.score +
          technicalQuality.score) / 6
      );

      // Generate suggestions
      const suggestions = await this.generateSuggestions(
        request.content,
        request.targetKeyword,
        {
          readability,
          seoOptimization,
          engagement,
          comprehensiveness,
          originality,
          technicalQuality,
        }
      );

      return {
        overallScore,
        dimensions: {
          readability,
          seoOptimization,
          engagement,
          comprehensiveness,
          originality,
          technicalQuality,
        },
        suggestions,
      };
    } catch (error) {
      console.error('Content quality analysis error:', error);
      throw new Error('Failed to analyze content quality');
    }
  }

  /**
   * Analyze readability
   */
  private async analyzeReadability(content: string): Promise<DimensionScore> {
    const prompt = `
Analyze readability of this content:

"${content.substring(0, 1000)}"

Evaluate:
1. Sentence length (ideal: 15-20 words)
2. Paragraph length (ideal: 3-4 sentences)
3. Word complexity (avoid jargon)
4. Flesch Reading Ease score estimate (target: 60-70)
5. Use of transition words
6. Active vs passive voice
7. Overall clarity

Provide:
- Score (0-100)
- Status (excellent/good/average/poor)
- 4 specific metrics with values and ideals
- 4 improvement suggestions

Return ONLY valid JSON:
{
  "score": 75,
  "status": "good",
  "metrics": [
    {"name": "Avg Sentence Length", "value": "18 words", "ideal": "15-20 words"},
    {"name": "Flesch Score", "value": "65", "ideal": "60-70"},
    {"name": "Paragraph Length", "value": "4 sentences", "ideal": "3-4 sentences"},
    {"name": "Passive Voice", "value": "15%", "ideal": "< 10%"}
  ],
  "improvements": [
    "Break up long sentences",
    "Use more transition words",
    "Reduce passive voice",
    "Simplify complex terms"
  ]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Analyze SEO optimization
   */
  private async analyzeSEOOptimization(
    content: string,
    targetKeyword: string
  ): Promise<DimensionScore> {
    const prompt = `
Analyze SEO optimization:

Target Keyword: "${targetKeyword}"
Content (first 800 chars): "${content.substring(0, 800)}"

Evaluate:
1. Keyword density (ideal: 1-2%)
2. Keyword placement (title, H1, first 100 words)
3. LSI keywords (semantic variations)
4. Heading structure (H1 → H2 → H3)
5. Content length (ideal: 1500+ words)
6. Meta-optimizable elements

Return ONLY valid JSON:
{
  "score": 82,
  "status": "good",
  "metrics": [
    {"name": "Keyword Density", "value": "1.5%", "ideal": "1-2%"},
    {"name": "Word Count", "value": "1800", "ideal": "1500+"},
    {"name": "Keyword in H1", "value": "Yes", "ideal": "Yes"},
    {"name": "LSI Keywords", "value": "5", "ideal": "8+"}
  ],
  "improvements": [
    "Add more semantic variations",
    "Include keyword in first paragraph",
    "Optimize H2 headings",
    "Add internal links"
  ]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Analyze engagement potential
   */
  private async analyzeEngagement(
    content: string,
    targetAudience?: string
  ): Promise<DimensionScore> {
    const prompt = `
Analyze engagement potential:

${targetAudience ? `Target Audience: ${targetAudience}` : ''}
Content (first 800 chars): "${content.substring(0, 800)}"

Evaluate:
1. Hook effectiveness (first 100 words)
2. Storytelling elements
3. Emotional resonance
4. Call-to-action strength
5. Visual elements (lists, bold, etc.)
6. Reader retention potential

Return ONLY valid JSON:
{
  "score": 78,
  "status": "good",
  "metrics": [
    {"name": "Hook Quality", "value": "Strong", "ideal": "Strong"},
    {"name": "Emotional Appeal", "value": "Moderate", "ideal": "Strong"},
    {"name": "CTA Present", "value": "Yes", "ideal": "Yes"},
    {"name": "Visual Elements", "value": "3", "ideal": "5+"}
  ],
  "improvements": [
    "Strengthen opening hook",
    "Add more storytelling",
    "Include case studies",
    "Improve CTA placement"
  ]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Analyze comprehensiveness
   */
  private async analyzeComprehensiveness(
    content: string,
    targetKeyword: string
  ): Promise<DimensionScore> {
    const prompt = `
Analyze topic comprehensiveness:

Topic: "${targetKeyword}"
Content (first 1000 chars): "${content.substring(0, 1000)}"

Evaluate:
1. Topic coverage depth
2. Subtopic breadth
3. Question answering
4. Expert insights
5. Examples and evidence
6. Comparison with competitors

Return ONLY valid JSON:
{
  "score": 85,
  "status": "good",
  "metrics": [
    {"name": "Topic Depth", "value": "Deep", "ideal": "Deep"},
    {"name": "Subtopics Covered", "value": "7", "ideal": "8+"},
    {"name": "Examples", "value": "4", "ideal": "5+"},
    {"name": "Expert Insights", "value": "Yes", "ideal": "Yes"}
  ],
  "improvements": [
    "Cover additional subtopics",
    "Add more examples",
    "Include statistics",
    "Add expert quotes"
  ]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Analyze originality
   */
  private async analyzeOriginality(content: string): Promise<DimensionScore> {
    const prompt = `
Analyze content originality:

Content (first 800 chars): "${content.substring(0, 800)}"

Evaluate:
1. Unique insights
2. Fresh perspective
3. Original examples
4. Unique data/research
5. Personal experience
6. Differentiation from generic content

Return ONLY valid JSON:
{
  "score": 72,
  "status": "good",
  "metrics": [
    {"name": "Unique Insights", "value": "Moderate", "ideal": "High"},
    {"name": "Original Examples", "value": "Yes", "ideal": "Yes"},
    {"name": "Unique Data", "value": "No", "ideal": "Yes"},
    {"name": "Personal Touch", "value": "Moderate", "ideal": "High"}
  ],
  "improvements": [
    "Add unique research",
    "Include personal experience",
    "Provide fresh perspective",
    "Create original examples"
  ]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Analyze technical quality
   */
  private async analyzeTechnicalQuality(content: string): Promise<DimensionScore> {
    const prompt = `
Analyze technical writing quality:

Content (first 800 chars): "${content.substring(0, 800)}"

Evaluate:
1. Grammar and spelling
2. Punctuation accuracy
3. Formatting consistency
4. Link quality (if any)
5. Citation style
6. Professional tone

Return ONLY valid JSON:
{
  "score": 88,
  "status": "excellent",
  "metrics": [
    {"name": "Grammar", "value": "Excellent", "ideal": "Excellent"},
    {"name": "Spelling", "value": "Perfect", "ideal": "Perfect"},
    {"name": "Formatting", "value": "Consistent", "ideal": "Consistent"},
    {"name": "Professional Tone", "value": "Yes", "ideal": "Yes"}
  ],
  "improvements": [
    "Fix minor grammar issues",
    "Add citations",
    "Improve link descriptions",
    "Enhance formatting"
  ]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Generate actionable suggestions
   */
  private async generateSuggestions(
    content: string,
    targetKeyword: string,
    dimensions: any
  ): Promise<ContentSuggestion[]> {
    // Collect all improvements from dimensions
    const allImprovements = Object.entries(dimensions).flatMap(([category, dim]: any) =>
      dim.improvements.map((imp: string) => ({ category, improvement: imp, score: dim.score }))
    );

    // Prioritize by score (lowest scores = highest priority)
    const prioritized = allImprovements
      .sort((a, b) => a.score - b.score)
      .slice(0, 10);

    const prompt = `
Generate specific, actionable suggestions:

Target Keyword: "${targetKeyword}"
Content (first 500 chars): "${content.substring(0, 500)}"

Improvements Needed:
${prioritized.map(p => `- ${p.category}: ${p.improvement}`).join('\n')}

For each improvement, create a specific suggestion with:
1. Type (add/modify/remove)
2. Priority (high/medium/low)
3. Category (structure/keywords/links/readability/technical)
4. Specific message
5. Example (if applicable)
6. Expected impact

Return ONLY valid JSON array:
[
  {
    "type": "add",
    "priority": "high",
    "category": "keywords",
    "message": "Add target keyword to first paragraph",
    "example": "Start with: 'Understanding [keyword] is essential...'",
    "impact": "Improves keyword placement score by 15 points"
  }
]

Generate 8-12 suggestions. ONLY JSON array.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Quick score (simplified, faster analysis)
   */
  async quickScore(content: string, targetKeyword: string): Promise<number> {
    const prompt = `
Quick SEO quality score (0-100) for this content:

Target Keyword: "${targetKeyword}"
Content: "${content.substring(0, 500)}"

Consider: keyword presence, length, readability, structure.

Return ONLY a number (0-100), nothing else.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text().trim();
    const score = parseInt(text.match(/\d+/)?.[0] || '50');
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Compare content versions
   */
  async compareVersions(
    original: string,
    modified: string,
    targetKeyword: string
  ): Promise<{
    improvements: string[];
    regressions: string[];
    scoreDelta: number;
    recommendation: string;
  }> {
    const [originalScore, modifiedScore] = await Promise.all([
      this.quickScore(original, targetKeyword),
      this.quickScore(modified, targetKeyword),
    ]);

    const prompt = `
Compare two versions of content:

Target Keyword: "${targetKeyword}"

Original (first 400 chars):
"${original.substring(0, 400)}"

Modified (first 400 chars):
"${modified.substring(0, 400)}"

Scores: Original ${originalScore}, Modified ${modifiedScore}

List:
1. 5 improvements in modified version
2. 3 potential regressions (if any)
3. Overall recommendation

Return ONLY valid JSON:
{
  "improvements": ["imp1", "imp2", "imp3", "imp4", "imp5"],
  "regressions": ["reg1", "reg2", "reg3"],
  "recommendation": "Specific recommendation (keep modified, revert, or refine)"
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const data = this.parseAIResponse<any>(text);

    return {
      ...data,
      scoreDelta: modifiedScore - originalScore,
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
export const contentQualityAnalyzer = new ContentQualityAnalyzer();
