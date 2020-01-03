importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

const CACHE_NAME = "football-league-v5";
const base_url = "https://api.football-data.org/v2/";

var urlsToCache = [
  { url: "/", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/nav.html", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/detailteam.html", revision: "1" },
  { url: "/pages/standings.html", revision: "1" },
  { url: "/pages/favorites.html", revision: "1" },
  { url: "/pages/matches.html", revision: "1" },
  { url: "/css/materialize.min.css", revision: "1" },
  { url: "/css/style.css", revision: "1" },
  { url: "/js/materialize.min.js", revision: "1" },
  { url: "/js/nav.js", revision: "1" },
  { url: "/js/api.js", revision: "1" },
  { url: "/js/app.js", revision: "1" },
  { url: "/js/db.js", revision: "1" },
  { url: "/js/idb.js", revision: "1" },
  { url: "/img/logo/logo.svg", revision: "1" },
  { url: "/img/logo/logo-32.png", revision: "1" },
  { url: "/img/logo/logo-36.png", revision: "1" },
  { url: "/img/logo/logo-48.png", revision: "1" },
  { url: "/img/logo/logo-57.png", revision: "1" },
  { url: "/img/logo/logo-72.png", revision: "1" },
  { url: "/img/logo/logo-96.png", revision: "1" },
  { url: "/img/logo/logo-114.png", revision: "1" },
  { url: "/img/logo/logo-144.png", revision: "1" },
  { url: "/img/logo/logo-192.png", revision: "1" },
  { url: "/img/logo/logo-512.png", revision: "1" }
];

if (workbox) {
  workbox.precaching.precacheAndRoute(urlsToCache, {
    ignoreURLParametersMatching: [/.*/]
  });

  workbox.routing.registerRoute(
    new RegExp(base_url),
    workbox.strategies.staleWhileRevalidate({
      cacheName: CACHE_NAME
    })
  );

  workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: CACHE_NAME
    })
  );

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts-stylesheets"
    })
  );

  workbox.routing.registerRoute(
    /^https:\/\/code\.iconify\.design/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "iconify-design"
    })
  );

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAME,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  );

  console.log(`Workbox berhasil dimuat`);
} else {
  console.log(`Workbox gagal dimuat`);
}

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
