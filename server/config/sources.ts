import { Category } from '../../src/types';

export interface NewsSourceConfig {
  id: string;
  name: string;
  type: 'rss' | 'api';
  url: string;
  defaultCategory: Category;
  enabled: boolean;
  priority: number; // 1 (highest) to 5
  language?: string;
  customHeaders?: Record<string, string>;
}

export const DEFAULT_NEWS_SOURCES: NewsSourceConfig[] = [
  {
    id: 'cnbc-finance',
    name: 'CNBC Finance',
    type: 'rss',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
    defaultCategory: 'markets',
    enabled: true,
    priority: 1,
  },
  {
    id: 'cnbc-top-news',
    name: 'CNBC Top Stories',
    type: 'rss',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
    defaultCategory: 'markets',
    enabled: true,
    priority: 1,
  },
  {
    id: 'cnbc-tech',
    name: 'CNBC Tech',
    type: 'rss',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910',
    defaultCategory: 'technology',
    enabled: true,
    priority: 2,
  },
  {
    id: 'bbc-business',
    name: 'BBC Business',
    type: 'rss',
    url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
    defaultCategory: 'economy',
    enabled: true,
    priority: 1,
  },
  {
    id: 'bbc-tech',
    name: 'BBC Technology',
    type: 'rss',
    url: 'http://feeds.bbci.co.uk/news/technology/rss.xml',
    defaultCategory: 'technology',
    enabled: true,
    priority: 2,
  },
  {
    id: 'guardian-business',
    name: 'The Guardian Business',
    type: 'rss',
    url: 'https://www.theguardian.com/business/rss',
    defaultCategory: 'business',
    enabled: true,
    priority: 2,
  },
  {
    id: 'guardian-economy',
    name: 'The Guardian Economics',
    type: 'rss',
    url: 'https://www.theguardian.com/business/economics/rss',
    defaultCategory: 'economy',
    enabled: true,
    priority: 2,
  },
  {
    id: 'sec-press-releases',
    name: 'U.S. SEC',
    type: 'rss',
    url: 'https://www.sec.gov/news/pressreleases.rss',
    defaultCategory: 'stocks',
    enabled: true,
    priority: 1,
    customHeaders: {
      'User-Agent': 'PULSE-Financial-Media/1.0 (editorial@sol-pump.store)',
    },
  },
  {
    id: 'fed-press',
    name: 'Federal Reserve',
    type: 'rss',
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
    defaultCategory: 'economy',
    enabled: true,
    priority: 1,
    customHeaders: {
      'User-Agent': 'PULSE-Financial-Media/1.0 (editorial@sol-pump.store)',
    },
  },
  {
    id: 'coindesk-news',
    name: 'CoinDesk',
    type: 'rss',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    defaultCategory: 'crypto',
    enabled: true,
    priority: 2,
  },
  {
    id: 'cointelegraph-news',
    name: 'CoinTelegraph',
    type: 'rss',
    url: 'https://cointelegraph.com/rss',
    defaultCategory: 'crypto',
    enabled: true,
    priority: 2,
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    type: 'rss',
    url: 'https://finance.yahoo.com/news/rssindex',
    defaultCategory: 'stocks',
    enabled: true,
    priority: 2,
  }
];

export function getActiveNewsSources(): NewsSourceConfig[] {
  // Allow environment override if specific sources are provided
  return DEFAULT_NEWS_SOURCES.filter(s => s.enabled);
}
