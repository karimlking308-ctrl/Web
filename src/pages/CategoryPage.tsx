import React, { useState, useEffect } from 'react';
import { Category, Article } from '../types';
import { newsService } from '../services/newsService';
import { ArticleCard } from '../components/news/ArticleCard';
import { ArticleCardSkeleton } from '../components/common/Skeleton';
import { AIAnalysisCard } from '../components/analysis/AIAnalysisCard';
import { AdSlot } from '../components/advertising/AdSlot';
import { MarketMovers } from '../components/markets/MarketMovers';
import { Badge } from '../components/common/Badge';
import { useRouter } from '../context/RouterContext';
import { Layers, ArrowLeft, RefreshCw, Rss } from 'lucide-react';

interface CategoryPageProps {
  category: Category;
}

const CATEGORY_META: Record<Category, { title: string; subtitle: string; description: string }> = {
  markets: {
    title: 'Global Markets',
    subtitle: 'Cross-Asset Intelligence & Macroeconomic Flows',
    description: 'Comprehensive reporting covering equities, fixed income, foreign exchange, commodities, and international index movements.',
  },
  crypto: {
    title: 'Cryptocurrency & Digital Assets',
    subtitle: 'Bitcoin, Layer 1s, DeFi, Institutional Capital & Regulation',
    description: 'Real-time coverage of digital asset market structure, spot ETF capital flows, on-chain dynamics, and regulatory policy.',
  },
  stocks: {
    title: 'Stocks & Equities',
    subtitle: 'Wall Street Reporting, Earnings, Valuation & Sector Rotations',
    description: 'Tracking corporate financial statements, earnings calls, balance sheet leverage, guidance revisions, and institutional trading.',
  },
  economy: {
    title: 'Economy & Central Banks',
    subtitle: 'Monetary Policy, Inflation, Sovereign Debt & Labor Metrics',
    description: 'In-depth macroeconomic analysis of central bank interest rate decisions, bond yield curves, and global trade dynamics.',
  },
  technology: {
    title: 'Technology & Enterprise AI',
    subtitle: 'Semiconductors, Cloud Infrastructure, Hardware & Enterprise Software',
    description: 'Investigating venture funding, semiconductor supply chains, enterprise datacenter capacity, and AI hardware architecture.',
  },
  analysis: {
    title: 'PULSE Financial Analysis',
    subtitle: 'AI-Assisted Multi-Factor Intelligence & Structural Breakdown',
    description: 'Institutional-grade contextual breakdowns explaining what happened, why it matters, market impact, and key risk vectors.',
  },
  trending: {
    title: 'Trending Market Stories',
    subtitle: 'High Velocity Financial Developments & Catalysts',
    description: 'Stories and market developments attracting the highest institutional readership and market volume velocity across the wire.',
  },
  business: {
    title: 'Business & Industry',
    subtitle: 'Corporate Strategy, Mergers & Industry Developments',
    description: 'Global business reporting, strategic acquisitions, supply chain logistics, and executive leadership coverage.',
  },
  energy: {
    title: 'Energy & Commodities',
    subtitle: 'Crude Oil, Natural Gas, Clean Power & Raw Materials',
    description: 'Tracking international oil benchmarks, renewable energy transition infrastructure, and commodities logistics.',
  },
  global: {
    title: 'Global Macro & Geopolitics',
    subtitle: 'International Trade, Sovereign Policy & Emerging Markets',
    description: 'Cross-border commerce, trade pacts, sovereign foreign reserves, and multilateral financial institution policy.',
  },
  science: {
    title: 'Science & Breakthroughs',
    subtitle: 'Biotech, Clean Tech & Research Innovations',
    description: 'Commercial biotechnology advancements, pharmaceutical trials, and applied research impacting global capital.',
  },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.markets;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  const loadData = () => {
    setLoading(true);
    if (category === 'trending') {
      newsService
        .getTrendingStories(12)
        .then((items) => {
          setArticles(items);
        })
        .catch(() => {
          setArticles([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      newsService
        .getLatestNews({ category, limit: 16 })
        .then((res) => {
          setArticles(res.articles);
        })
        .catch(() => {
          setArticles([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadData();
    document.title = `${meta.title} | PULSE Financial News`;
  }, [category]);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Category Header */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span className="text-slate-300">/</span>
            <Badge category={category} size="sm">
              {category}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f172a]">
            {meta.title}
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
            {meta.description}
          </p>

          <div className="pt-2 flex items-center justify-between gap-3 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-blue-700">
              <Rss className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Feed Ingestion Active</span>
            </span>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Wire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Banner Ad */}
      <AdSlot variant="banner" />

      {/* If Analysis category, show prominent AI Analysis Card */}
      {category === 'analysis' && (
        <section className="w-full">
          <AIAnalysisCard />
        </section>
      )}

      {/* Content Layout: 8 columns articles, 4 columns sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Category Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-slate-900 font-mono uppercase tracking-wider">
              {meta.title} Coverage
            </h2>
            <span className="text-xs font-mono text-slate-500 font-medium">
              {articles.length} Verified Stories
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleCardSkeleton key={i} variant="standard" />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center gap-2 shadow-xs">
              <Layers className="w-8 h-8 text-slate-400 mb-1" />
              <h3 className="text-base font-bold text-slate-900">No stories in this channel yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Stories are continuously ingested across our verified news feeds. Click refresh or check back shortly.
              </p>
              <button
                onClick={loadData}
                className="mt-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-mono font-bold cursor-pointer hover:bg-blue-100 transition-colors"
              >
                Sync Channel
              </button>
            </div>
          )}

          {/* Inline Ad */}
          <AdSlot variant="inline" />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <AdSlot variant="sidebar" />

          {/* Category Quick Context */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs shadow-xs">
            <h3 className="font-bold text-slate-900 font-mono uppercase tracking-wider mb-3 text-xs">
              Channel Intelligence
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs mb-4">
              PULSE monitors global wires to deliver unbiased editorial briefs, primary document links, and multi-source tracking for {meta.title}.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Wire Status:</span>
                <span className="text-blue-600 font-bold">Real Data Live</span>
              </div>
              <div className="flex justify-between">
                <span>Verified Sources:</span>
                <span className="text-slate-700 font-semibold">Active</span>
              </div>
            </div>
          </div>

          <AdSlot variant="native" />
        </aside>
      </div>

      {/* Category Bottom Market Movers */}
      <MarketMovers />
    </div>
  );
};
