import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  light = false,
  showTagline = false,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-11 h-11'
  };

  const textClasses = {
    xs: 'text-xs font-black tracking-tight',
    sm: 'text-sm font-black tracking-tight',
    md: 'text-base font-black tracking-tight',
    lg: 'text-xl font-black tracking-tight',
    xl: 'text-2xl font-black tracking-tight'
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* SOLPUMP Geometric Minimalist Brand Mark */}
      <div
        className={`${sizeClasses[size]} rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0 relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-[70%] h-[70%] fill-none stroke-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 8L12 3.5L20 8V16L12 20.5L4 16V8Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M12 3.5V12M12 12L20 16M12 12L4 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`${textClasses[size]} ${light ? 'text-white' : 'text-slate-900'} tracking-tight font-extrabold flex items-center gap-1`}>
          <span>SOLPUMP</span>
        </span>
        {showTagline && (
          <span className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 ${light ? 'text-slate-400' : 'text-slate-500'}`}>
            Commerce OS
          </span>
        )}
      </div>
    </div>
  );
};

