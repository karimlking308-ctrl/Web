import { Article, RelatedSource } from '../../src/types';

/**
 * Tokenize a title for semantic similarity comparison
 */
function getSignificantTokens(title: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
    'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'can', 'could', 'may', 'might', 'must', 'about', 'after', 'all', 'also',
    'say', 'says', 'said', 'new', 'report', 'reports', 'market', 'live',
    'updates', 'breaking', 'exclusive'
  ]);

  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  return new Set(words);
}

/**
 * Calculate Jaccard similarity between two token sets
 */
function calculateSimilarity(tokensA: Set<string>, tokensB: Set<string>): number {
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  
  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersection++;
    }
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

export interface DeduplicationResult {
  uniqueArticles: Article[];
  duplicatesMerged: number;
}

/**
 * Deduplicate raw ingested articles and merge secondary source attributions
 */
export function deduplicateArticles(articles: Article[]): DeduplicationResult {
  const uniqueArticles: Article[] = [];
  const seenUrls = new Set<string>();
  let duplicatesMerged = 0;

  // Sort candidate articles by publication timestamp (newest first)
  const sorted = [...articles].sort((a, b) => (b.publishedTimestamp || 0) - (a.publishedTimestamp || 0));

  for (const candidate of sorted) {
    if (!candidate.sourceUrl) continue;

    // 1. Direct URL duplication
    if (seenUrls.has(candidate.sourceUrl)) {
      duplicatesMerged++;
      continue;
    }

    const candidateTokens = getSignificantTokens(candidate.title);
    let isDuplicate = false;

    // 2. Similarity check against already approved unique articles
    for (const existing of uniqueArticles) {
      // Check timing window: stories must be published within 48 hours to be considered duplicate
      const timeDiff = Math.abs((existing.publishedTimestamp || 0) - (candidate.publishedTimestamp || 0));
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 48) continue;

      const existingTokens = getSignificantTokens(existing.title);
      const similarity = calculateSimilarity(candidateTokens, existingTokens);

      // If titles share > 65% significant tokens or both have same company & event
      if (similarity >= 0.65) {
        isDuplicate = true;
        duplicatesMerged++;

        // Add candidate as a verified related source
        if (candidate.source && candidate.sourceUrl && candidate.source !== existing.source) {
          const related: RelatedSource = {
            name: candidate.source,
            url: candidate.sourceUrl,
          };

          if (!existing.relatedSources) {
            existing.relatedSources = [];
          }

          // Avoid duplicate related sources
          if (!existing.relatedSources.some(r => r.name === candidate.source)) {
            existing.relatedSources.push(related);
          }
        }

        // Merge tickers & tags
        if (candidate.tickers && candidate.tickers.length > 0) {
          const existingTickers = new Set(existing.tickers || []);
          candidate.tickers.forEach(t => existingTickers.add(t));
          existing.tickers = Array.from(existingTickers);
        }

        break;
      }
    }

    if (!isDuplicate) {
      seenUrls.add(candidate.sourceUrl);
      uniqueArticles.push(candidate);
    }
  }

  return {
    uniqueArticles,
    duplicatesMerged,
  };
}
