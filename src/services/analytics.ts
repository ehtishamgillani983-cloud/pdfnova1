/**
 * Analytics Service for PDFNova (SZ.PDF)
 * Prepares events for Google Analytics 4 (GA4), Google Search Console,
 * and Supabase analytics_events table.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export type AnalyticsEventType =
  | 'page_view'
  | 'tool_opened'
  | 'file_uploaded'
  | 'processing_started'
  | 'processing_completed'
  | 'processing_failed'
  | 'download_clicked'
  | 'blog_viewed'
  | 'contact_submitted';

export interface AnalyticsEventPayload {
  toolSlug?: string;
  fileName?: string;
  fileSizeBytes?: number;
  durationMs?: number;
  error?: string;
  [key: string]: any;
}

class AnalyticsService {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId && gaId !== 'G-XXXXXXXXXX') {
      // Dynamic injection of Google Analytics script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, { send_page_view: false });
      this.isInitialized = true;
    }
  }

  public track(event: AnalyticsEventType, payload: AnalyticsEventPayload = {}) {
    // 1. Send to Google Analytics 4 if configured
    if (window.gtag) {
      window.gtag('event', event, payload);
    }

    // 2. Store in local analytics cache for hidden admin metrics review
    try {
      const stored = localStorage.getItem('pdfnova_analytics_events');
      const list = stored ? JSON.parse(stored) : [];
      list.push({
        id: Math.random().toString(36).substring(2, 9),
        event,
        payload,
        timestamp: new Date().toISOString(),
      });
      // Keep last 100 events in local storage
      if (list.length > 100) list.shift();
      localStorage.setItem('pdfnova_analytics_events', JSON.stringify(list));
    } catch {
      // Ignore local storage quota limits
    }
  }

  public trackPageView(path: string, title: string) {
    this.track('page_view', { page_path: path, page_title: title });
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }
  }
}

export const analytics = new AnalyticsService();
