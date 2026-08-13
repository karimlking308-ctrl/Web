import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { NewsletterSignup } from '../newsletter/NewsletterSignup';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  const sections = [
    { label: 'Markets', path: '/markets' },
    { label: 'Crypto', path: '/crypto' },
    { label: 'Stocks', path: '/stocks' },
    { label: 'Economy', path: '/economy' },
    { label: 'Technology', path: '/technology' },
    { label: 'Analysis', path: '/analysis' },
    { label: 'Trending', path: '/trending' },
  ];

  const infoLinks = [
    { label: 'About PULSE', path: '/about' },
    { label: 'Editorial Policy', path: '/editorial-policy' },
    { label: 'Contact Wire', path: '/contact' },
    { label: 'Search Wire', path: '/search' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Use', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Copyright & Content Policy', path: '/copyright' },
    { label: 'Financial Disclaimer', path: '/disclaimer' },
  ];

  return (
    <footer className="w-full bg-[#0f172a] border-t border-slate-800 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div
              onClick={() => navigate('/')}
              className="flex flex-col cursor-pointer select-none group"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 bg-blue-600 rounded-xs" />
                <span className="font-brand font-extrabold text-2xl tracking-widest text-white">
                  PULSE
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase pl-4.5 mt-0.5 font-semibold">
                MARKETS. NEWS. ANALYSIS.
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Independent digital financial media platform delivering global economic coverage, equity market intelligence, cryptocurrency data, and institutional-grade AI synthesis.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Production Architecture: Phase 1 Active</span>
            </div>
          </div>

          {/* Sections Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Markets & Sectors
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              {sections.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Information & Legal */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              {infoLinks.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-800" />
              {legalLinks.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="hover:text-slate-200 text-slate-400 transition-colors text-left cursor-pointer text-[11px]"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <NewsletterSignup variant="compact" />
          </div>
        </div>

        {/* Disclaimer Area */}
        <div className="py-6 border-b border-slate-800">
          <DisclaimerBanner type="financial" />
        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© {new Date().getFullYear()} PULSE Media Group. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Production Host: sol-pump.store</span>
            <span>•</span>
            <span>Editorial Wire</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
