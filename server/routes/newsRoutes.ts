import { Router, Request, Response } from 'express';
import { newsStorage } from '../services/storage';
import { ingestAllSources } from '../services/ingestion';
import { getActiveNewsSources } from '../config/sources';
import { Category } from '../../src/types';

export const newsRouter = Router();

/**
 * GET /api/news
 * Get paginated articles with optional category, tag, and ticker filtering
 */
newsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as Category | undefined;
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
    const tag = req.query.tag as string | undefined;
    const ticker = req.query.ticker as string | undefined;

    const data = await newsStorage.getAllArticles({
      category,
      limit,
      offset,
      tag,
      ticker,
    });

    res.json(data);
  } catch (err: any) {
    console.error('[API /api/news] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve news wire articles' });
  }
});

/**
 * GET /api/news/top
 * Get featured top story and supporting top stories
 */
newsRouter.get('/top', async (req: Request, res: Response) => {
  try {
    const topStories = await newsStorage.getTopStories();
    res.json(topStories);
  } catch (err: any) {
    console.error('[API /api/news/top] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve top stories' });
  }
});

/**
 * GET /api/news/breaking
 * Get breaking news item if any
 */
newsRouter.get('/breaking', async (req: Request, res: Response) => {
  try {
    const breaking = await newsStorage.getBreakingNews();
    res.json({ breaking });
  } catch (err: any) {
    console.error('[API /api/news/breaking] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve breaking news' });
  }
});

/**
 * GET /api/news/trending
 * Get calculated trending stories based on multi-source coverage & recency
 */
newsRouter.get('/trending', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 6));
    const trending = await newsStorage.getTrendingStories(limit);
    res.json({ trending });
  } catch (err: any) {
    console.error('[API /api/news/trending] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve trending stories' });
  }
});

/**
 * GET /api/news/search
 * Search across news titles, summaries, tags, tickers, and sources
 */
newsRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const category = req.query.category as Category | undefined;

    if (!query.trim()) {
      return res.json({ results: [], total: 0 });
    }

    const results = await newsStorage.search(query, category);
    res.json({ results, total: results.length });
  } catch (err: any) {
    console.error('[API /api/news/search] Error:', err);
    res.status(500).json({ error: 'Failed to execute news search' });
  }
});

/**
 * GET /api/news/article/:slug
 * Get a single article by slug along with related stories
 */
newsRouter.get('/article/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const article = await newsStorage.getArticleBySlug(slug);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const related = await newsStorage.getRelatedArticles(article.category, article.slug, 3);

    res.json({
      article,
      related,
    });
  } catch (err: any) {
    console.error(`[API /api/news/article/${req.params.slug}] Error:`, err);
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
});

/**
 * GET /api/news/sources
 * Get configured active sources and current ingestion status
 */
newsRouter.get('/sources', async (req: Request, res: Response) => {
  try {
    const sources = getActiveNewsSources();
    const lastReport = await newsStorage.getLastIngestionReport();
    res.json({
      sources: sources.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        defaultCategory: s.defaultCategory,
        enabled: s.enabled,
      })),
      lastReport,
    });
  } catch (err: any) {
    console.error('[API /api/news/sources] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve sources' });
  }
});

/**
 * GET /api/news/stats
 * Get overall database stats
 */
newsRouter.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await newsStorage.getStats();
    res.json(stats);
  } catch (err: any) {
    console.error('[API /api/news/stats] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

/**
 * POST /api/news/refresh or GET /api/news/refresh
 * Trigger manual or scheduled ingestion of all feeds
 */
newsRouter.all('/refresh', async (req: Request, res: Response) => {
  try {
    const report = await ingestAllSources();
    res.json({
      message: 'Ingestion completed',
      report,
    });
  } catch (err: any) {
    console.error('[API /api/news/refresh] Error:', err);
    res.status(500).json({ error: 'Ingestion failed' });
  }
});
