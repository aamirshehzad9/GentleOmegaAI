"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportApi = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ai_1 = require("../services/ai");
const rag_1 = require("../services/rag");
const webApp = (0, express_1.default)();
webApp.use((0, cors_1.default)({ origin: true }));
webApp.use(express_1.default.json());
/**
 * POST /message
 * Handle chat messages from the web widget
 */
webApp.post('/message', async (req, res) => {
    try {
        const { userId, message, product = 'general', history } = req.body;
        if (!userId || !message) {
            res.status(400).json({ error: 'Missing userId or message' });
            return;
        }
        // 1. Get RAG Context
        const contextInfo = await rag_1.ragService.getContext(message, product);
        // 2. Generate AI Response
        const aiResponse = await ai_1.aiService.generateResponse(message, {
            userId,
            product,
            previousMessages: history,
            ragContent: contextInfo
        });
        // 3. Log Interaction (Async)
        rag_1.ragService.logSession(userId, message, aiResponse.text, product);
        // 4. Return Response
        res.json({
            success: true,
            data: aiResponse
        });
    }
    catch (error) {
        console.error('❌ Chat API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal support service error'
        });
    }
});
exports.supportApi = webApp;
//# sourceMappingURL=web.js.map