const CACHE_NAME = "carehub-cache-v4"; // bump this each visual change
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.css",
  "/app.js",
  "/manifest.json"
];

// Install + pre-cache
self.addEventListener("install", (event) => {
  self.skipWaiting(); // take control immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Network falling back to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});

// Activate + clear old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});
