import { Article, Category } from '../../src/types';
import { initializeDatabase, getDbClient } from './db';

export interface StorageStats {
  totalArticles: number;
  lastUpdated: string | null;
  categories: Record<string, number>;
  sources: Record<string, number>;
}

export interface IngestionRunRecord {
  id: number;
  timestamp: string;
  totalSources: number;
  successfulSources: string[];
  failedSources: Array<{ sourceId: string; error: string }>;
  rawItemsParsed: number;
  uniqueArticlesStored: number;
  duplicatesMerged: number;
  totalInDatabase: number;
  createdAt: string;
}

function mapRowToArticle(row: any): Article {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary),
    content: row.content ? String(row.content) : undefined,
    category: row.category as Category,
    source: String(row.source),
    sourceUrl: String(row.source_url),
    imageUrl: row.image_url ? String(row.image_url) : undefined,
    publishedAt: String(row.published_at),
    publishedTimestamp: Number(row.published_timestamp),
    tags: row.tags ? JSON.parse(String(row.tags)) : [],
    tickers: row.tickers ? JSON.parse(String(row.tickers)) : undefined,
    relatedSources: row.related_sources ? JSON.parse(String(row.related_sources)) : undefined,
    readTimeMinutes: Number(row.read_time_minutes) || 2,
    isBreaking: Boolean(row.is_breaking),
    isFeatured: Boolean(row.is_featured),
    sourceId: String(row.source_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

class NewsStorage {
  private isReady = false;

  private async ensureInitialized(force = false) {
    if (!this.isReady || force) {
      await initializeDatabase(force);
      this.isReady = true;
    }
  }

  private async withRecovery<T>(operation: (client: ReturnType<typeof getDbClient>) => Promise<T>): Promise<T> {
    try {
      await this.ensureInitialized();
      const client = getDbClient();
      return await operation(client);
    } catch (err: any) {
      console.warn('[Storage] Query failed, attempting database recovery:', err?.message || err);
      this.isReady = false;
      await this.ensureInitialized(true);
      const client = getDbClient();
      return await operation(client);
    }
  }

  /**
   * Save newly ingested and deduplicated articles into persistent SQL database
   */
  public async saveArticles(newArticles: Article[]): Promise<{ added: number; updated: number; total: number }> {
    return this.withRecovery(async (client) => {
      let added = 0;
      let updated = 0;

      // Process in batches of 40 using transactions for maximum throughput
      const batchSize = 40;
      for (let i = 0; i < newArticles.length; i += batchSize) {
        const batch = newArticles.slice(i, i + batchSize);
        const statements = batch.map(item => ({
          sql: `
            INSERT OR REPLACE INTO articles (
              id, slug, title, summary, content, category, source, source_url,
              image_url, published_at, published_timestamp, tags, tickers,
              related_sources, read_time_minutes, is_breaking, is_featured,
              source_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            item.id,
            item.slug,
            item.title,
            item.summary,
            item.content || null,
            item.category,
            item.source,
            item.sourceUrl,
            item.imageUrl || null,
            item.publishedAt,
            item.publishedTimestamp,
            JSON.stringify(item.tags || []),
            item.tickers ? JSON.stringify(item.tickers) : null,
            item.relatedSources ? JSON.stringify(item.relatedSources) : null,
            item.readTimeMinutes || 2,
            item.isBreaking ? 1 : 0,
            item.isFeatured ? 1 : 0,
            item.sourceId,
            item.createdAt || new Date().toISOString(),
            new Date().toISOString(),
          ],
        }));

        try {
          await client.batch(statements, 'write');
          added += batch.length;
        } catch (err) {
          console.error('[Storage] Error during batch insert:', err);
        }
      }

      const totalResult = await client.execute('SELECT COUNT(*) as total FROM articles');
      const total = Number(totalResult.rows[0]?.total || 0);

      return { added, updated, total };
    });
  }

  public async getAllArticles(options?: {
    category?: Category;
    limit?: number;
    offset?: number;
    tag?: string;
    ticker?: string;
  }): Promise<{ articles: Article[]; total: number; hasMore: boolean }> {
    return this.withRecovery(async (client) => {
      const limit = options?.limit || 20;
      const offset = options?.offset || 0;

      let whereClause = '';
      const args: any[] = [];

      if (options?.category) {
        whereClause += 'WHERE category = ?';
        args.push(options.category);
      }

      if (options?.tag) {
        const condition = `tags LIKE ?`;
        whereClause += whereClause ? ` AND ${condition}` : `WHERE ${condition}`;
        args.push(`%"${options.tag}"%`);
      }

      if (options?.ticker) {
        const condition = `tickers LIKE ?`;
        whereClause += whereClause ? ` AND ${condition}` : `WHERE ${condition}`;
        args.push(`%"${options.ticker.toUpperCase()}"%`);
      }

      // Count total matching
      const countSql = `SELECT COUNT(*) as count FROM articles ${whereClause}`;
      const countRes = await client.execute({ sql: countSql, args });
      const total = Number(countRes.rows[0]?.count || 0);

      // Fetch paginated
      const querySql = `
        SELECT * FROM articles
        ${whereClause}
        ORDER BY published_timestamp DESC
        LIMIT ? OFFSET ?
      `;
      const rowsRes = await client.execute({
        sql: querySql,
        args: [...args, limit, offset],
      });

      const articles = rowsRes.rows.map(mapRowToArticle);
      const hasMore = offset + limit < total;

      return {
        articles,
        total,
        hasMore,
      };
    });
  }

  public async getArticleBySlug(slug: string): Promise<Article | null> {
    return this.withRecovery(async (client) => {
      const res = await client.execute({
        sql: 'SELECT * FROM articles WHERE slug = ? LIMIT 1',
        args: [slug],
      });

      if (res.rows.length === 0) {
        return null;
      }

      return mapRowToArticle(res.rows[0]);
    });
  }

  public async getBreakingNews(): Promise<Article | null> {
    return this.withRecovery(async (client) => {
      const eightHoursAgo = Date.now() - 8 * 60 * 60 * 1000;

      // First check strict breaking items within last 8 hours
      const res = await client.execute({
        sql: `
          SELECT * FROM articles
          WHERE is_breaking = 1 AND published_timestamp >= ?
          ORDER BY published_timestamp DESC
          LIMIT 1
        `,
        args: [eightHoursAgo],
      });

      if (res.rows.length > 0) {
        return mapRowToArticle(res.rows[0]);
      }

      // Fallback: most recent article within last 2 hours
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      const fallbackRes = await client.execute({
        sql: `
          SELECT * FROM articles
          WHERE published_timestamp >= ?
          ORDER BY published_timestamp DESC
          LIMIT 1
        `,
        args: [twoHoursAgo],
      });

      if (fallbackRes.rows.length > 0) {
        const art = mapRowToArticle(fallbackRes.rows[0]);
        return { ...art, isBreaking: true };
      }

      return null;
    });
  }

  public async getTopStories(): Promise<{ featured: Article | null; supporting: Article[] }> {
    return this.withRecovery(async (client) => {
      // Find best candidate for featured story (prefer recent story with image)
      const featuredRes = await client.execute(`
        SELECT * FROM articles
        WHERE image_url IS NOT NULL AND image_url != ''
        ORDER BY published_timestamp DESC
        LIMIT 1
      `);

      let featured: Article | null = null;

      if (featuredRes.rows.length > 0) {
        featured = mapRowToArticle(featuredRes.rows[0]);
      } else {
        const anyFirst = await client.execute(`
          SELECT * FROM articles
          ORDER BY published_timestamp DESC
          LIMIT 1
        `);
        if (anyFirst.rows.length > 0) {
          featured = mapRowToArticle(anyFirst.rows[0]);
        }
      }

      if (!featured) {
        return { featured: null, supporting: [] };
      }

      // Get 4 supporting top stories excluding featured
      const supportingRes = await client.execute({
        sql: `
          SELECT * FROM articles
          WHERE id != ?
          ORDER BY published_timestamp DESC
          LIMIT 4
        `,
        args: [featured.id],
      });

      const supporting = supportingRes.rows.map(mapRowToArticle);

      return { featured, supporting };
    });
  }

  public async getTrendingStories(limit = 6): Promise<Article[]> {
    return this.withRecovery(async (client) => {
      // Fetch 50 most recent stories to score
      const res = await client.execute({
        sql: `
          SELECT * FROM articles
          ORDER BY published_timestamp DESC
          LIMIT 50
        `,
        args: [],
      });

      const articles = res.rows.map(mapRowToArticle);
      const now = Date.now();

      const scored = articles.map(article => {
        let score = 0;
        const ageHours = (now - (article.publishedTimestamp || 0)) / (1000 * 60 * 60);

        // Recency weight
        if (ageHours < 6) score += 30;
        else if (ageHours < 12) score += 20;
        else if (ageHours < 24) score += 10;

        // Multi-source coverage weight
        if (article.relatedSources && article.relatedSources.length > 0) {
          score += article.relatedSources.length * 25;
        }

        // Verified tickers weight
        if (article.tickers && article.tickers.length > 0) {
          score += article.tickers.length * 10;
        }

        if (article.imageUrl) {
          score += 5;
        }

        return { article, score };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, limit).map(s => s.article);
    });
  }

  public async search(query: string, category?: Category): Promise<Article[]> {
    if (!query || !query.trim()) return [];
    return this.withRecovery(async (client) => {
      const q = query.toLowerCase().trim();
      const queryTokens = q.split(/\s+/).filter(Boolean);

      let whereClause = '';
      const args: any[] = [];

      if (category) {
        whereClause = 'WHERE category = ?';
        args.push(category);
      }

      // Match across title, summary, source, tags, tickers
      for (const token of queryTokens) {
        const matchCondition = `(
          LOWER(title) LIKE ? OR
          LOWER(summary) LIKE ? OR
          LOWER(source) LIKE ? OR
          LOWER(tags) LIKE ? OR
          LOWER(tickers) LIKE ?
        )`;
        whereClause += whereClause ? ` AND ${matchCondition}` : `WHERE ${matchCondition}`;
        const term = `%${token}%`;
        args.push(term, term, term, term, term);
      }

      const sql = `
        SELECT * FROM articles
        ${whereClause}
        ORDER BY published_timestamp DESC
        LIMIT 50
      `;

      const res = await client.execute({ sql, args });
      return res.rows.map(mapRowToArticle);
    });
  }

  public async getRelatedArticles(category: Category, currentSlug: string, limit = 3): Promise<Article[]> {
    return this.withRecovery(async (client) => {
      const res = await client.execute({
        sql: `
          SELECT * FROM articles
          WHERE category = ? AND slug != ?
          ORDER BY published_timestamp DESC
          LIMIT ?
        `,
        args: [category, currentSlug, limit],
      });

      return res.rows.map(mapRowToArticle);
    });
  }

  public async getStats(): Promise<StorageStats> {
    return this.withRecovery(async (client) => {
      const totalRes = await client.execute('SELECT COUNT(*) as total FROM articles');
      const totalArticles = Number(totalRes.rows[0]?.total || 0);

      const catRes = await client.execute('SELECT category, COUNT(*) as count FROM articles GROUP BY category');
      const categories: Record<string, number> = {};
      for (const row of catRes.rows) {
        categories[String(row.category)] = Number(row.count);
      }

      const srcRes = await client.execute('SELECT source, COUNT(*) as count FROM articles GROUP BY source');
      const sources: Record<string, number> = {};
      for (const row of srcRes.rows) {
        sources[String(row.source)] = Number(row.count);
      }

      const latestRun = await this.getLastIngestionReport();

      return {
        totalArticles,
        lastUpdated: latestRun?.timestamp || null,
        categories,
        sources,
      };
    });
  }

  public async saveIngestionReport(report: IngestionReport): Promise<void> {
    return this.withRecovery(async (client) => {
      await client.execute({
        sql: `
          INSERT INTO ingestion_runs (
            timestamp, total_sources, successful_sources, failed_sources,
            raw_items_parsed, unique_articles_stored, duplicates_merged,
            total_in_database, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          report.timestamp,
          report.totalSources,
          JSON.stringify(report.successfulSources),
          JSON.stringify(report.failedSources),
          report.rawItemsParsed,
          report.uniqueArticlesStored,
          report.duplicatesMerged,
          report.totalInDatabase,
          new Date().toISOString(),
        ],
      });
    });
  }

  public async getLastIngestionReport(): Promise<IngestionReport | null> {
    return this.withRecovery(async (client) => {
      const res = await client.execute(`
        SELECT * FROM ingestion_runs
        ORDER BY id DESC
        LIMIT 1
      `);

      if (res.rows.length === 0) {
        return null;
      }

      const row = res.rows[0];
      return {
        timestamp: String(row.timestamp),
        totalSources: Number(row.total_sources),
        successfulSources: row.successful_sources ? JSON.parse(String(row.successful_sources)) : [],
        failedSources: row.failed_sources ? JSON.parse(String(row.failed_sources)) : [],
        rawItemsParsed: Number(row.raw_items_parsed),
        uniqueArticlesStored: Number(row.unique_articles_stored),
        duplicatesMerged: Number(row.duplicates_merged),
        totalInDatabase: Number(row.total_in_database),
      };
    });
  }
}

export interface IngestionReport {
  timestamp: string;
  totalSources: number;
  successfulSources: string[];
  failedSources: Array<{ sourceId: string; error: string }>;
  rawItemsParsed: number;
  uniqueArticlesStored: number;
  duplicatesMerged: number;
  totalInDatabase: number;
}

export const newsStorage = new NewsStorage();
