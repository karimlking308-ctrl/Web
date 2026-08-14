import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SearchPage } from './pages/SearchPage';
import { LegalPage } from './pages/LegalPage';

function AppContent() {
  const { currentPath } = useApp();

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Tool Route: /tool/:slug
    if (currentPath.startsWith('/tool/')) {
      const slug = currentPath.replace('/tool/', '').split('?')[0] || '';
      return <ToolDetailPage toolSlug={slug} />;
    }

    // 2. Category Route: /category/:categoryId
    if (currentPath.startsWith('/category/')) {
      const catId = currentPath.replace('/category/', '').split('?')[0] || '';
      return <CategoryPage categoryId={catId} />;
    }

    // 3. Favorites Route: /favorites
    if (currentPath === '/favorites') {
      return <FavoritesPage />;
    }

    // 4. Search Route: /search
    if (currentPath.startsWith('/search')) {
      return <SearchPage />;
    }

    // 5. Legal / Company Info Routes
    if (currentPath === '/about') return <LegalPage pageType="about" />;
    if (currentPath === '/contact') return <LegalPage pageType="contact" />;
    if (currentPath === '/privacy') return <LegalPage pageType="privacy" />;
    if (currentPath === '/terms') return <LegalPage pageType="terms" />;

    // 6. Default Home Page Route (/)
    return <HomePage />;
  };

  return <Layout>{renderRoute()}</Layout>;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
