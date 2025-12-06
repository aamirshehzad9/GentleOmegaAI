// Google Analytics 4 Browser Integration (Client-side)
// Uses gtag.js for browser tracking

import type { 
  AnalyticsEvent, 
  AnalyticsUser, 
  PageViewEvent, 
  RevenueEvent,
  GA4Metric 
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
   * Initialize Google Analytics 4
   * Loads gtag.js script and configures GA4
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[GA4] Already initialized');
      return;
    }

    if (!this.measurementId) {
      console.error('[GA4] Measurement ID not found in environment variables');
      return;
    }

    try {
      // Load gtag.js script
      await this.loadGtagScript();
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        send_page_view: false, // We'll manually track page views
        anonymize_ip: true,
      });

      this.initialized = true;
      
      if (this.debug) {
        console.log('[GA4] Initialized with Measurement ID:', this.measurementId);
      }
    } catch (error) {
      console.error('[GA4] Initialization error:', error);
    }
  }

  /**
   * Load gtag.js script dynamically
   */
  private loadGtagScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already loaded
      if (document.querySelector(`script[src*="gtag/js"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load gtag.js'));
      document.head.appendChild(script);
    });
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('[GA4] Not initialized, queueing event:', event.name);
      return;
    }

    try {
      window.gtag('event', event.name, {
        ...event.properties,
        event_category: event.properties?.category || 'engagement',
        event_label: event.properties?.label,
        value: event.properties?.value,
        user_id: event.userId,
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
    if (!this.initialized) {
      console.warn('[GA4] Not initialized, cannot track page view');
      return;
    }

    try {
      window.gtag('event', 'page_view', {
        page_path: pageView.path,
        page_title: pageView.title || document.title,
        page_location: window.location.href,
        page_referrer: pageView.referrer || document.referrer,
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
    if (!this.initialized) {
      console.warn('[GA4] Not initialized, cannot identify user');
      return;
    }

    try {
      window.gtag('config', this.measurementId, {
        user_id: user.userId,
      });

      // Set user properties
      window.gtag('set', 'user_properties', {
        user_tier: user.tier,
        signup_date: user.signupDate?.toISOString(),
        ...user.properties,
      });

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
    if (!this.initialized) {
      console.warn('[GA4] Not initialized, cannot track revenue');
      return;
    }

    try {
      window.gtag('event', 'purchase', {
        currency: revenue.currency,
        value: revenue.amount,
        transaction_id: `txn_${Date.now()}`,
        items: revenue.productId ? [{
          item_id: revenue.productId,
          item_name: revenue.revenueType || 'Subscription',
          quantity: revenue.quantity || 1,
          price: revenue.amount,
        }] : [],
      });

      if (this.debug) {
        console.log('[GA4] Revenue tracked:', revenue.amount, revenue.currency);
      }
    } catch (error) {
      console.error('[GA4] Revenue tracking error:', error);
    }
  }

  /**
   * Track conversion (goal completion)
   */
  trackConversion(conversionName: string, value?: number): void {
    if (!this.initialized) {
      console.warn('[GA4] Not initialized, cannot track conversion');
      return;
    }

    try {
      window.gtag('event', 'conversion', {
        send_to: this.measurementId,
        conversion_name: conversionName,
        value: value,
      });

      if (this.debug) {
        console.log('[GA4] Conversion tracked:', conversionName);
      }
    } catch (error) {
      console.error('[GA4] Conversion tracking error:', error);
    }
  }

  /**
   * Set custom dimension
   */
  setCustomDimension(name: string, value: string): void {
    if (!this.initialized) return;

    try {
      window.gtag('set', { [name]: value });
    } catch (error) {
      console.error('[GA4] Custom dimension error:', error);
    }
  }

  /**
   * Check if GA4 is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get measurement ID
   */
  getMeasurementId(): string {
    return this.measurementId;
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Export singleton instance
export const googleAnalytics = new GoogleAnalytics();
export default googleAnalytics;
