const firebaseConfig = {
    apiKey: "AIzaSyC034nd6mDpq8wAK_snVHg6nnbTvWSzNws",
    authDomain: "equipes-nossa-senhora.firebaseapp.com",
    projectId: "equipes-nossa-senhora",
    storageBucket: "equipes-nossa-senhora.firebasestorage.app",
    messagingSenderId: "814719609165",
    appId: "1:814719609165:web:c5776b1b28c43fe1b86f04"
};

// Inicialização do Firebase
let db;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase pronto.");
    }
} catch (e) {
    console.error("Erro Firebase:", e);
}

document.addEventListener('DOMContentLoaded', function() {
    const welcomeModal = document.getElementById('welcomeModal');
    const startAppBtn = document.getElementById('startAppBtn');
    const userNameInput = document.getElementById('userNameInput');
    const monthlyCountElement = document.getElementById('monthlyCount');
    const streakCountElement = document.getElementById('streakCount');
    const liturgicalBar = document.getElementById('liturgicalBar');

    const STORAGE_KEY_COMPLETED = 'prayerCompletedDaysList';
    const STORAGE_KEY_USER_NAME = 'prayerUserName';
    
    let completedDays = JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED) || '[]');
    let userName = localStorage.getItem(STORAGE_KEY_USER_NAME);

    if (startAppBtn) {
        startAppBtn.onclick = function() {
            const name = userNameInput.value.trim();
            if (name) {
                userName = name;
                localStorage.setItem(STORAGE_KEY_USER_NAME, name);
                welcomeModal.classList.remove('show');
                initApp();
            } else {
                alert("Por favor, digite seu nome.");
            }
        };
    }

    function initApp() {
        document.getElementById('headerNames').textContent = userName;
        updateCounters();
        fetchLiturgia();
    }

    function updateCounters() {
        const today = new Date();
        const monthPrefix = `${today.getFullYear()}-${today.getMonth() + 1}-`;
        const count = completedDays.filter(d => d.startsWith(monthPrefix)).length;
        if (monthlyCountElement) monthlyCountElement.textContent = `🔥 ${count} dias este mês`;
        
        let streak = 0;
        let checkDate = new Date();
        while (true) {
            const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
            if (completedDays.includes(key)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        if (streakCountElement) streakCountElement.textContent = `⚡ ${streak} dias seguidos`;
    }

    async function fetchLiturgia() {
        try {
            const response = await fetch('https://liturgia.up.railway.app/');
            const data = await response.json();
            if (data.celebracao) document.getElementById('liturgicalCelebration').textContent = data.celebracao;
            if (data.santo_do_dia) document.getElementById('saintOfTheDay').textContent = `Santo do Dia: ${data.santo_do_dia}`;
            const colors = { 'Verde': '#2d5a27', 'Roxo': '#4a148c', 'Branco': '#2c3e6b', 'Vermelho': '#b71c1c' };
            if (liturgicalBar && data.cor) liturgicalBar.style.backgroundColor = colors[data.cor] || '#2c3e6b';
        } catch (e) {
            console.error("Erro Liturgia:", e);
        }
    }

    if (userName) {
        welcomeModal.classList.remove('show');
        initApp();
    }
});