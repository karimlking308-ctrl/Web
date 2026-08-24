import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', light = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg'
  };

  const textClasses = {
    sm: 'text-base font-black tracking-tight',
    md: 'text-lg font-black tracking-tight',
    lg: 'text-xl font-black tracking-tight',
    xl: 'text-2xl font-black tracking-tight'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SOLPUMP Hexagonal/Spark Icon */}
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/25 shrink-0`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
          <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor" fillOpacity="0.7" />
          <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
        </svg>
      </div>
      <span className={`${textClasses[size]} ${light ? 'text-white' : 'text-slate-900'} tracking-wider font-extrabold`}>
        SOLPUMP
      </span>
    </div>
  );
};
