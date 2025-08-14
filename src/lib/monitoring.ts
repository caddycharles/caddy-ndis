/**
 * Monitoring and Analytics Module
 * Provides unified interface for tracking events, errors, and performance
 */

interface MonitoringConfig {
  isDevelopment: boolean;
  sentryDsn?: string;
  posthogKey?: string;
}

class MonitoringService {
  private config: MonitoringConfig;
  private initialized = false;

  constructor() {
    this.config = {
      isDevelopment: import.meta.env.DEV,
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
      posthogKey: import.meta.env.VITE_POSTHOG_API_KEY,
    };
  }

  /**
   * Initialize monitoring services
   */
  async initialize() {
    if (this.initialized) return;

    // Initialize Sentry for error tracking (if configured)
    if (this.config.sentryDsn && !this.config.isDevelopment) {
      try {
        // Dynamic import for optional dependency
        // @ts-expect-error - Optional dependency
        const Sentry = await import("@sentry/react").catch(() => null);
        if (Sentry) {
          Sentry.init({
            dsn: this.config.sentryDsn,
            environment: import.meta.env.MODE,
            tracesSampleRate: 0.1,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
          });
          console.log("Sentry initialized");
        }
      } catch (error) {
        console.error("Failed to initialize Sentry:", error);
      }
    }

    // Initialize PostHog for analytics (if configured)
    if (this.config.posthogKey && !this.config.isDevelopment) {
      try {
        // Dynamic import for optional dependency
        // @ts-expect-error - Optional dependency
        const posthog = await import("posthog-js").catch(() => null);
        if (posthog?.default) {
          posthog.default.init(this.config.posthogKey, {
            api_host:
              import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
            capture_pageview: true,
            capture_pageleave: true,
          });
          console.log("PostHog initialized");
        }
      } catch (error) {
        console.error("Failed to initialize PostHog:", error);
      }
    }

    this.initialized = true;
  }

  /**
   * Track custom events
   */
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (this.config.isDevelopment) {
      console.log("[Analytics Event]", eventName, properties);
      return;
    }

    // Send to PostHog if available
    if (window.posthog) {
      window.posthog.capture(eventName, properties);
    }

    // Send to Google Analytics if available
    if (window.gtag) {
      window.gtag("event", eventName, properties);
    }
  }

  /**
   * Track page views
   */
  trackPageView(path: string, title?: string) {
    this.trackEvent("page_view", {
      path,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  /**
   * Track user identification
   */
  identify(userId: string, traits?: Record<string, any>) {
    if (this.config.isDevelopment) {
      console.log("[Analytics Identify]", userId, traits);
      return;
    }

    // PostHog identify
    if (window.posthog) {
      window.posthog.identify(userId, traits);
    }

    // Sentry user context
    if (window.Sentry) {
      window.Sentry.setUser({
        id: userId,
        ...traits,
      });
    }
  }

  /**
   * Track errors
   */
  captureError(error: Error, context?: Record<string, any>) {
    console.error("Error captured:", error, context);

    if (this.config.isDevelopment) return;

    // Send to Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context,
      });
    }

    // Track as event
    this.trackEvent("error", {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit = "ms") {
    this.trackEvent("performance", {
      metric,
      value,
      unit,
    });

    // Send to browser performance API
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(metric);
      } catch {
        // Ignore if marks don't exist
      }
    }
  }

  /**
   * Track API calls
   */
  trackApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number
  ) {
    this.trackEvent("api_call", {
      endpoint,
      method,
      statusCode,
      duration,
      success: statusCode >= 200 && statusCode < 300,
    });
  }

  /**
   * Create performance observer
   */
  observePerformance() {
    if (!window.PerformanceObserver) return;

    // Observe Largest Contentful Paint
    try {
      const lcpObserver = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance("lcp", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch {
      // LCP not supported
    }

    // Observe First Input Delay
    try {
      const fidObserver = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.trackPerformance("fid", entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch {
      // FID not supported
    }
  }
}

// Create singleton instance
export const monitoring = new MonitoringService();

// Auto-initialize on import
if (typeof window !== "undefined") {
  monitoring.initialize();
  monitoring.observePerformance();
}

// Extend window interface
declare global {
  interface Window {
    Sentry?: any;
    posthog?: any;
    gtag?: (...args: any[]) => void;
  }
}
