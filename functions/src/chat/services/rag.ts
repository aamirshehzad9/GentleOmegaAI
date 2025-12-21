
import * as admin from 'firebase-admin';

// Interface for Knowledge Documents
export interface KnowledgeDoc {
    id: string;
    category: string;
    product: 'go-aibob' | 'aiblogsstudio' | 'misoft' | 'general';
    question: string;
    answer: string;
    keywords: string[];
}

export class RAGService {
    private db = admin.firestore();

    /**
     * Retrieve relevant context for a user query
     * Currently uses simple keyword matching against Firestore
     * (Future: Upgrade to Vector Search with Pinecone/Milvus)
     */
    async getContext(query: string, product: string): Promise<string> {
        try {
            // 1. Fetch documents for the specific product
            const docsRef = this.db.collection('support_docs');
            const snapshot = await docsRef
                .where('product', 'in', [product, 'general'])
                .get();

            if (snapshot.empty) return '';

            // 2. Simple Scoring Algorithm (Keyword match)
            const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const scoredDocs: { content: string, score: number }[] = [];

            snapshot.forEach(doc => {
                const data = doc.data() as KnowledgeDoc;
                let score = 0;

                // Check keywords
                if (data.keywords) {
                    data.keywords.forEach(k => {
                        if (query.toLowerCase().includes(k.toLowerCase())) score += 3;
                    });
                }

                // Check question/answer overlap
                queryWords.forEach(word => {
                    if (data.question.toLowerCase().includes(word)) score += 2;
                    if (data.answer.toLowerCase().includes(word)) score += 1;
                });

                if (score > 0) {
                    scoredDocs.push({ content: `Q: ${data.question}\nA: ${data.answer}`, score });
                }
            });

            // 3. Sort by relevance and take top 3
            scoredDocs.sort((a, b) => b.score - a.score);
            const topDocs = scoredDocs.slice(0, 3).map(d => d.content);

            return topDocs.join('\n\n');

        } catch (error) {
            console.error('❌ RAG Retrieval Error:', error);
            return ''; // Fail silently to standard AI knowledge
        }
    }

    /**
     * Log chat session for memory/history
     */
    async logSession(userId: string, message: string, response: string, product: string) {
        try {
            await this.db.collection('chat_sessions').add({
                userId,
                product,
                message,
                response,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Failed to log chat session', error);
        }
    }
}

export const ragService = new RAGService();
