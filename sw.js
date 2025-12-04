const CACHE_NAME = "learning-journal-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/journal.html",
  "/projects.html",
  "/about.html",
  "/style.css",
  "/js/script.js",
  "/js/storage.js",
  "/js/browser.js",
  "/js/thirdparty.js",
  "/js/json.js",
  "/img/Learning.journal.png",
  "/img/Dark.mode.png",
  "/img/PWA.app.png"
];

/
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});


self.addEventListener("fetch", event => {
  const url = event.request.url;


  if (url.includes("/api/reflections")) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          
          const clone = response.clone();
          caches.open("dynamic-reflections").then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          
          caches.match("/index.html")
        )
      );
    })
  );
});
