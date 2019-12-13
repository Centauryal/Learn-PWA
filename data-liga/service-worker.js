const CACHE_NAME = "football-league-v2";
var urlsToCache = [
  "/",
  "/manifest.json",
  "/nav.html",
  "/index.html",
  "/pages/standings.html",
  "/pages/detailtim.html",
  "/pages/favorites.html",
  "/pages/matches.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js",
  "/js/app.js",
  "/js/dbhelper.js",
  "/js/idb.js",
  "/img/logo/logo.svg",
  "/img/logo/logo-32.png",
  "/img/logo/logo-36.png",
  "/img/logo/logo-48.png",
  "/img/logo/logo-57.png",
  "/img/logo/logo-72.png",
  "/img/logo/logo-96.png",
  "/img/logo/logo-114.png",
  "/img/logo/logo-144.png",
  "/img/logo/logo-192.png",
  "/img/logo/logo-512.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("Aktivasi service worker baru");

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME && cacheName.startsWith("firstpwa")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches
      .match(event.request, { cacheName: CACHE_NAME })
      .then(function(response) {
        if (response) {
          console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function(response) {
          if (!response || response.status !== 200) {
            return response;
          }

          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});

self.addEventListener("push", function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "img/logo/logo-32.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
