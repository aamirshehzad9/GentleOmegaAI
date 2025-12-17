import { HfInference } from '@huggingface/inference';

// Rotate through multiple API keys for rate limit management
const API_KEYS = [
    import.meta.env.VITE_HF_API_KEY || '',
    // Add more keys from .env.local if needed
].filter(Boolean);

export interface ClassificationResult {
    label: string;
    score: number;
}

export interface SentimentResult {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
}

export class HuggingFaceService {
    private currentKeyIndex = 0;
    private hf: HfInference;
    private requestCount = 0;
    private readonly MAX_REQUESTS_PER_KEY = 100; // Conservative limit

    constructor() {
        if (API_KEYS.length === 0) {
            throw new Error('No HuggingFace API keys configured');
        }
        this.hf = new HfInference(API_KEYS[0]);
    }

    /**
     * Rotate to next API key
     */
    private rotateKey(): void {
        this.currentKeyIndex = (this.currentKeyIndex + 1) % API_KEYS.length;
        this.hf = new HfInference(API_KEYS[this.currentKeyIndex]);
        this.requestCount = 0;
        console.log(`Rotated to HuggingFace API key ${this.currentKeyIndex + 1}/${API_KEYS.length}`);
    }

    /**
     * Check if we should rotate keys proactively
     */
    private checkRotation(): void {
        this.requestCount++;
        if (this.requestCount >= this.MAX_REQUESTS_PER_KEY) {
            this.rotateKey();
        }
    }

    /**
     * Classify content into categories
     */
    async classifyContent(text: string): Promise<ClassificationResult[]> {
        this.checkRotation();

        try {
            const result = await this.hf.textClassification({
                model: 'facebook/bart-large-mnli',
                inputs: text.substring(0, 1000), // Limit input size
            });

            return Array.isArray(result) ? result : [result];
        } catch (error: any) {
            if (error.message?.includes('rate limit') || error.message?.includes('429')) {
                console.warn('Rate limit hit, rotating key...');
                this.rotateKey();
                return this.classifyContent(text); // Retry with new key
            }
            throw error;
        }
    }

    /**
     * Analyze sentiment of text
     */
    async analyzeSentiment(text: string): Promise<SentimentResult> {
        this.checkRotation();

        try {
            const result = await this.hf.textClassification({
                model: 'distilbert-base-uncased-finetuned-sst-2-english',
                inputs: text.substring(0, 512), // Model limit
            });

            const classification = Array.isArray(result) ? result[0] : result;

            return {
                sentiment: classification.label.toUpperCase() as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
                score: classification.score,
            };
        } catch (error: any) {
            if (error.message?.includes('rate limit') || error.message?.includes('429')) {
                console.warn('Rate limit hit, rotating key...');
                this.rotateKey();
                return this.analyzeSentiment(text);
            }
            throw error;
        }
    }

    /**
     * Summarize content
     */
    async summarizeContent(text: string, maxLength: number = 150): Promise<string> {
        this.checkRotation();

        try {
            const result = await this.hf.summarization({
                model: 'facebook/bart-large-cnn',
                inputs: text.substring(0, 1024), // Model limit
                parameters: {
                    max_length: maxLength,
                    min_length: Math.floor(maxLength / 3),
                },
            });

            return result.summary_text;
        } catch (error: any) {
            if (error.message?.includes('rate limit') || error.message?.includes('429')) {
                console.warn('Rate limit hit, rotating key...');
                this.rotateKey();
                return this.summarizeContent(text, maxLength);
            }
            throw error;
        }
    }

    /**
     * Extract keywords from text using zero-shot classification
     */
    async extractKeywords(text: string, candidateLabels: string[]): Promise<ClassificationResult[]> {
        this.checkRotation();

        try {
            const result = await this.hf.zeroShotClassification({
                model: 'facebook/bart-large-mnli',
                inputs: text.substring(0, 1000),
                parameters: {
                    candidate_labels: candidateLabels,
                },
            });

            // Map to ClassificationResult format
            return result.labels.map((label, index) => ({
                label,
                score: result.scores[index],
            }));
        } catch (error: any) {
            if (error.message?.includes('rate limit') || error.message?.includes('429')) {
                console.warn('Rate limit hit, rotating key...');
                this.rotateKey();
                return this.extractKeywords(text, candidateLabels);
            }
            throw error;
        }
    }

    /**
     * Test API connection
     */
    async testConnection(): Promise<boolean> {
        try {
            await this.analyzeSentiment('This is a test.');
            return true;
        } catch (error) {
            console.error('HuggingFace connection test failed:', error);
            return false;
        }
    }

    /**
     * Get current API key status
     */
    getStatus(): { currentKey: number; totalKeys: number; requestCount: number } {
        return {
            currentKey: this.currentKeyIndex + 1,
            totalKeys: API_KEYS.length,
            requestCount: this.requestCount,
        };
    }
}

export const huggingFaceService = new HuggingFaceService();
