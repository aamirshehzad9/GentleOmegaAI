import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    Timestamp,
    writeBatch,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
    AISuggestion,
    SuggestionStatus,
    QueueStats,
    BulkOperationResult,
    SuggestionFilters,
    PaginationOptions,
    SortOptions,
    NicheDiscoveryInput,
    NicheDiscoveryOutput
} from '../types/aiSuggestion.types';

const COLLECTION_NAME = 'aiSuggestions';

export class ApprovalQueueService {
    /**
     * Create a new AI suggestion
     */
    async createSuggestion(
        input: NicheDiscoveryInput,
        output: NicheDiscoveryOutput,
        aiModel: string,
        processingTime: number,
        userId?: string
    ): Promise<string> {
        try {
            const suggestionData = {
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                status: 'pending' as SuggestionStatus,
                input,
                output,
                aiModel,
                processingTime,
                createdBy: userId,
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), suggestionData);
            console.log('Created suggestion:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error creating suggestion:', error);
            throw new Error(`Failed to create suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get suggestions by status
     */
    async getSuggestionsByStatus(
        status: SuggestionStatus,
        options?: PaginationOptions
    ): Promise<AISuggestion[]> {
        try {
            const constraints: QueryConstraint[] = [
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            ];

            if (options?.limit) {
                constraints.push(firestoreLimit(options.limit));
            }

            const q = query(collection(db, COLLECTION_NAME), ...constraints);
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as AISuggestion));
        } catch (error) {
            console.error(`Error fetching ${status} suggestions:`, error);
            throw new Error(`Failed to fetch suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get pending suggestions
     */
    async getPendingSuggestions(limit: number = 50): Promise<AISuggestion[]> {
        return this.getSuggestionsByStatus('pending', { limit });
    }

    /**
     * Get approved suggestions
     */
    async getApprovedSuggestions(limit: number = 50): Promise<AISuggestion[]> {
        return this.getSuggestionsByStatus('approved', { limit });
    }

    /**
     * Get rejected suggestions
     */
    async getRejectedSuggestions(limit: number = 50): Promise<AISuggestion[]> {
        return this.getSuggestionsByStatus('rejected', { limit });
    }

    /**
     * Get processing suggestions
     */
    async getProcessingSuggestions(limit: number = 50): Promise<AISuggestion[]> {
        return this.getSuggestionsByStatus('processing', { limit });
    }

    /**
     * Get suggestion by ID
     */
    async getSuggestionById(id: string): Promise<AISuggestion | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return {
                id: docSnap.id,
                ...docSnap.data()
            } as AISuggestion;
        } catch (error) {
            console.error('Error fetching suggestion:', error);
            throw new Error(`Failed to fetch suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Approve a suggestion
     */
    async approveSuggestion(
        id: string,
        adminId: string,
        notes?: string
    ): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                status: 'approved',
                reviewedBy: adminId,
                reviewedAt: Timestamp.now(),
                reviewNotes: notes || '',
                updatedAt: Timestamp.now()
            });
            console.log(`Approved suggestion: ${id}`);
        } catch (error) {
            console.error('Error approving suggestion:', error);
            throw new Error(`Failed to approve suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Reject a suggestion
     */
    async rejectSuggestion(
        id: string,
        adminId: string,
        notes?: string
    ): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                status: 'rejected',
                reviewedBy: adminId,
                reviewedAt: Timestamp.now(),
                reviewNotes: notes || '',
                updatedAt: Timestamp.now()
            });
            console.log(`Rejected suggestion: ${id}`);
        } catch (error) {
            console.error('Error rejecting suggestion:', error);
            throw new Error(`Failed to reject suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Bulk approve suggestions
     */
    async bulkApprove(ids: string[], adminId: string): Promise<BulkOperationResult> {
        const batch = writeBatch(db);
        const errors: Array<{ id: string; error: string }> = [];
        let successful = 0;

        try {
            for (const id of ids) {
                try {
                    const docRef = doc(db, COLLECTION_NAME, id);
                    batch.update(docRef, {
                        status: 'approved',
                        reviewedBy: adminId,
                        reviewedAt: Timestamp.now(),
                        updatedAt: Timestamp.now()
                    });
                    successful++;
                } catch (error) {
                    errors.push({
                        id,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            await batch.commit();
            console.log(`Bulk approved ${successful}/${ids.length} suggestions`);

            return {
                total: ids.length,
                successful,
                failed: errors.length,
                errors
            };
        } catch (error) {
            console.error('Error in bulk approve:', error);
            throw new Error(`Bulk approve failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Bulk reject suggestions
     */
    async bulkReject(ids: string[], adminId: string): Promise<BulkOperationResult> {
        const batch = writeBatch(db);
        const errors: Array<{ id: string; error: string }> = [];
        let successful = 0;

        try {
            for (const id of ids) {
                try {
                    const docRef = doc(db, COLLECTION_NAME, id);
                    batch.update(docRef, {
                        status: 'rejected',
                        reviewedBy: adminId,
                        reviewedAt: Timestamp.now(),
                        updatedAt: Timestamp.now()
                    });
                    successful++;
                } catch (error) {
                    errors.push({
                        id,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            await batch.commit();
            console.log(`Bulk rejected ${successful}/${ids.length} suggestions`);

            return {
                total: ids.length,
                successful,
                failed: errors.length,
                errors
            };
        } catch (error) {
            console.error('Error in bulk reject:', error);
            throw new Error(`Bulk reject failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update suggestion status
     */
    async updateStatus(id: string, status: SuggestionStatus): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                status,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating status:', error);
            throw new Error(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update processing progress
     */
    async updateProgress(id: string, progress: number, currentStep: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                processingProgress: progress,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating progress:', error);
            throw new Error(`Failed to update progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get queue statistics
     */
    async getQueueStats(): Promise<QueueStats> {
        try {
            const allDocs = await getDocs(collection(db, COLLECTION_NAME));

            const stats: QueueStats = {
                pending: 0,
                approved: 0,
                rejected: 0,
                processing: 0,
                completed: 0,
                failed: 0,
                total: allDocs.size,
                averageConfidence: 0,
                averageProcessingTime: 0
            };

            let totalConfidence = 0;
            let totalProcessingTime = 0;

            allDocs.forEach(doc => {
                const data = doc.data() as AISuggestion;

                // Count by status
                stats[data.status]++;

                // Sum for averages
                totalConfidence += data.output.confidence;
                totalProcessingTime += data.processingTime;
            });

            // Calculate averages
            if (stats.total > 0) {
                stats.averageConfidence = totalConfidence / stats.total;
                stats.averageProcessingTime = totalProcessingTime / stats.total;
            }

            return stats;
        } catch (error) {
            console.error('Error getting queue stats:', error);
            throw new Error(`Failed to get stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete suggestion
     */
    async deleteSuggestion(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                status: 'rejected',
                updatedAt: Timestamp.now()
            });
            console.log(`Deleted suggestion: ${id}`);
        } catch (error) {
            console.error('Error deleting suggestion:', error);
            throw new Error(`Failed to delete suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const approvalQueueService = new ApprovalQueueService();
