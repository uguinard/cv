const CACHE_NAME = 'job-tracker-cache-v4'; // Incremented version

// Local assets that are part of the application's source code.
const LOCAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/hooks/useLocalStorage.ts',
  '/data/demo-jobs.ts',
  '/data/locations.ts',
  '/data/country-codes.ts',
  '/utils/getCountryFlag.ts',
  '/components/Board.tsx',
  '/components/AddJobModal.tsx',
  '/components/FilterBar.tsx',
  '/components/Column.tsx',
  '/components/Card.tsx',
  '/components/ContextMenu.tsx',
  '/components/ConfirmationModal.tsx',
  '/components/RemindersCarousel.tsx',
  '/components/JobOverviewModal.tsx',
  '/components/DropzoneOverlay.tsx',
  '/components/ImportConfirmationModal.tsx',
  '/components/ImportStatusModal.tsx',
  '/components/icons/PlusIcon.tsx',
  '/components/icons/GithubIcon.tsx',
  '/components/icons/XCircleIcon.tsx',
  '/components/icons/EllipsisVerticalIcon.tsx',
  '/components/icons/ArrowDownOnSquareIcon.tsx',
  '/components/icons/UnarchiveIcon.tsx',
  '/components/icons/TrashIcon.tsx',
  '/components/icons/ExternalLinkIcon.tsx',
  '/components/icons/EditIcon.tsx',
  '/components/icons/CalendarIcon.tsx',
  '/components/icons/TagIcon.tsx',
  '/components/icons/SearchIcon.tsx',
  '/components/icons/ArchiveIcon.tsx',
  '/components/icons/SwitchIcon.tsx',
  '/components/icons/ChevronRightIcon.tsx',
  '/components/icons/BellIcon.tsx',
  '/components/icons/ChevronLeftIcon.tsx',
  '/components/icons/CheckIcon.tsx',
  '/components/icons/XMarkIcon.tsx',
  '/components/icons/UploadIcon.tsx',
  '/components/icons/CheckCircleIcon.tsx',
];

// Critical third-party assets loaded from CDNs.
const CDN_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://aistudiocdn.com/react@^19.2.0',
    'https://aistudiocdn.com/react-dom@^19.2.0/client',
];

const ASSETS_TO_CACHE = [...LOCAL_ASSETS, ...CDN_ASSETS];


// This event runs when the service worker is first installed.
self.addEventListener('install', (event) => {
  // We want to activate the new service worker immediately.
  self.skipWaiting();

  // waitUntil() ensures the service worker won't install until the code inside has successfully completed.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching all app assets (local and CDN).');
      // cache.addAll() is atomic. If any file fails to fetch, the whole operation fails.
      // This ensures a complete cache or no cache at all.
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(error => {
        console.error('Service Worker: Failed to cache critical assets during install. The app may not work offline.', error);
        // Re-throw the error to ensure the installation fails if caching fails.
        throw error;
    })
  );
});

// This event runs when the service worker is activated.
self.addEventListener('activate', (event) => {
  // This helps remove old, unused caches.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        // Take control of all open pages immediately.
        console.log('Service Worker: Now controlling clients.');
        return self.clients.claim();
    })
  );
});


// This event is fired for every fetch request.
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // URL protocol must be 'http' or 'https'.
  if (!event.request.url.startsWith('http')) {
      return;
  }

  // We implement a "cache-first" strategy.
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If a cached response is found, return it. This serves the app offline.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch it from the network.
        // This is for any assets not pre-cached (e.g., fonts loaded by tailwind, new assets).
        return fetch(event.request).then(
          (networkResponse) => {
            
            // We don't cache opaque responses because we can't verify their success.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
              return networkResponse;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache the new response for future use.
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
            console.error('Service Worker: Fetch failed; user is likely offline and resource is not cached.', error);
            // Optional: return a fallback offline page here if you have one.
        });
      })
  );
});
