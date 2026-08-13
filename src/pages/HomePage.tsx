import React from 'react';
import { TopStories } from '../components/news/TopStories';
import { MarketMovers } from '../components/markets/MarketMovers';
import { LatestNews } from '../components/news/LatestNews';
import { AIAnalysisCard } from '../components/analysis/AIAnalysisCard';
import { NewsletterSignup } from '../components/newsletter/NewsletterSignup';
import { AdSlot } from '../components/advertising/AdSlot';
import { SectionHeader } from '../components/common/SectionHeader';
import { ArticleCard } from '../components/news/ArticleCard';
import { placeholderSupportingArticles } from '../services/newsService';
import { useRouter } from '../context/RouterContext';
import { TrendingUp, Flame, Cpu, Landmark, Bitcoin, LineChart, ShieldAlert } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();

  const cryptoArticles = placeholderSupportingArticles.filter(a => a.category === 'crypto');
  const stockArticles = placeholderSupportingArticles.filter(a => a.category === 'stocks');
  const economyArticles = placeholderSupportingArticles.filter(a => a.category === 'economy');
  const techArticles = placeholderSupportingArticles.filter(a => a.category === 'technology');

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* Top Banner Advertisement Slot */}
      <AdSlot variant="banner" />

      {/* D. Top Stories Section */}
      <TopStories />

      {/* E. Market Movers Component */}
      <MarketMovers />

      {/* Main Grid: Latest News Wire + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center 8 Columns: Latest News */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* F. Latest News Feed */}
          <LatestNews limit={6} />

          {/* Inline Ad Slot */}
          <AdSlot variant="inline" />

          {/* G. Crypto Section Spotlight */}
          <section className="w-full">
            <SectionHeader
              title="Crypto & Digital Assets"
              subtitle="Bitcoin, Ethereum, DeFi liquidity, and regulatory developments"
              viewAllLink="/crypto"
              badge="Web3"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cryptoArticles.length > 0 ? (
                cryptoArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))
              ) : (
                <div className="col-span-2 p-6 bg-slate-900/40 rounded-lg text-center text-xs text-slate-400">
                  Digital asset wire stream connects in Phase 2
                </div>
              )}
              {/* Additional category preview card */}
              <ArticleCard
                article={{
                  id: 'crypto-spotlight-2',
                  slug: 'crypto-derivatives-and-spot-etf-flows',
                  title: 'Institutional Spot ETF Inflows & On-Chain Settlement Dynamics',
                  summary: 'Tracking net daily inflows into registered spot ETF products and sovereign reserve accumulation strategies.',
                  category: 'crypto',
                  source: 'PULSE Digital',
                  publishedAt: '2h ago',
                  readTimeMinutes: 4,
                  tags: ['ETF', 'Bitcoin', 'Flows']
                }}
                variant="standard"
              />
            </div>
          </section>

          {/* H. Stocks & Equities Spotlight */}
          <section className="w-full">
            <SectionHeader
              title="Equities & Corporate Earnings"
              subtitle="Wall Street earnings, valuation multiples, and sector rotations"
              viewAllLink="/stocks"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stockArticles.length > 0 ? (
                stockArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))
              ) : (
                <div className="col-span-2 p-6 bg-slate-900/40 rounded-lg text-center text-xs text-slate-400">
                  Stock market reports will appear here
                </div>
              )}
              <ArticleCard
                article={{
                  id: 'stock-spotlight-2',
                  slug: 'semiconductor-valuation-multiples-and-capex',
                  title: 'Megacap Tech Balance Sheets: Free Cash Flow Yields & Buybacks',
                  summary: 'Analyzing capital return programs, dividend growth trajectories, and debt leverage ratios across tech leaders.',
                  category: 'stocks',
                  source: 'PULSE Equities',
                  publishedAt: '3h ago',
                  readTimeMinutes: 5,
                  tags: ['Equities', 'Tech', 'Dividends']
                }}
                variant="standard"
              />
            </div>
          </section>

          {/* I. Economy & Macro Spotlight */}
          <section className="w-full">
            <SectionHeader
              title="Economy & Central Banks"
              subtitle="Monetary policy, inflation indicators, and sovereign debt markets"
              viewAllLink="/economy"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {economyArticles.length > 0 ? (
                economyArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))
              ) : (
                <div className="col-span-2 p-6 bg-slate-900/40 rounded-lg text-center text-xs text-slate-400">
                  Macroeconomic reports will appear here
                </div>
              )}
              <ArticleCard
                article={{
                  id: 'economy-spotlight-2',
                  slug: 'global-trade-flows-and-currency-crosses',
                  title: 'Global Trade Balances, Commodity Pricing, and Foreign Exchange',
                  summary: 'Monitoring export-import price indices, shipping freight rates, and international currency reserve shifts.',
                  category: 'economy',
                  source: 'PULSE Macro',
                  publishedAt: '4h ago',
                  readTimeMinutes: 4,
                  tags: ['Macro', 'Forex', 'Trade']
                }}
                variant="standard"
              />
            </div>
          </section>
        </div>

        {/* Right 4 Columns: Sidebar Widgets */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Sidebar Advertisement */}
          <AdSlot variant="sidebar" />

          {/* K. Trending Stories Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-mono">
                Trending Wire
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { rank: '01', title: 'Federal Reserve policy committee minutes and rate trajectory expectations', cat: 'economy', time: '18m ago' },
                { rank: '02', title: 'Global chipmaker unveils next-generation AI datacenter architecture', cat: 'technology', time: '34m ago' },
                { rank: '03', title: 'Major institutional liquidity provider opens digital asset custody desk', cat: 'crypto', time: '1h ago' },
                { rank: '04', title: 'Treasury yields adjust following latest monthly employment summary', cat: 'markets', time: '2h ago' },
              ].map((item) => (
                <div
                  key={item.rank}
                  onClick={() => navigate('/trending')}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <span className="font-mono font-extrabold text-lg text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                    {item.rank}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Native Sponsored Slot */}
          <AdSlot variant="native" />

          {/* Market Intelligence Quick Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-700 flex flex-col gap-3 shadow-xs">
            <h4 className="font-bold text-slate-900 font-mono uppercase tracking-wider text-xs flex items-center gap-2">
              <LineChart className="w-4 h-4 text-blue-600" />
              <span>Phase 1 Architecture Status</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              All core data schemas, component systems, and view controllers are primed for Phase 2 RSS ingestion and Phase 3 real-time market data feeds.
            </p>
            <div className="pt-2 border-t border-slate-200 font-mono text-[10px] text-slate-500 flex justify-between">
              <span>Clean Design System</span>
              <span className="text-emerald-700 font-bold">Active</span>
            </div>
          </div>
        </aside>
      </div>

      {/* J. PULSE AI Analysis Section */}
      <section className="w-full mt-4">
        <SectionHeader
          title="PULSE AI Market Synthesis"
          subtitle="Multi-factor intelligence synthesizing macro catalysts, balance sheet fundamentals, and market risks"
          viewAllLink="/analysis"
          badge="Gemini 2.5 Ready"
        />
        <AIAnalysisCard />
      </section>

      {/* L. Newsletter Subscription Section */}
      <div id="newsletter-section" className="w-full pt-4">
        <NewsletterSignup />
      </div>
    </div>
  );
};
