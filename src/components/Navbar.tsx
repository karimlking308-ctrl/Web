import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Shield, ArrowUpRight, Lock, Key, FolderArchive } from 'lucide-react';
import { HeaderSocialBar, SOCIAL_LINKS, TelegramIcon, TwitterXIcon, FacebookIcon } from './SocialLinks';

interface NavbarProps {
  onOpenLogin: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkLicense = () => {
      const saved = localStorage.getItem('solpump_vault_license');
      setIsUnlocked(!!saved);
    };
    checkLicense();
    window.addEventListener('storage', checkLicense);
    return () => window.removeEventListener('storage', checkLicense);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'utility-tools', label: 'Tools' },
    { id: 'gas-calculator', label: 'Fee Estimator' },
    { id: 'developer-scripts', label: 'Scripts Vault' },
    { id: 'store', label: 'Digital Store' },
    { id: 'vault', label: 'Digital Vault', isVault: true },
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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 p-[1px] shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                SolPump Store
              </span>
              <span className="text-[10px] font-mono-code font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO
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
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isUnlocked ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                )}
                <span>{link.label}</span>
                {link.isVault && isUnlocked && (
                  <span className="text-[9px] font-mono-code px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    VIP
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Social Channels Icons */}
          <HeaderSocialBar />

          <button
            onClick={() => handleLinkClick('vault')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-mono-code transition-colors cursor-pointer"
          >
            <Key className="w-3 h-3 text-emerald-400" />
            <span>{isUnlocked ? 'Vault: Unlocked' : 'Vault Access'}</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Creator Login</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => handleLinkClick('vault')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-mono-code flex items-center gap-1"
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
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {isUnlocked ? 'UNLOCKED' : 'VAULT'}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Social Channels */}
          <div className="pt-2.5 pb-1 border-t border-slate-800/80">
            <div className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider mb-2 px-1">
              Official Community Channels
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#229ED9] hover:border-[#229ED9]/40 text-xs font-mono-code transition-colors"
              >
                <TelegramIcon className="w-3.5 h-3.5 text-[#229ED9]" />
                <span>Telegram</span>
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-mono-code transition-colors"
              >
                <TwitterXIcon className="w-3.5 h-3.5 text-white" />
                <span>Twitter</span>
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#1877F2] hover:border-[#1877F2]/40 text-xs font-mono-code transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5 font-mono-code">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solana RPC Verified</span>
            </span>
            <button
              onClick={onOpenLogin}
              className="text-emerald-400 font-bold hover:underline"
            >
              Creator Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
