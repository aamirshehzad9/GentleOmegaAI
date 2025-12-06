// Amplitude Analytics Integration with Session Replay
// Advanced product analytics and user behavior tracking

import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import type {
  AnalyticsEvent,
  AnalyticsUser,
  RevenueEvent,
} from './analytics-types';

class AmplitudeAnalytics {
  private apiKey: string;
  private initialized: boolean = false;
  private debug: boolean = false;
  private sessionReplayEnabled: boolean = true;

  constructor() {
    this.apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY || 
                  import.meta.env.AMPLITUDE_API_KEY || '';
    this.debug = import.meta.env.DEV;
  }

  /**
   * Initialize Amplitude with session replay
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[Amplitude] Already initialized');
      return;
    }

    if (!this.apiKey) {
      console.error('[Amplitude] API key not found in environment variables');
      return;
    }

    try {
      // Add session replay plugin if enabled
      if (this.sessionReplayEnabled) {
        const sessionReplay = sessionReplayPlugin({
          sampleRate: 1.0, // Record 100% of sessions (adjust for production)
        });
        amplitude.add(sessionReplay);
      }

      // Initialize Amplitude
      amplitude.init(this.apiKey, undefined, {
        autocapture: {
          attribution: true,
          pageViews: false, // We'll manually track page views
          sessions: true,
          formInteractions: true,
          fileDownloads: true,
          elementInteractions: true,
        },
        defaultTracking: {
          sessions: true,
          pageViews: false,
          formInteractions: true,
          fileDownloads: true,
        },
        logLevel: this.debug ? amplitude.Types.LogLevel.Debug : amplitude.Types.LogLevel.Warn,
      });

      this.initialized = true;

      if (this.debug) {
        console.log('[Amplitude] Initialized with API key:', this.apiKey.substring(0, 10) + '...');
        console.log('[Amplitude] Session replay enabled:', this.sessionReplayEnabled);
      }
    } catch (error) {
      console.error('[Amplitude] Initialization error:', error);
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('[Amplitude] Not initialized, queueing event:', event.name);
      return;
    }

    try {
      amplitude.track(event.name, {
        ...event.properties,
        timestamp: event.timestamp,
        user_id: event.userId,
        session_id: event.sessionId,
      });

      if (this.debug) {
        console.log('[Amplitude] Event tracked:', event.name, event.properties);
      }
    } catch (error) {
      console.error('[Amplitude] Event tracking error:', error);
    }
  }

  /**
   * Track page view with context
   */
  trackPageView(path: string, title?: string, properties?: Record<string, any>): void {
    if (!this.initialized) {
      console.warn('[Amplitude] Not initialized, cannot track page view');
      return;
    }

    try {
      amplitude.track('Page View', {
        page_path: path,
        page_title: title || document.title,
        page_url: window.location.href,
        referrer: document.referrer,
        ...properties,
      });

      if (this.debug) {
        console.log('[Amplitude] Page view tracked:', path);
      }
    } catch (error) {
      console.error('[Amplitude] Page view tracking error:', error);
    }
  }

  /**
   * Identify user with user properties
   */
  identifyUser(user: AnalyticsUser): void {
    if (!this.initialized) {
      console.warn('[Amplitude] Not initialized, cannot identify user');
      return;
    }

    try {
      // Set user ID
      amplitude.setUserId(user.userId);

      // Create identify event with user properties
      const identifyEvent = new amplitude.Identify();
      
      if (user.email) identifyEvent.set('email', user.email);
      if (user.name) identifyEvent.set('name', user.name);
      if (user.tier) identifyEvent.set('tier', user.tier);
      if (user.signupDate) identifyEvent.set('signup_date', user.signupDate.toISOString());

      // Set additional properties
      if (user.properties) {
        Object.entries(user.properties).forEach(([key, value]) => {
          identifyEvent.set(key, value);
        });
      }

      // Send identify event
      amplitude.identify(identifyEvent);

      if (this.debug) {
        console.log('[Amplitude] User identified:', user.userId);
      }
    } catch (error) {
      console.error('[Amplitude] User identification error:', error);
    }
  }

  /**
   * Track revenue event
   */
  trackRevenue(revenue: RevenueEvent): void {
    if (!this.initialized) {
      console.warn('[Amplitude] Not initialized, cannot track revenue');
      return;
    }

    try {
      // Create revenue event
      const revenueEvent = new amplitude.Revenue();
      revenueEvent.setPrice(revenue.amount);
      revenueEvent.setQuantity(revenue.quantity || 1);
      
      if (revenue.productId) {
        revenueEvent.setProductId(revenue.productId);
      }
      
      if (revenue.revenueType) {
        revenueEvent.setRevenueType(revenue.revenueType);
      }

      // Track revenue
      amplitude.revenue(revenueEvent);

      // Also track as regular event for better visibility
      amplitude.track('Purchase', {
        amount: revenue.amount,
        currency: revenue.currency,
        product_id: revenue.productId,
        quantity: revenue.quantity || 1,
        revenue_type: revenue.revenueType,
      });

      if (this.debug) {
        console.log('[Amplitude] Revenue tracked:', revenue.amount, revenue.currency);
      }
    } catch (error) {
      console.error('[Amplitude] Revenue tracking error:', error);
    }
  }

  /**
   * Set user property
   */
  setUserProperty(property: string, value: any): void {
    if (!this.initialized) return;

    try {
      const identify = new amplitude.Identify();
      identify.set(property, value);
      amplitude.identify(identify);
    } catch (error) {
      console.error('[Amplitude] Set user property error:', error);
    }
  }

  /**
   * Increment user property (e.g., blogs_published)
   */
  incrementUserProperty(property: string, by: number = 1): void {
    if (!this.initialized) return;

    try {
      const identify = new amplitude.Identify();
      identify.add(property, by);
      amplitude.identify(identify);
    } catch (error) {
      console.error('[Amplitude] Increment property error:', error);
    }
  }

  /**
   * Append to user property array
   */
  appendToUserProperty(property: string, value: any): void {
    if (!this.initialized) return;

    try {
      const identify = new amplitude.Identify();
      identify.append(property, value);
      amplitude.identify(identify);
    } catch (error) {
      console.error('[Amplitude] Append to property error:', error);
    }
  }

  /**
   * Set user properties (multiple at once)
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      const identify = new amplitude.Identify();
      Object.entries(properties).forEach(([key, value]) => {
        identify.set(key, value);
      });
      amplitude.identify(identify);
    } catch (error) {
      console.error('[Amplitude] Set user properties error:', error);
    }
  }

  /**
   * Set group (for B2B analytics)
   */
  setGroup(groupType: string, groupName: string | string[]): void {
    if (!this.initialized) return;

    try {
      amplitude.setGroup(groupType, groupName);
    } catch (error) {
      console.error('[Amplitude] Set group error:', error);
    }
  }

  /**
   * Track time to complete an action
   */
  trackTimedEvent(eventName: string, duration: number, properties?: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      amplitude.track(eventName, {
        ...properties,
        duration_seconds: duration,
      });
    } catch (error) {
      console.error('[Amplitude] Timed event tracking error:', error);
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): number | undefined {
    if (!this.initialized) return undefined;

    try {
      return amplitude.getSessionId();
    } catch (error) {
      console.error('[Amplitude] Get session ID error:', error);
      return undefined;
    }
  }

  /**
   * Get device ID
   */
  getDeviceId(): string | undefined {
    if (!this.initialized) return undefined;

    try {
      return amplitude.getDeviceId();
    } catch (error) {
      console.error('[Amplitude] Get device ID error:', error);
      return undefined;
    }
  }

  /**
   * Reset user session
   */
  reset(): void {
    if (!this.initialized) return;

    try {
      amplitude.reset();
      if (this.debug) {
        console.log('[Amplitude] User session reset');
      }
    } catch (error) {
      console.error('[Amplitude] Reset error:', error);
    }
  }

  /**
   * Flush events (send immediately)
   */
  async flush(): Promise<void> {
    if (!this.initialized) return;

    try {
      await amplitude.flush();
    } catch (error) {
      console.error('[Amplitude] Flush error:', error);
    }
  }

  /**
   * Check if Amplitude is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Enable/disable session replay
   */
  setSessionReplay(enabled: boolean): void {
    this.sessionReplayEnabled = enabled;
  }
}

// Export singleton instance
export const amplitudeAnalytics = new AmplitudeAnalytics();
export default amplitudeAnalytics;
