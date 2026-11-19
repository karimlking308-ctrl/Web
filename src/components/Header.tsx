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
    <header className="tindry-site-header sticky top-0 z-20 w-full bg-black border-b border-[#1A1A1A]">
      <div className="flex items-center justify-between px-4 sm:px-8 h-16 sm:h-20 max-w-6xl mx-auto w-full gap-3">
        <div className="flex items-center gap-2.5 sm:gap-5 min-w-0">
          {/* Tablet & Mobile hamburger menu (< 1024px) */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center -ml-2 text-[#D4AF37] hover:bg-[#1A1A1A] rounded-lg transition-colors flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
          </button>

          {currentToolName && onBackToHome ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToHome();
                }}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-medium text-white hover:text-[#D4AF37] transition-colors py-1 px-2 -ml-1 rounded flex-shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Home</span>
              </a>
              <span className="text-[#D4AF37] text-xs select-none">/</span>
              <h2 className="text-xs sm:text-sm font-semibold tracking-wide text-white truncate">
                {currentToolName}
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-6 min-w-0">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToHome?.();
                }}
                className="tindry-logo-link inline-flex items-center gap-2 hover:opacity-95 transition-opacity min-h-[44px]"
              >
                <span className="tindry-metallic-logo" data-text="Tindry">
                  Tindry
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="tindry-logo-sparkle w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="tindryCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="45%" stopColor="#FFF099" />
                      <stop offset="70%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M2.5 8.5L7.5 12.2L12 4.8L16.5 12.2L21.5 8.5L19.5 16.5H4.5L2.5 8.5Z"
                    fill="url(#tindryCrownGold)"
                  />
                  <rect
                    x="4.5"
                    y="18"
                    width="15"
                    height="2.2"
                    rx="1"
                    fill="url(#tindryCrownGold)"
                  />
                </svg>
              </a>
              <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-white">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onBackToHome?.();
                  }}
                  className="hover:text-[#D4AF37] transition-colors py-2"
                >
                  Home
                </a>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTools?.();
                  }}
                  className="hover:text-[#D4AF37] transition-colors py-2"
                >
                  Tools
                </a>
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateBlog ? onNavigateBlog() : (window.location.href = '/blog');
                  }}
                  className="hover:text-[#D4AF37] transition-colors py-2"
                >
                  Blog
                </a>
              </nav>
            </div>
          )}
        </div>

        {/* Right side - Support Tindry link */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[11px] font-mono text-[#F9F6EF] select-none hidden lg:inline">
            Fast &middot; Private &middot; Free
          </span>
          <a
            href="https://ko-fi.com/tindry"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support Tindry on Ko-fi"
            className="inline-flex items-center gap-1.5 min-h-[44px] py-2 px-3 rounded-md border border-[#D4AF37] bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-colors text-xs font-semibold whitespace-nowrap"
          >
            <Coffee className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Support Tindry</span>
          </a>
        </div>
      </div>
    </header>
  );
};
