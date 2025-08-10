const CACHE_NAME = "dlu-cache-v91-final";
const CORE_ASSETS = [
  "./","./index.html","./manifest.json",
  "./icon-192.png","./icon-512.png",
  "./click.wav","./success.wav","./fail.wav"
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // cache-bust index by query string
  const isIndex = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('index.html');
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c)=>c.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || (isIndex ? caches.match("./index.html") : null)))
  );
});