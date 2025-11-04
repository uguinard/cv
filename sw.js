/**
 * Service Worker for Sergio Uribe Guinard CV
 * Provides offline functionality and PWA capabilities
 * © 2024 Sergio Uribe Guinard. All rights reserved.
 */

// Configuration
const CACHE_NAME = 'cv-v1.0.0';
const STATIC_CACHE = 'cv-static-v1.0.0';
const DYNAMIC_CACHE = 'cv-dynamic-v1.0.0';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/locales/en.json',
  '/locales/es.json',
  '/profile-optimized.jpg',
  '/profile-small.jpg',
  '/profile-large.jpg',
  '/robots.txt',
  '/sitemap.xml'
];

// API endpoints to cache (if any)
const API_CACHE_PATTERNS = [
  '/locales/',
  'fonts.googleapis.com',
  'kit.fontawesome.com'
];

/**
 * Service Worker Install Event
 * Cache essential resources for offline functionality
 */
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Open static cache
        const cache = await caches.open(STATIC_CACHE);
        
        // Cache essential files
        console.log('📦 Service Worker: Caching static assets...');
        await cache.addAll(STATIC_ASSETS);
        
        // Force activation of new service worker
        await self.skipWaiting();
        
        console.log('✅ Service Worker: Successfully installed and cached assets');
      } catch (error) {
        console.error('❌ Service Worker: Installation failed:', error);
      }
    })()
  );
});

/**
 * Service Worker Activate Event
 * Clean up old caches and take control
 */
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Get all cache names
        const cacheNames = await caches.keys();
        
        // Delete old caches
        const oldCaches = cacheNames.filter(cacheName => {
          return cacheName.startsWith('cv-') && 
                 !cacheName.includes('v1.0.0');
        });
        
        await Promise.all(
          oldCaches.map(cacheName => {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        
        // Take control of all open pages
        await self.clients.claim();
        
        console.log('✅ Service Worker: Successfully activated');
      } catch (error) {
        console.error('❌ Service Worker: Activation failed:', error);
      }
    })()
  );
});

/**
 * Service Worker Fetch Event
 * Handle network requests with caching strategies
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external API calls for dynamic content
  if (isExternalAPI(request.url)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

/**
 * Handle fetch requests with appropriate caching strategy
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First (for static assets)
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Network First (for dynamic content)
    if (isDynamicContent(url.pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 3: Stale While Revalidate (for locales)
    if (url.pathname.startsWith('/locales/')) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
    
    // Default: Network First
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.warn('⚠️ Service Worker: Request failed, serving offline fallback:', error);
    
    // Serve offline fallback for HTML pages
    if (request.headers.get('accept').includes('text/html')) {
      return await getOfflineFallback(request);
    }
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Last resort: basic offline response
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Cache First Strategy
 * Check cache first, fallback to network
 */
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 * Return cached version immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  // Start network request in background
  const fetchPromise = fetch(request).then(networkResponse => {
    // Update cache with fresh content
    if (networkResponse.status === 200) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  throw new Error('No cached or network response available');
}

/**
 * Get offline fallback for HTML pages
 */
async function getOfflineFallback(request) {
  // Try to serve cached version
  const cachedResponse = await caches.match('/');
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Last resort: basic offline HTML
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Sergio Uribe Guinard CV</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: #f4f7f9;
          color: #2c3e50;
        }
        .offline-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .offline-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .offline-title {
          font-size: 24px;
          margin-bottom: 15px;
        }
        .offline-message {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .offline-retry {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .offline-retry:hover {
          background: #2980b9;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1 class="offline-title">You're Offline</h1>
        <p class="offline-message">
          Your CV content isn't available right now. This might be because:<br>
          • You don't have an internet connection<br>
          • The service is temporarily unavailable<br><br>
          Your CV will be available offline once you've visited it online.
        </p>
        <button class="offline-retry" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

/**
 * Check if URL is for external APIs that should be excluded
 */
function isExternalAPI(url) {
  return url.includes('fonts.googleapis.com') || 
         url.includes('kit.fontawesome.com') ||
         url.startsWith('http') && !url.includes(location.hostname);
}

/**
 * Check if URL is for static assets
 */
function isStaticAsset(pathname) {
  return pathname === '/' ||
         pathname === '/index.html' ||
         pathname === '/style.css' ||
         pathname === '/script.js' ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.ico') ||
         pathname.endsWith('.txt') ||
         pathname.endsWith('.xml');
}

/**
 * Check if URL is for dynamic content
 */
function isDynamicContent(pathname) {
  return pathname === '/' || pathname === '/index.html';
}

/**
 * Handle service worker messages from main thread
 */
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

/**
 * Background sync for future use
 */
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Perform background synchronization
 */
async function doBackgroundSync() {
  try {
    // This could be used to update content in the background
    console.log('🔄 Service Worker: Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

/**
 * Push notifications for future use
 */
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'CV content updated',
    icon: '/profile-optimized.jpg',
    badge: '/profile-optimized.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View CV',
        icon: '/profile-optimized.jpg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/profile-optimized.jpg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('CV Updated', options)
  );
});

console.log('🔧 Service Worker: Script loaded successfully');