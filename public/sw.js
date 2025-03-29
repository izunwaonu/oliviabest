self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");
    event.waitUntil(
      caches.open("oliviabest-cache").then((cache) => {
        return cache.addAll([
          "/",
          "/offline.html",
          "/favicon.ico",
          "/icons/icon-192x192.png",
          "/icons/icon-512x512.png",
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match("/offline.html");
        });
      })
    );
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== "oliviabest-cache")
            .map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  });
  