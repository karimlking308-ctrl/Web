import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Shield,
  ArrowRight,
  Layers,
  Star,
  Check,
  Flame,
  Code2,
  Cpu,
  Lock,
} from 'lucide-react';
import { PlanItem } from './CheckoutModal';
import { fetchSolPriceUSD, calculateSolAmount } from '../utils/solanaPayment';

interface PricingSectionProps {
  onSelectPlan: (plan: PlanItem) => void;
  onExploreFree: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  onExploreFree,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [solPrice, setSolPrice] = useState<number>(175);

  useEffect(() => {
    fetchSolPriceUSD().then((price) => {
      if (price > 0) setSolPrice(price);
    });
  }, []);

  const plans: {
    id: string;
    name: string;
    badge?: string;
    popular?: boolean;
    tagline: string;
    priceMonthly: string;
    priceYearly: string;
    periodMonthly: string;
    periodYearly: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: 'free' | 'pro' | 'lifetime';
  }[] = [
    {
      id: 'starter',
      name: 'Starter / Free',
      tagline: 'Standard Community Tier',
      priceMonthly: '$0',
      priceYearly: '$0',
      periodMonthly: 'Free forever',
      periodYearly: 'Free forever',
      description: 'Access to basic public tools, standard prompt library, and essential developer validators.',
      features: [
        '10 daily AI prompt optimizations',
        'Solana Base58 address validation',
        'Standard prompt vault library (200+ presets)',
        'Basic JSON schema synthesis',
        'Community Discord & documentation access',
        'Client-side zero-retention privacy',
      ],
      buttonText: 'Start Free / View Tools',
      buttonVariant: 'free',
    },
    {
      id: 'pro-creator',
      name: 'Pro Creator',
      popular: true,
      badge: 'Most Popular',
      tagline: 'High-Velocity Creators & Engineers',
      priceMonthly: '$9',
      priceYearly: '$7.20',
      periodMonthly: 'per month, billed monthly',
      periodYearly: 'per month, billed annually ($86/yr)',
      description: 'Unlimited AI prompt optimization, multi-agent reasoning frameworks, and exclusive developer templates.',
      features: [
        'Unlimited AI prompt optimizations & vaults',
        'Multi-agent reasoning chain blueprints',
        'Verified Anchor & Rust smart contract kits',
        'SPL Token 2022 transfer hook boilerplate',
        'High-throughput Solana RPC balancer hooks',
        'Commercial & client project usage license',
        'Priority 24/7 creator support channel',
      ],
      buttonText: 'Upgrade to Pro ($9/mo)',
      buttonVariant: 'pro',
    },
    {
      id: 'lifetime-elite',
      name: 'Lifetime Elite Bundle',
      badge: 'Lifetime Access',
      tagline: 'Complete Perpetual Ownership',
      priceMonthly: '$49',
      priceYearly: '$49',
      periodMonthly: 'One-time payment',
      periodYearly: 'One-time payment',
      description: 'Full lifetime access to all digital products, prompt databases, and source code repositories forever.',
      features: [
        'Full perpetual access to all current & future tools',
        'Complete React 19 + Tailwind source code packs',
        'All 1,500+ curated prompt vaults (JSON / MD)',
        'Private GitHub repository access & updates',
        'All future tool drops included at no extra cost',
        'Unlimited team & multi-project commercial license',
        'VIP direct line with core developer team',
      ],
      buttonText: 'Get Lifetime Bundle ($49)',
      buttonVariant: 'lifetime',
    },
  ];

  const handlePlanClick = (plan: (typeof plans)[0]) => {
    if (plan.buttonVariant === 'free') {
      onExploreFree();
    } else {
      onSelectPlan({
        id: plan.id,
        name: plan.name,
        price: billingCycle === 'monthly' ? plan.priceMonthly : (plan.id === 'lifetime-elite' ? plan.priceMonthly : '$86'),
        period: billingCycle === 'monthly' ? plan.periodMonthly : (plan.id === 'lifetime-elite' ? plan.periodMonthly : plan.periodYearly),
        description: plan.description,
        badge: plan.badge,
      });
    }
  };

  return (
    <section id="store" className="py-20 md:py-28 bg-[#090d17] border-y border-slate-800/80 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-purple-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SolPump Digital Store &amp; On-Chain Checkout</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            SolPump Digital Vault &amp; Pro Access
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Unlock premium AI prompt bundles, developer scripts, and advanced web3 tools with native Solana payments.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-full border border-slate-800">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-[#080b12]">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isPro = plan.popular;
            const isLifetime = plan.buttonVariant === 'lifetime';
            const price = billingCycle === 'monthly' ? plan.priceMonthly : (isLifetime ? plan.priceMonthly : plan.priceYearly);
            const period = billingCycle === 'monthly' ? plan.periodMonthly : (isLifetime ? plan.periodMonthly : plan.periodYearly);
            
            const { solAmountFormatted } = calculateSolAmount(
              billingCycle === 'monthly' ? plan.priceMonthly : (isLifetime ? plan.priceMonthly : '$86'),
              solPrice
            );

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 ${
                  isPro
                    ? 'bg-gradient-to-b from-[#10172a] via-[#0d1324] to-[#0a0f1d] border-2 border-emerald-500/60 shadow-2xl shadow-emerald-500/10 lg:-translate-y-2'
                    : isLifetime
                    ? 'bg-gradient-to-b from-[#13112a] via-[#0e0f20] to-[#0a0b18] border border-purple-500/40 shadow-xl shadow-purple-500/5 hover:border-purple-500/60'
                    : 'bg-[#0c101c] border border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                {/* Popular / Lifetime Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-md ${
                        isPro
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#080b12]'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      }`}
                    >
                      {isPro ? <Flame className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Tagline & Name */}
                  <div className="mb-4">
                    <span className="text-[11px] font-mono-code uppercase font-semibold text-slate-400 block mb-1">
                      {plan.tagline}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                  </div>

                  {/* Price & SOL Conversion */}
                  <div className="mb-4 pb-4 border-b border-slate-800/80">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono-code text-white tracking-tight">
                        {price}
                      </span>
                      {plan.id !== 'starter' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono-code font-bold">
                          <Zap className="w-3 h-3" />
                          <span>~{solAmountFormatted} SOL</span>
                        </span>
                      )}
                      {plan.id !== 'starter' && plan.id !== 'lifetime-elite' && (
                        <span className="text-xs font-mono-code text-slate-400">/ mo</span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono-code text-slate-400 mt-1">{period}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-mono-code uppercase tracking-wider text-slate-400 font-semibold">
                      What's Included:
                    </p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPro
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isLifetime
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call-to-Action Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                      isPro
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:opacity-95 text-[#080b12] shadow-emerald-500/25 active:scale-[0.98]'
                        : isLifetime
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:opacity-95 text-white shadow-purple-500/20 active:scale-[0.98]'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white active:scale-[0.98]'
                    }`}
                  >
                    <span>
                      {isPro && billingCycle === 'yearly'
                        ? 'Upgrade to Pro ($7.20/mo)'
                        : plan.buttonText}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[10px] text-center font-mono-code text-slate-400 mt-3">
                    {isLifetime
                      ? 'Instant on-chain settlement · Perpetual vault unlock'
                      : isPro
                      ? 'Cancel anytime · Instant digital activation via SOL'
                      : 'No crypto or credit card required to get started'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee & Value Badges */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Instant Solana Settlement</p>
              <p className="text-[11px] text-slate-400">Direct wallet-to-wallet transfer</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Non-Custodial &amp; Safe</p>
              <p className="text-[11px] text-slate-400">Zero telemetry, verified on-chain</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Commercial License</p>
              <p className="text-[11px] text-slate-400">Use in client &amp; SaaS projects</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
