/* Offline shell for CineFree.
   - pages: network first, cached directory when offline
   - static files: cached copy first, refreshed in the background
   - API calls are never cached (favourites, ratings and the counter stay live) */
var CACHE = "cinefree-v4";

var CORE = [
  "/",
  "/styles.css",
  "/app.js",
  "/review.js",
  "/ratings.js",
  "/share.js",
  "/compare.js",
  "/country.js",
  "/favorites.js",
  "/analytics.js",
  "/pwa.js",
  "/i18n.js",
  "/theme.js",
  "/data.js",
  "/data-en.js",
  "/assets/logos/logos.js",
  "/assets/hero.jpg",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        return Promise.all(
          CORE.map(function (url) {
            return cache.add(new Request(url, { cache: "reload" })).catch(function () {});
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            return key === CACHE ? null : caches.delete(key);
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/api/") === 0) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          if (response && response.ok && url.pathname === "/") {
            var copy = response.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put("/", copy);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match("/").then(function (cached) {
            return cached || Response.error();
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      var fresh = fetch(request)
        .then(function (response) {
          if (response && response.ok) {
            var copy = response.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return cached;
        });
      return cached || fresh;
    })
  );
});
