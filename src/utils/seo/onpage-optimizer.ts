/**
 * On-Page SEO Automation
 * Analyzes and optimizes content for search engines
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  OnPageSEOAnalysis,
  OnPageOptimizationRequest,
  OnPageOptimizationResult,
  SEOElement,
  SEOIssue,
} from './seo-types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class OnPageSEOOptimizer {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Perform complete on-page SEO optimization
   */
  async optimize(request: OnPageOptimizationRequest): Promise<OnPageOptimizationResult> {
    try {
      // Analyze current state
      const analysis = await this.analyzeOnPageSEO(
        request.content,
        request.targetKeyword,
        request.metadata
      );

      // Generate optimized content
      const optimizedContent = await this.generateOptimizedContent(
        request.content,
        request.targetKeyword,
        request.secondaryKeywords || [],
        analysis
      );

      // Generate optimized metadata
      const optimizedMetadata = await this.generateOptimizedMetadata(
        request.content,
        request.targetKeyword,
        request.metadata
      );

      // Generate structured data
      const structuredData = await this.generateStructuredData(
        optimizedContent,
        optimizedMetadata,
        request.targetKeyword
      );

      // Re-analyze optimized content
      const optimizedAnalysis = await this.analyzeOnPageSEO(
        optimizedContent,
        request.targetKeyword,
        optimizedMetadata
      );

      return {
        analysis: optimizedAnalysis,
        optimizedContent,
        optimizedMetadata,
        structuredData,
        improvements: {
          before: analysis.overallScore,
          after: optimizedAnalysis.overallScore,
          changes: this.generateChangesList(analysis, optimizedAnalysis),
        },
      };
    } catch (error) {
      console.error('On-page optimization error:', error);
      throw new Error('Failed to optimize on-page SEO');
    }
  }

  /**
   * Analyze on-page SEO elements
   */
  async analyzeOnPageSEO(
    content: string,
    targetKeyword: string,
    metadata?: any
  ): Promise<OnPageSEOAnalysis> {
    const prompt = `
Analyze this content for on-page SEO:

Target Keyword: "${targetKeyword}"
Title: "${metadata?.title || 'Not provided'}"
Meta Description: "${metadata?.description || 'Not provided'}"

Content (first 1000 chars):
"${content.substring(0, 1000)}"

Analyze these elements and score each 0-100:
1. TITLE: Length (50-60 chars), keyword placement, compelling
2. META DESCRIPTION: Length (150-160 chars), keyword, CTA
3. HEADINGS: H1 present, keyword in H1, H2/H3 structure
4. CONTENT: Length (1500+ words), keyword density (1-2%), readability
5. IMAGES: Alt text, file names, optimization
6. INTERNAL LINKS: At least 3, relevant anchors
7. EXTERNAL LINKS: 2-3 authoritative sources
8. READABILITY: Flesch score 60+, short paragraphs
9. KEYWORD USAGE: Natural placement, semantic variations
10. STRUCTURED DATA: Schema markup potential

For each element provide:
- Score (0-100)
- Status (excellent/good/needs-improvement/poor)
- 2-3 specific issues with type (critical/warning/info) and priority (1-10)
- 2-3 recommendations

Return ONLY valid JSON:
{
  "title": {
    "score": 85,
    "status": "good",
    "issues": [
      {"type": "warning", "message": "Title is 65 characters, should be 50-60", "fix": "Shorten to 55 characters", "priority": 6}
    ],
    "recommendations": ["Add target keyword at start", "Make it more compelling"]
  },
  "metaDescription": {...},
  "headings": {...},
  "content": {...},
  "images": {...},
  "internalLinks": {...},
  "externalLinks": {...},
  "readability": {...},
  "keywordUsage": {...},
  "structuredData": {...}
}

ONLY JSON, no other text.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const elements = this.parseAIResponse<any>(text);

    const elementScores = Object.values(elements).map((el: any) => el.score || 0);
    const overallScore = Math.round(
      elementScores.reduce((sum: number, score: number) => sum + score, 0) / 10
    );

    return {
      ...elements,
      overallScore,
    };
  }

  /**
   * Generate optimized content
   */
  private async generateOptimizedContent(
    content: string,
    targetKeyword: string,
    secondaryKeywords: string[],
    analysis: OnPageSEOAnalysis
  ): Promise<string> {
    const issues = [
      ...analysis.content.issues,
      ...analysis.headings.issues,
      ...analysis.keywordUsage.issues,
      ...analysis.readability.issues,
    ]
      .filter(i => i.type === 'critical' || i.type === 'warning')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);

    const prompt = `
Optimize this content for SEO while maintaining quality:

Target Keyword: "${targetKeyword}"
Secondary Keywords: ${secondaryKeywords.join(', ')}

Current Content:
"${content}"

Critical Issues to Fix:
${issues.map(i => `- ${i.message}: ${i.fix}`).join('\n')}

Optimize by:
1. Natural keyword integration (1-2% density)
2. Clear heading hierarchy (H1 → H2 → H3)
3. Short paragraphs (3-4 sentences)
4. Readability improvements (Flesch 60+)
5. Add semantic keyword variations
6. Improve content structure
7. Add transition phrases
8. Maintain original meaning and tone

Return ONLY the optimized content, no explanations.
`;

    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }

  /**
   * Generate optimized metadata
   */
  private async generateOptimizedMetadata(
    content: string,
    targetKeyword: string,
    currentMetadata?: any
  ): Promise<{
    title: string;
    description: string;
    slug: string;
    keywords: string[];
  }> {
    const prompt = `
Generate optimized SEO metadata:

Target Keyword: "${targetKeyword}"
Current Title: "${currentMetadata?.title || ''}"
Current Description: "${currentMetadata?.description || ''}"

Content Summary (first 300 chars):
"${content.substring(0, 300)}"

Generate:
1. TITLE: 50-60 chars, keyword at start, compelling
2. META DESCRIPTION: 150-160 chars, keyword, CTA, benefit
3. SLUG: URL-friendly, keyword-rich, 3-5 words
4. KEYWORDS: 5-7 relevant keywords

Return ONLY valid JSON:
{
  "title": "Optimized Title Here",
  "description": "Optimized meta description with CTA",
  "slug": "optimized-url-slug",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Generate structured data (Schema.org JSON-LD)
   */
  private async generateStructuredData(
    content: string,
    metadata: any,
    targetKeyword: string
  ): Promise<any> {
    const prompt = `
Generate Schema.org JSON-LD structured data for this content:

Title: "${metadata.title}"
Description: "${metadata.description}"
Target Keyword: "${targetKeyword}"

Content (first 500 chars):
"${content.substring(0, 500)}"

Generate appropriate schema (Article, BlogPosting, HowTo, etc.) with:
- @context and @type
- headline, description
- author, publisher
- datePublished, dateModified
- image (placeholder)
- All relevant properties

Return ONLY valid JSON-LD:
{
  "@context": "https://schema.org",
  "@type": "Article",
  ...
}

ONLY JSON-LD.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Optimize images for SEO
   */
  async optimizeImages(
    images: Array<{ src: string; alt?: string }>,
    targetKeyword: string,
    contentContext: string
  ): Promise<Array<{ src: string; alt: string; title: string; filename: string }>> {
    const prompt = `
Generate SEO-optimized image attributes:

Target Keyword: "${targetKeyword}"
Content Context: "${contentContext.substring(0, 200)}"

Images:
${images.map((img, i) => `${i + 1}. ${img.src} (alt: "${img.alt || 'none'}")`).join('\n')}

For each image, generate:
1. Descriptive alt text (include keyword where relevant)
2. Title attribute
3. Optimized filename (keyword-rich, lowercase, hyphens)

Return ONLY valid JSON array:
[
  {
    "src": "original-src.jpg",
    "alt": "Descriptive alt text with keyword",
    "title": "Image title",
    "filename": "keyword-rich-filename.jpg"
  }
]

ONLY JSON array.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Suggest internal links
   */
  async suggestInternalLinks(
    content: string,
    targetKeyword: string,
    existingPages: Array<{ url: string; title: string; keywords: string[] }>
  ): Promise<Array<{ anchorText: string; url: string; position: string; relevance: number }>> {
    const prompt = `
Suggest internal links for this content:

Target Keyword: "${targetKeyword}"

Content (first 500 chars):
"${content.substring(0, 500)}"

Existing Pages:
${existingPages.map(p => `- ${p.title} (${p.url}): ${p.keywords.join(', ')}`).join('\n')}

Suggest 3-5 internal links with:
1. Natural anchor text (not "click here")
2. Most relevant existing page URL
3. Where to place (which paragraph/section)
4. Relevance score (0-100)

Return ONLY valid JSON array:
[
  {
    "anchorText": "natural anchor text",
    "url": "/existing-page-url",
    "position": "In paragraph about X, after sentence Y",
    "relevance": 95
  }
]

ONLY JSON array.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Check content for keyword cannibalization
   */
  async checkKeywordCannibalization(
    targetKeyword: string,
    existingPages: Array<{ url: string; title: string; targetKeyword: string }>
  ): Promise<{
    hasConflict: boolean;
    conflictingPages: string[];
    recommendation: string;
  }> {
    const similarPages = existingPages.filter(
      page => page.targetKeyword.toLowerCase().includes(targetKeyword.toLowerCase()) ||
              targetKeyword.toLowerCase().includes(page.targetKeyword.toLowerCase())
    );

    if (similarPages.length === 0) {
      return {
        hasConflict: false,
        conflictingPages: [],
        recommendation: 'No keyword cannibalization detected. Proceed with this keyword.',
      };
    }

    const prompt = `
Check for keyword cannibalization:

Target Keyword: "${targetKeyword}"

Similar Existing Pages:
${similarPages.map(p => `- ${p.title} (${p.url}): "${p.targetKeyword}"`).join('\n')}

Determine:
1. Is there actual cannibalization? (true/false)
2. Which pages conflict?
3. Recommendation to fix

Return ONLY valid JSON:
{
  "hasConflict": true,
  "conflictingPages": ["url1", "url2"],
  "recommendation": "Specific recommendation to resolve conflict"
}

ONLY JSON.
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseAIResponse(text);
  }

  /**
   * Generate list of improvements made
   */
  private generateChangesList(
    before: OnPageSEOAnalysis,
    after: OnPageSEOAnalysis
  ): string[] {
    const changes: string[] = [];

    const elements = [
      'title',
      'metaDescription',
      'headings',
      'content',
      'keywordUsage',
      'readability',
    ];

    for (const element of elements) {
      const beforeScore = (before as any)[element]?.score || 0;
      const afterScore = (after as any)[element]?.score || 0;
      
      if (afterScore > beforeScore) {
        const improvement = afterScore - beforeScore;
        changes.push(
          `${element.charAt(0).toUpperCase() + element.slice(1)} improved by ${improvement} points`
        );
      }
    }

    if (after.overallScore > before.overallScore) {
      changes.unshift(
        `Overall SEO score increased from ${before.overallScore} to ${after.overallScore}`
      );
    }

    return changes;
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
export const onPageOptimizer = new OnPageSEOOptimizer();
