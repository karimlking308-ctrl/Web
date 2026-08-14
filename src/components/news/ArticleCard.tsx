import React from 'react';
import { Article } from '../../types';
import { Badge } from '../common/Badge';
import { Clock, ArrowUpRight, Newspaper, Image as ImageIcon } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'standard' | 'compact' | 'horizontal';
  className?: string;
  showSummary?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  className = '',
  showSummary = true,
}) => {
  const { navigate } = useRouter();
  const [imageError, setImageError] = React.useState(false);
  const hasImage = Boolean(article.imageUrl && !imageError);

  const handleClick = () => {
    navigate(`/article/${article.slug}`);
  };

  // Hero Card Variant (Top Story)
  if (variant === 'hero') {
    return (
      <article
        onClick={handleClick}
        className={`group relative bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md ${className}`}
      >
        {/* Visual Container */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/10] bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200">
          {hasImage ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50/40 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2 shadow-xs">
                <Newspaper className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-700 font-bold">
                PULSE Editorial Coverage
              </span>
              <span className="text-[11px] font-mono text-slate-500 mt-1">
                Source: {article.source}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge category={article.category} size="md">
              {article.category}
            </Badge>
            {article.isBreaking && <Badge variant="breaking">Breaking</Badge>}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
            <span className="text-blue-600 font-bold">{article.source}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.publishedAt}
            </span>
            {article.readTimeMinutes && (
              <>
                <span>•</span>
                <span>{article.readTimeMinutes} min read</span>
              </>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0f172a] group-hover:text-blue-600 transition-colors leading-snug">
            {article.title}
          </h2>

          {showSummary && (
            <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3">
              {article.summary}
            </p>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5 flex-wrap">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Read Full Analysis</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact Variant (e.g. sidebar or list)
  if (variant === 'compact') {
    return (
      <article
        onClick={handleClick}
        className={`group p-3.5 bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-200 rounded-lg cursor-pointer transition-all flex flex-col gap-2 shadow-xs ${className}`}
      >
        <div className="flex items-center justify-between gap-2 text-xs font-mono">
          <Badge category={article.category} size="sm">
            {article.category}
          </Badge>
          <span className="text-slate-500 text-[11px]">{article.publishedAt}</span>
        </div>

        <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
          <span>{article.source}</span>
          <span className="text-blue-600 font-semibold group-hover:underline">Read →</span>
        </div>
      </article>
    );
  }

  // Horizontal Card Variant
  if (variant === 'horizontal') {
    return (
      <article
        onClick={handleClick}
        className={`group bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 cursor-pointer transition-all flex flex-col sm:flex-row gap-4 shadow-xs hover:shadow-md ${className}`}
      >
        <div className="sm:w-1/3 aspect-[16/10] bg-slate-100 rounded-md overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
          {hasImage ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-3 text-center">
              <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">PULSE Media</span>
            </div>
          )}
        </div>

        <div className="sm:w-2/3 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-mono">
              <Badge category={article.category} size="sm">
                {article.category}
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-semibold">{article.source}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{article.publishedAt}</span>
            </div>

            <h3 className="text-base font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>

            {showSummary && (
              <p className="text-xs md:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono">
            <span className="text-slate-500">{article.readTimeMinutes ? `${article.readTimeMinutes} min read` : 'Editorial'}</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
              Full Story →
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card Variant (Default)
  return (
    <article
      onClick={handleClick}
      className={`group bg-white border border-slate-200 hover:border-slate-300 rounded-lg overflow-hidden cursor-pointer transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${className}`}
    >
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200">
        {hasImage ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col items-center justify-center p-4 text-center">
            <Newspaper className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-semibold">
              {article.category} Report
            </span>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5">
          <Badge category={article.category} size="sm">
            {article.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mb-1">
            <span className="text-blue-600 font-bold">{article.source}</span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          <h3 className="text-base font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          {showSummary && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500 mt-2">
          <span>{article.readTimeMinutes ? `${article.readTimeMinutes} min read` : 'Briefing'}</span>
          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
            Read →
          </span>
        </div>
      </div>
    </article>
  );
};
