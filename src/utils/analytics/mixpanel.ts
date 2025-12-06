// Mixpanel Browser Integration
// Full-featured behavioral analytics and funnel tracking

import mixpanel from 'mixpanel-browser';
import type {
  AnalyticsEvent,
  AnalyticsUser,
  RevenueEvent,
  MixpanelFunnel,
} from './analytics-types';

class MixpanelAnalytics {
  private token: string;
  private initialized: boolean = false;
  private debug: boolean = false;

  constructor() {
    this.token = import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN || 
                 import.meta.env.MIXPANEL_PROJECT_TOKEN || '';
    this.debug = import.meta.env.DEV;
  }

  /**
   * Initialize Mixpanel
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[Mixpanel] Already initialized');
      return;
    }

    if (!this.token) {
      console.error('[Mixpanel] Project token not found in environment variables');
      return;
    }

    try {
      mixpanel.init(this.token, {
        debug: this.debug,
        track_pageview: false, // We'll manually track page views
        persistence: 'localStorage',
        ip: true,
        api_host: 'https://api.mixpanel.com',
        loaded: () => {
          if (this.debug) {
            console.log('[Mixpanel] Loaded successfully');
          }
        },
      });

      this.initialized = true;

      if (this.debug) {
        console.log('[Mixpanel] Initialized with token:', this.token.substring(0, 10) + '...');
      }
    } catch (error) {
      console.error('[Mixpanel] Initialization error:', error);
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('[Mixpanel] Not initialized, queueing event:', event.name);
      return;
    }

    try {
      mixpanel.track(event.name, {
        ...event.properties,
        timestamp: event.timestamp || new Date(),
        user_id: event.userId,
        session_id: event.sessionId,
      });

      if (this.debug) {
        console.log('[Mixpanel] Event tracked:', event.name, event.properties);
      }
    } catch (error) {
      console.error('[Mixpanel] Event tracking error:', error);
    }
  }

  /**
   * Track page view with additional context
   */
  trackPageView(path: string, title?: string): void {
    if (!this.initialized) {
      console.warn('[Mixpanel] Not initialized, cannot track page view');
      return;
    }

    try {
      mixpanel.track('Page View', {
        page_path: path,
        page_title: title || document.title,
        page_url: window.location.href,
        referrer: document.referrer,
      });

      if (this.debug) {
        console.log('[Mixpanel] Page view tracked:', path);
      }
    } catch (error) {
      console.error('[Mixpanel] Page view tracking error:', error);
    }
  }

  /**
   * Identify user and set profile properties
   */
  identifyUser(user: AnalyticsUser): void {
    if (!this.initialized) {
      console.warn('[Mixpanel] Not initialized, cannot identify user');
      return;
    }

    try {
      // Identify user
      mixpanel.identify(user.userId);

      // Set user profile properties
      mixpanel.people.set({
        $email: user.email,
        $name: user.name,
        tier: user.tier,
        signup_date: user.signupDate?.toISOString(),
        ...user.properties,
      });

      // Set user properties for events
      mixpanel.register({
        user_id: user.userId,
        user_tier: user.tier,
      });

      if (this.debug) {
        console.log('[Mixpanel] User identified:', user.userId);
      }
    } catch (error) {
      console.error('[Mixpanel] User identification error:', error);
    }
  }

  /**
   * Track revenue with Mixpanel People
   */
  trackRevenue(revenue: RevenueEvent): void {
    if (!this.initialized) {
      console.warn('[Mixpanel] Not initialized, cannot track revenue');
      return;
    }

    try {
      // Track revenue event
      mixpanel.track('Purchase', {
        amount: revenue.amount,
        currency: revenue.currency,
        product_id: revenue.productId,
        quantity: revenue.quantity || 1,
        revenue_type: revenue.revenueType,
      });

      // Track revenue in Mixpanel People
      mixpanel.people.track_charge(revenue.amount, {
        $time: new Date().toISOString(),
        currency: revenue.currency,
        product_id: revenue.productId,
      });

      // Increment lifetime revenue
      mixpanel.people.increment('lifetime_revenue', revenue.amount);

      if (this.debug) {
        console.log('[Mixpanel] Revenue tracked:', revenue.amount, revenue.currency);
      }
    } catch (error) {
      console.error('[Mixpanel] Revenue tracking error:', error);
    }
  }

  /**
   * Set user properties (for segmentation)
   */
  setUserProperty(property: string, value: any): void {
    if (!this.initialized) return;

    try {
      mixpanel.people.set({ [property]: value });
      mixpanel.register({ [property]: value });
    } catch (error) {
      console.error('[Mixpanel] Set user property error:', error);
    }
  }

  /**
   * Increment user property (e.g., blog_count)
   */
  incrementUserProperty(property: string, by: number = 1): void {
    if (!this.initialized) return;

    try {
      mixpanel.people.increment(property, by);
    } catch (error) {
      console.error('[Mixpanel] Increment property error:', error);
    }
  }

  /**
   * Create/Update user profile
   */
  updateUserProfile(updates: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      mixpanel.people.set(updates);
    } catch (error) {
      console.error('[Mixpanel] Update user profile error:', error);
    }
  }

  /**
   * Track funnel step
   */
  trackFunnelStep(funnelName: string, stepName: string, properties?: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      mixpanel.track(`${funnelName} - ${stepName}`, {
        funnel_name: funnelName,
        funnel_step: stepName,
        ...properties,
      });

      if (this.debug) {
        console.log('[Mixpanel] Funnel step tracked:', funnelName, stepName);
      }
    } catch (error) {
      console.error('[Mixpanel] Funnel tracking error:', error);
    }
  }

  /**
   * Time an event (start timing)
   */
  timeEventStart(eventName: string): void {
    if (!this.initialized) return;

    try {
      mixpanel.time_event(eventName);
    } catch (error) {
      console.error('[Mixpanel] Time event start error:', error);
    }
  }

  /**
   * Track timed event (end timing)
   */
  trackTimedEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      mixpanel.track(eventName, properties);
    } catch (error) {
      console.error('[Mixpanel] Timed event tracking error:', error);
    }
  }

  /**
   * Create a cohort (group of users)
   */
  addToCohort(cohortName: string): void {
    if (!this.initialized) return;

    try {
      mixpanel.people.union({ cohorts: [cohortName] });
    } catch (error) {
      console.error('[Mixpanel] Add to cohort error:', error);
    }
  }

  /**
   * Register super properties (sent with every event)
   */
  registerSuperProperties(properties: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      mixpanel.register(properties);
    } catch (error) {
      console.error('[Mixpanel] Register super properties error:', error);
    }
  }

  /**
   * Reset user (clear identity)
   */
  reset(): void {
    if (!this.initialized) return;

    try {
      mixpanel.reset();
      if (this.debug) {
        console.log('[Mixpanel] User session reset');
      }
    } catch (error) {
      console.error('[Mixpanel] Reset error:', error);
    }
  }

  /**
   * Get distinct ID (user identifier)
   */
  getDistinctId(): string | undefined {
    if (!this.initialized) return undefined;

    try {
      return mixpanel.get_distinct_id();
    } catch (error) {
      console.error('[Mixpanel] Get distinct ID error:', error);
      return undefined;
    }
  }

  /**
   * Check if Mixpanel is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get Mixpanel instance (for advanced usage)
   */
  getInstance() {
    return mixpanel;
  }
}

// Export singleton instance
export const mixpanelAnalytics = new MixpanelAnalytics();
export default mixpanelAnalytics;
