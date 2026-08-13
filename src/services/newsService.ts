import { Article, Category } from '../types';

export interface NewsService {
  getBreakingNews(): Promise<Article | null>;
  getTopStories(): Promise<{ featured: Article | null; supporting: Article[] }>;
  getLatestNews(params?: {
    category?: Category;
    limit?: number;
    offset?: number;
    tag?: string;
    ticker?: string;
  }): Promise<{
    articles: Article[];
    total: number;
    hasMore: boolean;
  }>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getRelatedArticles(category: Category, currentSlug: string, limit?: number): Promise<Article[]>;
  searchNews(query: string, category?: Category): Promise<Article[]>;
  getTrendingStories(limit?: number): Promise<Article[]>;
  refreshNews(): Promise<boolean>;
}

export const newsService: NewsService = {
  async getBreakingNews(): Promise<Article | null> {
    try {
      const res = await fetch('/api/news/breaking');
      if (!res.ok) return null;
      const data = await res.json();
      return data.breaking || null;
    } catch (err) {
      console.warn('[NewsService] Failed to fetch breaking news:', err);
      return null;
    }
  },

  async getTopStories(): Promise<{ featured: Article | null; supporting: Article[] }> {
    try {
      const res = await fetch('/api/news/top');
      if (!res.ok) {
        return { featured: null, supporting: [] };
      }
      const data = await res.json();
      return {
        featured: data.featured || null,
        supporting: Array.isArray(data.supporting) ? data.supporting : [],
      };
    } catch (err) {
      console.warn('[NewsService] Failed to fetch top stories:', err);
      return { featured: null, supporting: [] };
    }
  },

  async getLatestNews(params?: {
    category?: Category;
    limit?: number;
    offset?: number;
    tag?: string;
    ticker?: string;
  }): Promise<{
    articles: Article[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.set('category', params.category);
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.offset) queryParams.set('offset', params.offset.toString());
      if (params?.tag) queryParams.set('tag', params.tag);
      if (params?.ticker) queryParams.set('ticker', params.ticker);

      const qs = queryParams.toString();
      const url = qs ? `/api/news?${qs}` : '/api/news';

      const res = await fetch(url);
      if (!res.ok) {
        return { articles: [], total: 0, hasMore: false };
      }
      const data = await res.json();
      return {
        articles: Array.isArray(data.articles) ? data.articles : [],
        total: data.total || 0,
        hasMore: !!data.hasMore,
      };
    } catch (err) {
      console.warn('[NewsService] Failed to fetch latest news:', err);
      return { articles: [], total: 0, hasMore: false };
    }
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const res = await fetch(`/api/news/article/${encodeURIComponent(slug)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.article || null;
    } catch (err) {
      console.warn(`[NewsService] Failed to fetch article "${slug}":`, err);
      return null;
    }
  },

  async getRelatedArticles(category: Category, currentSlug: string, limit = 3): Promise<Article[]> {
    try {
      const res = await fetch(`/api/news/article/${encodeURIComponent(currentSlug)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.related) && data.related.length > 0) {
          return data.related.slice(0, limit);
        }
      }

      // Fallback: query category directly
      const latest = await this.getLatestNews({ category, limit: limit + 1 });
      return latest.articles.filter(a => a.slug !== currentSlug).slice(0, limit);
    } catch (err) {
      console.warn('[NewsService] Failed to fetch related articles:', err);
      return [];
    }
  },

  async searchNews(query: string, category?: Category): Promise<Article[]> {
    if (!query || !query.trim()) return [];
    try {
      const params = new URLSearchParams({ q: query });
      if (category) params.set('category', category);

      const res = await fetch(`/api/news/search?${params.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.results) ? data.results : [];
    } catch (err) {
      console.warn('[NewsService] Failed to search news:', err);
      return [];
    }
  },

  async getTrendingStories(limit = 6): Promise<Article[]> {
    try {
      const res = await fetch(`/api/news/trending?limit=${limit}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.trending) ? data.trending : [];
    } catch (err) {
      console.warn('[NewsService] Failed to fetch trending stories:', err);
      return [];
    }
  },

  async refreshNews(): Promise<boolean> {
    try {
      const res = await fetch('/api/news/refresh', { method: 'POST' });
      return res.ok;
    } catch (err) {
      console.warn('[NewsService] Failed to trigger refresh:', err);
      return false;
    }
  },
};
