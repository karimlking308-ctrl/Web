import React, { useState } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { LandingPage } from './components/commerce/LandingPage';
import { AuthModal } from './components/commerce/AuthModal';
import { OnboardingWizard } from './components/commerce/OnboardingWizard';
import { MerchantDashboard } from './components/commerce/MerchantDashboard';
import { LayoutDashboard, Globe } from 'lucide-react';

function CommerceOSApp() {
  const { isAuthenticated, login, logout } = useCommerce();
  const [viewOverride, setViewOverride] = useState<'marketing' | 'dashboard' | 'auto'>('auto');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const isShowingDashboard = viewOverride === 'dashboard' ? true : viewOverride === 'marketing' ? false : isAuthenticated;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans relative">
      {/* Quick View Mode Switcher Pill */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1 rounded-2xl bg-[#0f1422]/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-[11px] font-bold">
        <button
          onClick={() => {
            setViewOverride('marketing');
          }}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
            !isShowingDashboard
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Marketing Site</span>
        </button>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              login('admin@sol-pump.store', 'password123');
            }
            setViewOverride('dashboard');
          }}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
            isShowingDashboard
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Merchant OS</span>
        </button>
      </div>

      {isShowingDashboard ? (
        <>
          <MerchantDashboard />
          <OnboardingWizard />
        </>
      ) : (
        <LandingPage />
      )}

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CommerceProvider>
      <CommerceOSApp />
    </CommerceProvider>
  );
}
