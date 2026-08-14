import React, { useState, useEffect } from 'react';
import { Article, Category } from '../../types';
import { newsService } from '../../services/newsService';
import { ArticleCard } from './ArticleCard';
import { ArticleCardSkeleton } from '../common/Skeleton';
import { SectionHeader } from '../common/SectionHeader';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface LatestNewsProps {
  initialCategory?: Category;
  limit?: number;
  className?: string;
  showHeader?: boolean;
}

export const LatestNews: React.FC<LatestNewsProps> = ({
  initialCategory,
  limit = 6,
  className = '',
  showHeader = true,
}) => {
  const [category, setCategory] = useState<Category | 'all'>(initialCategory || 'all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (cat: Category | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const res = await newsService.getLatestNews({
        category: cat === 'all' ? undefined : cat,
        limit,
      });
      setArticles(res.articles);
    } catch {
      setError('Unable to load latest news wire right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(category);
  }, [category]);

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'All Feeds' },
    { id: 'markets', label: 'Markets' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'economy', label: 'Economy' },
    { id: 'technology', label: 'Tech' },
  ];

  return (
    <section className={`w-full ${className}`}>
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-3 mb-6">
          <SectionHeader
            title="Latest Wire"
            subtitle="Chronological real-time market reporting & company releases"
            className="border-b-0 pb-0 mb-0"
          />

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1 text-xs font-mono rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  category === c.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-300 font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ArticleCardSkeleton key={i} variant="standard" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 rounded-xl bg-rose-50 border border-rose-200 text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-rose-500" />
          <h4 className="text-base font-bold text-slate-900">Content Service Notice</h4>
          <p className="text-xs text-rose-700 max-w-md">{error}</p>
          <button
            onClick={() => fetchNews(category)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-white hover:bg-slate-50 text-xs font-mono text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
          <Layers className="w-8 h-8 text-slate-400 mb-1" />
          <h4 className="text-base font-bold text-slate-900">No wire stories in this category</h4>
          <p className="text-xs text-slate-500 max-w-md">
            No active wire reports in this channel right now. Select another feed or click retry to refresh.
          </p>
        </div>
      )}

      {/* Content State */}
      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      )}
    </section>
  );
};
