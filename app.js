const App = {
    surahs: ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"],
    history: ['p-home'],
    audio: document.getElementById('audio-player'),
    currentPlaying: null, // لتعريف السورة المشغلة حالياً
    userData: { favorites: [] },

    async init() {
        this.updateTime();
        this.loadReciters();
        this.loadRadios();
        this.loadDhikr();
        this.loadTikTokVideos();
        this.renderSurahList();
        this.getPrayerTimes();
        this.setHomeImage();
        
        this.audio.ontimeupdate = () => {
            if(this.audio.duration) document.getElementById('audio-progress').value = (this.audio.currentTime / this.audio.duration) * 100;
        };

        window.onpopstate = (e) => {
            if(e.state && e.state.page) this.renderPage(e.state.page, false);
        };
    },

    // --- منطق المفضلات الجديد ---
    renderFavorites() {
        const grid = document.getElementById('favorites-grid');
        if (this.userData.favorites?.length > 0) {
            document.getElementById('favorites-section').style.display = 'block';
            grid.innerHTML = this.userData.favorites.map(f => `
                <div class="card" onclick="App.playAudio('${f.url}', '${f.name}', '${f.sheikh}', '${f.img}')">
                    <i class="fas fa-play" style="color:var(--accent)"></i><br><small>${f.name}</small>
                </div>`).join('');
        } else {
            document.getElementById('favorites-section').style.display = 'none';
        }
    },

    // --- وظيفة التشغيل الأصلية مع تحديث المفضلات ---
    playAudio(url, name, sheikh, img) {
        this.currentPlaying = { url, name, sheikh, img };
        this.audio.src = url;
        this.audio.play();
        
        document.getElementById('player-img').src = img || 'icons/icon-512.png';
        document.getElementById('player-surah').innerText = name;
        document.getElementById('player-sheikh').innerText = sheikh;
        document.getElementById('audio-player-modal').classList.add('active');
        document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>';
        
        // تحديث لون زر القلب
        const isFav = this.userData.favorites?.some(f => f.url === url);
        document.getElementById('fav-btn').classList.toggle('active', isFav);
    },

    // الملاحة الأصلية (pushState)
    nav(id, btn) {
        if (this.history[this.history.length-1] !== id) { 
            this.history.push(id); 
            window.history.pushState({page: id}, '', ''); 
        }
        this.renderPage(id);
        if (btn) { document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active')); btn.classList.add('active'); }
    },

    renderPage(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
        document.getElementById(id).classList.add('active-page');
        document.getElementById('back-nav').style.display = id === 'p-home' ? 'none' : 'block';
    },

    toggleAudio() {
        if(this.audio.paused) { this.audio.play(); document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>'; }
        else { this.audio.pause(); document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-play"></i>'; }
    },

    closeAudioPlayer() { document.getElementById('audio-player-modal').classList.remove('active'); },

    async loadReciters() {
        const res = await fetch('reciters.json');
        const data = await res.json();
        document.getElementById('reciters-grid').innerHTML = data.reciters.map(r => `
            <div class="card" onclick="App.openSheikh('${r.server}', '${r.name}', '${r.img}')">
                <img src="${r.img}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; margin-bottom:10px;">
                <br><span>${r.name}</span>
            </div>`).join('');
    },

    openSheikh(srv, name, img) {
        this.nav('p-viewer');
        let html = `<h2 style="text-align:center; margin-bottom:20px; font-family:'Amiri';">${name}</h2><div class="grid">`;
        this.surahs.forEach((s, i) => {
            const num = (i + 1).toString().padStart(3, '0');
            html += `<div class="card" onclick="App.playAudio('${srv}${num}.mp3', '${s}', '${name}', '${img}')"><b>${s}</b></div>`;
        });
        document.getElementById('viewer-render').innerHTML = html + "</div>";
    },

    async loadRadios() {
        const res = await fetch('radio.json');
        const data = await res.json();
        document.getElementById('radio-grid').innerHTML = data.radios.slice(0, 8).map(r => `
            <div class="card" onclick="App.playAudio('${r.url}', '${r.name}', 'إذاعة مباشرة', 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png')">
                <i class="fas fa-tower-broadcast" style="font-size:1.5rem; color:var(--accent);"></i>
                <br><span style="font-size:0.8rem;">${r.name}</span>
            </div>`).join('');
    },

    async loadDhikr() {
        const res = await fetch('dhikr.json');
        const data = await res.json();
        this.azkarData = data;
        document.getElementById('azkar-categories').innerHTML = data.map((c, i) => `
            <div class="card" onclick="App.showDhikr(${i})"><b>${c.category}</b></div>`).join('');
    },

    showDhikr(idx) {
        const cat = this.azkarData[idx];
        document.getElementById('azkar-categories').style.display = 'none';
        document.getElementById('azkar-content').innerHTML = `
            <button onclick="document.getElementById('azkar-categories').style.display='grid'; document.getElementById('azkar-content').innerHTML=''" style="width:100%; padding:12px; margin-bottom:15px; background:var(--accent); color:white; border:none; border-radius:10px;">عودة للأصناف</button>
            ` + cat.array.map(z => `<div class="card" style="text-align:right; margin-bottom:15px; cursor:default;">
                <p style="font-size:1.1rem; line-height:1.8;">${z.text}</p>
                <div style="color:var(--accent); font-weight:800; margin-top:10px;">التكرار: ${z.count}</div>
            </div>`).join('');
    },

    async loadTikTokVideos() {
        const res = await fetch('videos.json');
        const data = await res.json();
        document.getElementById('tiktok-container').innerHTML = data.videos[0].videos.map(v => `
            <div style="height:100%; snap-align:start; position:relative; background:#000; display:flex; align-items:center;">
                <video loop style="width:100%; height:100%;" onclick="this.paused?this.play():this.pause()"><source src="${v.video_url}"></video>
            </div>`).join('');
    },

    renderSurahList() {
        document.getElementById('surah-grid').innerHTML = this.surahs.map((s, i) => `<div class="card"><b>${s}</b></div>`).join('');
    },

    getPrayerTimes() {
        navigator.geolocation.getCurrentPosition(async pos => {
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=4`);
            const d = await res.json();
            const t = d.data.timings;
            ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
                document.getElementById(`pt-${p}`).querySelector('.time').innerText = t[p];
            });
            document.getElementById('next-prayer-timer').innerText = "تم تحديث المواقيت لموقعك الحالي";
        });
    },

    updateTime() {
        setInterval(() => {
            document.getElementById('local-time').innerText = new Date().toLocaleTimeString('ar-EG', {hour12:false});
        }, 1000);
    },

    async setHomeImage() {
        try {
            const res = await fetch('tadabor.json');
            const d = await res.json();
            document.getElementById('home-random-img').src = d.tadabor.daily_verses[0].image_url;
        } catch(e) { 
            document.getElementById('home-random-img').src = 'https://images.unsplash.com/photo-1590059392234-8b61517595c2?auto=format&fit=crop&w=800&q=80';
        }
    },

    goBack() { window.history.back(); },
    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        document.getElementById('theme-icon').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
};

window.onload = () => App.init();
