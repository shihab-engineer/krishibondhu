/* KrishiBondhu service worker: offline app shell; API calls always go to the network. */
const CACHE = "krishibondhu-v6";
const SHELL = [
 "./",
 "index.html",
 "css/app.css",
 "css/extras.css",
 "js/data-geo-kb.js",
 "js/market-logic.js",
 "data/market-data.js",
 "js/extras.js",
 "js/app.js",
 "manifest.webmanifest",
 "icon.svg",
 "assets/font-48e4b00b.woff2",
 "assets/font-7bcc67f8.woff2",
 "assets/font-94b86932.woff2",
 "assets/font-9f7e2d2b.woff2",
 "assets/font-aaff84f1.woff2",
 "assets/font-c68005de.woff2",
 "assets/font-fc4268e5.woff2",
 "assets/photo-farmers.jpg",
 "assets/scene-harvest.svg",
 "assets/scene-market.svg",
 "assets/scene-paddy.svg"
];

self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/") || u.pathname.startsWith("/media/")) return;
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })
      .catch(() => hit || caches.match("index.html"));
    return hit || net;
  }));
});
