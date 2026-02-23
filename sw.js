const CACHE_NAME = 'muslim-pro-v6'; // قمت بتغيير الإصدار لتحديث الكاش عند المستخدمين
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
  './icons/screenshot.png', // تم إضافة الفاصلة المفقودة هنا
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://www.islamcan.com/common/adhan/adhan1.mp3'
];

// 1. مرحلة التثبيت: تخزين الملفات
self.addEventListener('install', e => {
  self.skipWaiting(); // تجبر المتصفح على استخدام النسخة الجديدة فوراً
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('جاري حفظ ملفات التطبيق...');
      return cache.addAll(assets);
    })
  );
});

// 2. مرحلة التنشيط: حذف الكاش القديم تلقائياً
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. جلب البيانات: يعمل حتى بدون إنترنت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() => {
        // في حال فشل الإنترنت وفشل الكاش (للصور مثلاً)
        if (e.request.destination === 'image') {
          return caches.match('./icons/icon-512.png');
        }
      });
    })
  );
});

// 4. تشغيل الأذان عبر الإشعارات (Push)
self.addEventListener('push', event => {
    let data = { title: 'موعد الصلاة', body: 'حي على الصلاة.. حي على الفلاح' };
    if (event.data) {
        try { data = event.data.json(); } catch(e) {}
    }

    const options = {
        body: data.body,
        icon: './icons/icon-512.png', // تأكد من وجود النقطة قبل المسار
        badge: './icons/icon-512.png',
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40],
        requireInteraction: true, // الإشعار لا يختفي حتى يغلقه المستخدم
        data: { url: './index.html' }
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// 5. عند الضغط على الإشعار: فتح التطبيق
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
