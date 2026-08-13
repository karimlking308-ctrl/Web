import React from 'react';
import { NAV_ITEMS } from '../navigation/NavTabs';
import { useRouter } from '../../context/RouterContext';
import { X, Search, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewsletter: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  onOpenNewsletter,
}) => {
  const { currentPath, navigate } = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full bg-[#0b0f17] border-t border-slate-800 rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto flex flex-col gap-5">
        {/* Header inside drawer */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="font-brand font-bold text-lg text-white tracking-widest">
              PULSE
            </span>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider">
              MARKETS. NEWS. ANALYSIS.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Shortcut */}
        <button
          onClick={() => {
            onClose();
            navigate('/search');
          }}
          className="flex items-center gap-3 w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-mono text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-left"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span>Search markets, companies, news...</span>
        </button>

        {/* Nav Links */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider px-2 mb-1">
            Editorial Sections
          </span>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-mono transition-colors text-left ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenNewsletter();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Join Market Brief</span>
          </button>
        </div>

        {/* Legal links small */}
        <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-500">
          <button onClick={() => { navigate('/about'); onClose(); }} className="hover:text-slate-400">About</button>
          <span>•</span>
          <button onClick={() => { navigate('/privacy'); onClose(); }} className="hover:text-slate-400">Privacy</button>
          <span>•</span>
          <button onClick={() => { navigate('/disclaimer'); onClose(); }} className="hover:text-slate-400">Disclaimer</button>
        </div>
      </div>
    </div>
  );
};
