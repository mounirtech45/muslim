const PrayerNotif = {
    city: "Cairo",
    country: "Egypt",
    lastDhikrIndex: 0,

    async init() {
        // طلب الإذن
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
        
        // بدء فحص مواقيت الصلاة (كل دقيقة)
        this.schedulePrayerCheck();
        
        // بدء إرسال أذكار عشوائية (كل ساعة)
        this.scheduleDhikrCheck();
    },

    // --- جلب مواقيت الصلاة ---
    async getPrayerTimes() {
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${this.city}&country=${this.country}&method=5`);
            const data = await response.json();
            return data.data.timings;
        } catch (e) { return null; }
    },

    // --- نظام تنبيهات الصلاة ---
    async checkPrayers() {
        const timings = await this.getPrayerTimes();
        if (!timings) return;

        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                            now.getMinutes().toString().padStart(2, '0');

        const prayers = { "Fajr": "صلاة الفجر", "Dhuhr": "صلاة الظهر", "Asr": "صلاة العصر", "Maghrib": "صلاة المغرب", "Isha": "صلاة العشاء" };

        if (Object.keys(prayers).includes(Object.keys(timings).find(key => timings[key] === currentTime))) {
            const prayerName = prayers[Object.keys(timings).find(key => timings[key] === currentTime)];
            this.sendNotification("نِدَاء الصلاة 🕋", `حان الآن موعد ${prayerName}، صلاتك حياتك.`);
        }
    },

    // --- نظام الأذكار العشوائية ---
    async sendRandomDhikr() {
        try {
            const res = await fetch('dhikr.json');
            const data = await res.json();
            // اختيار تصنيف عشوائي ثم ذكر عشوائي
            const randomCategory = data[Math.floor(Math.random() * data.length)];
            const randomDhikr = randomCategory.array[Math.floor(Math.random() * randomCategory.array.length)];
            
            this.sendNotification("ذكّر غيرك ✨", randomDhikr.text);
        } catch (e) { console.log("خطأ في جلب الأذكار"); }
    },

    // --- الإرسال الفعلي للإشعار ---
    sendNotification(title, body) {
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(title, {
                    body: body,
                    icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png',
                    badge: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png',
                    vibrate: [100, 50, 100],
                    tag: 'muslim-pro-notif'
                });
            });
        }
    },

    schedulePrayerCheck() {
        this.checkPrayers();
        setInterval(() => this.checkPrayers(), 60000); // كل دقيقة
    },

    scheduleDhikrCheck() {
        // إرسال ذكر فور تشغيل الموقع ثم كل ساعة
        this.sendRandomDhikr();
        setInterval(() => this.sendRandomDhikr(), 3600000); // 3600000 ملي ثانية = ساعة واحدة
    }
};

PrayerNotif.init();
