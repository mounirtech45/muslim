const CACHE_NAME = 'muslim-pro-v3';
const assets = [
  './',
  './index.html',
  './app.js',
  './notifications.js',
  './manifest.json',
  './quran.json',
  './dhikr.json',
  './radio.json',
  './reciters.json',
  './icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://www.islamcan.com/common/adhan/adhan1.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// استقبال إشعار الصلاة وتشغيل الأذان
self.addEventListener('push', function(event) {
    const options = {
        body: 'حان الآن موعد الصلاة .. حي على الصلاة',
        icon: 'icons/icon-512.png',
        badge: 'icons/icon-512.png',
        vibrate: [500, 100, 500],
        tag: 'prayer-notification',
        requireInteraction: true
    };
    event.waitUntil(self.registration.showNotification('نداء الصلاة', options));
});
