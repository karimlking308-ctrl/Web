import React from 'react';
import { Sparkles, Shield, ArrowUp, Github, Twitter } from 'lucide-react';

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
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
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
              <span>TLS 256-bit Encrypted Node</span>
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
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Platform Pillars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Tools &amp; Vaults
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Digital Store &amp; Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About &amp; FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-mono-code uppercase font-semibold text-slate-200 mb-3">
              Tool Suites
            </h4>
            <ul className="space-y-2">
              <li className="text-slate-400 hover:text-white cursor-pointer">AI Prompt Vaults</li>
              <li className="text-slate-400 hover:text-white cursor-pointer">Developer Micro-Utils</li>
              <li className="text-slate-400 hover:text-white cursor-pointer">Solana Web3 Decoders</li>
              <li className="text-slate-400 hover:text-white cursor-pointer">Zod / Type Synthesizers</li>
            </ul>
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
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
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
