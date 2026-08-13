import React from 'react';
import { NavItem } from '../../types';
import { useRouter } from '../../context/RouterContext';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Markets', path: '/markets', category: 'markets' },
  { label: 'Crypto', path: '/crypto', category: 'crypto' },
  { label: 'Stocks', path: '/stocks', category: 'stocks' },
  { label: 'Economy', path: '/economy', category: 'economy' },
  { label: 'Technology', path: '/technology', category: 'technology' },
  { label: 'Analysis', path: '/analysis', category: 'analysis', badge: 'AI' },
  { label: 'Trending', path: '/trending', category: 'trending' },
];

export const NavTabs: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentPath, navigate } = useRouter();

  return (
    <nav className={`flex items-center space-x-3 text-[11px] font-bold tracking-wider uppercase ${className}`} aria-label="Main Navigation">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.path === '/'
            ? currentPath === '/'
            : currentPath.startsWith(item.path);

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`py-1 px-1 transition-colors cursor-pointer flex items-center gap-1 ${
              isActive
                ? 'text-white border-b-2 border-blue-500 font-extrabold'
                : 'text-slate-300/80 hover:text-blue-400'
            }`}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span className="text-[8px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold uppercase border border-blue-500/40 ml-0.5">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
