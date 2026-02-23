const PrayerApp = {
    audio: new Audio('https://www.islamcan.com/common/adhan/adhan1.mp3'),
    
    async init() {
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
        setInterval(() => this.checkTime(), 60000);
    },

    async checkTime() {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5`);
        const data = await res.json();
        const timings = data.data.timings;
        
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        
        const prayers = { "Fajr": "الفجر", "Dhuhr": "الظهر", "Asr": "العصر", "Maghrib": "المغرب", "Isha": "العشاء" };
        
        for (let key in prayers) {
            if (timings[key] === timeStr) {
                this.playAzan(prayers[key]);
            }
        }
    },

    playAzan(name) {
        new Notification(`حان وقت صلاة ${name}`, {
            body: 'الله أكبر، الله أكبر',
            icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913501.png'
        });
        this.audio.play();
    }
};
PrayerApp.init();
