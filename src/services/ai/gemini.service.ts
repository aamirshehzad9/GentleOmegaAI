import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface NicheDiscoveryInput {
    industry: string;
    targetAudience: string;
    language: string;
    location?: string;
}

export interface NicheDiscoveryOutput {
    suggestedNiches: string[];
    keywords: string[];
    targetDomains: string[];
    confidence: number;
    reasoning: string;
}

export interface ContentAnalysisOutput {
    quality: number; // 0-100
    category: string;
    guestPostLikelihood: number; // 0-100
    sentiment: 'positive' | 'neutral' | 'negative';
    keyTopics: string[];
    recommendedAction: 'approve' | 'review' | 'reject';
}

export class GeminiService {
    private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    /**
     * Discover niches for guest posting based on business profile
     */
    async discoverNiches(input: NicheDiscoveryInput): Promise<NicheDiscoveryOutput> {
        const prompt = `
You are an expert SEO and guest blogging strategist. Analyze the following business profile and suggest the best niches for guest posting opportunities.

Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Language: ${input.language}
Location: ${input.location || 'Global'}

Provide:
1. 5-10 specific niche topics that would be perfect for guest posting
2. 10-15 relevant keywords for finding guest post opportunities
3. 5-10 high-authority domains in these niches (actual website names like techcrunch.com)
4. Confidence score (0.0 to 1.0) for these recommendations
5. Brief reasoning for your suggestions

Format your response as JSON:
{
  "suggestedNiches": ["niche1", "niche2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "targetDomains": ["domain1.com", "domain2.com", ...],
  "confidence": 0.95,
  "reasoning": "Brief explanation of why these niches are suitable"
}
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from Gemini');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Validate response structure
            if (!parsed.suggestedNiches || !parsed.keywords || !parsed.targetDomains) {
                throw new Error('Incomplete response from Gemini');
            }

            return parsed as NicheDiscoveryOutput;
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error(`Gemini niche discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Analyze website content for guest posting suitability
     */
    async analyzeContent(url: string, content: string): Promise<ContentAnalysisOutput> {
        const prompt = `
Analyze this website content for guest posting suitability:

URL: ${url}
Content (first 2000 chars): ${content.substring(0, 2000)}

Provide:
1. Content quality score (0-100)
2. Primary category/niche
3. Guest posting likelihood score (0-100) - how likely they accept guest posts
4. Sentiment (positive/neutral/negative)
5. Key topics covered
6. Recommended action (approve/review/reject)

Format as JSON:
{
  "quality": 85,
  "category": "Technology",
  "guestPostLikelihood": 75,
  "sentiment": "positive",
  "keyTopics": ["AI", "Machine Learning", "Tech News"],
  "recommendedAction": "approve"
}
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from Gemini');
            }

            return JSON.parse(jsonMatch[0]) as ContentAnalysisOutput;
        } catch (error) {
            console.error('Gemini content analysis error:', error);
            throw new Error(`Gemini content analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate search queries for finding guest post opportunities
     */
    async generateSearchQueries(niche: string, keywords: string[]): Promise<string[]> {
        const prompt = `
Generate 10-15 effective Google search queries to find guest posting opportunities in the "${niche}" niche.

Use these keywords: ${keywords.join(', ')}

Common patterns to include:
- "write for us"
- "guest post guidelines"
- "contribute"
- "submit article"
- "become a contributor"

Format as JSON array:
["query1", "query2", ...]
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from Gemini');
            }

            return JSON.parse(jsonMatch[0]) as string[];
        } catch (error) {
            console.error('Gemini search query generation error:', error);
            throw new Error(`Gemini query generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Test API connection
     */
    async testConnection(): Promise<boolean> {
        try {
            const result = await this.model.generateContent('Say "Hello" if you can read this.');
            const response = await result.response;
            const text = response.text();
            return text.toLowerCase().includes('hello');
        } catch (error) {
            console.error('Gemini connection test failed:', error);
            return false;
        }
    }
}

export const geminiService = new GeminiService();
