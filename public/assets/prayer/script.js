const firebaseConfig = {
    apiKey: "AIzaSyC034nd6mDpq8wAK_snVHg6nnbTvWSzNws",
    authDomain: "equipes-nossa-senhora.firebaseapp.com",
    projectId: "equipes-nossa-senhora",
    storageBucket: "equipes-nossa-senhora.firebasestorage.app",
    messagingSenderId: "814719609165",
    appId: "1:814719609165:web:c5776b1b28c43fe1b86f04"
};

// Inicialização do Firebase com proteção
let db;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase inicializado com sucesso.");
    }
} catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado. Iniciando lógica do app...");

    // --- Seleção de Elementos ---
    const welcomeModal = document.getElementById('welcomeModal');
    const startAppBtn = document.getElementById('startAppBtn');
    const userNameInput = document.getElementById('userNameInput');
    
    const monthlyCountElement = document.getElementById('monthlyCount');
    const streakCountElement = document.getElementById('streakCount');
    const liturgicalBar = document.getElementById('liturgicalBar');

    // --- Estado ---
    const STORAGE_KEY_COMPLETED = 'prayerCompletedDaysList';
    const STORAGE_KEY_USER_ID = 'prayerUserId';
    const STORAGE_KEY_USER_NAME = 'prayerUserName';
    
    let completedDays = [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
        completedDays = saved ? JSON.parse(saved) : [];
    } catch(e) {
        console.error("Erro ao ler localStorage:", e);
    }

    let today = new Date();
    let userId = localStorage.getItem(STORAGE_KEY_USER_ID);
    let userName = localStorage.getItem(STORAGE_KEY_USER_NAME);

    // --- Lógica do Botão "Começar" ---
    if (startAppBtn) {
        startAppBtn.onclick = function() {
            console.log("Botão Começar clicado.");
            const name = userNameInput ? userNameInput.value.trim() : '';
            if (name) {
                userName = name;
                localStorage.setItem(STORAGE_KEY_USER_NAME, name);
                if (welcomeModal) welcomeModal.classList.remove('show');
                initApp();
            } else {
                alert("Por favor, digite seu nome para continuar.");
            }
        };
    }

    async function initApp() {
        console.log("Inicializando interface para:", userName);
        
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(STORAGE_KEY_USER_ID, userId);
        }

        // Atualiza Nome no Header
        const headerNames = document.getElementById('headerNames');
        if (headerNames) headerNames.textContent = userName;

        // Sincroniza com Firebase se disponível
        if (db) {
            db.collection('users').doc(userId).set({ 
                name: userName, 
                lastActive: Date.now() 
            }, { merge: true }).catch(e => console.warn("Erro Firebase:", e));
        }

        updateCounters();
        fetchLiturgia();
    }

    function updateCounters() {
        const currentMonthPrefix = `${today.getFullYear()}-${today.getMonth() + 1}-`;
        const count = completedDays.filter(d => d.startsWith(currentMonthPrefix)).length;
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
            
            const liturgicalCelebration = document.getElementById('liturgicalCelebration');
            const saintOfTheDay = document.getElementById('saintOfTheDay');
            
            if (data.celebracao && liturgicalCelebration) liturgicalCelebration.textContent = data.celebracao;
            if (data.santo_do_dia && saintOfTheDay) saintOfTheDay.textContent = `Santo do Dia: ${data.santo_do_dia}`;
            
            const colors = { 'Verde': '#2d5a27', 'Roxo': '#4a148c', 'Branco': '#2c3e6b', 'Vermelho': '#b71c1c' };
            if (liturgicalBar && data.cor) liturgicalBar.style.backgroundColor = colors[data.cor] || '#2c3e6b';
        } catch (e) {
            console.error("Erro Liturgia:", e);
        }
    }

    // Se já tiver nome, inicia direto
    if (userName) {
        if (welcomeModal) welcomeModal.classList.remove('show');
        initApp();
    } else {
        if (welcomeModal) welcomeModal.classList.add('show');
    }
});