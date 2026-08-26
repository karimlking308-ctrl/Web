import React from 'react';
import { Sparkles, Shield, ArrowUp, Key, FolderArchive, ArrowUpRight, MessageSquare, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS, TelegramIcon, TwitterXIcon, FacebookIcon } from './SocialLinks';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#06080e] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission & Socials */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SolPump Store
              </span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                sol-pump.store
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Professional platform for AI utilities, curated prompt vaults, developer toolkits, and Web3 digital creator solutions.
            </p>
            
            <div className="flex items-center gap-2 text-[11px] font-mono-code text-slate-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Solana Non-Custodial Settlement Node</span>
            </div>

            {/* Official Social Badges */}
            <div className="pt-2">
              <p className="text-[10px] font-mono-code uppercase font-semibold text-slate-400 mb-2">
                Official Channels
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram Channel (@solana_pump_platform)"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#229ED9] hover:border-[#229ED9]/50 hover:bg-[#229ED9]/10 transition-all duration-200"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter / X (@Platform_launch)"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-600 hover:bg-white/10 transition-all duration-200"
                  aria-label="Twitter / X"
                >
                  <TwitterXIcon className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook Page"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('utility-tools')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Featured Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gas-calculator')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-between w-full"
                >
                  <span>Solana Fee Estimator</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">Free</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('developer-scripts')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-between w-full"
                >
                  <span>Developer Scripts Vault</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-300 font-mono-code">CLI &amp; Bots</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Digital Store &amp; Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderArchive className="w-3 h-3" />
                  <span>Digital Vault &amp; Downloads</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About &amp; FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 mb-3">
              Digital Assets
            </h4>
            <ul className="space-y-2">
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>Telegram Mini-App &amp; Clicker</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-300 font-mono-code">Hot</span>
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>WhatsApp AI Auto-Responder</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">AI</span>
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>Solana Token Sniper &amp; Bot</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-teal-500/15 text-teal-300 font-mono-code">MEV</span>
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                n8n AI Agent Workflows (.JSON)
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Solana Telegram Buy-Bot
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                1,500+ AI Prompt Vault (JSON/MD)
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Master All-In-One Bundle (.ZIP)
              </li>
            </ul>
          </div>

          {/* Official Community Links Card */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 mb-3">
              Community &amp; Socials
            </h4>
            <div className="space-y-2">
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-[#229ED9]/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#229ED9]/15 flex items-center justify-center text-[#229ED9]">
                    <TelegramIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-[#229ED9] transition-colors">
                      Telegram Channel
                    </div>
                    <div className="text-[10px] font-mono-code text-slate-400">
                      @solana_pump_platform
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#229ED9] transition-colors" />
              </a>

              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-600 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <TwitterXIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                      Twitter / X
                    </div>
                    <div className="text-[10px] font-mono-code text-slate-400">
                      @Platform_launch
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </a>

              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-[#1877F2]/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#1877F2]/15 flex items-center justify-center text-[#1877F2]">
                    <FacebookIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-[#1877F2] transition-colors">
                      Facebook Page
                    </div>
                    <div className="text-[10px] font-mono-code text-slate-400">
                      Official Page &amp; Share
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#1877F2] transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-code text-slate-400">
          <p>© {new Date().getFullYear()} SolPump Store (sol-pump.store). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300">Terms of Service</span>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

