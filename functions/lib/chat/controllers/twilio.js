"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twilioWebhook = void 0;
// import * as functions from 'firebase-functions';
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ai_1 = require("../services/ai");
const rag_1 = require("../services/rag");
const twilio_1 = __importDefault(require("twilio"));
// Initialize Twilio Config (Env vars checked but client not needed for TwiML response)
// const TWILIO_ACCOUNT_SID = functions.config().twilio?.account_sid || process.env.TWILIO_ACCOUNT_SID;
// const TWILIO_AUTH_TOKEN = functions.config().twilio?.auth_token || process.env.TWILIO_AUTH_TOKEN;
// const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.urlencoded({ extended: true })); // Twilio sends form-urlencoded
/**
 * Enhanced Webhook for WhatsApp
 * Replaces the legacy webhook in index.ts
 */
app.post('/webhook', async (req, res) => {
    try {
        const { From, Body } = req.body;
        // 1. Identify User & Product Context based on message
        // (For now, default to 'general' or infer from keywords)
        let product = 'general';
        if (Body.toLowerCase().includes('guest') || Body.toLowerCase().includes('post'))
            product = 'go-aibob';
        if (Body.toLowerCase().includes('blog') || Body.toLowerCase().includes('article'))
            product = 'aiblogsstudio';
        // 2. RAG & AI Generation
        const contextInfo = await rag_1.ragService.getContext(Body, product);
        const aiResponse = await ai_1.aiService.generateResponse(Body, {
            userId: From, // Use Phone Number as User ID
            product,
            ragContent: contextInfo
        });
        // 3. Log Session
        rag_1.ragService.logSession(From, Body, aiResponse.text, product);
        // 4. Send Response via Twilio Client (Explicitly, to ensure delivery)
        // We send it back as TwiML if synchronous, or async client create.
        // TwiML is faster for webhooks.
        const twiml = new twilio_1.default.twiml.MessagingResponse();
        twiml.message(aiResponse.text);
        res.type('text/xml').send(twiml.toString());
    }
    catch (error) {
        console.error('❌ Twilio Webhook Error:', error);
        // Fallback response
        const twiml = new twilio_1.default.twiml.MessagingResponse();
        twiml.message("I apologize, I'm currently unavailable. Please try again later.");
        res.type('text/xml').send(twiml.toString());
    }
});
exports.twilioWebhook = app;
//# sourceMappingURL=twilio.js.map