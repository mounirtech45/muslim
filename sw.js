const CACHE_NAME = 'muslim-pro-v5';
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
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://www.islamcan.com/common/adhan/adhan1.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// تشغيل الأذان عبر الإشعارات
self.addEventListener('push', event => {
    const options = {
        body: 'حي على الصلاة.. حي على الفلاح',
        icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png',
        vibrate: [500, 100, 500],
        requireInteraction: true
    };
    event.waitUntil(self.registration.showNotification('موعد الصلاة', options));
});
