const CACHE_NAME = 'muslim-pro-cache-v2';

// قائمة الملفات التي سيتم تخزينها لتعمل بدون إنترنت
const assets = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './quran.json',
  './dhikr.json',
  './radio.json',
  './reciters.json',
  './notifications.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Amiri&family=Tajawal:wght@400;700;800&display=swap'
];

// 1. مرحلة التثبيت: تخزين الملفات في الذاكرة (Cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم تخزين الملفات بنجاح');
      return cache.addAll(assets);
    })
  );
});

// 2. مرحلة التنشيط: حذف الكاش القديم عند تحديث التطبيق
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. جلب البيانات: محاولة التحميل من الكاش أولاً، ثم من الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 4. نظام الإشعارات (Push Notifications)
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {
        title: 'تذكير من المسلم PRO',
        body: 'حان الآن موعد ذكر الله'
    };

    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png',
        vibrate: [200, 100, 200],
        data: { url: './index.html' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// عند الضغط على الإشعار
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
