import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Send, FolderArchive, Users, CheckCircle2 } from 'lucide-react';
import { HeaderSocialBar, TelegramIcon } from './SocialLinks';
import { GlobalSearchBar } from './GlobalSearchBar';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenAffiliate: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAffiliate, activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'utility-tools', label: 'Tools' },
    { id: 'gas-calculator', label: 'Fee Estimator' },
    { id: 'developer-scripts', label: 'Scripts Vault' },
    { id: 'store', label: 'Pricing & Pro', isPro: true },
    { id: 'vault', label: 'Digital Vault', isVault: true },
    { id: 'backers-hub', label: 'Backers & Token' },
    { id: 'investors-hub', label: 'Investors & IP' },
    { id: 'dev-docs', label: 'Docs & API' },
    { id: 'trust-legal-hub', label: 'Trust & Legal' },
    { id: 'community', label: 'Telegram Hub' },
    { id: 'about', label: 'About' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#080b12]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40'
          : 'bg-[#080b12]/60 backdrop-blur-sm border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1px] shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                SolPump Store
              </span>
              <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                FREE HUB
              </span>
            </div>
            <span className="text-[10px] font-mono-code text-slate-400 block -mt-0.5">
              sol-pump.store
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {link.isVault && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {link.isPro && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
                <span>{link.label}</span>
                {link.isVault && (
                  <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    FREE
                  </span>
                )}
                {link.isPro && (
                  <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Global Quick Search Bar */}
          <GlobalSearchBar onNavigate={onNavigate} />

          {/* Social Channels Icons */}
          <HeaderSocialBar />

          <a
            href="https://t.me/solpump_store"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono-code transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telegram Community</span>
          </a>

          <button
            onClick={() => handleLinkClick('vault')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-bold font-mono-code transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#080b12]" />
            <span>Open Vault (Free)</span>
          </button>
        </div>

        {/* Medium/Tablet Search Bar (hidden on lg, visible on md/sm) */}
        <div className="hidden md:flex lg:hidden items-center gap-2">
          <GlobalSearchBar onNavigate={onNavigate} />
          <button
            onClick={() => handleLinkClick('vault')}
            className="px-3 py-1.5 rounded-full bg-emerald-500 text-[#080b12] text-xs font-bold font-mono-code flex items-center gap-1"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Vault</span>
          </button>
        </div>

        {/* Mobile menu trigger and quick search */}
        <div className="flex items-center gap-2 md:hidden">
          <GlobalSearchBar onNavigate={onNavigate} />
          <button
            onClick={() => handleLinkClick('vault')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-[#080b12] text-xs font-bold font-mono-code flex items-center gap-1"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Vault</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0b0f19] px-4 pt-3 pb-5 space-y-3 animate-in fade-in duration-150">
          <div className="pb-1">
            <GlobalSearchBar
              onNavigate={(id) => {
                handleLinkClick(id);
              }}
            />
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  activeSection === link.id
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{link.label}</span>
                {link.isVault && (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    100% FREE
                  </span>
                )}
                {link.isPro && (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    PRO / WEB3
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono-code flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Join Telegram Community</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
