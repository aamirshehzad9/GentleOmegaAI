// Unified Analytics Manager
// Coordinates GA4, Mixpanel, and Amplitude tracking

import { googleAnalytics } from './google-analytics';
import { mixpanelAnalytics } from './mixpanel';
import { amplitudeAnalytics } from './amplitude';
import type {
  AnalyticsEvent,
  AnalyticsUser,
  PageViewEvent,
  RevenueEvent,
  AnalyticsConfig,
  AnalyticsPlatform,
} from './analytics-types';
import { ANALYTICS_EVENTS } from './analytics-types';

class UnifiedAnalytics {
  private platforms: Map<string, AnalyticsPlatform> = new Map();
  private initialized: boolean = false;
  private debug: boolean = false;
  private sessionStartTime: Date | null = null;

  constructor() {
    this.debug = import.meta.env.DEV;
  }

  /**
   * Initialize all enabled analytics platforms
   */
  async initialize(config?: Partial<AnalyticsConfig>): Promise<void> {
    if (this.initialized) {
      console.warn('[Analytics] Already initialized');
      return;
    }

    try {
      // Determine which platforms to enable
      const enableGA4 = config?.enabledPlatforms?.includes('GA4') ?? true;
      const enableMixpanel = config?.enabledPlatforms?.includes('Mixpanel') ?? true;
      const enableAmplitude = config?.enabledPlatforms?.includes('Amplitude') ?? true;

      // Initialize platforms in parallel
      const initPromises: Promise<void>[] = [];

      if (enableGA4) {
        initPromises.push(
          googleAnalytics.initialize().then(() => {
            this.platforms.set('GA4', {
              name: 'GA4',
              enabled: true,
              initialized: googleAnalytics.isInitialized(),
            });
          })
        );
      }

      if (enableMixpanel) {
        initPromises.push(
          mixpanelAnalytics.initialize().then(() => {
            this.platforms.set('Mixpanel', {
              name: 'Mixpanel',
              enabled: true,
              initialized: mixpanelAnalytics.isInitialized(),
            });
          })
        );
      }

      if (enableAmplitude) {
        initPromises.push(
          amplitudeAnalytics.initialize().then(() => {
            this.platforms.set('Amplitude', {
              name: 'Amplitude',
              enabled: true,
              initialized: amplitudeAnalytics.isInitialized(),
            });
          })
        );
      }

      // Wait for all platforms to initialize
      await Promise.all(initPromises);

      this.initialized = true;
      this.sessionStartTime = new Date();

      if (this.debug) {
        console.log('[Analytics] Unified analytics initialized');
        console.log('[Analytics] Platforms:', Array.from(this.platforms.keys()));
      }

      // Track initialization event
      this.trackEvent({
        name: 'Analytics Initialized',
        properties: {
          platforms: Array.from(this.platforms.keys()),
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('[Analytics] Initialization error:', error);
    }
  }

  /**
   * Track event across all platforms
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized, event queued:', event.name);
      // Could implement event queue here
      return;
    }

    // Track on all enabled platforms
    this.platforms.forEach((platform) => {
      if (!platform.initialized) return;

      try {
        switch (platform.name) {
          case 'GA4':
            googleAnalytics.trackEvent(event);
            break;
          case 'Mixpanel':
            mixpanelAnalytics.trackEvent(event);
            break;
          case 'Amplitude':
            amplitudeAnalytics.trackEvent(event);
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Error tracking event on ${platform.name}:`, error);
      }
    });

    if (this.debug) {
      console.log('[Analytics] Event tracked:', event.name, event.properties);
    }
  }

  /**
   * Track page view across all platforms
   */
  trackPageView(pageView: PageViewEvent): void {
    if (!this.initialized) return;

    this.platforms.forEach((platform) => {
      if (!platform.initialized) return;

      try {
        switch (platform.name) {
          case 'GA4':
            googleAnalytics.trackPageView(pageView);
            break;
          case 'Mixpanel':
            mixpanelAnalytics.trackPageView(pageView.path, pageView.title);
            break;
          case 'Amplitude':
            amplitudeAnalytics.trackPageView(pageView.path, pageView.title);
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Error tracking page view on ${platform.name}:`, error);
      }
    });
  }

  /**
   * Identify user across all platforms
   */
  identifyUser(user: AnalyticsUser): void {
    if (!this.initialized) return;

    this.platforms.forEach((platform) => {
      if (!platform.initialized) return;

      try {
        switch (platform.name) {
          case 'GA4':
            googleAnalytics.identifyUser(user);
            break;
          case 'Mixpanel':
            mixpanelAnalytics.identifyUser(user);
            break;
          case 'Amplitude':
            amplitudeAnalytics.identifyUser(user);
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Error identifying user on ${platform.name}:`, error);
      }
    });

    if (this.debug) {
      console.log('[Analytics] User identified:', user.userId);
    }
  }

  /**
   * Track revenue across all platforms
   */
  trackRevenue(revenue: RevenueEvent): void {
    if (!this.initialized) return;

    this.platforms.forEach((platform) => {
      if (!platform.initialized) return;

      try {
        switch (platform.name) {
          case 'GA4':
            googleAnalytics.trackRevenue(revenue);
            break;
          case 'Mixpanel':
            mixpanelAnalytics.trackRevenue(revenue);
            break;
          case 'Amplitude':
            amplitudeAnalytics.trackRevenue(revenue);
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Error tracking revenue on ${platform.name}:`, error);
      }
    });

    if (this.debug) {
      console.log('[Analytics] Revenue tracked:', revenue.amount, revenue.currency);
    }
  }

  /**
   * Track conversion across all platforms
   */
  trackConversion(conversionName: string, value?: number): void {
    if (!this.initialized) return;

    // Track as custom event with conversion type
    this.trackEvent({
      name: 'Conversion',
      properties: {
        conversion_name: conversionName,
        conversion_value: value,
        timestamp: new Date().toISOString(),
      },
    });

    // GA4 specific conversion tracking
    const ga4Platform = this.platforms.get('GA4');
    if (ga4Platform?.initialized) {
      googleAnalytics.trackConversion(conversionName, value);
    }
  }

  /**
   * Set user property across all platforms
   */
  setUserProperty(property: string, value: any): void {
    if (!this.initialized) return;

    this.platforms.forEach((platform) => {
      if (!platform.initialized) return;

      try {
        switch (platform.name) {
          case 'Mixpanel':
            mixpanelAnalytics.setUserProperty(property, value);
            break;
          case 'Amplitude':
            amplitudeAnalytics.setUserProperty(property, value);
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Error setting property on ${platform.name}:`, error);
      }
    });
  }

  /**
   * Increment user property (e.g., blog count)
   */
  incrementUserProperty(property: string, by: number = 1): void {
    if (!this.initialized) return;

    this.platforms.forEach((platform) => {
      if (!platform.initialized) return;

      try {
        switch (platform.name) {
          case 'Mixpanel':
            mixpanelAnalytics.incrementUserProperty(property, by);
            break;
          case 'Amplitude':
            amplitudeAnalytics.incrementUserProperty(property, by);
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Error incrementing property on ${platform.name}:`, error);
      }
    });
  }

  /**
   * Reset user session (logout)
   */
  reset(): void {
    if (!this.initialized) return;

    this.platforms.forEach((platform) => {
      if (!platform.initialized) return;

      try {
        switch (platform.name) {
          case 'Mixpanel':
            mixpanelAnalytics.reset();
            break;
          case 'Amplitude':
            amplitudeAnalytics.reset();
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Error resetting on ${platform.name}:`, error);
      }
    });

    if (this.debug) {
      console.log('[Analytics] User session reset');
    }
  }

  /**
   * Get session duration in seconds
   */
  getSessionDuration(): number {
    if (!this.sessionStartTime) return 0;
    return Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
  }

  /**
   * Get enabled platforms
   */
  getEnabledPlatforms(): AnalyticsPlatform[] {
    return Array.from(this.platforms.values());
  }

  /**
   * Check if specific platform is initialized
   */
  isPlatformInitialized(platformName: 'GA4' | 'Mixpanel' | 'Amplitude'): boolean {
    const platform = this.platforms.get(platformName);
    return platform?.initialized ?? false;
  }

  /**
   * Check if analytics is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  // ========== Convenience Methods for Common Events ==========

  /**
   * Track user signup
   */
  trackSignup(method: string, userId: string): void {
    this.trackEvent({
      name: ANALYTICS_EVENTS.USER_SIGNUP,
      userId,
      properties: {
        signup_method: method,
        signup_date: new Date().toISOString(),
      },
    });
  }

  /**
   * Track user login
   */
  trackLogin(method: string, userId: string): void {
    this.trackEvent({
      name: ANALYTICS_EVENTS.USER_LOGIN,
      userId,
      properties: {
        login_method: method,
      },
    });
  }

  /**
   * Track blog published
   */
  trackBlogPublished(blogId: string, wordCount: number, niche: string, userId: string): void {
    this.trackEvent({
      name: ANALYTICS_EVENTS.BLOG_PUBLISHED,
      userId,
      properties: {
        blog_id: blogId,
        word_count: wordCount,
        niche,
        published_date: new Date().toISOString(),
      },
    });

    // Increment user's published blog count
    this.incrementUserProperty('blogs_published', 1);
  }

  /**
   * Track AI content generation
   */
  trackAIContentGeneration(
    contentType: string,
    wordCount: number,
    model: string,
    userId: string
  ): void {
    this.trackEvent({
      name: ANALYTICS_EVENTS.AI_CONTENT_GENERATED,
      userId,
      properties: {
        content_type: contentType,
        word_count: wordCount,
        model,
        generated_at: new Date().toISOString(),
      },
    });

    // Increment AI usage count
    this.incrementUserProperty('ai_generations_count', 1);
  }

  /**
   * Track subscription event
   */
  trackSubscription(
    action: 'started' | 'upgraded' | 'downgraded' | 'cancelled',
    tier: string,
    amount: number,
    userId: string
  ): void {
    const eventMap = {
      started: ANALYTICS_EVENTS.SUBSCRIPTION_STARTED,
      upgraded: ANALYTICS_EVENTS.SUBSCRIPTION_UPGRADED,
      downgraded: ANALYTICS_EVENTS.SUBSCRIPTION_DOWNGRADED,
      cancelled: ANALYTICS_EVENTS.SUBSCRIPTION_CANCELLED,
    };

    this.trackEvent({
      name: eventMap[action],
      userId,
      properties: {
        subscription_tier: tier,
        amount,
        currency: 'USD',
        timestamp: new Date().toISOString(),
      },
    });

    // Update user tier property
    this.setUserProperty('subscription_tier', tier);

    // Track revenue for paid subscriptions
    if (action === 'started' || action === 'upgraded') {
      this.trackRevenue({
        amount,
        currency: 'USD',
        productId: `subscription_${tier.toLowerCase()}`,
        revenueType: 'subscription',
      });
    }
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, location: string, userId?: string): void {
    this.trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICK,
      userId,
      properties: {
        button_name: buttonName,
        button_location: location,
      },
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, success: boolean, userId?: string): void {
    this.trackEvent({
      name: ANALYTICS_EVENTS.FORM_SUBMIT,
      userId,
      properties: {
        form_name: formName,
        success,
      },
    });
  }

  /**
   * Track error
   */
  trackError(errorType: string, errorMessage: string, context?: string, userId?: string): void {
    this.trackEvent({
      name: ANALYTICS_EVENTS.ERROR_OCCURRED,
      userId,
      properties: {
        error_type: errorType,
        error_message: errorMessage,
        context,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

// Export singleton instance
export const analytics = new UnifiedAnalytics();
export default analytics;

// Export convenience hook for React
export const useAnalytics = () => analytics;
