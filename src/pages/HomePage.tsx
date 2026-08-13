import React, { useState, useEffect } from 'react';
import { TopStories } from '../components/news/TopStories';
import { MarketMovers } from '../components/markets/MarketMovers';
import { LatestNews } from '../components/news/LatestNews';
import { AIAnalysisCard } from '../components/analysis/AIAnalysisCard';
import { NewsletterSignup } from '../components/newsletter/NewsletterSignup';
import { AdSlot } from '../components/advertising/AdSlot';
import { SectionHeader } from '../components/common/SectionHeader';
import { ArticleCard } from '../components/news/ArticleCard';
import { newsService } from '../services/newsService';
import { Article } from '../types';
import { useRouter } from '../context/RouterContext';
import { Flame, LineChart, Globe, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [cryptoArticles, setCryptoArticles] = useState<Article[]>([]);
  const [stockArticles, setStockArticles] = useState<Article[]>([]);
  const [economyArticles, setEconomyArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Load category spotlights
    newsService.getLatestNews({ category: 'crypto', limit: 2 }).then(res => {
      if (isMounted) setCryptoArticles(res.articles);
    });

    newsService.getLatestNews({ category: 'stocks', limit: 2 }).then(res => {
      if (isMounted) setStockArticles(res.articles);
    });

    newsService.getLatestNews({ category: 'economy', limit: 2 }).then(res => {
      if (isMounted) setEconomyArticles(res.articles);
    });

    newsService.getTrendingStories(5).then(items => {
      if (isMounted) setTrendingArticles(items);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* Top Banner Advertisement Slot */}
      <AdSlot variant="banner" />

      {/* Top Stories Section */}
      <TopStories />

      {/* Market Movers Component */}
      <MarketMovers />

      {/* Main Grid: Latest News Wire + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center 8 Columns: Latest News */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Latest News Feed */}
          <LatestNews limit={6} />

          {/* Inline Ad Slot */}
          <AdSlot variant="inline" />

          {/* Crypto Section Spotlight */}
          <section className="w-full">
            <SectionHeader
              title="Crypto & Digital Assets"
              subtitle="Bitcoin, Ethereum, digital asset flows, and regulatory developments"
              viewAllLink="/crypto"
              badge="Web3 Wire"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cryptoArticles.length > 0 ? (
                cryptoArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))
              ) : (
                <div className="col-span-2 p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-mono">
                  Loading verified digital asset news wire...
                </div>
              )}
            </div>
          </section>

          {/* Stocks & Equities Spotlight */}
          <section className="w-full">
            <SectionHeader
              title="Equities & Corporate Earnings"
              subtitle="Wall Street earnings, corporate guidance, and sector movements"
              viewAllLink="/stocks"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stockArticles.length > 0 ? (
                stockArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))
              ) : (
                <div className="col-span-2 p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-mono">
                  Loading equity market reporting...
                </div>
              )}
            </div>
          </section>

          {/* Economy & Macro Spotlight */}
          <section className="w-full">
            <SectionHeader
              title="Economy & Central Banks"
              subtitle="Monetary policy, inflation indicators, and sovereign debt dynamics"
              viewAllLink="/economy"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {economyArticles.length > 0 ? (
                economyArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))
              ) : (
                <div className="col-span-2 p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-mono">
                  Loading macroeconomic wire coverage...
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right 4 Columns: Sidebar Widgets */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Sidebar Advertisement */}
          <AdSlot variant="sidebar" />

          {/* Trending Stories Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-mono">
                  Trending Wire
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Live
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {trendingArticles.length > 0 ? (
                trendingArticles.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/article/${item.slug}`)}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <span className="font-mono font-extrabold text-lg text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        <span className="text-blue-600 font-semibold">{item.source}</span>
                        <span>•</span>
                        <span>{item.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs font-mono text-slate-400">
                  Calculating trending stories...
                </div>
              )}
            </div>
          </div>

          {/* Native Sponsored Slot */}
          <AdSlot variant="native" />

          {/* Verified News Engine Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-700 flex flex-col gap-3 shadow-xs">
            <h4 className="font-bold text-slate-900 font-mono uppercase tracking-wider text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Real-Time Ingestion Engine</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              PULSE ingests, normalizes, and deduplicates coverage from CNBC, BBC, SEC, The Guardian, Federal Reserve, and verified wire services.
            </p>
            <div className="pt-2 border-t border-slate-200 font-mono text-[10px] text-slate-500 flex justify-between">
              <span>Source Attribution</span>
              <span className="text-emerald-700 font-bold">100% Verified</span>
            </div>
          </div>
        </aside>
      </div>

      {/* PULSE AI Analysis Section */}
      <section className="w-full mt-4">
        <SectionHeader
          title="PULSE AI Market Synthesis"
          subtitle="Multi-factor intelligence synthesizing macro catalysts, balance sheet fundamentals, and market risks"
          viewAllLink="/analysis"
          badge="Gemini 2.5 Ready"
        />
        <AIAnalysisCard />
      </section>

      {/* Newsletter Subscription Section */}
      <div id="newsletter-section" className="w-full pt-4">
        <NewsletterSignup />
      </div>
    </div>
  );
};
