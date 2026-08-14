import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { newsService } from '../services/newsService';
import { Badge } from '../components/common/Badge';
import { AIAnalysisCard } from '../components/analysis/AIAnalysisCard';
import { ArticleCard } from '../components/news/ArticleCard';
import { AdSlot } from '../components/advertising/AdSlot';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useRouter } from '../context/RouterContext';
import { getDeterministicArticleImage } from '../utils/imageUtils';
import {
  Clock,
  Share2,
  ArrowLeft,
  Calendar,
  Check,
  Building,
  Newspaper,
  ExternalLink,
  Tag,
  TrendingUp,
  ShieldCheck,
  Globe,
} from 'lucide-react';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setImageError(false);
    newsService.getArticleBySlug(slug).then((art) => {
      if (mounted && art) {
        setArticle(art);
        // Set document title dynamically for SEO
        document.title = `${art.title} | PULSE Financial News`;

        newsService.getRelatedArticles(art.category, art.slug, 3).then((rel) => {
          if (mounted) setRelated(rel);
        });
        setLoading(false);
      } else if (mounted) {
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
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
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold shadow-xs cursor-pointer"
        >
          Return to News Wire
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
          <span>News Wire</span>
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/${article.category}`)}
          className="hover:text-blue-700 transition-colors cursor-pointer uppercase text-blue-600 font-bold"
        >
          {article.category}
        </button>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Article Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Article Reading Column */}
        <article className="lg:col-span-8 flex flex-col gap-6">
          {/* Article Header Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge category={article.category} size="md">
                {article.category}
              </Badge>
              {article.isBreaking && <Badge variant="breaking">Breaking Wire</Badge>}
              {article.tickers && article.tickers.length > 0 && (
                <div className="flex items-center gap-1">
                  {article.tickers.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded"
                    >
                      ${t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] leading-[1.15]">
              {article.title}
            </h1>

            {/* Editorial Summary Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-sans">
                {article.summary}
              </p>
            </div>

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

          {/* Hero Media */}
          <div className="relative aspect-[16/9] md:aspect-[21/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
            <img
              src={(!imageError && article.imageUrl) ? article.imageUrl : getDeterministicArticleImage(article.title, article.summary, article.category, article.id)}
              alt={article.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Primary Outbound Link & Copyright Protection Banner */}
          <div className="p-5 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Direct Source Attribution
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PULSE respects journalistic copyright. In accordance with fair-use standards, read the full unedited report directly at the publisher.
                </p>
              </div>
            </div>

            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <span>Read on {article.source}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Multi-source coverage / Related sources if deduplicated */}
          {article.relatedSources && article.relatedSources.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase">
                <Globe className="w-4 h-4 text-slate-500" />
                <span>Also Reported By Verified Outlets</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {article.relatedSources.map((rs, idx) => (
                  <a
                    key={idx}
                    href={rs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-mono text-slate-700 transition-colors"
                  >
                    <span>{rs.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Analysis Context */}
          <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
            <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
              Market Context & Catalyst Overview
            </h3>
            <p>
              This report represents live coverage captured across global financial reporting networks. Capital market participants monitor these developments closely to assess sector liquidity, monetary policy implications, and cross-asset correlations.
            </p>

            {/* Inline Advertisement */}
            <AdSlot variant="inline" />

            <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
              Key Implications
            </h3>
            <p>
              Institutional analysts evaluate developments against broader macroeconomic indicators, bond yield movements, and risk-asset sentiment. Readers should reference primary filings and verified press releases for formal documentation.
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-200">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-mono text-slate-500 font-medium">Tags:</span>
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
          <div className="mt-4">
            <AIAnalysisCard articleId={article.id} />
          </div>

          {/* Legal & Financial Disclaimers */}
          <div className="mt-2 space-y-3">
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
              Related {article.category} Coverage
            </h3>

            <div className="flex flex-col gap-3">
              {related.length > 0 ? (
                related.map((item) => (
                  <ArticleCard key={item.id} article={item} variant="compact" />
                ))
              ) : (
                <p className="text-xs text-slate-500 font-mono">
                  Loading related reporting...
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
