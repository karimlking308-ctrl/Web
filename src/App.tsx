import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveToolsGrid } from './components/InteractiveToolsGrid';
import { SolanaFeeEstimator } from './components/SolanaFeeEstimator';
import { PricingSection } from './components/PricingSection';
import { DeveloperScriptsVault } from './components/DeveloperScriptsVault';
import { DigitalVaultSection } from './components/DigitalVaultSection';
import { FeatureGrid } from './components/FeatureGrid';
import { ToolCatalog } from './components/ToolCatalog';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ToolDetailModal } from './components/ToolDetailModal';
import { CheckoutModal, PlanItem } from './components/CheckoutModal';
import { AffiliateModal } from './components/AffiliateModal';
import { ToolItem } from './data/toolsData';
import { captureReferralFromUrl } from './utils/affiliateStorage';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [verifiedLicenseKey, setVerifiedLicenseKey] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('solpump_vault_license');
    if (saved) {
      setVerifiedLicenseKey(saved);
    }
    // Capture any incoming referral query parameter ?ref=...
    captureReferralFromUrl();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromGrid = (categoryType: 'ai' | 'dev' | 'web3') => {
    setSelectedCategoryFilter(categoryType);
    scrollToSection('tools');
  };

  const handleSelectPlan = (plan: PlanItem) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleSuccessUnlock = (newLicenseKey: string) => {
    setVerifiedLicenseKey(newLicenseKey);
    localStorage.setItem('solpump_vault_license', newLicenseKey);
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navigation */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAffiliate={() => setIsAffiliateModalOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero
          onExploreTools={() => scrollToSection('utility-tools')}
          onOpenStore={() => scrollToSection('store')}
        />

        {/* Interactive AI & Web3 Tools Grid */}
        <InteractiveToolsGrid
          onOpenStore={() => scrollToSection('store')}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* Free Lead-Magnet Utility: Solana Gas & Fee Estimator */}
        <SolanaFeeEstimator
          onOpenStore={() => scrollToSection('store')}
          onOpenVault={() => scrollToSection('vault')}
        />

        {/* Digital Store & Pricing Section */}
        <PricingSection
          onSelectPlan={handleSelectPlan}
          onExploreFree={() => scrollToSection('utility-tools')}
        />

        {/* Ready-to-Deploy Developer Scripts Vault (Python, Node.js, Rust) */}
        <DeveloperScriptsVault
          activeLicenseKey={verifiedLicenseKey}
          onSelectPlan={(planId) => {
            if (planId === 'lifetime') {
              handleSelectPlan({
                id: 'lifetime-elite',
                name: 'Lifetime Elite Bundle',
                price: '$49',
                period: 'One-time payment',
                description: 'Complete master vault ownership: all developer scripts, bot engines, n8n workflows, and lifetime updates.',
              });
            } else {
              handleSelectPlan({
                id: 'pro-creator',
                name: 'Pro Creator',
                price: '$9',
                period: 'per month',
                description: 'Full access to all developer scripts, bots, workflows, and codebases.',
              });
            }
          }}
        />

        {/* Dedicated Digital Products & Asset Vault Downloads */}
        <DigitalVaultSection
          verifiedLicenseKey={verifiedLicenseKey}
          onOpenCheckout={handleSelectPlan}
        />

        {/* 3 Main Pillars / Features Grid */}
        <FeatureGrid onSelectCategory={handleSelectCategoryFromGrid} />

        {/* Tools & Digital Store Directory */}
        <ToolCatalog
          onSelectTool={(tool) => setSelectedTool(tool)}
          selectedCategoryFilter={selectedCategoryFilter}
          onFilterChange={(filter) => setSelectedCategoryFilter(filter)}
        />

        {/* About, Stats & FAQ Section */}
        <AboutSection />
      </main>

      {/* Global Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Interactive Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AffiliateModal
        isOpen={isAffiliateModalOpen}
        onClose={() => setIsAffiliateModalOpen(false)}
        userWalletAddress={verifiedLicenseKey ? 'WalletConnected' : null}
        onConnectWallet={() => {
          setIsAffiliateModalOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        plan={selectedPlan}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedPlan(null);
        }}
        onSuccessUnlock={handleSuccessUnlock}
      />
    </div>
  );
}
