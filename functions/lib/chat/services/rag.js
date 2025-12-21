"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragService = exports.RAGService = void 0;
const admin = __importStar(require("firebase-admin"));
class RAGService {
    constructor() {
        this.db = admin.firestore();
    }
    /**
     * Retrieve relevant context for a user query
     * Currently uses simple keyword matching against Firestore
     * (Future: Upgrade to Vector Search with Pinecone/Milvus)
     */
    async getContext(query, product) {
        try {
            // 1. Fetch documents for the specific product
            const docsRef = this.db.collection('support_docs');
            const snapshot = await docsRef
                .where('product', 'in', [product, 'general'])
                .get();
            if (snapshot.empty)
                return '';
            // 2. Simple Scoring Algorithm (Keyword match)
            const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const scoredDocs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                let score = 0;
                // Check keywords
                if (data.keywords) {
                    data.keywords.forEach(k => {
                        if (query.toLowerCase().includes(k.toLowerCase()))
                            score += 3;
                    });
                }
                // Check question/answer overlap
                queryWords.forEach(word => {
                    if (data.question.toLowerCase().includes(word))
                        score += 2;
                    if (data.answer.toLowerCase().includes(word))
                        score += 1;
                });
                if (score > 0) {
                    scoredDocs.push({ content: `Q: ${data.question}\nA: ${data.answer}`, score });
                }
            });
            // 3. Sort by relevance and take top 3
            scoredDocs.sort((a, b) => b.score - a.score);
            const topDocs = scoredDocs.slice(0, 3).map(d => d.content);
            return topDocs.join('\n\n');
        }
        catch (error) {
            console.error('❌ RAG Retrieval Error:', error);
            return ''; // Fail silently to standard AI knowledge
        }
    }
    /**
     * Log chat session for memory/history
     */
    async logSession(userId, message, response, product) {
        try {
            await this.db.collection('chat_sessions').add({
                userId,
                product,
                message,
                response,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        catch (error) {
            console.error('Failed to log chat session', error);
        }
    }
}
exports.RAGService = RAGService;
exports.ragService = new RAGService();
//# sourceMappingURL=rag.js.map