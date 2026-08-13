import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  badge?: string;
  className?: string;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  viewAllLink,
  badge,
  className = '',
  id,
}) => {
  const { navigate } = useRouter();

  return (
    <div id={id} className={`flex items-end justify-between border-b border-slate-200 pb-3 mb-6 ${className}`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 bg-blue-600 rounded-xs" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] font-sans">
            {title}
          </h2>
          {badge && (
            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-semibold">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-slate-500 max-w-2xl pl-4">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <button
          onClick={() => navigate(viewAllLink)}
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider font-mono cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
};
