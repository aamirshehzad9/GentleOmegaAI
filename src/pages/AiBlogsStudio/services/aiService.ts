/**
 * AI BLOGS STUDIO - GOOGLE GEMINI AI SERVICE
 * Handles content generation, SEO optimization, and AI features
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from '@/src/config/gemini.config';

const GEMINI_API_KEY = getGeminiApiKey();

if (!GEMINI_API_KEY) {
  console.error('❌ Gemini API Key not configured');
  throw new Error('Gemini API Key is required for AI Blogs Studio');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ============================================
// CONTENT GENERATION
// ============================================

export interface GenerateBlogRequest {
  topic: string;
  niche: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'technical' | 'creative';
  length?: 'short' | 'medium' | 'long'; // 500, 2000, 5000 words
  targetAudience?: string;
}

export interface GenerateBlogResponse {
  title: string;
  content: string; // Markdown format
  excerpt: string;
  tags: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  tokensUsed: number;
  estimatedCost: number;
  qualityScore: number;
}

export async function generateBlogContent(
  request: GenerateBlogRequest
): Promise<GenerateBlogResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const wordCount = request.length === 'short' ? 500 : request.length === 'medium' ? 2000 : 5000;
    const tone = request.tone || 'professional';

    const prompt = `You are an expert content writer for AI Blogs Studio, a premium blogging platform.

TASK: Write a comprehensive, SEO-optimized blog article.

TOPIC: ${request.topic}
NICHE: ${request.niche}
TARGET LENGTH: ${wordCount} words
TONE: ${tone}
${request.keywords ? `TARGET KEYWORDS: ${request.keywords.join(', ')}` : ''}
${request.targetAudience ? `TARGET AUDIENCE: ${request.targetAudience}` : ''}

REQUIREMENTS:
1. Create a compelling, click-worthy title (60-70 characters)
2. Write a captivating excerpt (150-160 characters)
3. Structure with clear H2 and H3 headings
4. Include actionable insights and data when relevant
5. Write in ${tone} tone
6. Naturally incorporate keywords (if provided)
7. Make it engaging, informative, and valuable
8. Use markdown formatting (headings, bold, lists, quotes)
9. Include a strong conclusion with CTA

OUTPUT FORMAT (JSON):
{
  "title": "Blog Title Here",
  "content": "Full blog content in markdown...",
  "excerpt": "Compelling excerpt...",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "metaTitle": "SEO-optimized meta title",
  "metaDescription": "SEO-optimized meta description",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Generate the blog now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Calculate metrics
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0;
    const estimatedCost = (tokensUsed / 1000) * 0.00025; // Gemini pricing
    const qualityScore = calculateQualityScore(parsed.content);

    return {
      title: parsed.title,
      content: parsed.content,
      excerpt: parsed.excerpt,
      tags: parsed.tags,
      seo: {
        metaTitle: parsed.metaTitle,
        metaDescription: parsed.metaDescription,
        keywords: parsed.keywords,
      },
      tokensUsed,
      estimatedCost,
      qualityScore,
    };
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw new Error('Failed to generate blog content. Please try again.');
  }
}

// ============================================
// CONTENT IMPROVEMENT
// ============================================

export async function improveBlogContent(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert content editor for AI Blogs Studio.

TASK: Improve the following blog content while preserving the original meaning and structure.

IMPROVEMENTS NEEDED:
1. Fix grammar and spelling errors
2. Improve readability (shorter sentences, active voice)
3. Enhance flow and transitions
4. Strengthen headlines and subheadings
5. Add compelling hooks and CTAs
6. Maintain markdown formatting

ORIGINAL CONTENT:
${content}

Return ONLY the improved content (no explanations):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ Content Improvement Error:', error);
    throw new Error('Failed to improve content');
  }
}

// ============================================
// SEO OPTIMIZATION
// ============================================

export async function optimizeForSEO(content: string, targetKeywords: string[]): Promise<{
  optimizedContent: string;
  seoScore: number;
  suggestions: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an SEO expert for AI Blogs Studio.

TASK: Optimize the following blog content for SEO.

TARGET KEYWORDS: ${targetKeywords.join(', ')}

CONTENT:
${content}

OPTIMIZATION TASKS:
1. Naturally incorporate target keywords (2-3% density)
2. Optimize headings with keywords
3. Add LSI keywords (related terms)
4. Improve internal linking opportunities
5. Enhance readability (Flesch score > 60)
6. Add schema markup suggestions

OUTPUT FORMAT (JSON):
{
  "optimizedContent": "SEO-optimized content...",
  "seoScore": 85,
  "suggestions": ["Suggestion 1", "Suggestion 2", ...]
}

Optimize now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse SEO response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ SEO Optimization Error:', error);
    throw new Error('Failed to optimize content');
  }
}

// ============================================
// TOPIC GENERATION
// ============================================

export async function generateTopicIdeas(
  niche: string,
  count: number = 10
): Promise<Array<{ title: string; description: string; keywords: string[] }>> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a content strategist for AI Blogs Studio.

TASK: Generate ${count} trending, high-potential blog topic ideas for the "${niche}" niche.

REQUIREMENTS:
1. Topics should be timely, relevant, and searchable
2. Include a brief description for each topic
3. Provide 3-5 target keywords per topic
4. Focus on topics with earning potential (ads, affiliates)

OUTPUT FORMAT (JSON Array):
[
  {
    "title": "Topic Title",
    "description": "Brief description...",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  ...
]

Generate ${count} topic ideas now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse topics response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ Topic Generation Error:', error);
    throw new Error('Failed to generate topic ideas');
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function calculateQualityScore(content: string): number {
  let score = 50; // Base score

  // Length check (longer = better, up to a point)
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 500) score += 10;
  if (wordCount > 1500) score += 10;
  if (wordCount > 3000) score += 10;

  // Structure check
  if (content.includes('##')) score += 5; // Has H2 headings
  if (content.includes('###')) score += 5; // Has H3 headings
  if (content.includes('-') || content.includes('*')) score += 5; // Has lists

  // Formatting check
  if (content.includes('**')) score += 5; // Has bold text
  if (content.includes('`')) score += 5; // Has code or emphasis

  return Math.min(score, 100);
}

export function estimateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / 200); // 200 words per minute
}

export function extractKeywords(content: string, count: number = 10): string[] {
  // Simple keyword extraction (can be enhanced with NLP)
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4); // Filter short words

  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}
