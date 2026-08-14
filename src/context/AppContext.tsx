import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeMode } from '../types';
import { translations } from '../data/translations';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  currentPath: string;
  navigate: (path: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with localStorage
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('soltools_lang') || localStorage.getItem('quickkit_lang');
      if (saved === 'en' || saved === 'ar') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('soltools_lang', newLang);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // 2. Theme state with localStorage
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('soltools_theme') || localStorage.getItem('quickkit_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('soltools_theme', next);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 3. Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soltools_favorites') || localStorage.getItem('quickkit_favorites');
      return saved ? JSON.parse(saved) : ['image-resizer', 'json-formatter', 'pdf-to-jpg', 'word-counter'];
    } catch {
      return ['image-resizer', 'json-formatter', 'pdf-to-jpg', 'word-counter'];
    }
  });

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem('soltools_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  // 4. Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      return window.location.pathname || '/';
    } catch {
      return '/';
    }
  });

  const navigate = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {}
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 5. Global search term
  const [searchTerm, setSearchTerm] = useState('');

  // 6. Translation helper
  const t = (key: keyof typeof translations['en']): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        isFavorite,
        currentPath,
        navigate,
        searchTerm,
        setSearchTerm,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
