/**
 * AI BLOGS STUDIO - FIRESTORE DATABASE SCHEMA
 * Complete type definitions for all collections
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// USER TYPES
// ============================================

export type SubscriptionTier = 'creator' | 'professional' | 'studio' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export type PayoutMethod = 'stripe' | 'paypal' | 'bank';

export interface User {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: SubscriptionTier;
  subscription: {
    stripeCustomerId: string;
    subscriptionId: string;
    status: SubscriptionStatus;
    currentPeriodEnd: Timestamp;
    cancelAtPeriodEnd: boolean;
  };
  earnings: {
    totalLifetime: number;
    thisMonth: number;
    lastPayout?: Timestamp;
    pendingPayout: number;
    payoutMethod: PayoutMethod;
  };
  usage: {
    blogsCreated: number;
    blogsThisMonth: number;
    aiCreditsUsed: number;
    aiCreditsRemaining: number;
    storageUsedGB: number;
  };
  niches: string[];
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

// ============================================
// BLOG TYPES
// ============================================

export type BlogStatus = 'draft' | 'published' | 'scheduled';
export type AIModel = 'gemini' | 'claude' | 'gpt4' | 'llama';

export interface Blog {
  blogId: string;
  authorId: string;
  title: string;
  slug: string; // unique, SEO-friendly
  excerpt: string; // AI-generated, 150 chars
  contentStoragePath: string; // Firebase Storage path
  content?: string; // Full markdown content (cached)
  coverImageURL: string;
  niche: string;
  tags: string[];
  status: BlogStatus;
  publishedAt?: Timestamp;
  scheduledFor?: Timestamp;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    schema: Record<string, any>; // JSON-LD
    canonicalURL: string;
  };
  ai: {
    model: AIModel;
    tokensUsed: number;
    cost: number; // USD
    qualityScore: number; // 0-100
    humanLikenessScore: number; // 0-100
  };
  analytics: {
    views: number;
    uniqueVisitors: number;
    avgReadTime: number; // seconds
    bounceRate: number;
    lastViewedAt?: Timestamp;
  };
  monetization: {
    adRevenueTotal: number;
    affiliateEarnings: number;
    sponsoredAmount: number;
    paywallEarnings: number;
    totalEarnings: number;
  };
  adwords?: {
    campaignId: string; // Google Ads
    status: 'active' | 'paused' | 'ended';
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number; // USD
    spent: number; // USD
    earned: number; // USD
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// EARNINGS TYPES
// ============================================

export type EarningType = 'ad_revenue' | 'affiliate' | 'sponsored' | 'paywall' | 'license';
export type EarningStatus = 'pending' | 'processing' | 'paid';

export interface Earning {
  earningId: string;
  userId: string;
  blogId?: string;
  type: EarningType;
  amount: number; // USD
  platformFee: number; // USD
  creatorPayout: number; // USD
  status: EarningStatus;
  paidAt?: Timestamp;
  createdAt: Timestamp;
}

// ============================================
// ADWORDS CAMPAIGN TYPES
// ============================================

export interface AdWordsCampaign {
  campaignId: string; // Google Ads ID
  blogId: string;
  userId: string;
  status: 'active' | 'paused' | 'ended';
  budget: {
    daily: number; // USD
    total: number; // USD
    spent: number; // USD
  };
  performance: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversions: number;
    roi: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// AFFILIATE LINK TYPES
// ============================================

export type AffiliateProvider = 'amazon' | 'shareasale' | 'cj' | 'impact';

export interface AffiliateLink {
  linkId: string;
  blogId: string;
  userId: string;
  provider: AffiliateProvider;
  productName: string;
  originalURL: string;
  trackedURL: string; // with affiliate ID
  clicks: number;
  conversions: number;
  earnings: number; // USD
  createdAt: Timestamp;
}

// ============================================
// SPONSORED CONTENT TYPES
// ============================================

export type SponsorshipStatus = 'pending' | 'accepted' | 'completed' | 'paid';

export interface SponsoredContent {
  sponsorshipId: string;
  blogId?: string; // null = pending assignment
  userId: string; // creator
  brandName: string;
  brandContact: string;
  amount: number; // USD
  platformFee: number; // USD
  creatorPayout: number; // USD
  status: SponsorshipStatus;
  dueDate: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
}

// ============================================
// PAYWALL CONTENT TYPES
// ============================================

export interface PaywallContent {
  paywallId: string;
  blogId: string;
  price: number; // USD
  purchases: number;
  revenue: number; // USD
  createdAt: Timestamp;
}

// ============================================
// AI USAGE TRACKING
// ============================================

export type AIFeature = 'generate' | 'improve' | 'seo' | 'image';

export interface AIUsage {
  usageId: string;
  userId: string;
  blogId?: string;
  model: string;
  feature: AIFeature;
  tokensUsed: number;
  cost: number; // USD
  timestamp: Timestamp;
}

// ============================================
// COLLECTION PATHS
// ============================================

export const COLLECTIONS = {
  USERS: 'ai_blogs_users',
  BLOGS: 'ai_blogs',
  EARNINGS: 'ai_blogs_earnings',
  ADWORDS_CAMPAIGNS: 'ai_blogs_adwords_campaigns',
  AFFILIATE_LINKS: 'ai_blogs_affiliate_links',
  SPONSORED_CONTENT: 'ai_blogs_sponsored_content',
  PAYWALL_CONTENT: 'ai_blogs_paywall_content',
  AI_USAGE: 'ai_blogs_ai_usage',
} as const;

// ============================================
// SUBSCRIPTION TIER LIMITS
// ============================================

export const TIER_LIMITS = {
  creator: {
    blogsPerMonth: 50,
    niches: 3,
    revenueShare: 0.7, // 70%
    features: ['basic_seo', 'standard_support'],
  },
  professional: {
    blogsPerMonth: -1, // unlimited
    niches: -1, // unlimited
    revenueShare: 0.8, // 80%
    features: ['advanced_seo', 'adwords_automation', 'affiliate_marketplace', 'priority_support'],
  },
  studio: {
    blogsPerMonth: -1,
    niches: -1,
    revenueShare: 0.9, // 90%
    features: ['custom_ai_training', 'white_label', 'team_collaboration', 'dedicated_manager', 'api_access'],
    teamMembers: 5,
  },
  enterprise: {
    blogsPerMonth: -1,
    niches: -1,
    revenueShare: 0.95, // 95%
    features: ['multi_brand', 'custom_ai_models', 'sla_guarantee', 'white_glove_service', 'api_access'],
    teamMembers: -1, // unlimited
  },
} as const;

// ============================================
// PRICING (USD/month)
// ============================================

export const PRICING = {
  creator: 29,
  professional: 99,
  studio: 299,
  enterprise: 499,
} as const;
