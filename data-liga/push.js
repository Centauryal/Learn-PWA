var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BPNVM1zdU4h0lwTnNcE5fAAX5pCjt4Jsf-mGpMr7B7YQ5JC8pV10AKdtvRpoEgYfX5YbEhBzVkiIJfWhz9kX9XU",
  privateKey: "HEH8WdKBVlSOi8yGf1-wJqWA2asGtZ0qTK8tu3bD-Wk"
};

webPush.setVapidDetails(
  "mailto:alfa.arnialfa@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
var pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/dLIUEWsU0yQ:APA91bEqXjmHUalNY2ZqDJe0QxZVMDiKdCn22dHahheScC0Ye_ZO25AUnnsyb_D8gzay27ax2vQtL0dJWSy1GhjCprr0MnlWgW5UcgLDL5eOZjBQ7Pc5Uc5GHe6IzGkuSSzEwJeoCsSX",
  keys: {
    p256dh:
      "BM7afodQDjvOLdCOH6L9SgQPKx3UBEy2MrSELO9RDxybmfgEWsqxcblA+byqNj2+XHh9QpVhBzdN2qvJqD1Kfak=",
    auth: "aVVTuLGgT3HMCgllod2uzw=="
  }
};
var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
  gcmAPIKey: "528724451782",
  TTL: 60
};
webPush
  .sendNotification(pushSubscription, payload, options)
  .then(response => {
    console.log(response);
  })
  .catch(e => {
    console.log(e);
  });
