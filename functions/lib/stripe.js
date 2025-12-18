"use strict";
/**
 * Firebase Cloud Functions for Stripe Integration
 * Handles webhooks, checkout sessions, and billing portal
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.getSubscriptionStatus = exports.createPortalSession = exports.createCheckoutSession = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
admin.initializeApp();
// Initialize Stripe
const stripe = new stripe_1.default(functions.config().stripe.secret_key, {
    apiVersion: '2025-11-17.clover',
});
const db = admin.firestore();
/**
 * Create Stripe Checkout Session
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { priceId, userId, billingCycle, successUrl, cancelUrl } = data;
    try {
        // Get or create Stripe customer
        let customer;
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId) {
            customer = await stripe.customers.retrieve(userData.stripeCustomerId);
        }
        else {
            customer = await stripe.customers.create({
                email: context.auth.token.email,
                metadata: {
                    firebaseUID: userId,
                },
            });
            // Save Stripe customer ID to Firestore
            await db.collection('users').doc(userId).set({
                stripeCustomerId: customer.id,
            }, { merge: true });
        }
        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId,
                billingCycle,
            },
            subscription_data: {
                metadata: {
                    userId,
                },
            },
        });
        return {
            sessionId: session.id,
            url: session.url,
        };
    }
    catch (error) {
        console.error('Create checkout session error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
/**
 * Create Billing Portal Session
 */
exports.createPortalSession = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { userId, returnUrl } = data;
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const stripeCustomerId = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
        if (!stripeCustomerId) {
            throw new functions.https.HttpsError('not-found', 'No Stripe customer found');
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: returnUrl,
        });
        return {
            url: session.url,
        };
    }
    catch (error) {
        console.error('Create portal session error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
/**
 * Get Subscription Status
 */
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { userId } = data;
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const stripeCustomerId = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
        if (!stripeCustomerId) {
            return {
                status: 'inactive',
                tier: null,
                currentPeriodEnd: null,
                cancelAtPeriodEnd: false,
            };
        }
        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: 'active',
            limit: 1,
        });
        if (subscriptions.data.length === 0) {
            return {
                status: 'inactive',
                tier: null,
                currentPeriodEnd: null,
                cancelAtPeriodEnd: false,
            };
        }
        const subscription = subscriptions.data[0];
        const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
        return {
            status: subscription.status,
            tier: product.name,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
        };
    }
    catch (error) {
        console.error('Get subscription status error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
/**
 * Stripe Webhook Handler
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = functions.config().stripe.webhook_secret;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    }
    catch (error) {
        console.error('Webhook signature verification failed:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
        return;
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
        return;
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).send(`Webhook Error: ${error.message}`);
        return;
    }
});
/**
 * Handle checkout session completed
 */
async function handleCheckoutSessionCompleted(session) {
    var _a;
    const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return;
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
    await db.collection('users').doc(userId).set({
        subscription: {
            id: subscriptionId,
            status: subscription.status,
            tier: product.name,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
    }, { merge: true });
    console.log(`Subscription created for user ${userId}: ${product.name}`);
}
/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
    var _a;
    const userId = (_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return;
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
    await db.collection('users').doc(userId).set({
        subscription: {
            id: subscription.id,
            status: subscription.status,
            tier: product.name,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
    }, { merge: true });
}
/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription) {
    var _a;
    const userId = (_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return;
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
    await db.collection('users').doc(userId).set({
        subscription: {
            id: subscription.id,
            status: subscription.status,
            tier: product.name,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
    }, { merge: true });
    console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
}
/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription) {
    var _a;
    const userId = (_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return;
    await db.collection('users').doc(userId).set({
        subscription: {
            id: subscription.id,
            status: 'canceled',
            tier: null,
            canceledAt: admin.firestore.FieldValue.serverTimestamp(),
        },
    }, { merge: true });
    console.log(`Subscription canceled for user ${userId}`);
}
/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(invoice) {
    var _a;
    const subscriptionId = invoice.subscription;
    if (!subscriptionId)
        return;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = (_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return;
    // Log payment
    await db.collection('users').doc(userId).collection('payments').add({
        invoiceId: invoice.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'succeeded',
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Payment succeeded for user ${userId}: $${invoice.amount_paid / 100}`);
}
/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice) {
    var _a;
    const subscriptionId = invoice.subscription;
    if (!subscriptionId)
        return;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = (_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return;
    await db.collection('users').doc(userId).set({
        subscription: {
            status: 'past_due',
            paymentFailedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
    }, { merge: true });
    console.log(`Payment failed for user ${userId}`);
}
//# sourceMappingURL=stripe.js.map