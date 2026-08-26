import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import {
  Sparkles,
  ArrowRight,
  Check,
  ShoppingBag,
  TrendingUp,
  Layers,
  ShieldCheck,
  Zap,
  BarChart3,
  Boxes,
  Percent,
  ChevronRight,
  Store,
  CreditCard,
  Users,
  Search,
  CheckCircle2,
  Package,
  Activity,
  ArrowUpRight,
  Lock,
  Globe,
  Sliders,
  DollarSign
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { AuthModal } from './AuthModal';
import { CheckoutModal } from './CheckoutModal';

interface LandingPageProps {
  onExplorePlatform?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplorePlatform }) => {
  const { products, setViewMode, login } = useCommerce();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [previewProduct, setPreviewProduct] = useState<any>(products[0] || null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState<'overview' | 'orders' | 'ai'>('overview');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartMerchantOS = () => {
    if (onExplorePlatform) {
      onExplorePlatform();
    } else {
      login('merchant@sol-pump.store', 'password123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. ENTERPRISE NAVIGATION BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="md" light={false} showTagline={true} />

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <a href="#features" className="hover:text-slate-950 transition">
                Products
              </a>
              <a href="#solutions" className="hover:text-slate-950 transition">
                Solutions
              </a>
              <a href="#ai-commerce" className="hover:text-slate-950 transition flex items-center gap-1.5">
                <span>AI Commerce</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
                  v2.5
                </span>
              </a>
              <a href="#pricing" className="hover:text-slate-950 transition">
                Pricing
              </a>
              <a href="#security" className="hover:text-slate-950 transition">
                Security
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={handleStartMerchantOS}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
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
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-slate-50/80 border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>SOLPUMP 2.5 — The Commerce Operating System</span>
          </div>

          {/* Positioning Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            The operating system for <span className="text-indigo-600">modern commerce</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Build your store, manage your business, understand your customers, and grow with intelligent commerce tools.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartMerchantOS}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Start for free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleStartMerchantOS}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm shadow-2xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore the platform</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero setup fees</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Card & Stripe Ready</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Autonomous AI Intelligence</span>
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* REALISTIC HERO PRODUCT VISUAL (Merchant OS Window) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-left">
            {/* Top Window Bar */}
            <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <span className="text-slate-300 mx-1">|</span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-[11px] font-mono shadow-2xs">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>app.sol-pump.store/admin/overview</span>
                </div>
              </div>

              {/* View Switcher Tabs inside Hero Preview */}
              <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveHeroTab('overview')}
                  className={`px-3 py-1 rounded-md transition cursor-pointer ${
                    activeHeroTab === 'overview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveHeroTab('orders')}
                  className={`px-3 py-1 rounded-md transition cursor-pointer ${
                    activeHeroTab === 'orders' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Live Orders
                </button>
                <button
                  onClick={() => setActiveHeroTab('ai')}
                  className={`px-3 py-1 rounded-md transition cursor-pointer ${
                    activeHeroTab === 'ai' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI Insights
                </button>
              </div>
            </div>

            {/* Dashboard Content Inside Hero Visual */}
            <div className="p-6 bg-slate-50 space-y-6">
              {activeHeroTab === 'overview' && (
                <>
                  {/* Top Stats Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Good morning, Alexander</h2>
                      <p className="text-xs text-slate-500">Here is your live store performance for today.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● Store Live & Syncing
                      </span>
                    </div>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">$128,645.60</div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+12.5% vs last month</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Net Orders</div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">1,482</div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+8.2% vs last month</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Conversion Rate</div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">3.42%</div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+0.6% vs benchmark</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg Order Value</div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">$86.80</div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+$4.10 from recommendations</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimal Sales Chart & AI Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm font-bold text-slate-900">Revenue & Volume (Last 30 Days)</div>
                          <div className="text-xs text-slate-500">Daily breakdown with auto-forecast overlay</div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">Daily</span>
                      </div>

                      {/* Clean CSS SVG Area Chart */}
                      <div className="h-40 w-full flex items-end gap-2 pt-4">
                        {[40, 55, 48, 65, 72, 60, 85, 95, 78, 88, 110, 92, 115, 128, 140].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div
                              style={{ height: `${(val / 140) * 100}%` }}
                              className="w-full rounded-t-sm bg-indigo-600/85 group-hover:bg-indigo-600 transition-all cursor-pointer"
                            />
                            <span className="text-[9px] text-slate-400 hidden group-hover:block absolute -top-6 bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono">
                              ${val * 100}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 mt-2">
                        <span>Day 1</span>
                        <span>Day 10</span>
                        <span>Day 20</span>
                        <span>Day 30</span>
                      </div>
                    </div>

                    {/* AI Opportunities side panel */}
                    <div className="p-5 rounded-xl bg-indigo-900 text-white shadow-2xs flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold">
                          <Sparkles className="w-4 h-4 text-indigo-300" />
                          <span>AI Intelligence Feed</span>
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-950/60 border border-indigo-700/50 space-y-1">
                          <div className="text-xs font-bold text-white">3 High-Yield Opportunities</div>
                          <div className="text-[11px] text-indigo-200 leading-relaxed">
                            Restocking Backpacks and bundling Watch + Sunglasses can yield an estimated{' '}
                            <span className="text-emerald-400 font-bold">+$2,480</span> this week.
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleStartMerchantOS}
                        className="mt-4 w-full py-2 rounded-lg bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Open Merchant OS</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeHeroTab === 'orders' && (
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Recent Transactions</span>
                    <span className="text-xs text-slate-500 font-medium">Auto-updated via Stripe & Card Network</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                          <th className="py-2">Order</th>
                          <th className="py-2">Customer</th>
                          <th className="py-2">Payment</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="py-3 font-mono font-bold text-indigo-600">#1029</td>
                          <td className="py-3 text-slate-900">Elena Rostova</td>
                          <td className="py-3 text-slate-500">Credit Card (Visa)</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-slate-900">$129.00</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono font-bold text-indigo-600">#1028</td>
                          <td className="py-3 text-slate-900">Marcus Chen</td>
                          <td className="py-3 text-slate-500">Credit Card (Mastercard)</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-slate-900">$189.00</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono font-bold text-indigo-600">#1027</td>
                          <td className="py-3 text-slate-900">Sarah Jenkins</td>
                          <td className="py-3 text-slate-500">Credit Card (Amex)</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              Processing
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-slate-900">$89.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeHeroTab === 'ai' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>Inventory Reorder Alert</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Product <strong className="text-slate-900">Leather Travel Backpack</strong> will run out in 6 days
                      based on current velocity.
                    </div>
                    <button
                      onClick={handleStartMerchantOS}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Draft supplier PO →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Abandoned Cart Recovery</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      14 buyers left checkout in the last 24h. Automated email sequence can recover estimated $1,240.
                    </div>
                    <button
                      onClick={handleStartMerchantOS}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Send recovery sequence →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Margin Optimization</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Demand elasticity indicates you can increase <strong className="text-slate-900">Classic Aviator</strong>{' '}
                      price to $94 without conversion loss.
                    </div>
                    <button
                      onClick={handleStartMerchantOS}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Review price test →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. HONEST PLATFORM ARCHITECTURE METRICS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">99.99%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Edge Availability & SLA</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">&lt; 45ms</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Global API Latency</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">256-bit</div>
            <div className="text-xs text-slate-500 font-medium mt-1">End-to-End SSL Encryption</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-indigo-600 font-mono">0% Fee</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Platform Surcharge on Direct Sales</div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. STRUCTURED CAPABILITIES & FEATURE GRID */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Complete Platform Suite</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything your commerce business needs.
          </h2>
          <p className="text-sm text-slate-600">
            A unified operating system replacing fragmented plugins, complex sync connectors, and disjointed tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Products & Multi-Variant Catalog */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Products & Variant Matrix</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create and manage thousands of SKUs, nested variant combinations (Size, Color, Material), cost accounting,
              barcode labels, and high-resolution media galleries.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Multi-attribute variant generator</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Margin & profit calculation engine</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Orders & Settlement */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Orders & Fulfillment Flow</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track customer orders from checkout to doorstep. Issue refunds, split shipments, assign carrier tracking
              numbers, and generate PDF invoices with one click.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Automated order status lifecycle</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>One-click refunds & cancellations</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Customers & CRM */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Customers & LTV Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintain deep profiles for every buyer. Track lifetime value, repeat order rates, preferred categories, and
              tag high-value VIP accounts automatically.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Customer segmentation (VIP, New, Inactive)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Purchase history and activity timeline</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Inventory & Low Stock Automation */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Operational Inventory</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time stock reservation during active checkouts. Custom low-stock threshold triggers, multi-warehouse
              tracking, and bulk stock adjustments.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Threshold-based low stock warnings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant bulk stock updates</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Card & Stripe Payments */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Card & Global Payments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seamless 256-bit SSL encrypted card checkout. Server-side price calculation prevents tampering, with full
              webhook verification for order confirmation.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Stripe PaymentIntents & 3D Secure</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Server-authoritative discount calculations</span>
              </li>
            </ul>
          </div>

          {/* Card 6: Real-Time Analytics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Real-Time Financial Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive visibility into sales volume, conversion rates, channel acquisition, average order values,
              and profitability trends across customizable date ranges.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Multi-period comparison (Today, 7D, 30D, 12M)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Product-by-product profitability metrics</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. AI COMMERCE DEEP DIVE SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="ai-commerce" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Native Intelligence Layer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your store, powered by intelligence.</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              SOLPUMP doesn't just display historical charts. It continuously analyzes sales trends, customer behavior,
              inventory velocity, abandoned carts, and margin opportunities to give you clear, actionable guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="text-emerald-400 text-xs font-bold font-mono">INSIGHT 01 • REVENUE GROWTH</div>
              <div className="text-base font-bold text-white">«Revenue is up 18% this week.»</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Growth driven predominantly by organic search traffic landing on Bags & Leather. Recommending a 10%
                accessory upsell at checkout to increase basket size.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="text-amber-400 text-xs font-bold font-mono">INSIGHT 02 • INVENTORY RESTOCK</div>
              <div className="text-base font-bold text-white">«Leather Travel Backpack approaching low inventory.»</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                At current sales rate of 12 units/day, stock will deplete in 4 days. Direct PO generation prepared for
                supplier.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="text-indigo-400 text-xs font-bold font-mono">INSIGHT 03 • BASKET AFFINITY</div>
              <div className="text-base font-bold text-white">«Buyers of Watch frequently purchase Sunglasses.»</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                42% co-purchase correlation identified. Automated bundle created saving buyers $15 while boosting gross
                margin.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Ask SOLPUMP anything about your business</h3>
              <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
                Query in plain English: "Why did sales drop yesterday?", "Who are my top 10% most loyal customers?",
                "Which SKU has the highest profit margin?"
              </p>
            </div>
            <button
              onClick={handleStartMerchantOS}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0 flex items-center gap-2"
            >
              <span>Test AI Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. TRANSPARENT PRICING GRID */}
      {/* ------------------------------------------------------------- */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Predictable Pricing</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple plans for businesses of every scale.
          </h2>
          <p className="text-sm text-slate-600">
            No hidden gateway fees, no punitive transaction penalties. Upgrade or downgrade anytime.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/70 text-xs font-bold mt-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Plan */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Free</div>
                <div className="text-xs text-slate-500 mt-0.5">For launching your first store</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Up to 25 Products</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Subdomain (you.sol-pump.store)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Standard Checkout Flow</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              Start Free
            </button>
          </div>

          {/* Growth Plan (Popular) */}
          <div className="p-6 rounded-2xl bg-white border-2 border-indigo-600 shadow-lg shadow-indigo-600/5 space-y-5 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Growth</div>
                <div className="text-xs text-slate-500 mt-0.5">For active, scaling stores</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${billingCycle === 'monthly' ? '29' : '24'}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Unlimited Products</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AI Product & SEO Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Abandoned Cart Automations</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              Start 14-Day Trial
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Pro</div>
                <div className="text-xs text-slate-500 mt-0.5">For high-volume merchants</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${billingCycle === 'monthly' ? '79' : '65'}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Everything in Growth</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AI Business Copilot & Queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Advanced Customer LTV Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>5 Staff Account Seats</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Enterprise</div>
                <div className="text-xs text-slate-500 mt-0.5">Dedicated infrastructure</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${billingCycle === 'monthly' ? '299' : '249'}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom Multi-Store Routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dedicated Account Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>99.99% Uptime Guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom ERP / Warehouse Connectors</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. ENTERPRISE FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" light={false} showTagline={true} />
            <span>© 2026 SOLPUMP Commerce OS. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-slate-900 transition">
              Products
            </a>
            <a href="#solutions" className="hover:text-slate-900 transition">
              Solutions
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition">
              Pricing
            </a>
            <a href="#ai-commerce" className="hover:text-slate-900 transition">
              AI Commerce
            </a>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-slate-600">Production Domain: sol-pump.store</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Card Checkout Modal for demo purchases */}
      {previewProduct && checkoutOpen && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={previewProduct}
          quantity={1}
        />
      )}
    </div>
  );
};
