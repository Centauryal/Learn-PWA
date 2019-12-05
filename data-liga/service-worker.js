const CACHE_NAME = "football-league-v1";
var urlsToCache = [
  "/",
  "/nav.html",
  "/manifest.json",
  "/index.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/services.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/img/c_programming.svg",
  "/img/c_sharp_programming.svg",
  "/img/cplus_programming.svg",
  "/img/html_5_programming.svg",
  "/img/java_programming.svg",
  "/img/kotlin_programming.svg",
  "/img/react_programming.svg",
  "/img/xamarin_programming.svg",
  "/img/trianglify-background.svg",
  "/img/s1.webp",
  "/img/s2.webp",
  "/img/s3.webp",
  "/img/hero_user.webp",
  "/img/user.webp",
  "/img/logo/logo_36.png",
  "/img/logo/logo_48.png",
  "/img/logo/logo_72.png",
  "/img/logo/logo_96.png",
  "/img/logo/logo_144.png",
  "/img/logo/logo_192.png",
  "/img/logo/logo_512.png"
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
    icon: "img/logo/logo.svg",
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
