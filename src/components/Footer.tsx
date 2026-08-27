import React from 'react';
import { Sparkles, ArrowUp, FolderArchive, Send, CheckCircle2 } from 'lucide-react';
import { SOCIAL_LINKS, TelegramIcon, TwitterXIcon, FacebookIcon } from './SocialLinks';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLegal: (docType: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
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
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SolPump Store
              </span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 font-medium border border-slate-700/60">
                100% FREE HUB
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Open access community hub for n8n AI workflows, developer scripts, prompt databases, and Web3 digital creator toolkits.
            </p>
            
            <div className="flex items-center gap-2 text-[11px] font-mono-code text-slate-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>100% Free Open Access • No Paywalls</span>
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
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 mb-3 tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left w-full block"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('utility-tools')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left w-full block"
                >
                  Featured Micro Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gas-calculator')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Fee Estimator</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">Free</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('developer-scripts')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Scripts Vault</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">Open Source</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Pro &amp; Enterprise Pricing</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-mono-code">PRO</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <FolderArchive className="w-3 h-3 text-slate-400" />
                    <span>Digital Vault (1-Click Downloads)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-mono-code">FREE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('token-stats')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                    <span>Live $sopump Ticker</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">TON</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('backers-hub')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left w-full block"
                >
                  Backers &amp; Support Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('investors-hub')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Investors &amp; IP Hub</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dev-docs')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Developer Docs &amp; API</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">REST</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trust-legal-hub')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Trust, Security &amp; Legal</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">Audit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left w-full block"
                >
                  About &amp; FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Free Digital Assets */}
          <div>
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 mb-3 tracking-wider">
              Free Downloads
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Telegram Mini-App &amp; Clicker</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">FREE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>WhatsApp AI Auto-Responder</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">FREE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>Solana Token Sniper Bot</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">FREE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>n8n AI Workflows (.JSON)</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">FREE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                >
                  <span>1,500+ AI Prompt Vaults</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono-code">FREE</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Telegram Community Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 tracking-wider">
              Developer Community
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Join our official Telegram for daily open source code drops, script support, and custom n8n workflow requests.
            </p>
            
            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-mono-code text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-slate-400" />
              <span>Join Telegram Community</span>
            </a>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Commercial License</span>
              </div>
              <p className="text-[10px] text-slate-400">
                All downloaded code bases &amp; scripts are free for personal &amp; commercial use.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-400 text-[11px] text-center sm:text-left">
            © {new Date().getFullYear()} SolPump Store (sol-pump.store). All rights reserved. 100% Free Open Access Resource Hub.
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
