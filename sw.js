self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {
        title: 'حان الآن موعد الصلاة',
        body: 'حي على الصلاة، حي على الفلاح'
    };

    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png',
        vibrate: [500, 110, 500],
        data: { url: './index.html' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// فتح الموقع عند الضغط على الإشعار
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

const CACHE_NAME = 'muslim-pro-v1';
const assets = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// تفعيل الملف وجلب البيانات حتى بدون إنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

