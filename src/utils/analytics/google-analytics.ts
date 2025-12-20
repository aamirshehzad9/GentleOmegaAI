// Google Analytics 4 Browser Integration (Client-side)
// Uses react-ga4 for cleaner React integration

import ReactGA from 'react-ga4';
import type {
  AnalyticsEvent,
  AnalyticsUser,
  PageViewEvent,
  RevenueEvent
} from './analytics-types';

class GoogleAnalytics {
  private measurementId: string;
  private initialized: boolean = false;
  private debug: boolean = false;

  constructor() {
    this.measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';
    this.debug = import.meta.env.DEV;
  }

  /**
   * Initialize Google Analytics 4 via react-ga4
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[GA4] Already initialized');
      return;
    }

    if (!this.measurementId) {
      console.error('[GA4] Measurement ID not found in environment variables (VITE_GA4_MEASUREMENT_ID)');
      return;
    }

    try {
      ReactGA.initialize(this.measurementId);
      this.initialized = true;

      if (this.debug) {
        console.log('[GA4] Initialized with react-ga4 ID:', this.measurementId);
      }
    } catch (error) {
      console.error('[GA4] Initialization error:', error);
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) return;

    try {
      ReactGA.event({
        category: event.properties?.category || 'engagement',
        action: event.name,
        label: event.properties?.label,
        value: event.properties?.value,
      });

      if (this.debug) {
        console.log('[GA4] Event tracked:', event.name, event.properties);
      }
    } catch (error) {
      console.error('[GA4] Event tracking error:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageView: PageViewEvent): void {
    if (!this.initialized) return;

    try {
      ReactGA.send({
        hitType: "pageview",
        page: pageView.path,
        title: pageView.title
      });

      if (this.debug) {
        console.log('[GA4] Page view tracked:', pageView.path);
      }
    } catch (error) {
      console.error('[GA4] Page view tracking error:', error);
    }
  }

  /**
   * Identify user (set user ID)
   */
  identifyUser(user: AnalyticsUser): void {
    if (!this.initialized) return;

    try {
      ReactGA.set({ userId: user.userId });

      // Set user properties
      if (user.properties || user.tier) {
        ReactGA.set({
          user_tier: user.tier,
          ...user.properties
        });
      }

      if (this.debug) {
        console.log('[GA4] User identified:', user.userId);
      }
    } catch (error) {
      console.error('[GA4] User identification error:', error);
    }
  }

  /**
   * Track revenue/conversion
   */
  trackRevenue(revenue: RevenueEvent): void {
    if (!this.initialized) return;

    try {
      ReactGA.event({
        category: "Ecommerce",
        action: "Purchase",
        value: revenue.amount,
        label: revenue.productId
      });
      // GA4 Recommended Ecommerce event structure can be more complex, 
      // but this maps to the basic event for now.
    } catch (error) {
      console.error('[GA4] Revenue tracking error:', error);
    }
  }

  /**
   * Track conversion (goal completion)
   */
  trackConversion(conversionName: string, value?: number): void {
    if (!this.initialized) return;

    try {
      ReactGA.event({
        category: "Conversion",
        action: conversionName,
        value: value
      });
    } catch (error) {
      console.error('[GA4] Conversion tracking error:', error);
    }
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export const googleAnalytics = new GoogleAnalytics();
export default googleAnalytics;
