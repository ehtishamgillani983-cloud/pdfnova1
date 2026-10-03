import React, { useEffect, useLayoutEffect } from 'react';
import { analytics } from '../../services/analytics';

export interface BreadcrumbItemMeta {
  name: string;
  path: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItemMeta[];
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const PRODUCTION_ORIGIN = 'https://pdfnova1.vercel.app';
const DEFAULT_OG_IMAGE = `${PRODUCTION_ORIGIN}/og-image.svg`;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function setMetaTag(selector: string, attributeName: string, attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;
  const elements = Array.from(document.querySelectorAll(selector));
  let primaryElement = elements[0];
  if (!primaryElement) {
    primaryElement = document.createElement('meta');
    primaryElement.setAttribute(attributeName, attributeValue);
    document.head.appendChild(primaryElement);
  }
  primaryElement.setAttribute('content', content);
  for (let i = 1; i < elements.length; i++) {
    elements[i].remove();
  }
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  noIndex = false,
  breadcrumbs,
  jsonLd,
}) => {
  useIsomorphicLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Title
    document.title = title;

    // 2. Update Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Update Robots Metadata
    if (noIndex) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag(
        'meta[name="robots"]',
        'name',
        'robots',
        'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      );
    }

    // 4. Clean & Self-Referencing Canonical URL
    const rawPath = canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    const normalizedPath = cleanPath === '/' ? '/' : cleanPath.split('?')[0].split('#')[0].replace(/\/+$/, '');
    const fullCanonicalUrl = `${PRODUCTION_ORIGIN}${normalizedPath}`;

    const canonicalLinks = Array.from(document.querySelectorAll('link[rel="canonical"]'));
    if (noIndex) {
      // Remove canonical tag on 404 or private routes
      canonicalLinks.forEach((link) => link.remove());
    } else {
      let primaryCanonical = canonicalLinks[0];
      if (!primaryCanonical) {
        primaryCanonical = document.createElement('link');
        primaryCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(primaryCanonical);
      }
      primaryCanonical.setAttribute('href', fullCanonicalUrl);
      // Remove any extraneous or duplicate canonical tags
      for (let i = 1; i < canonicalLinks.length; i++) {
        canonicalLinks[i].remove();
      }
    }

    // 5. OpenGraph Tags
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'PDFNova');
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullCanonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', DEFAULT_OG_IMAGE);

    // 6. Twitter / X Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', fullCanonicalUrl);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_OG_IMAGE);

    // 7. Dynamic JSON-LD Structured Data
    const scriptId = 'pdfnova-dynamic-jsonld';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const graphItems: Record<string, any>[] = [];

    // Optional BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      graphItems.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, index) => {
          const cleanItemPath = b.path.startsWith('http')
            ? b.path
            : `${PRODUCTION_ORIGIN}${b.path === '/' ? '/' : b.path.split('?')[0].replace(/\/+$/, '')}`;
          return {
            '@type': 'ListItem',
            position: index + 1,
            name: b.name,
            item: cleanItemPath,
          };
        }),
      });
    }

    // Custom or graph JSON-LD
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        graphItems.push(...jsonLd);
      } else if (jsonLd['@graph']) {
        graphItems.push(...jsonLd['@graph']);
      } else {
        graphItems.push(jsonLd);
      }
    }

    if (graphItems.length > 0) {
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graphItems,
      });
    } else {
      scriptTag.textContent = '';
    }

    // 8. Track Page View
    analytics.trackPageView(normalizedPath, title);
  }, [title, description, canonicalPath, ogType, noIndex, breadcrumbs, jsonLd]);

  return null;
};
