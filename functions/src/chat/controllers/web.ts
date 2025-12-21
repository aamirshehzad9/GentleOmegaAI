
import express from 'express';
import cors from 'cors';
import { aiService } from '../services/ai';
import { ragService } from '../services/rag';

const webApp = express();
webApp.use(cors({ origin: true }));
webApp.use(express.json());

interface ChatRequest {
    userId: string;
    message: string;
    product?: 'go-aibob' | 'aiblogsstudio' | 'misoft' | 'general';
    history?: { role: 'user' | 'model'; parts: string }[];
}

/**
 * POST /message
 * Handle chat messages from the web widget
 */
webApp.post('/message', async (req, res) => {
    try {
        const { userId, message, product = 'general', history } = req.body as ChatRequest;

        if (!userId || !message) {
            res.status(400).json({ error: 'Missing userId or message' });
            return;
        }

        // 1. Get RAG Context
        const contextInfo = await ragService.getContext(message, product);

        // 2. Generate AI Response
        const aiResponse = await aiService.generateResponse(message, {
            userId,
            product,
            previousMessages: history,
            ragContent: contextInfo
        });

        // 3. Log Interaction (Async)
        ragService.logSession(userId, message, aiResponse.text, product);

        // 4. Return Response
        res.json({
            success: true,
            data: aiResponse
        });

    } catch (error: any) {
        console.error('❌ Chat API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal support service error'
        });
    }
});

export const supportApi = webApp;
