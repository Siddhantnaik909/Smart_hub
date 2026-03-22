const CACHE_NAME = 'smarthub-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/calculators.html',
    '/history.html',
    '/profile.html',
    '/css/style.css',
    '/css/custom.css',
    '/js/script.js',
    '/js/calc-utils.js',
    '/js/component-loader.js',
    '/js/buttons.js',
    '/icons/icon-192x192.png',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Caching offline assets');
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('[Service Worker] Failed to cache some assets', err);
            });
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
