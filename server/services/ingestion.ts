import Parser from 'rss-parser';
import { getActiveNewsSources, NewsSourceConfig } from '../config/sources';
import { normalizeRssItem } from './normalizer';
import { deduplicateArticles } from './deduplicator';
import { newsStorage, IngestionReport } from './storage';
import { Article } from '../../src/types';

const parser = new Parser({
  timeout: 9000,
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['media:group', 'mediaGroup'],
      ['content:encoded', 'contentEncoded'],
      ['enclosure', 'enclosure'],
      ['image', 'image'],
      ['dc:creator', 'creator'],
    ],
  },
});

let isIngesting = false;
let scheduledTimer: NodeJS.Timeout | null = null;

/**
 * Fetch and parse a single news source using native fetch for superior decompression & redirects
 */
async function fetchSource(source: NewsSourceConfig): Promise<{
  sourceId: string;
  success: boolean;
  articles: Article[];
  error?: string;
}> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 PULSE-Financial/1.0',
      'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html;q=0.9, */*;q=0.8',
      ...(source.customHeaders || {}),
    };

    const response = await fetch(source.url, {
      headers,
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);
    const validArticles: Article[] = [];

    if (Array.isArray(feed.items)) {
      for (const item of feed.items) {
        const normalized = normalizeRssItem(item, source);
        if (normalized) {
          validArticles.push(normalized);
        }
      }
    }

    return {
      sourceId: source.id,
      success: true,
      articles: validArticles,
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown network/parse failure';
    console.warn(`[Ingestion] Source "${source.name}" (${source.id}) failed: ${errorMsg}`);
    return {
      sourceId: source.id,
      success: false,
      articles: [],
      error: errorMsg,
    };
  }
}

/**
 * Run full ingestion pipeline across all configured sources
 */
export async function ingestAllSources(): Promise<IngestionReport> {
  if (isIngesting) {
    console.log('[Ingestion] Ingestion already in progress, skipping overlapping run.');
    const lastReport = await newsStorage.getLastIngestionReport();
    if (lastReport) return lastReport;
    const stats = await newsStorage.getStats();
    return {
      timestamp: new Date().toISOString(),
      totalSources: 0,
      successfulSources: [],
      failedSources: [],
      rawItemsParsed: 0,
      uniqueArticlesStored: 0,
      duplicatesMerged: 0,
      totalInDatabase: stats.totalArticles,
    };
  }

  isIngesting = true;
  const sources = getActiveNewsSources();
  const startTime = Date.now();
  console.log(`[Ingestion] Starting ingestion across ${sources.length} sources...`);

  const successfulSources: string[] = [];
  const failedSources: Array<{ sourceId: string; error: string }> = [];
  const rawArticles: Article[] = [];

  // Fetch feeds concurrently with isolated error boundaries
  const results = await Promise.allSettled(sources.map(s => fetchSource(s)));

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const source = sources[i];

    if (res.status === 'fulfilled') {
      const outcome = res.value;
      if (outcome.success) {
        successfulSources.push(outcome.sourceId);
        rawArticles.push(...outcome.articles);
      } else {
        failedSources.push({
          sourceId: outcome.sourceId,
          error: outcome.error || 'Failed to ingest',
        });
      }
    } else {
      failedSources.push({
        sourceId: source.id,
        error: res.reason?.message || 'Promise rejection',
      });
    }
  }

  // Deduplicate and merge multi-source attribution
  const { uniqueArticles, duplicatesMerged } = deduplicateArticles(rawArticles);

  // Persist to SQL database
  const saveStats = await newsStorage.saveArticles(uniqueArticles);

  const durationMs = Date.now() - startTime;
  console.log(
    `[Ingestion] Completed in ${durationMs}ms: Ingested ${rawArticles.length} raw items -> ${uniqueArticles.length} unique (${duplicatesMerged} duplicates merged). Total in DB: ${saveStats.total}`
  );

  const report: IngestionReport = {
    timestamp: new Date().toISOString(),
    totalSources: sources.length,
    successfulSources,
    failedSources,
    rawItemsParsed: rawArticles.length,
    uniqueArticlesStored: uniqueArticles.length,
    duplicatesMerged,
    totalInDatabase: saveStats.total,
  };

  await newsStorage.saveIngestionReport(report);
  isIngesting = false;

  return report;
}

/**
 * Optional local background scheduler for long-running Node/Docker environments.
 * For serverless / Vercel deployment, production ingestion is triggered via /api/cron/ingest.
 */
export function startIngestionScheduler(intervalMs = 15 * 60 * 1000) {
  if (process.env.ENABLE_INTERNAL_SCHEDULER === 'false') {
    console.log('[Ingestion] Internal interval scheduler disabled (serverless mode).');
    return;
  }

  if (scheduledTimer) {
    clearInterval(scheduledTimer);
  }

  // Run initial ingestion on server start
  setTimeout(() => {
    ingestAllSources().catch(err => {
      console.error('[Ingestion] Initial ingestion error:', err);
    });
  }, 1000);

  // Set recurring interval if running continuously
  scheduledTimer = setInterval(() => {
    ingestAllSources().catch(err => {
      console.error('[Ingestion] Scheduled ingestion error:', err);
    });
  }, intervalMs);

  console.log(`[Ingestion] Periodic news scheduler active (interval: ${intervalMs / 1000}s).`);
}
