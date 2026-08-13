import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { newsService } from '../services/newsService';
import { Badge } from '../components/common/Badge';
import { AIAnalysisCard } from '../components/analysis/AIAnalysisCard';
import { ArticleCard } from '../components/news/ArticleCard';
import { AdSlot } from '../components/advertising/AdSlot';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useRouter } from '../context/RouterContext';
import {
  Clock,
  Share2,
  Bookmark,
  ArrowLeft,
  Calendar,
  User,
  Check,
  Building,
  Newspaper,
  ExternalLink,
} from 'lucide-react';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    newsService.getArticleBySlug(slug).then((art) => {
      if (mounted && art) {
        setArticle(art);
        newsService.getRelatedArticles(art.category, art.slug).then((rel) => {
          if (mounted) setRelated(rel);
        });
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-pulse space-y-6">
        <div className="h-4 bg-slate-200 w-32 rounded" />
        <div className="h-10 bg-slate-200 w-4/5 rounded" />
        <div className="h-6 bg-slate-200 w-2/3 rounded" />
        <div className="w-full aspect-[21/9] bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Article Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested wire story is unavailable or may have been archived.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-mono font-bold shadow-xs cursor-pointer"
        >
          Return to Wire
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      {/* Top Banner Ad */}
      <AdSlot variant="banner" />

      {/* Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <button
          onClick={() => navigate('/')}
          className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/${article.category}`)}
          className="hover:text-blue-700 transition-colors cursor-pointer uppercase text-blue-600 font-bold"
        >
          {article.category}
        </button>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{article.slug}</span>
      </nav>

      {/* Article Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Article Reading Column */}
        <article className="lg:col-span-8 flex flex-col gap-6">
          {/* Article Header Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge category={article.category} size="md">
                {article.category}
              </Badge>
              {article.isBreaking && <Badge variant="breaking">Breaking Wire</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] leading-[1.15]">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-sans border-l-3 border-blue-600 pl-4 py-1">
              {article.summary}
            </p>

            {/* Author / Source / Time / Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200 text-xs font-mono text-slate-500">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>{article.source}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.publishedAt}</span>
                </div>
                {article.readTimeMinutes && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.readTimeMinutes} min read</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 transition-colors cursor-pointer text-xs font-bold shadow-xs"
                  title="Copy article link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? 'Link Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hero Media Placeholder */}
          <div className="relative aspect-[16/9] md:aspect-[21/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-xs">
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2 shadow-xs">
                  <Newspaper className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-800 font-bold">
                  PULSE Verified Wire Media
                </span>
                <span className="text-[11px] font-mono text-slate-500 mt-1">
                  High-resolution photo and financial chart feeds integrate in Phase 2
                </span>
              </div>
            )}
          </div>

          {/* Article Notice for Phase 1 */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
            <div>
              <strong className="text-slate-900 font-mono uppercase">Editorial Architecture Notice: </strong>
              This reading experience is styled to institutional editorial standards. Live wire feeds, full-text syndication, and primary regulatory documents will be ingested in Phase 2.
            </div>
          </div>

          {/* Article Body Paragraphs */}
          <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-5 pt-2">
            <p>
              {article.content || (
                <>
                  Global capital market participants are closely monitoring macro catalysts and sector liquidity distributions. The intersection of monetary policy adjustments, treasury debt yields, and corporate earnings forecasts remains central to cross-asset valuations.
                </>
              )}
            </p>

            <p>
              According to institutional market data models, volatility indices across equity and digital asset sectors reflect cautious positioning ahead of scheduled central bank statements and quarterly financial releases. Institutional trading desks are actively recalibrating portfolio weights across defensive equities and sovereign debt instruments.
            </p>

            {/* Inline Advertisement Inside Article */}
            <AdSlot variant="inline" />

            <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight mt-6 font-sans">
              Market Impact and Regulatory Environment
            </h3>

            <p>
              Regulatory transparency, digital asset ETF flows, and cross-border settlement rails continue to evolve rapidly. Analysts highlight the importance of balancing near-term liquidity conditions against secular fundamental growth trends.
            </p>

            <p>
              PULSE will continue to monitor real-time developments across the wire. Readers can subscribe to the PULSE Market Brief below to receive verified updates directly.
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-200">
            <span className="text-xs font-mono text-slate-500 font-medium">Filed under:</span>
            {article.tags.map((t) => (
              <span
                key={t}
                className="text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-semibold"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Dedicated PULSE AI Analysis Card Embedded */}
          <div className="mt-6">
            <AIAnalysisCard articleId={article.id} />
          </div>

          {/* Legal & Financial Disclaimers */}
          <div className="mt-4 space-y-3">
            <DisclaimerBanner type="financial" />
          </div>
        </article>

        {/* Article Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Sidebar Ad */}
          <AdSlot variant="sidebar" />

          {/* Related Stories Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider pb-3 mb-4 border-b border-slate-100">
              Related Coverage
            </h3>

            <div className="flex flex-col gap-3">
              {related.length > 0 ? (
                related.map((item) => (
                  <ArticleCard key={item.id} article={item} variant="compact" />
                ))
              ) : (
                <p className="text-xs text-slate-500">
                  Related stories will connect in Phase 2.
                </p>
              )}
            </div>
          </div>

          {/* Native Recommendation Ad */}
          <AdSlot variant="native" />
        </aside>
      </div>
    </div>
  );
};
