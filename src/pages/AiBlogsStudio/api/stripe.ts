/**
 * Stripe Integration Module
 * Handles subscription checkout, webhook processing, and billing portal
 */

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export interface SubscriptionTier {
  name: string;
  monthlyPriceId: string;
  yearlyPriceId: string;
  amount: number;
  yearlyAmount: number;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Creator',
    monthlyPriceId: 'price_creator_monthly',
    yearlyPriceId: 'price_creator_yearly',
    amount: 29,
    yearlyAmount: 290
  },
  {
    name: 'Professional',
    monthlyPriceId: 'price_professional_monthly',
    yearlyPriceId: 'price_professional_yearly',
    amount: 99,
    yearlyAmount: 990
  },
  {
    name: 'Studio',
    monthlyPriceId: 'price_studio_monthly',
    yearlyPriceId: 'price_studio_yearly',
    amount: 299,
    yearlyAmount: 2990
  },
  {
    name: 'Enterprise',
    monthlyPriceId: 'price_enterprise_monthly',
    yearlyPriceId: 'price_enterprise_yearly',
    amount: 999,
    yearlyAmount: 9990
  }
];

/**
 * Create Stripe Checkout Session
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<{ sessionId: string; url: string }> {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        billingCycle,
        successUrl: `${window.location.origin}/AIBlogsStudio/success`,
        cancelUrl: `${window.location.origin}/AIBlogsStudio/pricing`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Checkout session error:', error);
    throw error;
  }
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(
  priceId: string,
  userId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<void> {
  try {
    const { url } = await createCheckoutSession(priceId, userId, billingCycle);
    
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Create Billing Portal Session
 */
export async function createBillingPortalSession(userId: string): Promise<{ url: string }> {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        returnUrl: `${window.location.origin}/AIBlogsStudio/dashboard`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    return await response.json();
  } catch (error) {
    console.error('Portal session error:', error);
    throw error;
  }
}

/**
 * Get Subscription Status
 */
export async function getSubscriptionStatus(userId: string): Promise<{
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  tier: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}> {
  try {
    const response = await fetch(`/api/subscription-status?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription status');
    }

    return await response.json();
  } catch (error) {
    console.error('Subscription status error:', error);
    return {
      status: 'inactive',
      tier: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }
}

/**
 * Calculate revenue share based on subscription tier
 */
export function calculateRevenueShare(tier: string, grossRevenue: number): {
  creatorShare: number;
  platformFee: number;
  creatorPercentage: number;
} {
  const sharePercentages: Record<string, number> = {
    'Creator': 70,
    'Professional': 85,
    'Studio': 90,
    'Enterprise': 95,
  };

  const creatorPercentage = sharePercentages[tier] || 70;
  const creatorShare = (grossRevenue * creatorPercentage) / 100;
  const platformFee = grossRevenue - creatorShare;

  return {
    creatorShare,
    platformFee,
    creatorPercentage,
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
