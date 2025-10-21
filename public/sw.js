self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

self.addEventListener("fetch", (event) => {
   // simple network-first handler
   event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
