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
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SolPump Store
              </span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                100% FREE HUB
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Open access community hub for n8n AI workflows, developer scripts, prompt databases, and Web3 digital creator toolkits.
            </p>
            
            <div className="flex items-center gap-2 text-[11px] font-mono-code text-slate-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-semibold">100% Free Open Access • No Paywalls</span>
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
                  Featured Micro Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gas-calculator')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-between w-full"
                >
                  <span>Fee Estimator</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">Free</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('developer-scripts')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-between w-full"
                >
                  <span>Scripts Vault</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">Open Source</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Free Resource Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderArchive className="w-3 h-3" />
                  <span>Digital Vault (1-Click Downloads)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('backers-hub')}
                  className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Backers &amp; Support Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('investors-hub')}
                  className="text-teal-400 font-medium hover:text-teal-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Investors &amp; IP Hub</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-teal-500/15 text-teal-300 font-mono-code">Overview</span>
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

          {/* Free Digital Assets */}
          <div>
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 mb-3">
              Free Downloads
            </h4>
            <ul className="space-y-2">
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>Telegram Mini-App &amp; Clicker</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">FREE</span>
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>WhatsApp AI Auto-Responder</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">FREE</span>
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>Solana Token Sniper Bot</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">FREE</span>
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>n8n AI Workflows (.JSON)</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">FREE</span>
              </li>
              <li
                onClick={() => onNavigate('vault')}
                className="text-slate-400 hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>1,500+ AI Prompt Vaults</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono-code">FREE</span>
              </li>
            </ul>
          </div>

          {/* Telegram Community Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200">
              Developer Community
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Join our official Telegram for daily open source code drops, script support, and custom n8n workflow requests.
            </p>
            
            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono-code text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Join Telegram Community</span>
            </a>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
