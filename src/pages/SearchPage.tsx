import React, { useState, useEffect } from 'react';
import { Article, Category } from '../types';
import { newsService } from '../services/newsService';
import { ArticleCard } from '../components/news/ArticleCard';
import { ArticleCardSkeleton } from '../components/common/Skeleton';
import { AdSlot } from '../components/advertising/AdSlot';
import { useRouter } from '../context/RouterContext';
import { Search, Filter, AlertCircle, RefreshCw, Layers, Sparkles } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { searchQuery, setSearchQuery } = useRouter();
  const [query, setQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(Boolean(searchQuery.trim()));
  const [error, setError] = useState<string | null>(null);

  const executeSearch = async (term: string, cat: Category | 'all') => {
    if (!term.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Simulate fast search query with Phase 1 service
      const res = await newsService.searchNews(
        term,
        cat === 'all' ? undefined : cat
      );
      setResults(res);
    } catch {
      setError('Search service is currently indexing new wires. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
      executeSearch(searchQuery, selectedCategory);
    }
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    executeSearch(query, selectedCategory);
  };

  const handleCategoryChange = (cat: Category | 'all') => {
    setSelectedCategory(cat);
    if (query.trim()) {
      executeSearch(query, cat);
    }
  };

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'All Sectors' },
    { id: 'markets', label: 'Markets' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'economy', label: 'Economy' },
    { id: 'technology', label: 'Tech' },
    { id: 'analysis', label: 'Analysis' },
  ];

  const suggestedQueries = [
    'Bitcoin ETF',
    'Federal Reserve',
    'Semiconductors',
    'Treasury Yields',
    'Corporate Earnings',
    'Inflation',
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Search Header Container */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="max-w-3xl mx-auto flex flex-col gap-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Search PULSE Intelligence Wire
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Query across global markets, macroeconomic reports, corporate filings, and AI-assisted analysis
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search markets, companies, crypto, news..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Category Filter Chips */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryChange(c.id)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-300 font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Suggested Query Tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 pt-1">
            <span className="font-mono text-[11px] font-medium">Popular Searches:</span>
            {suggestedQueries.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  setSearchQuery(item);
                  executeSearch(item, selectedCategory);
                }}
                className="hover:text-blue-600 underline decoration-slate-300 cursor-pointer text-[11px] font-mono text-slate-600 font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Slot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Status 1: Initial (Before Search) */}
          {!hasSearched && !loading && (
            <div className="p-12 bg-white border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center gap-3 shadow-xs">
              <Search className="w-10 h-10 text-slate-400 mb-1" />
              <h3 className="text-base font-bold text-slate-900">Enter a keyword to search</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Search real-time financial reporting by ticker symbol, central bank, company name, or asset class.
              </p>
            </div>
          )}

          {/* Status 2: Loading */}
          {loading && (
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 w-48 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <ArticleCardSkeleton key={i} variant="standard" />
                ))}
              </div>
            </div>
          )}

          {/* Status 3: Error */}
          {!loading && error && (
            <div className="p-8 rounded-xl bg-rose-50 border border-rose-200 text-center flex flex-col items-center justify-center gap-3">
              <AlertCircle className="w-8 h-8 text-rose-600" />
              <h3 className="text-base font-bold text-rose-900">Search Service Alert</h3>
              <p className="text-xs text-rose-700">{error}</p>
              <button
                onClick={() => executeSearch(query, selectedCategory)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-xs font-mono text-slate-800 rounded-lg border border-slate-300 font-bold shadow-xs cursor-pointer hover:bg-slate-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          )}

          {/* Status 4: No Results */}
          {!loading && !error && hasSearched && results.length === 0 && (
            <div className="p-12 bg-white border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center gap-3 shadow-xs">
              <Layers className="w-10 h-10 text-slate-400 mb-1" />
              <h3 className="text-base font-bold text-slate-900">
                No matching wire reports found for "{query}"
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try searching for broader terms like "crypto", "markets", "earnings", or "Fed". Full real-time news search indices connect in Phase 2.
              </p>
            </div>
          )}

          {/* Status 5: Results */}
          {!loading && !error && hasSearched && results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs font-mono text-slate-500">
                <span>
                  Found <strong className="text-slate-900">{results.length}</strong> reports matching "{query}"
                </span>
                <span>Sorted by Editorial Relevance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((art) => (
                  <ArticleCard key={art.id} article={art} variant="standard" />
                ))}
              </div>
            </div>
          )}

          <AdSlot variant="inline" />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <AdSlot variant="sidebar" />
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600 shadow-xs">
            <h3 className="font-bold text-slate-900 font-mono uppercase tracking-wider mb-2 text-xs">
              Search Index Status
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              In Phase 2, this search system will perform sub-millisecond semantic search across indexed global wire feeds, RSS streams, and SEC corporate disclosures.
            </p>
          </div>
          <AdSlot variant="native" />
        </aside>
      </div>
    </div>
  );
};
