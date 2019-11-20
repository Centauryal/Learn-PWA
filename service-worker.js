const CACHE_NAME = "firstpwa-v7";
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
  "/img/logo/logo_512.png",
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
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

        console.log(
          "ServiceWorker: Memuat aset dari server: ",
          event.request.url
        );
        return fetch(event.request);
      })
  );
});
