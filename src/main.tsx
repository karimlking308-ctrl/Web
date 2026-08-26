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

// Reposition floating Monetag / In-Page Push notifications from top header to bottom-right
if (typeof window !== 'undefined') {
  const repositionAdContainers = () => {
    const children = Array.from(document.body.children);
    children.forEach((el) => {
      if (el.id === 'root' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
      const htmlEl = el as HTMLElement;
      const style = window.getComputedStyle(htmlEl);
      if (style.position === 'fixed' || style.position === 'absolute') {
        const topVal = style.top;
        // If element is placed at top or blocking header area
        if (topVal === '0px' || parseInt(topVal, 10) < 80 || topVal === '0') {
          htmlEl.style.setProperty('top', 'auto', 'important');
          htmlEl.style.setProperty('bottom', '20px', 'important');
          htmlEl.style.setProperty('right', '20px', 'important');
          htmlEl.style.setProperty('left', 'auto', 'important');
          htmlEl.style.setProperty('z-index', '40', 'important');
          htmlEl.style.setProperty('max-width', 'calc(100vw - 32px)', 'important');
        }
      }
    });
  };

  window.addEventListener('load', () => {
    repositionAdContainers();
    const observer = new MutationObserver(() => {
      repositionAdContainers();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


