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
import { AffiliateModal } from './components/AffiliateModal';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { ToolItem } from './data/toolsData';
import { captureReferralFromUrl } from './utils/affiliateStorage';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>('privacy');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  useEffect(() => {
    // Capture any incoming referral query parameter ?ref=...
    captureReferralFromUrl();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'community') {
      window.open('https://t.me/solpump_store', '_blank');
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
          onExploreTools={() => scrollToSection('vault')}
          onOpenStore={() => scrollToSection('store')}
        />

        {/* Dedicated Digital Products & Asset Vault Downloads (Free Community Access) */}
        <DigitalVaultSection />

        {/* Ready-to-Deploy Developer Scripts Vault (Python, Node.js, Rust - Free Open Source) */}
        <DeveloperScriptsVault />

        {/* Interactive AI & Web3 Micro Tools Grid */}
        <InteractiveToolsGrid
          onOpenStore={() => scrollToSection('vault')}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* Free Lead-Magnet Utility: Solana Gas & Fee Estimator */}
        <SolanaFeeEstimator
          onOpenStore={() => scrollToSection('vault')}
          onOpenVault={() => scrollToSection('vault')}
        />

        {/* Free Community Resource Hub & 3 Pillars Section */}
        <PricingSection
          onExploreFree={() => scrollToSection('developer-scripts')}
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
      <Footer
        onNavigate={scrollToSection}
        onOpenLegal={(docType) => {
          setLegalDocType(docType);
          setIsLegalOpen(true);
        }}
      />

      {/* Interactive Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AffiliateModal
        isOpen={isAffiliateModalOpen}
        onClose={() => setIsAffiliateModalOpen(false)}
        userWalletAddress={'FreeCommunityMember'}
        onConnectWallet={() => {
          setIsAffiliateModalOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialDoc={legalDocType}
      />
      <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </div>
  );
};
