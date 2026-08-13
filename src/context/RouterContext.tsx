import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('q') || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;

    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    
    if (path.includes('?')) {
      const params = new URLSearchParams(path.split('?')[1]);
      setSearchQuery(params.get('q') || '');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, searchQuery, setSearchQuery }}>
      {children}
    </RouterContext.Provider>
  );
};
