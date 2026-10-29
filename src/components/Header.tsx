import React from 'react';
import { Menu, ArrowLeft, Coffee } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  currentToolName?: string;
  onBackToHome?: () => void;
  onNavigateTools?: () => void;
  onNavigateBlog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  currentToolName,
  onBackToHome,
  onNavigateTools,
  onNavigateBlog,
}) => {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-xs border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 sm:px-8 h-14 sm:h-16 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile hamburger menu */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 -ml-1 text-black hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4 text-black" strokeWidth={2} />
          </button>

          {currentToolName && onBackToHome ? (
            <div className="flex items-center gap-2.5">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToHome();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-black transition-colors py-1 px-1.5 -ml-1 rounded"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </a>
              <span className="text-neutral-300 text-xs select-none">/</span>
              <h2 className="text-xs font-semibold tracking-wide text-black">
                {currentToolName}
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToHome?.();
                }}
                className="font-bold text-sm tracking-tight text-black hover:opacity-80 transition-opacity"
              >
                Tindry
              </a>
              <nav className="hidden sm:flex items-center gap-5 text-xs font-medium text-neutral-500">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onBackToHome?.();
                  }}
                  className="hover:text-black transition-colors"
                >
                  Home
                </a>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTools?.();
                  }}
                  className="hover:text-black transition-colors"
                >
                  Tools
                </a>
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateBlog ? onNavigateBlog() : (window.location.href = '/blog');
                  }}
                  className="hover:text-black transition-colors"
                >
                  Blog
                </a>
              </nav>
            </div>
          )}
        </div>

        {/* Right side - Support Tindry link */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-neutral-400 select-none hidden md:inline">
            Fast &middot; Private &middot; Free
          </span>
          <a
            href="https://ko-fi.com/tindry"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support Tindry on Ko-fi"
            className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-md border border-neutral-200 hover:border-black text-black hover:bg-neutral-50 transition-colors text-xs font-medium"
          >
            <Coffee className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Support Tindry</span>
          </a>
        </div>
      </div>
    </header>
  );
};
