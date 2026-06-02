const CACHE_NAME = 'cgl-coach-pro-v3';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap'
];

// App install hote hi saare assets ko cache mein save karna
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Purane cache ko clear karna jab naya version aaye
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Offline access control network pipeline
self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request).then(cachedResponse => {
      return cachedResponse || fetch(ev.request).catch(() => {
        // Agar network fail ho jaye aur cache mein na mile (offline fallback)
        if (ev.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});