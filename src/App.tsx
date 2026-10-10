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
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  
  if (path === '/') return 'home';
  if (path === '/tools') return 'all-tools';
  if (path === '/tools/mp4-to-mp3' || path === '/mp4-to-mp3') return 'mp4-to-mp3';
  if (path === '/tools/merge-pdf' || path === '/merge-pdf') return 'merge-pdf';
  if (path === '/tools/jpg-to-pdf' || path === '/jpg-to-pdf') return 'jpg-to-pdf';
  if (path === '/tools/pdf-to-jpg' || path === '/pdf-to-jpg') return 'pdf-to-jpg';
  if (path === '/tools/compress-image' || path === '/compress-image') return 'compress-image';
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

  // Ensure canonical URL is reflected in the address bar if loaded via alias
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const config = SEO_CONFIGS[currentView];
    if (config && config.canonicalPath) {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
      const canonicalPath = config.canonicalPath.toLowerCase().replace(/\/+$/, '') || '/';
      if (currentPath !== canonicalPath) {
        window.history.replaceState({}, '', config.canonicalPath + window.location.search);
      }
    }
  }, [currentView]);

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

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
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

              <div className="hidden sm:block h-3.5 w-px bg-neutral-200" />

              {/* Official Social & Community Links */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Official X / Twitter Profile Link */}
                <a
                  href="https://x.com/TindryOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Tindry on X"
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md border border-neutral-200 hover:border-black text-black hover:bg-neutral-50 transition-colors text-xs font-medium"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Follow @TindryOfficial</span>
                </a>

                {/* Official Telegram Community Link */}
                <a
                  href="https://t.me/TindryCommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Tindry Community on Telegram"
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md border border-neutral-200 hover:border-black text-black hover:bg-neutral-50 transition-colors text-xs font-medium"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z" />
                  </svg>
                  <span>Join Tindry Community</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
