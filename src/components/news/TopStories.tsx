import React, { useState, useEffect } from 'react';
import { Article } from '../../types';
import { newsService } from '../../services/newsService';
import { ArticleCard } from './ArticleCard';
import { ArticleCardSkeleton } from '../common/Skeleton';
import { SectionHeader } from '../common/SectionHeader';

export const TopStories: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [featured, setFeatured] = useState<Article | null>(null);
  const [supporting, setSupporting] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    newsService
      .getTopStories()
      .then((data) => {
        if (isMounted) {
          setFeatured(data.featured);
          setSupporting(data.supporting);
        }
      })
      .catch((err) => {
        console.warn('[TopStories] Failed to load top stories:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className={`w-full ${className}`}>
      <SectionHeader
        title="Top Stories"
        subtitle="Primary editorial coverage and verified market catalysts"
        viewAllLink="/markets"
      />

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <ArticleCardSkeleton variant="hero" />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <ArticleCardSkeleton variant="compact" />
            <ArticleCardSkeleton variant="compact" />
            <ArticleCardSkeleton variant="compact" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Large Hero Story */}
          <div className="lg:col-span-7">
            {featured ? (
              <ArticleCard article={featured} variant="hero" />
            ) : (
              <div className="p-8 bg-[#0d131f] border border-slate-800 rounded-xl text-center text-slate-400 font-mono text-xs">
                Syncing top stories from verified wire feeds...
              </div>
            )}
          </div>

          {/* Supporting Stories Grid / List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {supporting.slice(0, 4).map((story) => (
              <ArticleCard key={story.id} article={story} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
