import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Sparkles, ArrowRight, CheckCircle2, ShoppingBag, Globe, Store as StoreIcon } from 'lucide-react';
import { Logo } from '../common/Logo';

export const OnboardingWizard: React.FC = () => {
  const { onboardingStep, setOnboardingStep, completeOnboarding } = useCommerce();
  const [step, setStep] = useState<number>(onboardingStep || 1);
  const [sellingType, setSellingType] = useState('Physical products');
  const [storeName, setStoreName] = useState('Sol Pump Boutique');
  const [salesChannel, setSalesChannel] = useState('Online store & Social media');
  const [goal, setGoal] = useState('Scale my online revenue to $10k/mo');

  if (onboardingStep === null) return null;

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const progressPercent = Math.round((step / 7) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0f1422] border border-slate-800 p-8 shadow-2xl shadow-indigo-500/10 text-left">
        {/* Header with Logo & Progress */}
        <div className="flex items-center justify-between mb-6">
          <Logo size="sm" light={true} />
          <span className="text-xs font-bold text-slate-400">Step {step} of 7</span>
        </div>

        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Store setup progress: <strong className="text-indigo-400">{progressPercent}%</strong></span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Step 1 of 7
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">What are you selling?</h2>
            <p className="text-sm text-slate-400">This helps us customize your store dashboard and inventory tools.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Physical products', 'Digital downloads', 'Services & Consultations', 'Subscription boxes'].map((item) => (
                <button
                  key={item}
                  onClick={() => setSellingType(item)}
                  className={`p-4 rounded-xl border text-left font-semibold text-sm transition cursor-pointer flex items-center justify-between ${
                    sellingType === item ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{item}</span>
                  {sellingType === item && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <StoreIcon className="w-3.5 h-3.5" /> Step 2 of 7
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">What's your business name?</h2>
            <p className="text-sm text-slate-400">Your store name will appear on your storefront, invoices, and packing slips.</p>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white font-bold text-lg focus:outline-none focus:border-indigo-500 transition"
              placeholder="e.g. Sol Pump Boutique"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Globe className="w-3.5 h-3.5" /> Step 3 of 7
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Where do you sell?</h2>
            <p className="text-sm text-slate-400">Select your primary sales channels to configure automated sync.</p>
            <div className="space-y-3">
              {[
                'Online store & Social media',
                'An existing website or blog',
                'Marketplaces (Amazon, eBay, Etsy)',
                'In-person (POS or Pop-ups)'
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setSalesChannel(item)}
                  className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition cursor-pointer flex items-center justify-between ${
                    salesChannel === item ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{item}</span>
                  {salesChannel === item && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Step 4 of 7
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">What's your main business goal?</h2>
            <p className="text-sm text-slate-400">SOLPUMP AI will tailor insights to help you reach this target.</p>
            <div className="space-y-3">
              {[
                'Scale my online revenue to $10k/mo',
                'Launch a brand new product line',
                'Automate inventory & fulfillment',
                'Expand to international markets'
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setGoal(item)}
                  className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition cursor-pointer flex items-center justify-between ${
                    goal === item ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{item}</span>
                  {goal === item && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <ShoppingBag className="w-3.5 h-3.5" /> Step 5 of 7
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Add your first product</h2>
            <p className="text-sm text-slate-400">You can add more products anytime from your dashboard.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Product Title</label>
                <input type="text" defaultValue="Signature Leather Wallet" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Price ($)</label>
                  <input type="number" defaultValue={59.00} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Initial Stock</label>
                  <input type="number" defaultValue={50} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Step 6 of 7
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Choose your store theme style</h2>
            <p className="text-sm text-slate-400">Select an initial visual direction crafted by our design system.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border-2 border-indigo-500 cursor-pointer">
                <div className="h-20 bg-gradient-to-br from-indigo-950 to-slate-900 rounded-lg mb-3 flex items-center justify-center font-bold text-indigo-300">Apex Modern</div>
                <div className="font-bold text-white text-sm">Minimal Luxury</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer opacity-80 hover:opacity-100 transition">
                <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-3 flex items-center justify-center font-bold text-slate-900">Vanguard Light</div>
                <div className="font-bold text-white text-sm">Clean Editorial</div>
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Your store is ready to launch!</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">SOLPUMP Commerce OS has configured your multi-tenant catalog, secure checkout, and AI copilot.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition cursor-pointer"
            >
              Back
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2"
          >
            {step === 7 ? 'Launch Merchant Dashboard' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
