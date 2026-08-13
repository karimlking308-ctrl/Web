import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { SearchPage } from './pages/SearchPage';
import { LegalPage } from './pages/LegalPage';
import { Category } from './types';

function AppContent() {
  const { currentPath } = useRouter();

  // Route Dispatcher
  const renderRoute = () => {
    // Article Route: /article/:slug
    if (currentPath.startsWith('/article/')) {
      const slug = currentPath.replace('/article/', '').split('?')[0] || 'overview';
      return <ArticlePage slug={slug} />;
    }

    // Search Route: /search
    if (currentPath.startsWith('/search')) {
      return <SearchPage />;
    }

    // Category Routes
    const categories: Category[] = [
      'markets',
      'crypto',
      'stocks',
      'economy',
      'technology',
      'analysis',
      'trending',
    ];

    for (const cat of categories) {
      if (currentPath === `/${cat}` || currentPath.startsWith(`/${cat}/`)) {
        return <CategoryPage category={cat} />;
      }
    }

    // Legal / Company Routes
    if (currentPath === '/about') return <LegalPage pageType="about" />;
    if (currentPath === '/contact') return <LegalPage pageType="contact" />;
    if (currentPath === '/privacy') return <LegalPage pageType="privacy" />;
    if (currentPath === '/terms') return <LegalPage pageType="terms" />;
    if (currentPath === '/cookies') return <LegalPage pageType="cookies" />;
    if (currentPath === '/copyright') return <LegalPage pageType="copyright" />;
    if (currentPath === '/disclaimer') return <LegalPage pageType="disclaimer" />;
    if (currentPath === '/editorial-policy') return <LegalPage pageType="editorial-policy" />;

    // Default Home Page Route (/)
    return <HomePage />;
  };

  return (
    <Layout
      showBreakingNews={true}
      showMarketTicker={true}
    >
      {renderRoute()}
    </Layout>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

