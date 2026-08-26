import React, { useState } from 'react';
import { ShieldCheck, Zap, Globe, Sparkles, ChevronDown, ChevronUp, Mail, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { PLATFORM_STATS, FAQS } from '../data/toolsData';
import { SOCIAL_LINKS, TelegramIcon, TwitterXIcon, FacebookIcon } from './SocialLinks';

export const AboutSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-[#090d16] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Platform Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {PLATFORM_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center"
            >
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono-code mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* About & Trust Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About SolPump Store</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Built for High-Velocity Engineering and Digital Creation
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              SolPump Store (<span className="text-emerald-400 font-mono-code font-semibold">sol-pump.store</span>) was designed from the ground up to solve the friction of modern digital tool discovery.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Instead of scattering tools across disconnected repositories and unvetted scripts, our catalog curates battle-tested AI prompt blueprints, secure client-side utilities, and Web3 protocol decoders into a singular high-performance suite.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Zero Trust Privacy</h4>
                  <p className="text-[11px] text-slate-400">All sanitizers &amp; converters execute client-side.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Production Ready</h4>
                  <p className="text-[11px] text-slate-400">Schema-compliant and tested across modern LLMs.</p>
                </div>
              </div>
            </div>

            {/* Official Social Channels */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <p className="text-xs font-mono-code text-slate-400 uppercase tracking-wider mb-3">
                Official Channels &amp; Community
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-[#229ED9]/50 hover:bg-[#229ED9]/10 text-slate-300 hover:text-[#229ED9] text-xs font-mono-code transition-all"
                >
                  <TelegramIcon className="w-4 h-4 text-[#229ED9]" />
                  <span>Telegram Channel</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-600 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono-code transition-all"
                >
                  <TwitterXIcon className="w-4 h-4 text-white" />
                  <span>Twitter / X</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 text-slate-300 hover:text-[#1877F2] text-xs font-mono-code transition-all"
                >
                  <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                  <span>Facebook Page</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1322] to-[#090d18] border border-slate-800 p-8 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Get Tool Updates &amp; Prompt Drops</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Receive weekly releases of verified AI prompts, Solana developer scripts, and micro-tools directly in your inbox. No spam.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>You're subscribed! You will receive the next curated tool drops.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your creator email..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Subscribe to Tool Drops
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  Independent subscription · Unsubscribe anytime with 1 click
                </p>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto pt-10 border-t border-slate-800/80">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-sm font-semibold text-slate-200">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
