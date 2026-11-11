// Offline support: the app shell is kept up to date from the network when online;
// built assets and exam PDFs are cached the first time they are loaded.
const SHELL = 'prepa-shell-v1';
const FILES = 'prepa-files-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(['/', '/manifest.webmanifest', '/icon-192.png'])));
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
          caches.open(SHELL).then((c) => c.put('/', res.clone()));
          return res;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  // Hashed assets and PDFs never change: cache first. Range requests go to the network.
  if ((url.pathname.startsWith('/assets/') || url.pathname.startsWith('/exams/')) && !req.headers.has('range')) {
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
