const CACHE_NAME = "carehub-cache-v5"; // bump this each visual change
const urlsToCache = [
  "/",            // root
  "/index.html",
  "/styles.css",  // we’ll match even if requested as styles.css?v=5
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

// Network falling back to cache (ignore query strings like ?v=5)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((resp) => resp || fetch(event.request))
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
