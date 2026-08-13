import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  let roundedClass = 'rounded-lg';
  if (variant === 'circle') roundedClass = 'rounded-full';
  if (variant === 'text') roundedClass = 'rounded h-4';

  return (
    <div
      className={`bg-slate-200/80 animate-shimmer ${roundedClass} ${className}`}
      aria-hidden="true"
    />
  );
};

export const ArticleCardSkeleton: React.FC<{ variant?: 'hero' | 'standard' | 'compact' }> = ({ variant = 'standard' }) => {
  if (variant === 'hero') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-xs">
        <Skeleton className="w-full aspect-[16/9] md:aspect-[21/9]" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-4/5 h-8" />
        <Skeleton className="w-full h-12" />
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Skeleton className="w-14 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-2/3 h-4" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
      <Skeleton className="w-full aspect-[16/10]" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-20 h-3" />
      </div>
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-5/6 h-4" />
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-12 h-3" />
      </div>
    </div>
  );
};
