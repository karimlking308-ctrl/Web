import React, { useState } from 'react';
import { newsletterService } from '../../services/newsletterService';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, Lock } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'card' | 'inline' | 'compact';
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  variant = 'card',
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await newsletterService.subscribe(email);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Something went wrong while registering your email. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
          PULSE Market Brief
        </h4>
        <p className="text-xs text-slate-500">
          Daily macro and digital asset intelligence delivered directly to your inbox.
        </p>

        {status.type === 'success' ? (
          <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Subscribed successfully.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono shadow-xs"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
              </button>
            </div>
            {status.type === 'error' && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <section className={`bg-[#0f172a] text-white border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-lg ${className}`}>
      {/* Subtle geometric pattern / glow */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
          <Mail className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono uppercase tracking-wider font-semibold">
            <span>Free Editorial Intelligence</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            PULSE MARKET BRIEF
          </h3>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Get the most important market news, crypto updates, stock stories and PULSE analysis delivered to your inbox.
          </p>
        </div>

        {status.type === 'success' ? (
          <div className="w-full max-w-md p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-left leading-relaxed">{status.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-2.5 mt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-blue-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {status.type === 'error' && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {status.message}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>No account or login required • Unsubscribe at any time</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
