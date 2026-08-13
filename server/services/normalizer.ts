import crypto from 'crypto';
import { Article, Category } from '../../src/types';
import { NewsSourceConfig } from '../config/sources';

// List of verified financial tickers to detect in titles and summaries
const VERIFIED_STOCK_TICKERS = new Set([
  'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.A', 'BRK.B',
  'JPM', 'JNJ', 'V', 'WMT', 'PG', 'MA', 'UNH', 'HD', 'XOM', 'DIS', 'BAC',
  'VZ', 'ADBE', 'NFLX', 'AMD', 'INTC', 'CRM', 'QCOM', 'CSCO', 'TXN', 'NKE',
  'PFE', 'ABT', 'ORCL', 'COST', 'BABA', 'TSM', 'ASML', 'PLTR', 'ARM', 'COIN'
]);

const VERIFIED_CRYPTO_SYMBOLS = new Set([
  'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'LINK', 'NEAR',
  'MATIC', 'SUI', 'BNB', 'USDT', 'USDC', 'SHIB', 'UNI', 'APT', 'TON'
]);

/**
 * Safely extract string from any RSS node structure (string, object, or array)
 */
export function extractString(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    if (typeof val._ === 'string') return val._;
    if (typeof val.value === 'string') return val.value;
    if (typeof val['#text'] === 'string') return val['#text'];
    if (typeof val.title === 'string') return val.title;
    if (typeof val.name === 'string') return val.name;
    if (Array.isArray(val)) {
      return val.map(extractString).join(' ');
    }
  }
  return '';
}

/**
 * Strip HTML tags and unescape common HTML entities
 */
export function sanitizeHtml(rawInput?: any): string {
  const rawText = extractString(rawInput);
  if (!rawText) return '';
  return rawText
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncate summary cleanly at sentence boundary (approx 200-320 chars)
 */
export function cleanSummary(rawSummary?: any, fallbackTitle?: string): string {
  const sanitized = sanitizeHtml(rawSummary);
  if (!sanitized || sanitized.length < 20) {
    return fallbackTitle
      ? `${sanitizeHtml(fallbackTitle)} — Full editorial report available at original source.`
      : 'Full editorial report available at original source.';
  }

  if (sanitized.length <= 280) {
    return sanitized;
  }

  // Find nearest period or question mark before 280 chars
  const sub = sanitized.slice(0, 280);
  const lastPeriod = Math.max(sub.lastIndexOf('.'), sub.lastIndexOf('?'), sub.lastIndexOf('!'));
  if (lastPeriod > 140) {
    return sanitized.slice(0, lastPeriod + 1).trim();
  }

  return sub.slice(0, sub.lastIndexOf(' ')).trim() + '...';
}

/**
 * Generate a clean, SEO-friendly slug
 */
export function createSlug(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 75);

  const hash = Math.abs(
    id.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(36).slice(0, 6);

  return `${base || 'financial-report'}-${hash}`;
}

/**
 * Detect tickers from text
 */
export function extractTickers(text: string): string[] {
  const words = text.toUpperCase().replace(/[^A-Z0-9.\s]/g, ' ').split(/\s+/);
  const found = new Set<string>();

  for (const word of words) {
    if (VERIFIED_STOCK_TICKERS.has(word) || VERIFIED_CRYPTO_SYMBOLS.has(word)) {
      found.add(word);
    }
  }

  return Array.from(found).slice(0, 5);
}

/**
 * Map item to most appropriate Category based on title, description, and source defaults
 */
export function determineCategory(
  title: string,
  summary: string,
  categories: any[] | undefined,
  defaultCat: Category
): Category {
  const categoryStrings = Array.isArray(categories) ? categories.map(extractString).join(' ') : '';
  const combined = `${title} ${summary} ${categoryStrings}`.toLowerCase();

  if (
    combined.includes('bitcoin') ||
    combined.includes('ethereum') ||
    combined.includes('crypto') ||
    combined.includes('blockchain') ||
    combined.includes('solana') ||
    combined.includes('altcoin') ||
    combined.includes('stablecoin') ||
    combined.includes('etf btc') ||
    combined.includes('binance') ||
    combined.includes('coinbase')
  ) {
    return 'crypto';
  }

  if (
    combined.includes('fed ') ||
    combined.includes('federal reserve') ||
    combined.includes('inflation') ||
    combined.includes('cpi ') ||
    combined.includes('interest rate') ||
    combined.includes('central bank') ||
    combined.includes('ecb') ||
    combined.includes('gdp') ||
    combined.includes('treasury yield') ||
    combined.includes('labor market') ||
    combined.includes('unemployment') ||
    combined.includes('recession')
  ) {
    return 'economy';
  }

  if (
    combined.includes('earnings') ||
    combined.includes('s&p 500') ||
    combined.includes('dow jones') ||
    combined.includes('nasdaq') ||
    combined.includes('nyse') ||
    combined.includes('shares rise') ||
    combined.includes('shares fall') ||
    combined.includes('dividend') ||
    combined.includes('ipo ') ||
    combined.includes('stock market') ||
    combined.includes('quarterly revenue') ||
    combined.includes('sec charges') ||
    combined.includes('sec filing')
  ) {
    return 'stocks';
  }

  if (
    combined.includes('semiconductor') ||
    combined.includes('artificial intelligence') ||
    combined.includes(' ai ') ||
    combined.includes('chips') ||
    combined.includes('nvidia') ||
    combined.includes('cloud compute') ||
    combined.includes('cybersecurity') ||
    combined.includes('software') ||
    combined.includes('metaverse') ||
    combined.includes('quantum')
  ) {
    return 'technology';
  }

  if (
    combined.includes('oil ') ||
    combined.includes('crude') ||
    combined.includes('brent') ||
    combined.includes('natural gas') ||
    combined.includes('opec') ||
    combined.includes('energy sector') ||
    combined.includes('solar energy') ||
    combined.includes('clean power')
  ) {
    return 'energy';
  }

  if (
    combined.includes('deep dive') ||
    combined.includes('market outlook') ||
    combined.includes('valuation analysis') ||
    combined.includes('macro forecast') ||
    combined.includes('analyst commentary') ||
    combined.includes('special report')
  ) {
    return 'analysis';
  }

  return defaultCat || 'markets';
}

/**
 * Detect if article warrants Breaking classification
 */
export function isBreakingStory(title: string, publishedTimestamp: number, priority: number): boolean {
  const now = Date.now();
  const ageHours = (now - publishedTimestamp) / (1000 * 60 * 60);

  // Must be under 4 hours old and from high priority source
  if (ageHours > 4 || priority > 2) return false;

  const t = title.toUpperCase();
  const breakingTerms = [
    'BREAKING:',
    'ALERT:',
    'JUST IN:',
    'SURGES ABOVE',
    'PLUNGES BELOW',
    'RATE CUT',
    'RATE HIKE',
    'EMERGENCY',
    'SANCTIONS',
    'CRISIS',
    'FILES BANKRUPTCY',
    'HISTORIC HIGH',
    'ACQUIRES',
    'HALTS TRADING'
  ];

  return breakingTerms.some(term => t.includes(term));
}

/**
 * Format relative date string (e.g. "12m ago", "2h ago", "Today, 14:30")
 */
export function formatPublishedAt(dateString?: string): { formatted: string; timestamp: number } {
  let timestamp = Date.now();
  if (dateString) {
    const parsed = Date.parse(dateString);
    if (!isNaN(parsed)) {
      timestamp = parsed;
    }
  }

  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) return { formatted: 'Just now', timestamp };
  if (diffSec < 3600) return { formatted: `${Math.floor(diffSec / 60)}m ago`, timestamp };
  if (diffSec < 86400) return { formatted: `${Math.floor(diffSec / 3600)}h ago`, timestamp };
  if (diffSec < 172800) return { formatted: 'Yesterday', timestamp };

  const dateObj = new Date(timestamp);
  const formatted = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return { formatted, timestamp };
}

/**
 * Normalize raw RSS item into PULSE Article model
 */
export function normalizeRssItem(
  item: any,
  source: NewsSourceConfig
): Article | null {
  const rawTitle = extractString(item.title);
  if (!rawTitle || rawTitle.trim().length < 5) {
    return null;
  }

  const title = sanitizeHtml(rawTitle);
  let link = extractString(item.link || item.guid || item.url);
  if (typeof link !== 'string' || !link.startsWith('http')) {
    if (item.guid && typeof item.guid === 'object' && typeof item.guid._ === 'string' && item.guid._.startsWith('http')) {
      link = item.guid._;
    } else {
      return null;
    }
  }

  const rawSummary = extractString(item.contentSnippet || item.summary || item.description || item.content);
  const summary = cleanSummary(rawSummary, title);

  const { formatted: publishedAt, timestamp: publishedTimestamp } = formatPublishedAt(
    item.isoDate || item.pubDate || item.published || item.created
  );

  const category = determineCategory(
    title,
    summary,
    item.categories,
    source.defaultCategory
  );

  const tickers = extractTickers(`${title} ${summary}`);

  // Extract tags from RSS categories or tickers
  const tagsSet = new Set<string>();
  if (Array.isArray(item.categories)) {
    for (const c of item.categories) {
      const catStr = sanitizeHtml(c);
      if (catStr && catStr.length > 1 && catStr.length < 30) {
        tagsSet.add(catStr);
      }
    }
  }
  tickers.forEach(t => tagsSet.add(t));
  tagsSet.add(category.charAt(0).toUpperCase() + category.slice(1));
  tagsSet.add(source.name);

  // Extract Image if provided legitimately in enclosure or media
  let imageUrl: string | undefined = undefined;
  if (item.enclosure && item.enclosure.url && typeof item.enclosure.url === 'string') {
    imageUrl = item.enclosure.url;
  } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    imageUrl = item['media:content'].$.url;
  } else if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    imageUrl = item['media:thumbnail'].$.url;
  }

  const linkHash = crypto.createHash('sha256').update(link).digest('hex').slice(0, 16);
  const id = `${source.id}-${linkHash}`;
  const slug = createSlug(title, id);
  const isBreaking = isBreakingStory(title, publishedTimestamp, source.priority);

  // Compute estimated read time
  const wordCount = (title.split(' ').length + summary.split(' ').length) + 150;
  const readTimeMinutes = Math.max(2, Math.ceil(wordCount / 180));

  return {
    id,
    slug,
    title,
    summary,
    content: undefined, // Phase 2 adheres to strict copyright: we provide original source summary + direct attribution
    category,
    source: source.name,
    sourceUrl: link,
    imageUrl,
    publishedAt,
    publishedTimestamp,
    tags: Array.from(tagsSet).slice(0, 6),
    tickers: tickers.length > 0 ? tickers : undefined,
    readTimeMinutes,
    isBreaking,
    isFeatured: false,
    sourceId: source.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
