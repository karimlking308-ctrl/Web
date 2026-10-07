import React, { useEffect } from 'react';
import { SEO_CONFIGS, PageSeoConfig } from '../config/seo';

const DOMAIN = 'https://tindry.com';

interface SeoManagerProps {
  currentView: string;
}

export const SeoManager: React.FC<SeoManagerProps> = ({ currentView }) => {
  const config: PageSeoConfig = SEO_CONFIGS[currentView] || SEO_CONFIGS.home;
  const canonicalUrl = `${DOMAIN}${config.canonicalPath === '/' ? '' : config.canonicalPath}`;

  useEffect(() => {
    // 1. Update Title
    document.title = config.title;

    // 2. Helper to set or create meta tag
    const setMeta = (nameAttr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('name', 'description', config.description);

    // Open Graph
    setMeta('property', 'og:title', config.title);
    setMeta('property', 'og:description', config.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Tindry');
    setMeta('property', 'og:image', `${DOMAIN}/og-image.svg`);

    // Twitter / X
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', config.title);
    setMeta('name', 'twitter:description', config.description);
    setMeta('name', 'twitter:image', `${DOMAIN}/og-image.svg`);

    // Canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);

    // 3. Inject Structured Data (JSON-LD)
    let scriptTag = document.querySelector('script#tindry-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('id', 'tindry-jsonld');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    let structuredData: any = {
      '@context': 'https://schema.org',
      '@type': config.schemaType || 'WebApplication',
      name: config.title.split(' - ')[0].split(' | ')[0],
      url: canonicalUrl,
      description: config.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };

    if (config.schemaType === 'FAQPage' && config.faqItems) {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };
    } else if (config.schemaType === 'WebSite') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Tindry',
        url: DOMAIN,
        description: config.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${DOMAIN}/tools?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };
    }

    scriptTag.textContent = JSON.stringify(structuredData);
  }, [config, canonicalUrl]);

  return null;
};
