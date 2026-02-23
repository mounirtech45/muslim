const PrayerNotif = {
    city: "Cairo",
    country: "Egypt",
    audio: new Audio('https://www.islamcan.com/common/adhan/adhan1.mp3'),

    async init() {
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
        this.schedulePrayerCheck();
    },

    async getPrayerTimes() {
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${this.city}&country=${this.country}&method=5`);
            const data = await response.json();
            return data.data.timings;
        } catch (e) { return null; }
    },

    async checkPrayers() {
        const timings = await this.getPrayerTimes();
        if (!timings) return;

        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                            now.getMinutes().toString().padStart(2, '0');

        const prayers = { "Fajr": "الفجر", "Dhuhr": "الظهر", "Asr": "العصر", "Maghrib": "المغرب", "Isha": "العشاء" };

        if (Object.keys(prayers).includes(Object.keys(timings).find(k => timings[k] === currentTime))) {
            const prayerName = prayers[Object.keys(timings).find(k => timings[k] === currentTime)];
            this.triggerAzan(prayerName);
        }
    },

    triggerAzan(name) {
        // إظهار الإشعار
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(`حان وقت صلاة ${name}`, {
                    body: 'حي على الصلاة .. حي على الفلاح',
                    icon: 'icons/icon-512.png',
                    vibrate: [500, 100, 500],
                    requireInteraction: true
                });
            });
        }
        // تشغيل صوت الأذان
        this.audio.play().catch(e => console.log("انتظار تفاعل المستخدم لتشغيل الصوت"));
    },

    schedulePrayerCheck() {
        setInterval(() => this.checkPrayers(), 60000);
    }
};

PrayerNotif.init();
