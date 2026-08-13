import { Article, Category } from '../types';

/**
 * Service interface for News Ingestion and Fetching.
 * Prepared for Phase 2 integration (Real RSS / News APIs).
 * Phase 1 returns structured placeholders and skeletons without inventing fake real-world stories.
 */
export interface NewsService {
  getBreakingNews(): Promise<Article | null>;
  getTopStories(): Promise<{ featured: Article | null; supporting: Article[] }>;
  getLatestNews(params?: { category?: Category; limit?: number; offset?: number }): Promise<{
    articles: Article[];
    total: number;
    hasMore: boolean;
  }>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getRelatedArticles(category: Category, currentSlug: string, limit?: number): Promise<Article[]>;
  searchNews(query: string, category?: Category): Promise<Article[]>;
}

export const placeholderBreakingNews: Article = {
  id: 'breaking-placeholder-1',
  slug: 'breaking-market-update-live',
  title: 'Breaking news updates and real-time global market developments will appear here',
  summary: 'Live wire coverage of global macroeconomic events, central bank statements, earnings releases, and market moving catalysts.',
  category: 'markets',
  source: 'PULSE Wire',
  sourceUrl: '#',
  publishedAt: 'LIVE UPDATES',
  tags: ['Markets', 'Breaking', 'Global Economy'],
  isBreaking: true,
};

export const placeholderFeaturedArticle: Article = {
  id: 'featured-story-1',
  slug: 'global-macro-market-overview-editorial',
  title: 'Global Markets & Macroeconomic Developments: Editorial Coverage & Live Briefing',
  summary: 'Real-time financial reporting, institutional perspectives, and comprehensive economic intelligence across equity, bond, and digital asset markets will be integrated in Phase 2.',
  category: 'markets',
  source: 'PULSE Editorial',
  sourceUrl: '#',
  publishedAt: 'Just now',
  readTimeMinutes: 4,
  tags: ['Macro', 'Central Banks', 'Equities', 'Bonds'],
  isFeatured: true,
};

export const placeholderSupportingArticles: Article[] = [
  {
    id: 'story-placeholder-crypto',
    slug: 'crypto-market-structure-and-institutional-adoption',
    title: 'Cryptocurrency Market Structure, Regulation, and Institutional Liquidity Analysis',
    summary: 'Comprehensive analysis of digital asset capital flows, spot exchange volumes, and regulatory frameworks.',
    category: 'crypto',
    source: 'PULSE Digital',
    sourceUrl: '#',
    publishedAt: '12m ago',
    readTimeMinutes: 3,
    tags: ['Bitcoin', 'Ethereum', 'Regulation'],
  },
  {
    id: 'story-placeholder-stocks',
    slug: 'earnings-season-equities-and-corporate-revenue-trends',
    title: 'Corporate Earnings Season: S&P 500 Margins, Guidance, and Valuation Multiples',
    summary: 'Evaluating quarterly reports, guidance revisions, sector rotations, and institutional positioning.',
    category: 'stocks',
    source: 'PULSE Equities',
    sourceUrl: '#',
    publishedAt: '28m ago',
    readTimeMinutes: 5,
    tags: ['S&P 500', 'Earnings', 'Tech'],
  },
  {
    id: 'story-placeholder-economy',
    slug: 'monetary-policy-inflation-metrics-and-yield-curve-signals',
    title: 'Central Bank Policy Outlook: Inflation Dynamics, Interest Rates, and Yield Curve Signals',
    summary: 'Tracking interest rate expectations, treasury auction dynamics, and labor market metrics across major economies.',
    category: 'economy',
    source: 'PULSE Macro',
    sourceUrl: '#',
    publishedAt: '45m ago',
    readTimeMinutes: 4,
    tags: ['Fed', 'Inflation', 'Yields'],
  },
  {
    id: 'story-placeholder-tech',
    slug: 'technology-infrastructure-and-enterprise-ai-capital-expenditures',
    title: 'Enterprise Technology & Semiconductor Supply Chains: Capital Expenditure Trends',
    summary: 'Examining cloud compute demands, hardware infrastructure investments, and technology sector fundamentals.',
    category: 'technology',
    source: 'PULSE Tech',
    sourceUrl: '#',
    publishedAt: '1h ago',
    readTimeMinutes: 4,
    tags: ['AI Hardware', 'Cloud', 'Semiconductors'],
  }
];

export const newsService: NewsService = {
  async getBreakingNews(): Promise<Article | null> {
    // Phase 1: Return placeholder breaking item ready for real feed
    return placeholderBreakingNews;
  },

  async getTopStories(): Promise<{ featured: Article | null; supporting: Article[] }> {
    return {
      featured: placeholderFeaturedArticle,
      supporting: placeholderSupportingArticles,
    };
  },

  async getLatestNews(params?: { category?: Category; limit?: number; offset?: number }) {
    let filtered = [...placeholderSupportingArticles, placeholderFeaturedArticle];
    if (params?.category) {
      filtered = filtered.filter(a => a.category === params.category);
    }
    return {
      articles: filtered,
      total: filtered.length,
      hasMore: false,
    };
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const all = [placeholderBreakingNews, placeholderFeaturedArticle, ...placeholderSupportingArticles];
    const found = all.find(a => a.slug === slug);
    if (found) return found;

    // Return a standardized placeholder for unknown slug in Phase 1
    return {
      id: `article-${slug}`,
      slug,
      title: `Article Preview: ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      summary: 'This article view is ready for Phase 2 real-time news ingestion. Content and live reporting will appear here.',
      content: `The full article text, primary data sources, and verified market intelligence will appear here once the news feed service is connected in Phase 2.\n\nKey Highlights & Context:\n- Real-time fact-checked reporting.\n- Institutional commentary and market impact breakdown.\n- Direct attribution and links to verified primary filings and original releases.`,
      category: 'markets',
      source: 'PULSE Editorial',
      sourceUrl: 'https://sol-pump.store',
      publishedAt: 'Phase 1 Architecture Preview',
      readTimeMinutes: 3,
      tags: ['Markets', 'Analysis', 'PULSE'],
    };
  },

  async getRelatedArticles(category: Category, currentSlug: string, limit = 3): Promise<Article[]> {
    return placeholderSupportingArticles
      .filter(a => a.slug !== currentSlug)
      .slice(0, limit);
  },

  async searchNews(query: string, category?: Category): Promise<Article[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const all = [placeholderBreakingNews, placeholderFeaturedArticle, ...placeholderSupportingArticles];
    return all.filter(a => 
      (a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q))) &&
      (!category || a.category === category)
    );
  }
};
