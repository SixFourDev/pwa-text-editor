const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching');


precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

registerRoute(
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|eot|ttf)$/,
  new CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache assets for 7 days
      }),
    ],
  })
);

// Implement offline fallback
const offlineFallback = new CacheFirst({
  cacheName: 'offline-fallback',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
});

registerRoute(({ request }) => request.mode === 'navigate', ({ event }) => {
  return pageCache.handle({ event }).catch(() => {
    return offlineFallback.handle({ event });
  });
});
