const staticCacheName = 'qr-code-generator-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/pic.jpg',
        'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js'
        // Add more URLs of assets you want to cache
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
