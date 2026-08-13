import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MarketTicker } from '../markets/MarketTicker';
import { BreakingNews } from '../news/BreakingNews';
import { AdSlot } from '../advertising/AdSlot';

interface LayoutProps {
  children: React.ReactNode;
  showBreakingNews?: boolean;
  showMarketTicker?: boolean;
  showTopAdBanner?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showBreakingNews = true,
  showMarketTicker = true,
  showTopAdBanner = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      {/* Breaking News Ribbon */}
      {showBreakingNews && <BreakingNews />}

      {/* Main Sticky Header */}
      <Header />

      {/* Market Ticker Ribbon */}
      {showMarketTicker && <MarketTicker />}

      {/* Optional Top Ad Banner */}
      {showTopAdBanner && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-4">
          <AdSlot variant="banner" />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
