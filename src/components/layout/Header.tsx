import React, { useState } from 'react';
import { NavTabs } from '../navigation/NavTabs';
import { useRouter } from '../../context/RouterContext';
import { Search, Mail, Menu } from 'lucide-react';
import { MobileNavigation } from './MobileNavigation';

interface HeaderProps {
  onOpenNewsletterModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewsletterModal }) => {
  const { navigate, searchQuery, setSearchQuery } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleNewsletterClick = () => {
    const el = document.getElementById('newsletter-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (onOpenNewsletterModal) {
        onOpenNewsletterModal();
      } else {
        navigate('/#newsletter-section');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f172a] text-white border-b border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16 gap-4">
          {/* Brand / Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex flex-col cursor-pointer select-none shrink-0 group leading-none"
          >
            <div className="flex items-center space-x-1.5">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                PULSE
              </span>
            </div>
            <span className="text-[8px] md:text-[9px] tracking-[0.2em] font-bold text-slate-400 uppercase pt-0.5">
              MARKETS. NEWS. ANALYSIS.
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <NavTabs />
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Search Trigger or Input */}
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search markets..."
                  autoFocus
                  className="bg-[#1e293b] border border-blue-500 rounded text-[12px] py-1.5 px-3 text-white placeholder-slate-400 font-sans w-40 sm:w-52 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-1 text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </form>
            ) : (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-[#1e293b] hover:bg-[#273549] text-slate-300 text-[12px] py-1.5 pl-3 pr-4 rounded flex items-center gap-2 border border-slate-700/60 cursor-pointer transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-400">Search markets...</span>
                </button>
              </div>
            )}

            {/* Mobile search button */}
            {!isSearchOpen && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-1.5 rounded bg-[#1e293b] text-slate-300 hover:text-white"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            {/* Newsletter CTA Button */}
            <button
              onClick={handleNewsletterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3.5 sm:px-4 py-1.5 rounded uppercase tracking-wider transition-colors cursor-pointer"
            >
              Newsletter
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded bg-[#1e293b] text-slate-300 hover:text-white border border-slate-700/60 cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenNewsletter={handleNewsletterClick}
      />
    </header>
  );
};
