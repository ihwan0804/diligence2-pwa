const CACHE = "dlu-cache-v913";
const CORE = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./click.wav","./success.wav","./fail.wav"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)))) .then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  e.respondWith(
    fetch(e.request).then(res=>{const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy)); return res;})
    .catch(()=>caches.match(e.request).then(c=> c || (e.request.mode==="navigate"? caches.match("./index.html") : null)))
  );
});