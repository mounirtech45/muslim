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
