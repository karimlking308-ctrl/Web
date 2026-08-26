import React from 'react';
import { Send, Users, Sparkles, MessageCircle, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

interface TelegramCommunityBannerProps {
  compact?: boolean;
}

export const TelegramCommunityBanner: React.FC<TelegramCommunityBannerProps> = ({ compact = false }) => {
  return (
    <div id="community" className="w-full relative overflow-hidden">
      <div
        className={`relative rounded-3xl bg-gradient-to-r from-[#0c1425] via-[#0d1a33] to-[#091122] border border-cyan-500/30 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden ${
          compact ? 'my-6' : 'my-12'
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70f_1px,transparent_1px),linear-gradient(to_bottom,#0284c70f_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content Column */}
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold font-mono-code uppercase tracking-wider">
              <Send className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Official SolPump Telegram Community</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Join Our Developer Community &amp; Get{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Future Free Tool Releases
              </span>
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Connect with 12,000+ engineers, creators, and web3 builders. Get instant updates on newly added open-source micro-apps, custom n8n workflow requests, technical support, and free source code drops.
            </p>

            {/* Quick Feature Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-mono-code text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Weekly Free Script Drops</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dev Support &amp; Custom Bots</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Open Access</span>
              </div>
            </div>
          </div>

          {/* Right CTA Actions Column */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto shrink-0">
            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:opacity-95 text-[#080b12] text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Join Official Telegram Channel</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="https://t.me/solpump_community"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Join Dev Discussion Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
