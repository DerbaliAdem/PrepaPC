// Offline support: the app shell is kept up to date from the network when online;
// built assets and exam PDFs are cached the first time they are loaded.
const SHELL = 'prepa-shell-v2';
const FILES = 'prepa-files-v1';
// Works at the site root or under a subpath such as /PrepaPC/ (GitHub Pages).
const BASE = new URL(self.registration.scope).pathname;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll([BASE, BASE + 'manifest.webmanifest', BASE + 'icon-192.png'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== FILES).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // Pages: network first, fall back to the cached shell (the app routes on the client).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(SHELL).then((c) => c.put(BASE, res.clone()));
          return res;
        })
        .catch(() => caches.match(BASE)),
    );
    return;
  }

  // Hashed assets and PDFs never change: cache first. Range requests go to the network.
  if ((url.pathname.startsWith(BASE + 'assets/') || url.pathname.startsWith(BASE + 'exams/')) && !req.headers.has('range')) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok && res.status === 200) {
              const copy = res.clone();
              caches.open(FILES).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
