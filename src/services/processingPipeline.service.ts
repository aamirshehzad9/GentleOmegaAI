import { approvalQueueService } from './approvalQueue.service';
import { groqService } from './ai/groq.service';
import { huggingFaceService } from './ai/huggingface.service';
import { urlDiscoveryService } from './urlDiscovery.service';
import type {
    ProcessingResult,
    ProcessingStatus,
    URLAnalysis
} from '../types/aiSuggestion.types';
import { Timestamp } from 'firebase/firestore';

export class ProcessingPipelineService {
    /**
     * Process an approved suggestion end-to-end
     */
    async processSuggestion(suggestionId: string): Promise<ProcessingResult> {
        const startTime = Date.now();

        try {
            // Update status to processing
            await approvalQueueService.updateStatus(suggestionId, 'processing');
            await approvalQueueService.updateProgress(suggestionId, 10, 'Starting processing...');

            // Get the suggestion
            const suggestion = await approvalQueueService.getSuggestionById(suggestionId);
            if (!suggestion) {
                throw new Error('Suggestion not found');
            }

            // Step 1: Generate search queries (20%)
            await approvalQueueService.updateProgress(suggestionId, 20, 'Generating search queries...');
            const searchQueries = await groqService.generateSearchQueries(
                suggestion.output.suggestedNiches[0],
                suggestion.output.keywords
            );

            // Step 2: Discover URLs (40%)
            await approvalQueueService.updateProgress(suggestionId, 40, 'Discovering URLs...');
            const urls = await urlDiscoveryService.discoverURLs(
                suggestion.output.suggestedNiches[0],
                suggestion.output.keywords
            );

            // Step 3: Analyze URLs (60-90%)
            const urlAnalyses: URLAnalysis[] = [];
            let successCount = 0;
            let failureCount = 0;

            for (let i = 0; i < urls.length; i++) {
                const progress = 60 + Math.floor((i / urls.length) * 30);
                await approvalQueueService.updateProgress(
                    suggestionId,
                    progress,
                    `Analyzing URL ${i + 1}/${urls.length}...`
                );

                try {
                    // Simulate content fetching (in real implementation, you'd fetch actual content)
                    const mockContent = `Sample content for ${urls[i]}`;

                    // Analyze with HuggingFace
                    const sentiment = await huggingFaceService.analyzeSentiment(mockContent);
                    const classification = await huggingFaceService.classifyContent(mockContent);

                    urlAnalyses.push({
                        url: urls[i],
                        status: 'success',
                        quality: Math.floor(Math.random() * 30) + 70, // Mock quality score
                        category: classification[0]?.label || 'Unknown',
                        guestPostLikelihood: Math.floor(Math.random() * 40) + 60,
                        sentiment: sentiment.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative',
                        keyTopics: classification.slice(0, 3).map(c => c.label),
                        recommendedAction: sentiment.score > 0.7 ? 'approve' : 'review',
                        analyzedAt: new Date()
                    });

                    successCount++;
                } catch (error) {
                    urlAnalyses.push({
                        url: urls[i],
                        status: 'failed',
                        error: error instanceof Error ? error.message : 'Analysis failed',
                        analyzedAt: new Date()
                    });
                    failureCount++;
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Step 4: Store results (95%)
            await approvalQueueService.updateProgress(suggestionId, 95, 'Storing results...');
            await this.storeResults(suggestionId, urls, urlAnalyses, successCount, failureCount);

            // Step 5: Complete (100%)
            await approvalQueueService.updateProgress(suggestionId, 100, 'Processing complete!');
            await approvalQueueService.updateStatus(suggestionId, 'completed');

            const processingTime = Date.now() - startTime;

            return {
                success: true,
                suggestionId,
                urlsDiscovered: urls.length,
                urlsAnalyzed: urlAnalyses.length,
                successfulAnalyses: successCount,
                failedAnalyses: failureCount,
                processingTime
            };

        } catch (error) {
            console.error('Processing pipeline error:', error);

            // Update status to failed
            await approvalQueueService.updateStatus(suggestionId, 'failed');

            return {
                success: false,
                suggestionId,
                urlsDiscovered: 0,
                urlsAnalyzed: 0,
                successfulAnalyses: 0,
                failedAnalyses: 0,
                processingTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Store processing results in Firestore
     */
    private async storeResults(
        suggestionId: string,
        urls: string[],
        analyses: URLAnalysis[],
        successCount: number,
        failureCount: number
    ): Promise<void> {
        try {
            const suggestion = await approvalQueueService.getSuggestionById(suggestionId);
            if (!suggestion) {
                throw new Error('Suggestion not found');
            }

            // Import Firestore functions
            const { doc, updateDoc } = await import('firebase/firestore');
            const { db } = await import('../../firebase/config');

            // Update the suggestion document with results
            const docRef = doc(db, 'aiSuggestions', suggestionId);

            await updateDoc(docRef, {
                discoveredURLs: urls,
                urlAnalyses: analyses,
                processedCount: analyses.length,
                successCount,
                failureCount,
                processingCompletedAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            console.log(`Stored results for suggestion: ${suggestionId}`);
        } catch (error) {
            console.error('Error storing results:', error);
            throw error;
        }
    }

    /**
     * Get processing status
     */
    async getProcessingStatus(suggestionId: string): Promise<ProcessingStatus | null> {
        try {
            const suggestion = await approvalQueueService.getSuggestionById(suggestionId);
            if (!suggestion) {
                return null;
            }

            return {
                status: suggestion.status,
                progress: suggestion.processingProgress || 0,
                currentStep: this.getCurrentStep(suggestion.processingProgress || 0),
                startedAt: suggestion.processingStartedAt?.toDate(),
                error: suggestion.processingError
            };
        } catch (error) {
            console.error('Error getting processing status:', error);
            return null;
        }
    }

    /**
     * Get current step based on progress
     */
    private getCurrentStep(progress: number): string {
        if (progress < 20) return 'Initializing...';
        if (progress < 40) return 'Generating search queries...';
        if (progress < 60) return 'Discovering URLs...';
        if (progress < 95) return 'Analyzing URLs...';
        if (progress < 100) return 'Storing results...';
        return 'Complete!';
    }

    /**
     * Cancel processing
     */
    async cancelProcessing(suggestionId: string): Promise<void> {
        try {
            await approvalQueueService.updateStatus(suggestionId, 'approved');
            console.log(`Cancelled processing for: ${suggestionId}`);
        } catch (error) {
            console.error('Error cancelling processing:', error);
            throw error;
        }
    }
}

export const processingPipelineService = new ProcessingPipelineService();
