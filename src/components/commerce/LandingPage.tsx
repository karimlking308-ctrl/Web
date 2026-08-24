import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  ShoppingBag, 
  Globe, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Sliders, 
  Boxes, 
  Percent, 
  Megaphone, 
  ChevronRight, 
  Star, 
  Store, 
  Tag, 
  Smartphone, 
  Monitor,
  Heart,
  Search,
  User,
  ShoppingBag as CartIcon
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { AuthModal } from './AuthModal';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useCommerce();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. PUBLIC NAVIGATION HEADER */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#070a12]/80 backdrop-blur-xl border-b border-slate-800/80 transition">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo size="md" light={true} />

            <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#ai-section" className="hover:text-white transition flex items-center gap-1">
                <span>AI Commerce</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-extrabold border border-indigo-500/30">
                  New
                </span>
              </a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="#testimonials" className="hover:text-white transition">Customers</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2"
            >
              <span>Start for free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Subtle Ambient Violet Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>All-in-one Commerce Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Everything you need to <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">build, run, and scale</span> your commerce.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Launch your store, manage your multi-tenant business, and grow your sales — all from one intelligent commerce platform.
          </p>

          {/* Hero Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/35 transition cursor-pointer flex items-center justify-center gap-2.5"
            >
              <span>Start for free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAuth('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore the platform</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HERO VISUAL: Desktop Mockup + Floating Widgets + Mobile Phone */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-16 max-w-6xl mx-auto relative">
          {/* Main Desktop Storefront Frame */}
          <div className="rounded-2xl bg-[#0f1422] border border-slate-800 p-2 sm:p-4 shadow-2xl shadow-indigo-950/40 relative z-10 overflow-hidden">
            {/* Window Browser Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 mb-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-4 py-1 rounded-lg bg-slate-900/90 text-slate-400 font-mono text-[11px] border border-slate-800">
                https://sol-pump.store
              </div>
              <div className="w-12" />
            </div>

            {/* Inner Storefront Content */}
            <div className="bg-white rounded-xl text-slate-900 overflow-hidden">
              {/* Store Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="font-black text-slate-950 text-base tracking-tight">SOLPUMP STORE</div>
                <div className="hidden sm:flex items-center gap-6 font-semibold text-slate-600">
                  <span className="text-indigo-600">Summer 2026</span>
                  <span>Bags</span>
                  <span>Eyewear</span>
                  <span>Accessories</span>
                </div>
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-slate-500" />
                  <CartIcon className="w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Store Hero Banner */}
              <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white p-8 sm:p-12 text-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                  New Arrivals
                </span>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">Summer Collection</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Handcrafted full-grain goods engineered for maximum longevity and everyday elegance.
                </p>
                <span className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
                  Shop Catalog &rarr;
                </span>
              </div>

              {/* Product Cards Grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'Leather Travel Bag', price: '$129.00', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
                  { title: 'Aviator Sunglasses', price: '$89.00', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
                  { title: 'Chronograph Watch', price: '$189.00', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
                  { title: 'Sport Running Shoes', price: '$149.00', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-3 hover:shadow-lg transition group">
                    <img src={item.img} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                    <div className="font-bold text-slate-900 text-xs truncate">{item.title}</div>
                    <div className="text-xs font-extrabold text-indigo-600 mt-0.5">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FLOATING WIDGET 1: Total Sales Metric (Top Left) */}
          <div className="hidden md:flex absolute -top-6 -left-6 z-20 bg-[#0f1422]/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400">Total Sales</div>
              <div className="text-lg font-black text-white">$128,645.60</div>
              <div className="text-[10px] font-bold text-emerald-400">+12.5% this week</div>
            </div>
          </div>

          {/* FLOATING WIDGET 2: AI Assistant Widget (Top Right) */}
          <div className="hidden lg:flex absolute top-12 -right-8 z-20 bg-[#0f1422]/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex-col gap-2 max-w-xs text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Assistant</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              "How can I help you grow your store today?"
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-semibold">
                Analyze sales
              </span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-semibold">
                Create a discount
              </span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-semibold">
                Write description
              </span>
            </div>
          </div>

          {/* FLOATING WIDGET 3: Mobile Store Mockup (Bottom Right) */}
          <div className="hidden sm:block absolute -bottom-10 -right-6 z-20 w-64 bg-slate-950 rounded-[32px] p-2 border-4 border-slate-800 shadow-2xl">
            <div className="bg-white text-slate-900 rounded-[24px] p-3 text-left overflow-hidden">
              <div className="text-[10px] font-black text-slate-950 flex items-center justify-between mb-2">
                <span>SOLPUMP STORE</span>
                <span className="text-[9px] text-indigo-600 font-bold">2 items</span>
              </div>
              <div className="h-16 bg-slate-900 text-white rounded-lg p-2 text-center flex flex-col justify-center mb-2">
                <span className="text-[9px] font-bold">Summer 2026</span>
                <span className="text-[11px] font-black text-indigo-300">Save 20% Today</span>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center gap-2 p-1 rounded bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded bg-slate-200" />
                  <div className="truncate font-bold">Leather Backpack</div>
                  <div className="ml-auto font-black text-indigo-600">$129</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. LOGO TRUST BADGES */}
      {/* ------------------------------------------------------------- */}
      <section className="py-12 border-y border-slate-800/60 bg-[#0c101d]/60">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
            Trusted by 10,000+ modern businesses worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60 font-black text-sm tracking-widest text-slate-400">
            <span>LOOM</span>
            <span>KANBA</span>
            <span>CACTUS</span>
            <span>POLARIS</span>
            <span>CIRCLE</span>
            <span>CLOUDWAVE</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FEATURES GRID (8 Cards matching the reference) */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Powerful features to grow your business
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            Everything you need in one platform. No coding required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Store,
              title: 'Build Your Store',
              desc: 'Drag-and-drop visual store builder with customizable layouts, high-converting checkout, and mobile responsiveness.'
            },
            {
              icon: Globe,
              title: 'Sell Everywhere',
              desc: 'Seamlessly sell across your website, Instagram, Facebook, TikTok, POS, and international marketplaces.'
            },
            {
              icon: Sparkles,
              title: 'AI-Powered Commerce',
              desc: 'Generate product copy, automated email campaigns, smart pricing recommendations, and sales predictions.'
            },
            {
              icon: Boxes,
              title: 'Manage Everything',
              desc: 'Centralized catalog management, multi-warehouse stock sync, barcode tracking, and automated fulfillment.'
            },
            {
              icon: Percent,
              title: 'Increase Sales',
              desc: 'Smart promo codes, flash sale countdowns, abandoned checkout recovery, and dynamic upselling at checkout.'
            },
            {
              icon: BarChart3,
              title: 'Understand Your Business',
              desc: 'Real-time profit tracking, customer lifetime value metrics, cohort retention charts, and traffic insights.'
            },
            {
              icon: Layers,
              title: 'Apps & Integrations',
              desc: 'Connect Stripe, PayPal, Apple Pay, Google Pay, DHL, FedEx, Mailchimp, and custom REST & GraphQL APIs.'
            },
            {
              icon: ShieldCheck,
              title: 'Secure & Reliable',
              desc: 'Multi-tenant architecture with 99.99% uptime, automated DDoS protection, and PCI-DSS Level 1 compliance.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#0f1422] rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-xl transition group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. AI COMMERCE SHOWCASE SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="ai-section" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-[#0f1422] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Commerce Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Your business, smarter with AI
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Save dozens of hours every week. SOLPUMP's AI copilot handles copywriting, SEO, marketing campaigns, and data analysis automatically.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'AI store builder from a single prompt',
                  'High-converting AI product descriptions',
                  'Automated email campaign copy & segmentation',
                  'Real-time sales insights & revenue projections',
                  '24/7 autonomous customer inquiries copilot'
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{txt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => openAuth('signup')}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try AI Commerce Assistant</span>
                </button>
              </div>
            </div>

            {/* Right Interactive AI Card Mockup */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI Store Generator</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                &gt; "I sell handmade Moroccan leather bags and travel accessories."
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Generating store structure
                  </span>
                  <span className="text-slate-500">Done</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Generating 4 curated products
                  </span>
                  <span className="text-slate-500">Done</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Writing SEO titles & descriptions
                  </span>
                  <span className="text-slate-500">Done</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Applying Apex Modern luxury theme
                  </span>
                  <span className="text-slate-500">Done</span>
                </div>
              </div>

              <button
                onClick={() => openAuth('signup')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Launch Generated Store &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. PRICING TIERS */}
      {/* ------------------------------------------------------------- */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto text-center">
        <div className="max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Flexible plans for every stage
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Start free. Upgrade anytime as your business expands.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs font-bold">
            <span className={billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-1 relative transition cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full bg-indigo-500 transition-all ${billingCycle === 'yearly' ? 'ml-6' : 'ml-0'}`} />
            </button>
            <span className={billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}>
              Yearly <strong className="text-indigo-400 font-extrabold">(Save 20%)</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          {[
            {
              name: 'Free',
              price: '$0',
              period: '/mo',
              desc: 'For new creators testing products',
              features: ['1 Storefront', 'Up to 10 products', '2.0% transaction fee', 'Basic analytics']
            },
            {
              name: 'Starter',
              price: billingCycle === 'yearly' ? '$7' : '$9',
              period: '/mo',
              desc: 'For early stage growing brands',
              features: ['Unlimited products', 'Custom domain support', '1.5% transaction fee', 'Discount codes']
            },
            {
              name: 'Growth',
              popular: true,
              price: billingCycle === 'yearly' ? '$23' : '$29',
              period: '/mo',
              desc: 'Most popular for scaling merchants',
              features: ['Everything in Starter', 'AI Commerce Assistant', '0.5% transaction fee', 'Multi-location inventory', 'Priority support']
            },
            {
              name: 'Pro',
              price: billingCycle === 'yearly' ? '$63' : '$79',
              period: '/mo',
              desc: 'For established high volume retailers',
              features: ['0% transaction fees', 'Custom checkout scripts', 'Advanced cohort analytics', 'Dedicated account manager']
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              desc: 'For global retail networks',
              features: ['Custom SLA 99.99%', 'Dedicated cloud instance', 'Custom ERP sync', 'Unlimited team seats']
            }
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 flex flex-col justify-between relative ${
                plan.popular
                  ? 'bg-[#141b2d] border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20'
                  : 'bg-[#0f1422] border border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="font-extrabold text-white text-base mb-1">{plan.name}</div>
                <div className="text-xs text-slate-400 mb-4">{plan.desc}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-bold">{plan.period}</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                  {plan.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openAuth('signup')}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. CUSTOMER TESTIMONIALS */}
      {/* ------------------------------------------------------------- */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">Loved by high-growth merchants</h2>
          <p className="text-xs text-slate-400 font-medium">Real stories from merchants operating on SOLPUMP</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              quote: "Switching to SOLPUMP doubled our conversion rate in 3 weeks. The built-in AI copilot writes our campaign emails and saves 10+ hours weekly.",
              name: "Sarah Johnson",
              role: "Founder, Artisan Bag Co.",
              rating: 5
            },
            {
              quote: "The speed and inventory synchronization across our online shop and pop-up locations is unmatched. It feels like software built for 2026.",
              name: "Michael Chen",
              role: "Owner, Vanguard Optics",
              rating: 5
            },
            {
              quote: "Setup was completed in under 10 minutes. The multi-tenant security, checkout speed, and clean design helped us pass $100k in monthly revenue.",
              name: "Fatima Zahra",
              role: "Creative Director, Zahra Atelier",
              rating: 5
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-[#0f1422] rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <div className="font-bold text-xs text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. FINAL CTA BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-950 via-[#0f1422] to-slate-950 rounded-3xl border border-indigo-500/30 p-10 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to build your success story?
            </h2>
            <p className="text-sm text-slate-300 font-medium">
              Join thousands of fast-growing businesses already operating on SOLPUMP.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openAuth('signup')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/35 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Start for free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuth('login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-sm transition cursor-pointer"
              >
                <span>Explore the platform</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-16 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <Logo size="md" light={true} />
            <p className="text-slate-400 max-w-sm leading-relaxed">
              SOLPUMP is the all-in-one AI-powered commerce operating system for modern brands, multi-location retailers, and global merchants.
            </p>
            <div className="text-[11px] text-slate-500">
              Official Production Domain: <strong className="text-slate-300">sol-pump.store</strong>
            </div>
          </div>

          <div>
            <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Product</div>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition">Store Builder</a></li>
              <li><a href="#ai-section" className="hover:text-white transition">AI Copilot</a></li>
              <li><a href="#features" className="hover:text-white transition">Multi-Warehouse</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Resources</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition">Merchant Guides</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Company & Legal</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Security & Compliance</a></li>
              <li><a href="#" className="hover:text-white transition">System Status</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>© 2026 SOLPUMP. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">English (US) ▾</span>
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};
