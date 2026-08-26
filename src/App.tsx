import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveToolsGrid } from './components/InteractiveToolsGrid';
import { FeatureGrid } from './components/FeatureGrid';
import { ToolCatalog } from './components/ToolCatalog';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ToolDetailModal } from './components/ToolDetailModal';
import { ToolItem } from './data/toolsData';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

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
          onOpenStore={() => scrollToSection('tools')}
        />

        {/* Interactive AI & Web3 Tools Grid */}
        <InteractiveToolsGrid
          onOpenStore={() => scrollToSection('tools')}
          onOpenLogin={() => setIsLoginOpen(true)}
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
    </div>
  );
}
