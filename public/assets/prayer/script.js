const firebaseConfig = {
    apiKey: "AIzaSyC034nd6mDpq8wAK_snVHg6nnbTvWSzNws",
    authDomain: "equipes-nossa-senhora.firebaseapp.com",
    projectId: "equipes-nossa-senhora",
    storageBucket: "equipes-nossa-senhora.firebasestorage.app",
    messagingSenderId: "814719609165",
    appId: "1:814719609165:web:c5776b1b28c43fe1b86f04"
};

// Inicialização segura do Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
}

document.addEventListener('DOMContentLoaded', function() {
    // --- Seleção de Elementos ---
    const welcomeModal = document.getElementById('welcomeModal');
    const startAppBtn = document.getElementById('startAppBtn');
    const userNameInput = document.getElementById('userNameInput');
    const mainView = document.getElementById('mainView');
    
    // Outros elementos (com verificação de existência)
    const monthlyCountElement = document.getElementById('monthlyCount');
    const streakCountElement = document.getElementById('streakCount');
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonthLabel = document.getElementById('calendarMonth');
    const liturgicalBar = document.getElementById('liturgicalBar');
    const methodBtns = document.querySelectorAll('.method-btn');
    const themeToggle = document.getElementById('themeToggle');

    // --- Estado e Configurações ---
    const STORAGE_KEY_COMPLETED = 'prayerCompletedDaysList';
    const STORAGE_KEY_USER_ID = 'prayerUserId';
    const STORAGE_KEY_USER_NAME = 'prayerUserName';
    
    let completedDays = [];
    try {
        completedDays = JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED) || '[]');
    } catch(e) {}

    let today = new Date();
    let userId = localStorage.getItem(STORAGE_KEY_USER_ID);
    let userName = localStorage.getItem(STORAGE_KEY_USER_NAME);
    let gospelData = null;

    // --- Lógica do Botão "Começar" (Configurada cedo para garantir funcionamento) ---
    if (startAppBtn) {
        startAppBtn.onclick = async function() {
            const name = userNameInput ? userNameInput.value.trim() : '';
            if (name) {
                console.log("Iniciando app para:", name);
                userName = name;
                try {
                    localStorage.setItem(STORAGE_KEY_USER_NAME, name);
                } catch(e) {}
                
                if (welcomeModal) welcomeModal.classList.remove('show');
                await init();
            } else {
                alert("Por favor, digite seu nome.");
            }
        };
    }

    // --- Funções de Inicialização ---
    async function init() {
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            try { localStorage.setItem(STORAGE_KEY_USER_ID, userId); } catch(e) {}
        }

        if (!userName) {
            if (welcomeModal) welcomeModal.classList.add('show');
            return;
        }

        // Se já temos o nome, garantimos que o modal suma
        if (welcomeModal) welcomeModal.classList.remove('show');

        // Atualiza UI básica
        const headerNames = document.getElementById('headerNames');
        if (headerNames) headerNames.textContent = userName;

        // Sincroniza com Firebase se disponível
        if (db) {
            try {
                await db.collection('users').doc(userId).set({ 
                    name: userName, 
                    lastActive: Date.now() 
                }, { merge: true });
            } catch (e) { console.warn("Erro ao sincronizar usuário:", e); }
        }

        // Carrega o restante do app
        updateDayCounter();
        fetchLiturgia();
        if (calendarGrid && calendarMonthLabel) {
            renderCalendar(today.getMonth(), today.getFullYear(), calendarGrid, calendarMonthLabel);
        }
    }

    function updateDayCounter() {
        const currentMonthPrefix = `${today.getFullYear()}-${today.getMonth() + 1}-`;
        const count = completedDays.filter(d => d.startsWith(currentMonthPrefix)).length;
        if (monthlyCountElement) monthlyCountElement.textContent = `🔥 ${count} dias este mês`;
        
        // Cálculo simples de streak
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
            
            if (data.evangelho) gospelData = data.evangelho;
        } catch (e) { console.error("Erro ao buscar liturgia:", e); }
    }

    function renderCalendar(month, year, grid, label) {
        grid.innerHTML = '';
        const date = new Date(year, month, 1);
        label.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
        
        const firstDay = date.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = day;
            const dateString = `${year}-${month + 1}-${day}`;
            if (day === today.getDate() && month === today.getMonth()) dayDiv.classList.add('today');
            if (completedDays.includes(dateString)) dayDiv.classList.add('completed');
            grid.appendChild(dayDiv);
        }
    }

    // --- Inicialização ---
    init();
});