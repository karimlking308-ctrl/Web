import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register Monetag / Adsterra service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[Monetag SW] Registered successfully with scope:', reg.scope);
      })
      .catch((err) => {
        console.error('[Monetag SW] Registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

