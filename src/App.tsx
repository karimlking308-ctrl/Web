import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SeoManager } from './components/SeoManager';
import { HomeView } from './views/HomeView';
import { FaqView } from './views/FaqView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';
import { Mp4ToMp3Tool } from './tools/Mp4ToMp3Tool';
import { MergePdfTool } from './tools/MergePdfTool';
import { JpgToPdfTool } from './tools/JpgToPdfTool';
import { PdfToJpgTool } from './tools/PdfToJpgTool';
import { CompressImageTool } from './tools/CompressImageTool';
import { getToolById } from './config/tools';
import { SEO_CONFIGS } from './config/seo';

function getInitialView(): string {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  
  if (path === '/') return 'home';
  if (path === '/tools') return 'all-tools';
  if (path === '/tools/mp4-to-mp3') return 'mp4-to-mp3';
  if (path === '/tools/merge-pdf') return 'merge-pdf';
  if (path === '/tools/jpg-to-pdf') return 'jpg-to-pdf';
  if (path === '/tools/pdf-to-jpg') return 'pdf-to-jpg';
  if (path === '/tools/compress-image') return 'compress-image';
  if (path === '/faq') return 'faq';
  if (path === '/contact') return 'contact';
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';

  return 'home';
}

export function App() {
  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    const config = SEO_CONFIGS[view] || SEO_CONFIGS.home;
    const targetUrl = config.canonicalPath;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTool = getToolById(currentView);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
      case 'all-tools':
        return <HomeView onSelectTool={(toolId) => navigateTo(toolId)} />;
      case 'mp4-to-mp3':
        return <Mp4ToMp3Tool />;
      case 'merge-pdf':
        return <MergePdfTool />;
      case 'jpg-to-pdf':
        return <JpgToPdfTool />;
      case 'pdf-to-jpg':
        return <PdfToJpgTool />;
      case 'compress-image':
        return <CompressImageTool />;
      case 'faq':
        return <FaqView onSelectTool={(toolId) => navigateTo(toolId)} />;
      case 'contact':
        return <ContactView />;
      case 'privacy':
        return <LegalView type="privacy" />;
      case 'terms':
        return <LegalView type="terms" />;
      default:
        return <HomeView onSelectTool={(toolId) => navigateTo(toolId)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
      {/* SEO Engine */}
      <SeoManager currentView={currentView} />

      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view)}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          currentToolName={activeTool ? activeTool.name : undefined}
          onBackToHome={activeTool ? () => navigateTo('home') : undefined}
          onNavigateTools={() => navigateTo('all-tools')}
        />

        <main className="flex-1 p-5 sm:p-8 md:p-10 max-w-5xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* SEO-Rich Crawlable Footer */}
        <footer className="mt-auto border-t border-neutral-200 py-8 px-6 text-xs text-neutral-500 bg-white">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="font-bold text-black text-sm">Tindry</span>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Simple file tools that just work &middot; Zero uploads &middot; Complete privacy
              </p>
            </div>

            <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-neutral-600">
              <a
                href="/tools"
                onClick={(e) => { e.preventDefault(); navigateTo('all-tools'); }}
                className="hover:text-black transition-colors"
              >
                Tools
              </a>
              <a
                href="/faq"
                onClick={(e) => { e.preventDefault(); navigateTo('faq'); }}
                className="hover:text-black transition-colors"
              >
                FAQ
              </a>
              <a
                href="/contact"
                onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}
                className="hover:text-black transition-colors"
              >
                Contact
              </a>
              <a
                href="/privacy"
                onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}
                className="hover:text-black transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}
                className="hover:text-black transition-colors"
              >
                Terms of Service
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
