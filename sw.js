/**
 * Service worker for Colored Noise.
 *
 * Strategy:
 *  - The app shell (HTML, CSS, JS, worklet, manifest, icons) is precached on
 *    install so the generator works fully offline once it has been opened once.
 *  - Same-origin GET requests use stale-while-revalidate: serve from cache
 *    immediately, refresh the cache in the background.
 *  - Cross-origin requests (Google Fonts) are passed through untouched.
 *
 * Bump CACHE_VERSION whenever a shell file changes so old caches are purged.
 */

const CACHE_VERSION = 'v3';
const CACHE_NAME = `colorednoise-${CACHE_VERSION}`;

const APP_SHELL = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/ui.js',
    '/js/audio-engine.js',
    '/js/presets.js',
    '/worklet/noise-processor.js',
    '/manifest.webmanifest',
    '/favicon.svg',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-maskable-192.png',
    '/icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Navigations: drop the query string so /?preset=3 resolves to the cached shell.
    const cacheKey = request.mode === 'navigate' ? url.pathname : request;

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(cacheKey);

            const network = fetch(request)
                .then((response) => {
                    if (response && response.ok) {
                        cache.put(cacheKey, response.clone());
                    }
                    return response;
                })
                .catch(() => null);

            if (cached) {
                // Refresh in the background but respond immediately.
                event.waitUntil(network);
                return cached;
            }

            const response = await network;
            if (response) return response;

            // Offline and not cached: fall back to the app shell for navigations.
            if (request.mode === 'navigate') {
                const shell = await cache.match('/index.html');
                if (shell) return shell;
            }
            return Response.error();
        })
    );
});
