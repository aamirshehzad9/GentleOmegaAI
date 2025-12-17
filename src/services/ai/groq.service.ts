import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Required for frontend use
});

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
    quality: number;
    category: string;
    guestPostLikelihood: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyTopics: string[];
    recommendedAction: 'approve' | 'review' | 'reject';
}

export class GroqService {
    private requestCount = 0;
    private lastRequestTime = 0;
    private readonly MIN_REQUEST_INTERVAL = 100; // 100ms between requests (Groq is fast!)

    /**
     * Rate limiting
     */
    private async waitForRateLimit(): Promise<void> {
        this.requestCount++;
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
            const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        this.lastRequestTime = Date.now();
    }

    /**
     * Discover niches using Groq's Llama 3.1 70B model
     */
    async discoverNiches(input: NicheDiscoveryInput): Promise<NicheDiscoveryOutput> {
        await this.waitForRateLimit();

        const prompt = `You are an expert SEO and guest blogging strategist. Analyze the following business profile and suggest the best niches for guest posting opportunities.

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

IMPORTANT: Respond ONLY with valid JSON, no markdown formatting:
{
  "suggestedNiches": ["niche1", "niche2"],
  "keywords": ["keyword1", "keyword2"],
  "targetDomains": ["domain1.com", "domain2.com"],
  "confidence": 0.95,
  "reasoning": "Brief explanation"
}`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert SEO strategist. Always respond with valid JSON only, no markdown."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "llama-3.3-70b-versatile", // Latest Llama 3.3 70B model (Dec 2024)
                temperature: 0.7,
                max_tokens: 2000,
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from Groq');
            }

            return JSON.parse(response) as NicheDiscoveryOutput;
        } catch (error) {
            console.error('Groq niche discovery error:', error);
            throw new Error(`Groq failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Analyze content for guest posting suitability
     */
    async analyzeContent(url: string, content: string): Promise<ContentAnalysisOutput> {
        await this.waitForRateLimit();

        const prompt = `Analyze this website content for guest posting suitability:

URL: ${url}
Content (first 2000 chars): ${content.substring(0, 2000)}

Provide:
1. Content quality score (0-100)
2. Primary category/niche
3. Guest posting likelihood score (0-100)
4. Sentiment (positive/neutral/negative)
5. Key topics covered
6. Recommended action (approve/review/reject)

Respond ONLY with valid JSON:
{
  "quality": 85,
  "category": "Technology",
  "guestPostLikelihood": 75,
  "sentiment": "positive",
  "keyTopics": ["AI", "Tech"],
  "recommendedAction": "approve"
}`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a content analyst. Respond with valid JSON only." },
                    { role: "user", content: prompt }
                ],
                model: "llama-3.1-70b-versatile",
                temperature: 0.5,
                max_tokens: 1000,
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from Groq');
            }

            return JSON.parse(response) as ContentAnalysisOutput;
        } catch (error) {
            console.error('Groq content analysis error:', error);
            throw new Error(`Groq failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate search queries
     */
    async generateSearchQueries(niche: string, keywords: string[]): Promise<string[]> {
        await this.waitForRateLimit();

        const prompt = `Generate 10-15 effective Google search queries to find guest posting opportunities in the "${niche}" niche.

Use these keywords: ${keywords.join(', ')}

Common patterns:
- "write for us"
- "guest post guidelines"
- "contribute"
- "submit article"

Respond with JSON array only:
["query1", "query2", ...]`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "Respond with valid JSON array only." },
                    { role: "user", content: prompt }
                ],
                model: "llama-3.1-8b-instant", // Fast 8B model for simple tasks
                temperature: 0.8,
                max_tokens: 500,
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from Groq');
            }

            const parsed = JSON.parse(response);
            return parsed.queries || parsed;
        } catch (error) {
            console.error('Groq search query error:', error);
            throw new Error(`Groq failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Test connection
     */
    async testConnection(): Promise<boolean> {
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "user", content: 'Say "Hello" if you can read this.' }
                ],
                model: "llama-3.1-8b-instant",
                max_tokens: 50
            });

            const response = completion.choices[0]?.message?.content;
            return response?.toLowerCase().includes('hello') || false;
        } catch (error) {
            console.error('Groq connection test failed:', error);
            return false;
        }
    }

    /**
     * Get service status
     */
    getStatus(): { service: string; requestCount: number; model: string } {
        return {
            service: 'Groq',
            requestCount: this.requestCount,
            model: 'llama-3.1-70b-versatile'
        };
    }
}

export const groqService = new GroqService();
