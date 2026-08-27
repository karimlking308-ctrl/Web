import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Menu,
  X,
  Send,
  FolderArchive,
  ChevronDown,
  Coins,
  Building2,
  ShieldCheck,
  Info,
  Terminal,
  Wrench,
  Zap,
  BookOpen,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { HeaderSocialBar } from './SocialLinks';
import { GlobalSearchBar } from './GlobalSearchBar';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenAffiliate: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close ecosystem dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ecosystemRef.current && !ecosystemRef.current.contains(event.target as Node)) {
        setEcosystemOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'utility-tools', label: 'Tools', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'gas-calculator', label: 'Fee Estimator', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'developer-scripts', label: 'Scripts Vault', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'store', label: 'Pricing & Pro', isPro: true, icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'vault', label: 'Digital Vault', isVault: true, icon: <FolderArchive className="w-3.5 h-3.5" /> },
    { id: 'dev-docs', label: 'Docs & API', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  const secondaryNavLinks = [
    {
      id: 'backers-hub',
      label: 'Backers & Token',
      desc: '$sopump TON Jetton & DEX liquidity',
      icon: <Coins className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'investors-hub',
      label: 'Investors & IP',
      desc: 'Codebase valuation & IP licensing',
      icon: <Building2 className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'trust-legal-hub',
      label: 'Trust & Legal',
      desc: 'Contract audit & non-custodial terms',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'about',
      label: 'About & FAQ',
      desc: 'Engineering collective & roadmap',
      icon: <Info className="w-4 h-4 text-indigo-400" />,
    },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setEcosystemOpen(false);
  };

  const isEcosystemActive = secondaryNavLinks.some((l) => l.id === activeSection);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#080b12]/95 backdrop-blur-md border-b border-slate-800/90 shadow-xl shadow-black/50'
          : 'bg-[#080b12]/75 backdrop-blur-md border-b border-slate-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1px] shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                SolPump Store
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                FREE HUB
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
              sol-pump.store
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/70 p-1 rounded-full border border-slate-800/80">
          {primaryNavLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-700'
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
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    FREE
                  </span>
                )}
                {link.isPro && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    PRO
                  </span>
                )}
              </button>
            );
          })}

          {/* More Ecosystem Dropdown */}
          <div className="relative" ref={ecosystemRef}>
            <button
              onClick={() => setEcosystemOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                isEcosystemActive
                  ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>Ecosystem</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  ecosystemOpen ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>

            {ecosystemOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0b1020] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                {secondaryNavLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-slate-800/80 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls & Global Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Quick Search Bar */}
          <GlobalSearchBar onNavigate={onNavigate} />

          {/* Social Channels Icons */}
          <div className="hidden xl:flex items-center">
            <HeaderSocialBar />
          </div>

          <a
            href="https://t.me/solpump_store"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300 font-mono transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Telegram</span>
          </a>

          <button
            onClick={() => handleLinkClick('vault')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-mono font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#080b12]" />
            <span>Open Vault</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#090d18] px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
          {/* Search bar inside drawer */}
          <div className="pb-1">
            <GlobalSearchBar
              onNavigate={(id) => {
                handleLinkClick(id);
              }}
            />
          </div>

          {/* Primary Navigation links */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2">
              Main Workspaces
            </span>
            {primaryNavLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {link.isVault && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      FREE VIP
                    </span>
                  )}
                  {link.isPro && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      PRO STORE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Ecosystem Links */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2">
              Ecosystem &amp; Governance
            </span>
            {secondaryNavLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action buttons inside drawer */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300 font-mono font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Join Telegram Community</span>
            </a>
            <button
              onClick={() => handleLinkClick('vault')}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-[#080b12] text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Open VIP Vault (100% Free)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
