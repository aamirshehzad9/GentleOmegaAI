"use strict";
/**
 * GentleOmegaAI - Cloud Functions
 * - WhatsApp Integration via Twilio
 * - GO-AIBOB API for Firestore data
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportTwilio = exports.supportApi = exports.getWhatsAppConversations = exports.verifyWhatsAppOTP = exports.sendWhatsAppOTP = exports.sendWhatsAppMessage = exports.whatsappWebhook = exports.gobApi = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const twilio_1 = __importDefault(require("twilio"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
// ============================================================================
// 🔥 GO-AIBOB API - Serve Firestore Data
// ============================================================================
const gobApp = (0, express_1.default)();
gobApp.use((0, cors_1.default)({ origin: true }));
gobApp.use(express_1.default.json());
// Health check
gobApp.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'GO-AIBOB Firebase API',
        database: 'Firestore'
    });
});
// Health check for dashboard (expected endpoint)
gobApp.get('/api/gob/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'GO-AIBOB Firebase API',
        database: 'Firestore',
        queue: {
            waiting: 0,
            active: 0,
            completed: 10,
            failed: 0
        }
    });
});
// Get all sites
gobApp.get('/api/gob/list', async (req, res) => {
    try {
        const sitesRef = db.collection('gob_sites');
        const snapshot = await sitesRef.get();
        const sites = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Filter active sites and sort on client side
            if (data.isActive === true) {
                sites.push(Object.assign({ id: doc.id }, data));
            }
        });
        // Sort by backlink value descending
        sites.sort((a, b) => (b.backlinkValue || 0) - (a.backlinkValue || 0));
        res.json({
            success: true,
            count: sites.length,
            sites
        });
    }
    catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Get site statistics
gobApp.get('/api/gob/stats', async (req, res) => {
    try {
        const sitesRef = db.collection('gob_sites');
        const snapshot = await sitesRef.where('isActive', '==', true).get();
        let totalValue = 0;
        let totalSpam = 0;
        let totalLinks = 0;
        let guestPosts = 0;
        let count = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            totalValue += data.backlinkValue || 0;
            totalSpam += data.spamScore || 0;
            totalLinks += data.linksCount || 0;
            if (data.hasGuestPost)
                guestPosts++;
            count++;
        });
        const stats = {
            totalSites: count,
            avgBacklinkValue: count > 0 ? (totalValue / count).toFixed(2) : 0,
            avgSpamScore: count > 0 ? (totalSpam / count).toFixed(2) : 0,
            totalLinks,
            guestPostSites: guestPosts,
            totalEstimatedValue: totalValue.toFixed(2)
        };
        res.json({
            success: true,
            stats
        });
    }
    catch (error) {
        console.error('Error calculating stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Get single site by domain
gobApp.get('/api/gob/site/:domain', async (req, res) => {
    try {
        const { domain } = req.params;
        const sitesRef = db.collection('gob_sites');
        const snapshot = await sitesRef.where('domain', '==', domain).get();
        if (snapshot.empty) {
            res.status(404).json({
                success: false,
                error: 'Site not found'
            });
            return;
        }
        const doc = snapshot.docs[0];
        const site = Object.assign({ id: doc.id }, doc.data());
        res.json({
            success: true,
            site
        });
    }
    catch (error) {
        console.error('Error fetching site:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Search sites
gobApp.get('/api/gob/search', async (req, res) => {
    try {
        const { q: searchQuery, minValue, maxSpam } = req.query;
        const sitesRef = db.collection('gob_sites');
        const snapshot = await sitesRef.where('isActive', '==', true).get();
        let sites = [];
        snapshot.forEach(doc => {
            var _a, _b;
            const data = doc.data();
            // Client-side filtering
            let matches = true;
            if (searchQuery) {
                const search = searchQuery.toLowerCase();
                matches = matches && (((_a = data.domain) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search)) ||
                    ((_b = data.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search)));
            }
            if (minValue) {
                matches = matches && (data.backlinkValue >= parseFloat(minValue));
            }
            if (maxSpam) {
                matches = matches && (data.spamScore <= parseFloat(maxSpam));
            }
            if (matches) {
                sites.push(Object.assign({ id: doc.id }, data));
            }
        });
        res.json({
            success: true,
            count: sites.length,
            sites
        });
    }
    catch (error) {
        console.error('Error searching sites:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Export GO-AIBOB API as Cloud Function
exports.gobApi = functions.https.onRequest(gobApp);
// ============================================================================
// 📱 WHATSAPP INTEGRATION (Existing)
// ============================================================================
// Twilio Configuration
const TWILIO_ACCOUNT_SID = ((_a = functions.config().twilio) === null || _a === void 0 ? void 0 : _a.account_sid) || process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = ((_b = functions.config().twilio) === null || _b === void 0 ? void 0 : _b.auth_token) || process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'; // Sandbox number
const twilioClient = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
// ============================================================================
// 📥 WEBHOOK: Receive Incoming WhatsApp Messages
// ============================================================================
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/**
 * Webhook endpoint to receive incoming WhatsApp messages from Twilio
 * This will be called when someone sends a message to your WhatsApp sandbox
 */
app.post('/webhook', async (req, res) => {
    try {
        const { From, To, Body, MessageSid, ProfileName } = req.body;
        console.log('📥 Incoming WhatsApp message:', {
            from: From,
            to: To,
            body: Body,
            messageSid: MessageSid,
            profileName: ProfileName
        });
        // Store message in Firestore
        const messageData = {
            from: From,
            to: To,
            body: Body,
            messageSid: MessageSid,
            profileName: ProfileName || 'Unknown',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            direction: 'inbound',
            status: 'received'
        };
        await db.collection('whatsapp_messages').add(messageData);
        // Auto-reply logic
        let replyMessage = '';
        if (Body.toLowerCase().includes('help')) {
            replyMessage = `👋 Welcome to GentleOmega AI!\n\nHow can we assist you?\n1️⃣ Support\n2️⃣ Booking\n3️⃣ Services\n4️⃣ Pricing\n\nReply with a number or describe your issue.`;
        }
        else if (Body.toLowerCase().includes('booking')) {
            replyMessage = `📅 Booking Inquiry\n\nVisit: https://gentleomegaai.space\nOr reply with your preferred date & service.`;
        }
        else if (Body.toLowerCase().includes('support')) {
            replyMessage = `🆘 Support Request\n\nWe've received your message. Our team will respond within 2 hours.\n\nFor urgent issues, call: +923468066680`;
        }
        else {
            replyMessage = `✅ Message received!\n\nThank you for contacting GentleOmega AI. Our team will respond shortly.\n\nReply "HELP" for quick options.`;
        }
        // Send auto-reply
        await twilioClient.messages.create({
            from: TWILIO_WHATSAPP_NUMBER,
            to: From,
            body: replyMessage
        });
        // Twilio expects TwiML response
        res.set('Content-Type', 'text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
    }
    catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).send('Error processing message');
    }
});
// Export webhook as Firebase Function
exports.whatsappWebhook = functions.https.onRequest(app);
// ============================================================================
// 📤 SEND WhatsApp Message (Callable Function)
// ============================================================================
/**
 * Send WhatsApp message to a user
 * Call from frontend: firebase.functions().httpsCallable('sendWhatsAppMessage')
 */
exports.sendWhatsAppMessage = functions.https.onCall(async (data, context) => {
    try {
        // Security: Check if user is authenticated (optional)
        // if (!context.auth) {
        //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        // }
        const { to, message } = data;
        if (!to || !message) {
            throw new functions.https.HttpsError('invalid-argument', 'Phone number and message are required');
        }
        // Format phone number for WhatsApp
        const formattedNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        // Send message via Twilio
        const result = await twilioClient.messages.create({
            from: TWILIO_WHATSAPP_NUMBER,
            to: formattedNumber,
            body: message
        });
        // Store outbound message in Firestore
        await db.collection('whatsapp_messages').add({
            from: TWILIO_WHATSAPP_NUMBER,
            to: formattedNumber,
            body: message,
            messageSid: result.sid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            direction: 'outbound',
            status: result.status
        });
        console.log('✅ WhatsApp message sent:', result.sid);
        return {
            success: true,
            messageSid: result.sid,
            status: result.status
        };
    }
    catch (error) {
        console.error('❌ Error sending WhatsApp message:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// ============================================================================
// 📲 SEND WhatsApp OTP
// ============================================================================
/**
 * Generate and send OTP via WhatsApp
 */
exports.sendWhatsAppOTP = functions.https.onCall(async (data, context) => {
    try {
        const { phoneNumber } = data;
        if (!phoneNumber) {
            throw new functions.https.HttpsError('invalid-argument', 'Phone number is required');
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store OTP in Firestore with 5-minute expiry
        const otpDoc = await db.collection('otp_codes').add({
            phone: phoneNumber,
            code: otp,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + (5 * 60 * 1000)),
            verified: false,
            attempts: 0
        });
        // Format phone number
        const formattedNumber = phoneNumber.startsWith('whatsapp:')
            ? phoneNumber
            : `whatsapp:${phoneNumber}`;
        // Send OTP via WhatsApp
        const message = `🔐 Your GentleOmega AI verification code is:\n\n*${otp}*\n\nValid for 5 minutes.\nDo not share this code with anyone.`;
        await twilioClient.messages.create({
            from: TWILIO_WHATSAPP_NUMBER,
            to: formattedNumber,
            body: message
        });
        console.log('✅ OTP sent to:', phoneNumber);
        return {
            success: true,
            otpId: otpDoc.id,
            message: 'OTP sent successfully'
        };
    }
    catch (error) {
        console.error('❌ Error sending OTP:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// ============================================================================
// ✅ VERIFY WhatsApp OTP
// ============================================================================
/**
 * Verify OTP code
 */
exports.verifyWhatsAppOTP = functions.https.onCall(async (data, context) => {
    try {
        const { phoneNumber, code } = data;
        if (!phoneNumber || !code) {
            throw new functions.https.HttpsError('invalid-argument', 'Phone number and code are required');
        }
        // Find OTP in Firestore
        const otpQuery = await db.collection('otp_codes')
            .where('phone', '==', phoneNumber)
            .where('code', '==', code)
            .where('verified', '==', false)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        if (otpQuery.empty) {
            return {
                success: false,
                message: 'Invalid or expired OTP'
            };
        }
        const otpDoc = otpQuery.docs[0];
        const otpData = otpDoc.data();
        // Check if OTP is expired
        const now = admin.firestore.Timestamp.now();
        if (otpData.expiresAt < now) {
            return {
                success: false,
                message: 'OTP has expired'
            };
        }
        // Mark OTP as verified
        await otpDoc.ref.update({
            verified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ OTP verified for:', phoneNumber);
        return {
            success: true,
            message: 'OTP verified successfully'
        };
    }
    catch (error) {
        console.error('❌ Error verifying OTP:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// ============================================================================
// 📊 GET WhatsApp Conversations
// ============================================================================
/**
 * Get all WhatsApp messages for a user (admin only)
 */
exports.getWhatsAppConversations = functions.https.onCall(async (data, context) => {
    try {
        // Security check - only authenticated users
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }
        const { phoneNumber, limit = 50 } = data;
        let query = db.collection('whatsapp_messages')
            .orderBy('timestamp', 'desc')
            .limit(limit);
        if (phoneNumber) {
            const formattedNumber = phoneNumber.startsWith('whatsapp:')
                ? phoneNumber
                : `whatsapp:${phoneNumber}`;
            query = query.where('from', '==', formattedNumber);
        }
        const snapshot = await query.get();
        const messages = [];
        snapshot.forEach(doc => {
            messages.push(Object.assign({ id: doc.id }, doc.data()));
        });
        return {
            success: true,
            count: messages.length,
            messages
        };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// ============================================================================
// 🤖 AI COPILOT SUPPORT API (Phase 4.1.5)
// ============================================================================
const web_1 = require("./chat/controllers/web");
const twilio_2 = require("./chat/controllers/twilio");
exports.supportApi = functions.https.onRequest(web_1.supportApi);
exports.supportTwilio = functions.https.onRequest(twilio_2.twilioWebhook);
//# sourceMappingURL=index.js.map