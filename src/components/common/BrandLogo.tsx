import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  isArabic?: boolean;
  className?: string;
}

export const BrandMark: React.FC<{ size?: number; className?: string; altText?: string }> = ({
  size = 40,
  className = '',
  altText = 'Sol Tools Logo',
}) => {
  return (
    <div
      role="img"
      aria-label={altText}
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width={Math.round(size * 0.58)}
        height={Math.round(size * 0.58)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Modern Sol Tools Modular Multi-Tool Grid / S-Nexus */}
        {/* Top utility segment */}
        <path
          d="M18.5 7.5C18.5 5.567 16.933 4 15 4H8.5C6.567 4 5 5.567 5 7.5C5 9.433 6.567 11 8.5 11H15.5C17.433 11 19 12.567 19 14.5C19 16.433 17.433 18 15.5 18H9C7.067 18 5.5 16.433 5.5 14.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Utility precision node accents */}
        <circle cx="15" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="9" cy="14.5" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  isArabic = false,
  className = '',
}) => {
  const markSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none group ${className}`}>
      <BrandMark
        size={markSize}
        altText={isArabic ? 'شعار سول تولز - +200 أداة مجانية أونلاين' : 'Sol Tools Logo - 200+ Free Online Tools'}
        className="group-hover:scale-105 transition-transform duration-200"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
            {isArabic ? 'سول تولز' : 'Sol Tools'}
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-amber-600 dark:text-amber-400 pt-0.5 whitespace-nowrap">
            {isArabic ? '+200 أداة مجانية أونلاين' : '200+ Free Online Tools'}
          </span>
        )}
      </div>
    </div>
  );
};
