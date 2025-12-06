/**
 * Firebase Cloud Functions for Stripe Integration
 * Handles webhooks, checkout sessions, and billing portal
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2025-11-17.clover',
});

const db = admin.firestore();

/**
 * Create Stripe Checkout Session
 */
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { priceId, userId, billingCycle, successUrl, cancelUrl } = data;

  try {
    // Get or create Stripe customer
    let customer: Stripe.Customer;
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (userData?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(userData.stripeCustomerId) as Stripe.Customer;
    } else {
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
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Create Billing Portal Session
 */
export const createPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, returnUrl } = data;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

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
  } catch (error: any) {
    console.error('Create portal session error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Get Subscription Status
 */
export const getSubscriptionStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId } = data;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

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
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);

    return {
      status: subscription.status,
      tier: product.name,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    };
  } catch (error: any) {
    console.error('Get subscription status error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Stripe Webhook Handler
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
    return;
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).send(`Webhook Error: ${error.message}`);
    return;
  }
});

/**
 * Handle checkout session completed
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);

  await db.collection('users').doc(userId).set({
    subscription: {
      id: subscriptionId,
      status: subscription.status,
      tier: product.name,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  }, { merge: true });

  console.log(`Subscription created for user ${userId}: ${product.name}`);
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);

  await db.collection('users').doc(userId).set({
    subscription: {
      id: subscription.id,
      status: subscription.status,
      tier: product.name,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  }, { merge: true });
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);

  await db.collection('users').doc(userId).set({
    subscription: {
      id: subscription.id,
      status: subscription.status,
      tier: product.name,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  }, { merge: true });

  console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

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
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Log payment
  await db.collection('users').doc(userId).collection('payments').add({
    invoiceId: invoice.id,
    amount: (invoice as any).amount_paid / 100,
    currency: invoice.currency,
    status: 'succeeded',
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Payment succeeded for user ${userId}: $${(invoice as any).amount_paid / 100}`);
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await db.collection('users').doc(userId).set({
    subscription: {
      status: 'past_due',
      paymentFailedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  }, { merge: true });

  console.log(`Payment failed for user ${userId}`);
}
