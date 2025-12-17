import { groqService } from './ai/groq.service';

export interface URLDiscoveryResult {
    urls: string[];
    niche: string;
    keywords: string[];
    searchQueries: string[];
    estimatedOpportunities: number;
}

export class URLDiscoveryService {
    /**
     * Discover URLs for guest posting opportunities
     * Uses Google Custom Search API if available, otherwise returns sample data
     */
    async discoverURLs(niche: string, keywords: string[]): Promise<string[]> {
        // Generate search queries using Groq
        const searchQueries = await groqService.generateSearchQueries(niche, keywords);

        // For now, return sample URLs since we don't have Google Custom Search API configured
        // TODO: Integrate Google Custom Search API when available
        const sampleUrls = this.generateSampleURLs(niche, searchQueries.slice(0, 5));

        return sampleUrls;
    }

    /**
     * Generate sample URLs based on niche and queries
     * This is a placeholder until Google Custom Search API is integrated
     */
    private generateSampleURLs(niche: string, queries: string[]): string[] {
        // Common high-authority domains that accept guest posts
        const domains = [
            'medium.com',
            'dev.to',
            'hashnode.com',
            'hackernoon.com',
            'freecodecamp.org',
            'smashingmagazine.com',
            'css-tricks.com',
            'sitepoint.com',
            'webdesignerdepot.com',
            'designmodo.com',
        ];

        // Generate URLs based on niche
        return domains.map(domain => {
            const nicheSlug = niche.toLowerCase().replace(/\s+/g, '-');
            return `https://${domain}/write-for-us/${nicheSlug}`;
        });
    }

    /**
     * Generate CSV from discovered URLs
     */
    async generateCSV(urls: string[], niche: string): Promise<string> {
        const header = 'URL,Niche,Status,Estimated DA,Spam Score,Last Checked\n';
        const timestamp = new Date().toISOString();

        const rows = urls.map(url => {
            // Extract domain for DA estimation
            const domain = new URL(url).hostname;
            const estimatedDA = this.estimateDA(domain);

            return `${url},${niche},Pending,${estimatedDA},Unknown,${timestamp}`;
        }).join('\n');

        return header + rows;
    }

    /**
     * Estimate Domain Authority based on known domains
     * This is a rough estimation - real DA would come from Moz API
     */
    private estimateDA(domain: string): number {
        const highAuthority = ['medium.com', 'dev.to', 'freecodecamp.org', 'smashingmagazine.com'];
        const mediumAuthority = ['hashnode.com', 'hackernoon.com', 'css-tricks.com'];

        if (highAuthority.some(d => domain.includes(d))) return 85;
        if (mediumAuthority.some(d => domain.includes(d))) return 65;
        return 50; // Default
    }

    /**
     * Discover opportunities with full workflow
     */
    async discoverOpportunities(
        niche: string,
        keywords: string[]
    ): Promise<URLDiscoveryResult> {
        // Generate search queries using Groq
        const searchQueries = await groqService.generateSearchQueries(niche, keywords);

        // Discover URLs
        const urls = await this.discoverURLs(niche, keywords);

        return {
            urls,
            niche,
            keywords,
            searchQueries,
            estimatedOpportunities: urls.length,
        };
    }
}

export const urlDiscoveryService = new URLDiscoveryService();
