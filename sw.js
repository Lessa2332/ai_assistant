const CACHE_NAME = 'ai-checker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Не кешуємо API-запити до Gemini та CDN SDK
  if (
    e.request.url.includes('generativelanguage.googleapis.com') ||
    e.request.url.includes('cdn.jsdelivr.net') ||
    e.request.url.includes('unpkg.com') ||
    e.request.url.includes('cdn.tailwindcss.com')
  ) return;

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
