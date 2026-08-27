import React from 'react';
import { Hero } from './Hero';
import { TokenStatsTicker } from './TokenStatsTicker';
import { FeatureGrid } from './FeatureGrid';
import { DigitalVaultSection } from './DigitalVaultSection';
import { DeveloperScriptsVault } from './DeveloperScriptsVault';
import { InteractiveToolsGrid } from './InteractiveToolsGrid';
import { SolanaFeeEstimator } from './SolanaFeeEstimator';
import { PricingSection } from './PricingSection';
import { ToolCatalog } from './ToolCatalog';
import { BackersHubSection } from './BackersHubSection';
import { InvestorsHubSection } from './InvestorsHubSection';
import { DeveloperDocsSection } from './DeveloperDocsSection';
import { TrustSecurityHubSection } from './TrustSecurityHubSection';
import { AboutSection } from './AboutSection';
import { ToolItem } from '../data/toolsData';
import { LegalDocType } from './LegalModal';
import {
  ArrowRight,
  Terminal,
  Wrench,
  Sparkles,
  Zap,
  FolderArchive,
  BookOpen,
  ShieldCheck,
  Coins,
  Building,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (sectionId: string) => void;
  onOpenLogin: () => void;
  onSelectTool: (tool: ToolItem) => void;
  selectedCategoryFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenLegalDoc: (type: LegalDocType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenLogin,
  onSelectTool,
  selectedCategoryFilter,
  onFilterChange,
  onOpenLegalDoc,
}) => {
  const handleSelectCategoryFromGrid = (categoryType: 'ai' | 'dev' | 'web3') => {
    onFilterChange(categoryType);
    onNavigate('utility-tools');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080b12] animate-in fade-in duration-300">
      {/* 1. Hero Section */}
      <Hero
        onExploreTools={() => onNavigate('vault')}
        onOpenStore={() => onNavigate('store')}
      />

      {/* 2. Live Token & Market Stats Ticker ($sopump • TON Network) */}
      <TokenStatsTicker />

      {/* 3. Quick Hub Launchpad / Multi-View Navigation Cards */}
      <section className="py-12 bg-[#060913] border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dedicated Ecosystem Hubs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Explore Standalone Workspaces
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Select any hub to enter its focused standalone view
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Scripts Vault */}
            <div
              onClick={() => onNavigate('developer-scripts')}
              className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-emerald-500/50 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                  Developer Scripts
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Executable Python, Node.js &amp; Rust scripts for Solana airdrops, Jito MEV sniping, and Telegram automation.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                Open Scripts Page <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Card 2: Interactive Micro-Tools */}
            <div
              onClick={() => onNavigate('utility-tools')}
              className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  Micro-Tools &amp; Catalog
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Interactive AI prompt optimizers, API payload formatters, secret obfuscators, and SPL metadata inspectors.
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400 flex items-center gap-1 font-semibold">
                Open Tools Page <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Card 3: Gas & Priority Fee Estimator */}
            <div
              onClick={() => onNavigate('gas-calculator')}
              className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                  Solana Fee Estimator
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Live compute unit pricing, priority fee multipliers, and lamport-to-USD conversion calculator.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 font-semibold">
                Open Estimator <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Card 4: 100% Free VIP Vault */}
            <div
              onClick={() => onNavigate('vault')}
              className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-purple-500/50 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                  Digital Asset Vault
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  1-click ZIP downloads of n8n AI agent workflows, prompt master databases, and production boilerplates.
                </p>
              </div>
              <span className="text-xs font-mono text-purple-400 flex items-center gap-1 font-semibold">
                Open Digital Vault <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dedicated Digital Products & Asset Vault Downloads (Free Community Access) */}
      <DigitalVaultSection />

      {/* 5. Ready-to-Deploy Developer Scripts Vault (Python, Node.js, Rust - Free Open Source) */}
      <DeveloperScriptsVault />

      {/* 6. Interactive AI & Web3 Micro Tools Grid */}
      <InteractiveToolsGrid
        onOpenStore={() => onNavigate('vault')}
        onOpenLogin={onOpenLogin}
      />

      {/* 7. Free Lead-Magnet Utility: Solana Gas & Fee Estimator */}
      <SolanaFeeEstimator
        onOpenStore={() => onNavigate('vault')}
        onOpenVault={() => onNavigate('vault')}
      />

      {/* 8. Free Community Resource Hub & 3 Pillars Section */}
      <PricingSection onExploreFree={() => onNavigate('developer-scripts')} />

      {/* 9. 3 Main Pillars / Features Grid */}
      <FeatureGrid onSelectCategory={handleSelectCategoryFromGrid} />

      {/* 10. Tools & Digital Store Directory */}
      <ToolCatalog
        onSelectTool={onSelectTool}
        selectedCategoryFilter={selectedCategoryFilter}
        onFilterChange={onFilterChange}
      />

      {/* 11. Direct Backers & Support Hub (TON, Solana, $sopump CA) */}
      <BackersHubSection />

      {/* 12. Official Investors & Intellectual Property (IP) Overview */}
      <InvestorsHubSection />

      {/* 13. Developer Documentation & API Hub */}
      <DeveloperDocsSection />

      {/* 14. Decentralized Trust, Security & Legal Hub */}
      <TrustSecurityHubSection onOpenLegalDoc={onOpenLegalDoc} />

      {/* 15. About, Stats & FAQ Section */}
      <AboutSection />
    </div>
  );
};
