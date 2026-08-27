self.options = {
  "domain": "5gvci.com",
  "zoneId": 11659439
};
self.lary = "";

try {
  importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');
} catch (e) {
  console.warn('[Monetag SW] ServiceWorker importScripts failed or was blocked:', e);
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

