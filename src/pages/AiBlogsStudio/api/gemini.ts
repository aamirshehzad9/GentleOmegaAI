/**
 * Google Gemini AI Service
 * Handles all AI content generation for AI Blogs Studio
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey, GEMINI_CONFIG } from '@/src/config/gemini.config';

// Initialize Gemini AI with proper configuration
const API_KEY = getGeminiApiKey();
const genAI = new GoogleGenerativeAI(API_KEY);

// Models configuration
const MODELS = {
  PRO: GEMINI_CONFIG.model,
  PRO_VISION: GEMINI_CONFIG.modelVision,
};

/**
 * Generate blog content from prompt
 */
export async function generateBlogContent(prompt: string, options?: {
  tone?: 'professional' | 'casual' | 'technical' | 'creative';
  wordCount?: number;
  model?: keyof typeof MODELS;
}): Promise<{
  success: boolean;
  content: string;
  error?: string;
  tokensUsed?: number;
}> {
  if (!API_KEY) {
    return {
      success: false,
      content: '',
      error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: MODELS[options?.model || 'PRO'] 
    });

    const wordCount = options?.wordCount || 2000;
    const tone = options?.tone || 'professional';

    // Enhanced prompt with context
    const enhancedPrompt = `
You are a professional content writer for AI Blogs Studio. Generate high-quality blog content based on the following requirements:

**Topic/Instructions**: ${prompt}

**Requirements**:
- Word count: Approximately ${wordCount} words
- Tone: ${tone}
- Format: Well-structured with clear headings (use ## for main headings, ### for subheadings)
- Include an engaging introduction paragraph
- Use bullet points or numbered lists where appropriate
- Add a compelling conclusion
- Write in a ${tone === 'technical' ? 'detailed, informative' : 'engaging, reader-friendly'} style
- Optimize for SEO with natural keyword placement
- Make it original and plagiarism-free

Please generate the content now:
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const content = response.text();

    // Calculate approximate tokens (rough estimate: 1 token ≈ 4 characters)
    const tokensUsed = Math.ceil((enhancedPrompt.length + content.length) / 4);

    return {
      success: true,
      content: content.trim(),
      tokensUsed,
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      content: '',
      error: error.message || 'Failed to generate content. Please try again.',
    };
  }
}

/**
 * Improve existing content
 */
export async function improveContent(content: string, improvements: string[]): Promise<{
  success: boolean;
  content: string;
  error?: string;
}> {
  if (!API_KEY) {
    return {
      success: false,
      content: '',
      error: 'Gemini API key not configured.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `
You are an expert content editor. Please improve the following blog content based on these specific improvements:

${improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

**Original Content**:
${content}

**Instructions**:
- Apply only the requested improvements
- Maintain the original structure and key points
- Keep the same tone and style
- Preserve any existing headings and formatting
- Return the improved version

Please provide the improved content now:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedContent = response.text();

    return {
      success: true,
      content: improvedContent.trim(),
    };
  } catch (error: any) {
    console.error('Content improvement error:', error);
    return {
      success: false,
      content: '',
      error: error.message || 'Failed to improve content.',
    };
  }
}

/**
 * Generate SEO metadata (title, description, keywords)
 */
export async function generateSEOMetadata(content: string): Promise<{
  success: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  error?: string;
}> {
  if (!API_KEY) {
    return {
      success: false,
      seoTitle: '',
      seoDescription: '',
      keywords: [],
      error: 'Gemini API key not configured.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `
Analyze this blog content and generate SEO metadata:

**Content**:
${content.substring(0, 2000)}... (truncated)

**Generate**:
1. SEO Title (50-60 characters, compelling, keyword-rich)
2. Meta Description (150-160 characters, engaging, includes primary keyword)
3. Keywords (5-10 relevant keywords/phrases)

**Format your response EXACTLY like this**:
TITLE: [Your SEO title here]
DESCRIPTION: [Your meta description here]
KEYWORDS: keyword1, keyword2, keyword3, keyword4, keyword5
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse response
    const titleMatch = text.match(/TITLE:\s*(.+?)(?:\n|$)/i);
    const descMatch = text.match(/DESCRIPTION:\s*(.+?)(?:\n|KEYWORDS)/is);
    const keywordsMatch = text.match(/KEYWORDS:\s*(.+?)(?:\n|$)/i);

    const seoTitle = titleMatch ? titleMatch[1].trim() : '';
    const seoDescription = descMatch ? descMatch[1].trim().replace(/\n/g, ' ') : '';
    const keywords = keywordsMatch 
      ? keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k.length > 0)
      : [];

    return {
      success: true,
      seoTitle,
      seoDescription,
      keywords,
    };
  } catch (error: any) {
    console.error('SEO generation error:', error);
    return {
      success: false,
      seoTitle: '',
      seoDescription: '',
      keywords: [],
      error: error.message || 'Failed to generate SEO metadata.',
    };
  }
}

/**
 * Generate blog topic ideas
 */
export async function generateTopicIdeas(niche: string, count: number = 10): Promise<{
  success: boolean;
  topics: string[];
  error?: string;
}> {
  if (!API_KEY) {
    return {
      success: false,
      topics: [],
      error: 'Gemini API key not configured.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `
Generate ${count} engaging blog topic ideas for the "${niche}" niche.

**Requirements**:
- Topics should be trending and relevant in 2025
- Each topic should be specific and actionable
- Mix of different content types (how-to, listicles, guides, analysis)
- SEO-friendly and searchable
- Suitable for 2000-5000 word articles

**Format**: Return one topic per line, numbered 1-${count}

Generate the topics now:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse topics (remove numbering)
    const topics = text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(topic => topic.length > 0)
      .slice(0, count);

    return {
      success: true,
      topics,
    };
  } catch (error: any) {
    console.error('Topic generation error:', error);
    return {
      success: false,
      topics: [],
      error: error.message || 'Failed to generate topics.',
    };
  }
}

/**
 * Expand outline into full content
 */
export async function expandOutline(outline: string): Promise<{
  success: boolean;
  content: string;
  error?: string;
}> {
  if (!API_KEY) {
    return {
      success: false,
      content: '',
      error: 'Gemini API key not configured.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `
You are a professional content writer. Expand this outline into a full, comprehensive blog article:

**Outline**:
${outline}

**Requirements**:
- Each section should be 200-400 words
- Use clear headings (## for main sections, ### for subsections)
- Write in an engaging, professional tone
- Include examples and practical insights
- Add transitions between sections
- Make it flow naturally
- Total length: 2000-3000 words

Generate the full article now:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return {
      success: true,
      content: content.trim(),
    };
  } catch (error: any) {
    console.error('Outline expansion error:', error);
    return {
      success: false,
      content: '',
      error: error.message || 'Failed to expand outline.',
    };
  }
}

/**
 * Generate image prompt for DALL-E based on content
 */
export async function generateImagePrompt(content: string): Promise<{
  success: boolean;
  prompt: string;
  error?: string;
}> {
  if (!API_KEY) {
    return {
      success: false,
      prompt: '',
      error: 'Gemini API key not configured.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `
Analyze this blog content and create a detailed image generation prompt for DALL-E:

**Content**:
${content.substring(0, 1000)}...

**Generate a DALL-E prompt that**:
- Captures the main theme visually
- Is descriptive and specific
- Uses professional photography/illustration style
- Avoids text in the image
- Is suitable for a blog featured image
- Maximum 400 characters

Return ONLY the image prompt, nothing else:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const imagePrompt = response.text().trim();

    return {
      success: true,
      prompt: imagePrompt,
    };
  } catch (error: any) {
    console.error('Image prompt generation error:', error);
    return {
      success: false,
      prompt: '',
      error: error.message || 'Failed to generate image prompt.',
    };
  }
}

/**
 * Check if API key is configured
 */
export function isGeminiConfigured(): boolean {
  return API_KEY.length > 0;
}

/**
 * Get API usage stats (rough estimate)
 */
export function getUsageEstimate(text: string): {
  tokens: number;
  cost: number; // USD (Gemini Pro is free up to rate limits)
} {
  const tokens = Math.ceil(text.length / 4);
  const cost = 0; // Free tier
  
  return { tokens, cost };
}
