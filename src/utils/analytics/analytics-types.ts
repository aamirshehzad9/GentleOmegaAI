// Shared TypeScript types for analytics across all platforms

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsUser {
  userId: string;
  email?: string;
  name?: string;
  tier?: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  signupDate?: Date;
  properties?: Record<string, any>;
}

export interface RevenueEvent {
  amount: number;
  currency: string;
  productId?: string;
  quantity?: number;
  revenueType?: string;
}

export interface PageViewEvent {
  path: string;
  title?: string;
  referrer?: string;
  searchParams?: Record<string, string>;
}

export interface ConversionFunnel {
  name: string;
  steps: string[];
  completionRate?: number;
}

// Google Analytics 4 Types
export interface GA4Config {
  propertyId: string;
  measurementId: string;
  serviceAccountPath?: string;
}

export interface GA4Metric {
  name: string;
  value: number;
  comparison?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface GA4Report {
  dateRange: { startDate: string; endDate: string };
  metrics: GA4Metric[];
  dimensions?: Record<string, any>[];
}

// Mixpanel Types
export interface MixpanelConfig {
  token: string;
  apiSecret?: string;
}

export interface MixpanelFunnel {
  funnelId: string;
  name: string;
  steps: Array<{
    event: string;
    count: number;
    conversionRate: number;
  }>;
}

export interface MixpanelCohort {
  cohortId: string;
  name: string;
  size: number;
  retentionRate: Record<string, number>;
}

// Amplitude Types
export interface AmplitudeConfig {
  apiKey: string;
  serverUrl?: string;
  sessionReplay?: boolean;
}

export interface AmplitudeSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  events: AnalyticsEvent[];
  replayUrl?: string;
}

// Unified Analytics Types
export interface AnalyticsPlatform {
  name: 'GA4' | 'Mixpanel' | 'Amplitude';
  enabled: boolean;
  initialized: boolean;
}

export interface AnalyticsConfig {
  ga4?: GA4Config;
  mixpanel?: MixpanelConfig;
  amplitude?: AmplitudeConfig;
  enabledPlatforms: ('GA4' | 'Mixpanel' | 'Amplitude')[];
}

export interface UnifiedMetrics {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversions: number;
  revenue: number;
}

export interface DashboardData {
  metrics: UnifiedMetrics;
  topPages: Array<{ path: string; views: number }>;
  trafficSources: Array<{ source: string; users: number }>;
  conversionFunnels: ConversionFunnel[];
  revenueOverTime: Array<{ date: string; revenue: number }>;
  userRetention: Array<{ cohort: string; retention: number }>;
}

// Event Names (Standardized across all platforms)
export const ANALYTICS_EVENTS = {
  // User Events
  USER_SIGNUP: 'User Signup',
  USER_LOGIN: 'User Login',
  USER_LOGOUT: 'User Logout',
  USER_PROFILE_UPDATE: 'User Profile Updated',
  
  // Blog Events
  BLOG_CREATED: 'Blog Created',
  BLOG_PUBLISHED: 'Blog Published',
  BLOG_EDITED: 'Blog Edited',
  BLOG_DELETED: 'Blog Deleted',
  BLOG_VIEWED: 'Blog Viewed',
  
  // AI Events
  AI_CONTENT_GENERATED: 'AI Content Generated',
  AI_SEO_GENERATED: 'AI SEO Generated',
  AI_TOPIC_GENERATED: 'AI Topic Generated',
  AI_CONTENT_IMPROVED: 'AI Content Improved',
  
  // Subscription Events
  SUBSCRIPTION_STARTED: 'Subscription Started',
  SUBSCRIPTION_UPGRADED: 'Subscription Upgraded',
  SUBSCRIPTION_DOWNGRADED: 'Subscription Downgraded',
  SUBSCRIPTION_CANCELLED: 'Subscription Cancelled',
  PAYMENT_SUCCESS: 'Payment Success',
  PAYMENT_FAILED: 'Payment Failed',
  
  // Engagement Events
  PAGE_VIEW: 'Page View',
  BUTTON_CLICK: 'Button Click',
  FORM_SUBMIT: 'Form Submit',
  LINK_CLICK: 'Link Click',
  VIDEO_PLAY: 'Video Play',
  
  // Conversion Events
  TRIAL_STARTED: 'Trial Started',
  DEMO_REQUESTED: 'Demo Requested',
  CONTACT_FORM_SUBMITTED: 'Contact Form Submitted',
  
  // Dashboard Events
  DASHBOARD_VIEWED: 'Dashboard Viewed',
  ANALYTICS_VIEWED: 'Analytics Viewed',
  EARNINGS_VIEWED: 'Earnings Viewed',
  
  // Error Events
  ERROR_OCCURRED: 'Error Occurred',
  API_ERROR: 'API Error',
  PAYMENT_ERROR: 'Payment Error',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
