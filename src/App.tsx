import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveToolsGrid } from './components/InteractiveToolsGrid';
import { PricingSection } from './components/PricingSection';
import { DigitalVaultSection } from './components/DigitalVaultSection';
import { FeatureGrid } from './components/FeatureGrid';
import { ToolCatalog } from './components/ToolCatalog';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ToolDetailModal } from './components/ToolDetailModal';
import { CheckoutModal, PlanItem } from './components/CheckoutModal';
import { ToolItem } from './data/toolsData';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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

        {/* Digital Store & Pricing Section */}
        <PricingSection
          onSelectPlan={handleSelectPlan}
          onExploreFree={() => scrollToSection('utility-tools')}
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
