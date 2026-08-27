import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PageViewWrapper } from './components/PageViewWrapper';
import { InteractiveToolsGrid } from './components/InteractiveToolsGrid';
import { ToolCatalog } from './components/ToolCatalog';
import { SolanaFeeEstimator } from './components/SolanaFeeEstimator';
import { DeveloperScriptsVault } from './components/DeveloperScriptsVault';
import { DigitalVaultSection } from './components/DigitalVaultSection';
import { PricingSection } from './components/PricingSection';
import { BackersHubSection } from './components/BackersHubSection';
import { InvestorsHubSection } from './components/InvestorsHubSection';
import { DeveloperDocsSection } from './components/DeveloperDocsSection';
import { TrustSecurityHubSection } from './components/TrustSecurityHubSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ToolDetailModal } from './components/ToolDetailModal';
import { AffiliateModal } from './components/AffiliateModal';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { ToolItem } from './data/toolsData';
import { captureReferralFromUrl } from './utils/affiliateStorage';
import {
  Wrench,
  Zap,
  Terminal,
  FolderArchive,
  CreditCard,
  Coins,
  Building2,
  BookOpen,
  ShieldCheck,
  Info,
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>('privacy');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Normalize aliases to valid section IDs
  const normalizeSectionId = (id: string): string => {
    const cleanId = id.replace(/^#\/?/, '').trim().toLowerCase();
    switch (cleanId) {
      case 'tools':
      case 'utility-tools':
        return 'utility-tools';
      case 'gas':
      case 'gas-calculator':
      case 'fee':
      case 'fee-estimator':
        return 'gas-calculator';
      case 'scripts':
      case 'developer-scripts':
      case 'code':
        return 'developer-scripts';
      case 'store':
      case 'pricing':
      case 'pro':
        return 'store';
      case 'vault':
      case 'digital-vault':
      case 'downloads':
        return 'vault';
      case 'backers':
      case 'backers-hub':
      case 'token':
      case 'sopump':
        return 'backers-hub';
      case 'investors':
      case 'investors-hub':
      case 'ip':
        return 'investors-hub';
      case 'docs':
      case 'dev-docs':
      case 'api':
        return 'dev-docs';
      case 'trust':
      case 'legal':
      case 'trust-legal-hub':
      case 'security':
        return 'trust-legal-hub';
      case 'about':
      case 'faq':
        return 'about';
      case '':
      case 'home':
      default:
        return 'home';
    }
  };

  useEffect(() => {
    // 1. Capture incoming referral query parameter ?ref=...
    captureReferralFromUrl();

    // 2. Parse initial URL hash for direct deep-linking
    const hash = window.location.hash;
    if (hash) {
      const target = normalizeSectionId(hash);
      setActiveSection(target);
    }

    // 3. Listen to browser back/forward and hash changes
    const handleHashChange = () => {
      const target = normalizeSectionId(window.location.hash);
      setActiveSection(target);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToSection = (sectionId: string) => {
    if (sectionId === 'community') {
      window.open('https://t.me/solpump_store', '_blank');
      return;
    }

    const normalized = normalizeSectionId(sectionId);
    setActiveSection(normalized);

    // Update URL hash without breaking history
    if (normalized === 'home') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = `#${normalized}`;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sticky Persistent Top Navigation Bar */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAffiliate={() => setIsAffiliateModalOpen(true)}
        activeSection={activeSection}
        onNavigate={navigateToSection}
      />

      {/* Main Multi-Page Dynamic View Switcher */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: Home Executive Landing Page */}
        {activeSection === 'home' && (
          <HomeView
            onNavigate={navigateToSection}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {/* VIEW 2: Interactive Micro-Tools & Full Catalog Page */}
        {activeSection === 'utility-tools' && (
          <PageViewWrapper
            pageId="utility-tools"
            badge="Interactive Micro-Tools"
            badgeIcon={<Wrench className="w-3.5 h-3.5" />}
            badgeColor="indigo"
            title="AI & Web3 Interactive"
            titleGradient="Developer Utilities"
            description="High-speed client-side developer utilities designed to format payloads, optimize AI agent system prompts, obfuscate private secrets, and inspect SPL token metadata in real-time."
            onNavigate={navigateToSection}
          >
            <div className="space-y-12 py-8">
              <InteractiveToolsGrid
                onOpenStore={() => navigateToSection('vault')}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
              <ToolCatalog
                onSelectTool={(tool) => setSelectedTool(tool)}
                selectedCategoryFilter={selectedCategoryFilter}
                onFilterChange={(filter) => setSelectedCategoryFilter(filter)}
              />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 3: Solana Gas & Priority Fee Estimator Suite */}
        {activeSection === 'gas-calculator' && (
          <PageViewWrapper
            pageId="gas-calculator"
            badge="Real-time Web3 Utility"
            badgeIcon={<Zap className="w-3.5 h-3.5" />}
            badgeColor="cyan"
            title="Solana Priority Fee &"
            titleGradient="Gas Cost Estimator"
            description="Live compute unit pricing, priority fee multipliers, and lamport-to-USD conversion calculator. Optimize transaction landing rates on Solana Mainnet with sub-second estimates."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <SolanaFeeEstimator
                onOpenStore={() => navigateToSection('store')}
                onOpenVault={() => navigateToSection('vault')}
              />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 4: Developer Scripts Vault (Python, Node.js, Rust) */}
        {activeSection === 'developer-scripts' && (
          <PageViewWrapper
            pageId="developer-scripts"
            badge="Open Source Vault"
            badgeIcon={<Terminal className="w-3.5 h-3.5" />}
            badgeColor="emerald"
            title="Ready-to-Deploy"
            titleGradient="Developer Scripts"
            description="Battle-tested, executable Python, Node.js, and Rust scripts for Solana bulk airdrops, Jito MEV frontrunning protection, Telegram broadcast automation, and AI content batching."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <DeveloperScriptsVault />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 5: Pro & Enterprise Lifetime Licensing Store */}
        {activeSection === 'store' && (
          <PageViewWrapper
            pageId="store"
            badge="Lifetime Licensing"
            badgeIcon={<CreditCard className="w-3.5 h-3.5" />}
            badgeColor="cyan"
            title="Developer Pro &"
            titleGradient="Enterprise IP Store"
            description="Transparent, lifetime licensing tiers with direct Web3 settlement in TON, Solana (SOL), or $sopump token. Instant automated TxID verification and cryptographic key dispenser."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <PricingSection onExploreFree={() => navigateToSection('developer-scripts')} />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 6: VIP Digital Asset Vault (100% Free 1-Click ZIPs) */}
        {activeSection === 'vault' && (
          <PageViewWrapper
            pageId="vault"
            badge="VIP Digital Vault"
            badgeIcon={<FolderArchive className="w-3.5 h-3.5" />}
            badgeColor="purple"
            title="Open Access VIP"
            titleGradient="Digital Asset Vault"
            description="1-Click client-side ZIP bundle generators for n8n AI agent workflows, WhatsApp lead bots, Telegram mini-apps, and 1,500+ master prompts — 100% free with verified SHA-256 integrity."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <DigitalVaultSection />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 7: Backers & $sopump Token Utility Hub */}
        {activeSection === 'backers-hub' && (
          <PageViewWrapper
            pageId="backers-hub"
            badge="Token Ecosystem"
            badgeIcon={<Coins className="w-3.5 h-3.5" />}
            badgeColor="cyan"
            title="Backers & $sopump"
            titleGradient="Token Utility Hub"
            description="Direct community grant verification, verified TON Jetton contract (TEP-74), DeDust DEX liquidity pool reserves, staking rewards, and backer governance privileges."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <BackersHubSection />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 8: Investors & Intellectual Property (IP) Hub */}
        {activeSection === 'investors-hub' && (
          <PageViewWrapper
            pageId="investors-hub"
            badge="Institutional Assets"
            badgeIcon={<Building2 className="w-3.5 h-3.5" />}
            badgeColor="purple"
            title="Investors & Proprietary"
            titleGradient="IP Acquisition Hub"
            description="Institutional IP licensing, proprietary codebase valuation, modular infrastructure portfolio, and direct strategic partnership contact desk."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <InvestorsHubSection />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 9: Developer Documentation & REST API Playground */}
        {activeSection === 'dev-docs' && (
          <PageViewWrapper
            pageId="dev-docs"
            badge="Documentation & APIs"
            badgeIcon={<BookOpen className="w-3.5 h-3.5" />}
            badgeColor="cyan"
            title="Developer Documentation &"
            titleGradient="REST API Hub"
            description="Explore live interactive REST endpoints (GET /api/v1/tools, GET /api/v1/token/sopump, GET /api/v1/rates/solana, POST /api/v1/license/verify), quickstart guides, and client SDKs."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <DeveloperDocsSection />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 10: Trust, Security & Legal Hub */}
        {activeSection === 'trust-legal-hub' && (
          <PageViewWrapper
            pageId="trust-legal-hub"
            badge="Audit & Security"
            badgeIcon={<ShieldCheck className="w-3.5 h-3.5" />}
            badgeColor="emerald"
            title="Decentralized Trust,"
            titleGradient="Security & Legal Hub"
            description="TEP-74 smart contract audit report, non-custodial cryptographic privacy guarantees, open-source MIT terms, and comprehensive decentralized legal disclosures."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <TrustSecurityHubSection
                onOpenLegalDoc={(type) => {
                  setLegalDocType(type);
                  setIsLegalOpen(true);
                }}
              />
            </div>
          </PageViewWrapper>
        )}

        {/* VIEW 11: About & FAQ Hub */}
        {activeSection === 'about' && (
          <PageViewWrapper
            pageId="about"
            badge="About Platform"
            badgeIcon={<Info className="w-3.5 h-3.5" />}
            badgeColor="indigo"
            title="About sol-pump.store &"
            titleGradient="Developer FAQ"
            description="Learn more about the SolPump open engineering collective, platform statistics, mission roadmap, and frequently asked questions."
            onNavigate={navigateToSection}
          >
            <div className="py-8">
              <AboutSection />
            </div>
          </PageViewWrapper>
        )}
      </main>

      {/* Persistent Global Footer */}
      <Footer
        onNavigate={navigateToSection}
        onOpenLegal={(docType) => {
          setLegalDocType(docType);
          setIsLegalOpen(true);
        }}
      />

      {/* Interactive Global Modals */}
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
}
