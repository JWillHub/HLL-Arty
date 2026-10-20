/* HLL service worker: offline app shell + runtime font caching.
   Same-origin files use stale-while-revalidate, so an update is fetched in the
   background and appears on the next launch. Bump VERSION to force a clean cache. */
const VERSION = "hll-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const key = req.mode === "navigate" ? "index.html" : req;
    const cached = await cache.match(key, { ignoreSearch: true });
    const network = fetch(req).then((res) => {
      if (res && (res.ok || res.type === "opaque")) cache.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    const res = await network;
    if (res) return res;
    if (req.mode === "navigate") { const idx = await cache.match("index.html"); if (idx) return idx; }
    return new Response("", { status: 504, statusText: "Offline" });
  })());
});
