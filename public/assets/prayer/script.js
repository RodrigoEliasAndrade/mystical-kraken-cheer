const firebaseConfig = {
    apiKey: "AIzaSyC034nd6mDpq8wAK_snVHg6nnbTvWSzNws",
    authDomain: "equipes-nossa-senhora.firebaseapp.com",
    projectId: "equipes-nossa-senhora",
    storageBucket: "equipes-nossa-senhora.firebasestorage.app",
    messagingSenderId: "814719609165",
    appId: "1:814719609165:web:c5776b1b28c43fe1b86f04"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mainView = document.getElementById('mainView');
    const markAsDoneButton = document.getElementById('markAsDone');
    const sliderWrapper = document.getElementById('sliderWrapper');
    const cardsWrapper = document.getElementById('cardsWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressIndicator = document.getElementById('progressIndicator');
    const monthlyCountElement = document.getElementById('monthlyCount');
    const streakCountElement = document.getElementById('streakCount');
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonthLabel = document.getElementById('calendarMonth');
    const liturgicalBar = document.getElementById('liturgicalBar');
    const appHeader = document.getElementById('appHeader');
    const methodBtns = document.querySelectorAll('.method-btn');
    const prayerActions = document.getElementById('prayerActions');
    const successOverlay = document.getElementById('successOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationMenu = document.getElementById('notificationMenu');
    const commonPrayersBtn = document.getElementById('commonPrayersBtn');

    // Modals
    const pceModal = document.getElementById('pceModal');
    const pceHistoryModal = document.getElementById('pceHistoryModal');
    const wordModal = document.getElementById('wordModal');
    const sitDownModal = document.getElementById('sitDownModal');
    const sitDownGuideModal = document.getElementById('sitDownGuideModal');
    const ruleOfLifeModal = document.getElementById('ruleOfLifeModal');
    const meditationModal = document.getElementById('meditationModal');
    const retreatModal = document.getElementById('retreatModal');
    const coupleModal = document.getElementById('coupleModal');
    const diaryModal = document.getElementById('diaryModal');
    const diaryDetailModal = document.getElementById('diaryDetailModal');
    const welcomeModal = document.getElementById('welcomeModal');
    const commonPrayersModal = document.getElementById('commonPrayersModal');
    const prayerDetailModal = document.getElementById('prayerDetailModal');

    // Nav Items
    const navHome = document.getElementById('navHome');
    const navPce = document.getElementById('navPce');
    const navDiary = document.getElementById('navDiary');
    const navCouple = document.getElementById('navCouple');

    // Buttons
    const startAppBtn = document.getElementById('startAppBtn'); // Adicionado aqui
    const nudgeBtn = document.getElementById('nudgeBtn');
    const saveWord = document.getElementById('saveWord');
    const saveSitDown = document.getElementById('saveSitDown');
    const sitDownGuideBtn = document.getElementById('sitDownGuideBtn');
    const saveRuleOfLife = document.getElementById('saveRuleOfLife');
    const saveMeditation = document.getElementById('saveMeditation');
    const saveRetreat = document.getElementById('saveRetreat');
    const addIntentionBtn = document.getElementById('addIntentionBtn');
    const shareBtn = document.getElementById('shareBtn');
    const generateInviteBtn = document.getElementById('generateInviteBtn');
    const joinCoupleBtn = document.getElementById('joinCoupleBtn');
    const saveConjugalTime = document.getElementById('saveConjugalTime');
    const saveNotif = document.getElementById('saveNotif');
    const shareReflectionBtn = document.getElementById('shareReflectionBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const pceHistoryBtn = document.getElementById('pceHistoryBtn');
    const shareAppBtn = document.getElementById('shareAppBtn');

    // State
    const STORAGE_KEY_COMPLETED = 'prayerCompletedDaysList';
    const STORAGE_KEY_USER_ID = 'prayerUserId';
    const STORAGE_KEY_USER_NAME = 'prayerUserName';
    const STORAGE_KEY_THEME = 'prayerTheme';
    const STORAGE_KEY_NOTIF = 'prayerNotifSettings';
    
    let completedDays = JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED) || '[]');
    let today = new Date();
    let gospelData = null;
    let currentMethod = null;
    let currentCardIndex = 0;
    let allCardsData = [];
    let userId = localStorage.getItem(STORAGE_KEY_USER_ID);
    let userName = localStorage.getItem(STORAGE_KEY_USER_NAME);
    let coupleId = null;
    let partnerId = null;
    let conjugalTime = null;
    let partnerUnsubscribe = null;
    let nudgeUnsubscribe = null;
    let intentionsUnsubscribe = null;
    let timerInterval = null;
    let currentDiaryEntry = null;
    let allDiaryEntries = [];
    let currentAudio = null;

    const commonPrayers = [
        {
            title: "Magnificat",
            text: "A minha alma engrandece o Senhor,\ne o meu espírito se alegra em Deus, meu Salvador.\nPorque pôs os olhos na humildade da sua serva:\nde hoje em diante me chamarão bem-aventurada todas as gerações.\nO Todo-Poderoso fez em mim maravilhas:\nSanto é o seu nome.\nA sua misericórdia se estende de geração em geração\nsobre aqueles que O temem.\nManifestou o poder do seu braço\ne dispersou os soberbos.\nDerrubou os poderosos de seus tronos\ne exaltou os humildes.\nAos famintos encheu de bens\ne aos ricos despediu de mãos vazias.\nAcolheu a Israel, seu servo,\nlembrado da sua misericórdia,\ncomo tinha proibido a nossos pais,\na Abraão e à sua descendência para sempre.\nGlória ao Pai e ao Filho e ao Espírito Santo,\ncomo era no princípio, agora e sempre. Amém."
        },
        {
            title: "Oração da Equipe",
            text: "Senhor, fazei que a nossa Equipe seja um lugar de acolhimento, de escuta e de partilha.\nQue saibamos nos amar como Vós nos amastes.\nQue a nossa união seja sinal da Vossa presença no meio de nós.\nDai-nos a graça de sermos fiéis aos nossos compromissos e de crescermos juntos na fé e no amor.\nMaria, Mãe das Equipes, rogai por nós."
        },
        {
            title: "Oração ao Espírito Santo",
            text: "Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.\nEnviai o vosso Espírito e tudo será criado, e renovareis a face da terra.\nOremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolação. Por Cristo, Senhor nosso. Amém."
        }
    ];

    // Theme Logic
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.onclick = () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem(STORAGE_KEY_THEME, next);
        };
    }

    // Notification Logic
    if (notificationBtn) {
        notificationBtn.onclick = () => notificationMenu.classList.toggle('show');
    }
    
    const savedNotifSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_NOTIF) || '{"enabled":false,"time":"08:00"}');
    const notifToggle = document.getElementById('notifToggle');
    const notifTime = document.getElementById('notifTime');
    if (notifToggle) notifToggle.checked = savedNotifSettings.enabled;
    if (notifTime) notifTime.value = savedNotifSettings.time;
    if (savedNotifSettings.enabled && notificationBtn) notificationBtn.classList.replace('inactive', 'active');

    if (saveNotif) {
        saveNotif.onclick = () => {
            const enabled = document.getElementById('notifToggle').checked;
            const time = document.getElementById('notifTime').value;
            localStorage.setItem(STORAGE_KEY_NOTIF, JSON.stringify({ enabled, time }));
            if (notificationBtn) {
                notificationBtn.classList.toggle('active', enabled);
                notificationBtn.classList.toggle('inactive', !enabled);
            }
            notificationMenu.classList.remove('show');
            alert("Configurações de lembrete salvas!");
        };
    }

    if (shareAppBtn) {
        shareAppBtn.onclick = () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Equipes de Nossa Senhora - Oração Diária',
                    text: 'Venha rezar e acompanhar seus PCEs conosco! 🙏',
                    url: window.location.href
                });
            } else {
                alert("Link do App: " + window.location.href);
            }
        };
    }

    // Common Prayers Logic
    if (commonPrayersBtn) {
        commonPrayersBtn.onclick = () => {
            const list = document.getElementById('prayerLibraryList');
            if (list) {
                list.innerHTML = '';
                commonPrayers.forEach(prayer => {
                    const item = document.createElement('div');
                    item.className = 'prayer-library-item';
                    item.innerHTML = `
                        <div class="prayer-library-title">${prayer.title}</div>
                        <div class="prayer-library-preview">${prayer.text.substring(0, 60)}...</div>
                    `;
                    item.onclick = () => {
                        document.getElementById('prayerDetailTitle').textContent = prayer.title;
                        document.getElementById('prayerDetailText').textContent = prayer.text;
                        prayerDetailModal.classList.add('show');
                    };
                    list.appendChild(item);
                });
            }
            commonPrayersModal.classList.add('show');
        };
    }

    const closeCommonPrayersModal = document.getElementById('closeCommonPrayersModal');
    if (closeCommonPrayersModal) closeCommonPrayersModal.onclick = () => commonPrayersModal.classList.remove('show');
    
    const closePrayerDetailModal = document.getElementById('closePrayerDetailModal');
    if (closePrayerDetailModal) closePrayerDetailModal.onclick = () => prayerDetailModal.classList.remove('show');

    // Initialization
    async function init() {
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(STORAGE_KEY_USER_ID, userId);
        }
        if (!userName) {
            welcomeModal.classList.add('show');
        } else {
            const displayMyName = document.getElementById('displayMyName');
            if (displayMyName) displayMyName.textContent = userName;
            await syncUser();
        }
        if (calendarGrid && calendarMonthLabel) {
            renderCalendar(today.getMonth(), today.getFullYear(), calendarGrid, calendarMonthLabel);
        }
        updateDayCounter();
        fetchLiturgia();
        loadHomePCEs();
    }

    async function syncUser() {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({ name: userName, coupleId: null });
        } else {
            const data = doc.data();
            coupleId = data.coupleId;
            if (coupleId) setupCoupleListeners();
        }
        const headerNames = document.getElementById('headerNames');
        if (headerNames) headerNames.textContent = userName;
    }

    async function loadHomePCEs() {
        const ruleDoc = await db.collection('users').doc(userId).collection('pces').doc('ruleoflife').get();
        const homeRuleValue = document.getElementById('homeRuleValue');
        if (ruleDoc.exists && homeRuleValue) {
            homeRuleValue.textContent = ruleDoc.data().text || 'Nenhuma regra definida.';
        }
        const wordDoc = await db.collection('users').doc(userId).collection('pces').doc('word').get();
        const homeWordValue = document.getElementById('homeWordValue');
        if (wordDoc.exists && homeWordValue) {
            homeWordValue.textContent = wordDoc.data().passage || 'Nenhum registro recente.';
        }
    }

    function setupCoupleListeners() {
        if (!coupleId) return;
        db.collection('couples').doc(coupleId).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                partnerId = data.partner1 === userId ? data.partner2 : data.partner1;
                const partnerName = data.partner1 === userId ? data.partner2Name : data.partner1Name;
                if (partnerId) {
                    const partnerNameEl = document.getElementById('partnerName');
                    if (partnerNameEl) partnerNameEl.textContent = partnerName;
                    const headerNames = document.getElementById('headerNames');
                    if (headerNames) headerNames.textContent = `${userName} & ${partnerName}`;
                    
                    const notConnectedView = document.getElementById('notConnectedView');
                    const connectedView = document.getElementById('connectedView');
                    if (notConnectedView) notConnectedView.style.display = 'none';
                    if (connectedView) connectedView.style.display = 'block';
                    
                    setupPartnerStatusListener();
                    setupNudgeListener();
                    setupIntentionsListener();
                }
                if (data.conjugalTime) {
                    conjugalTime = data.conjugalTime;
                    const conjugalTimeInput = document.getElementById('conjugalTimeInput');
                    if (conjugalTimeInput) conjugalTimeInput.value = conjugalTime;
                }
            }
        });
    }

    // Invite System Logic
    if (generateInviteBtn) {
        generateInviteBtn.onclick = async () => {
            const code = Math.random().toString(36).substr(2, 6).toUpperCase();
            await db.collection('invites').doc(code).set({
                creatorId: userId,
                creatorName: userName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            const inviteLinkInput = document.getElementById('inviteLinkInput');
            const inviteLinkArea = document.getElementById('inviteLinkArea');
            if (inviteLinkInput) inviteLinkInput.value = code;
            if (inviteLinkArea) inviteLinkArea.style.display = 'block';
        };
    }

    if (joinCoupleBtn) {
        joinCoupleBtn.onclick = async () => {
            const joinCodeInput = document.getElementById('joinCodeInput');
            const code = joinCodeInput ? joinCodeInput.value.trim().toUpperCase() : '';
            if (!code) return;
            
            const inviteDoc = await db.collection('invites').doc(code).get();
            if (inviteDoc.exists) {
                const inviteData = inviteDoc.data();
                const newCoupleId = 'couple_' + Math.random().toString(36).substr(2, 9);
                
                await db.collection('couples').doc(newCoupleId).set({
                    partner1: inviteData.creatorId,
                    partner1Name: inviteData.creatorName,
                    partner2: userId,
                    partner2Name: userName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                await db.collection('users').doc(userId).update({ coupleId: newCoupleId });
                await db.collection('users').doc(inviteData.creatorId).update({ coupleId: newCoupleId });
                await db.collection('invites').doc(code).delete();
                
                alert("Conectado com sucesso!");
                location.reload();
            } else {
                alert("Código inválido ou expirado.");
            }
        };
    }

    if (disconnectBtn) {
        disconnectBtn.onclick = async () => {
            if (confirm("Tem certeza que deseja desconectar do seu cônjuge?")) {
                if (coupleId) {
                    await db.collection('users').doc(userId).update({ coupleId: null });
                    if (partnerId) await db.collection('users').doc(partnerId).update({ coupleId: null });
                    await db.collection('couples').doc(coupleId).delete();
                    alert("Desconectado com sucesso.");
                    location.reload();
                }
            }
        };
    }

    if (saveConjugalTime) {
        saveConjugalTime.onclick = async () => {
            const conjugalTimeInput = document.getElementById('conjugalTimeInput');
            const time = conjugalTimeInput ? conjugalTimeInput.value : '';
            if (time && coupleId) {
                await db.collection('couples').doc(coupleId).update({ conjugalTime: time });
                alert("Horário da Oração Conjugal salvo!");
            }
        };
    }

    function setupPartnerStatusListener() {
        if (!partnerId) return;
        if (partnerUnsubscribe) partnerUnsubscribe();
        const dateKey = getCurrentDateKey();
        partnerUnsubscribe = db.collection('users').doc(partnerId).collection('prayers').doc(dateKey).onSnapshot(doc => {
            const statusText = document.getElementById('partnerStatusText');
            if (statusText) {
                if (doc.exists) {
                    statusText.innerHTML = `✅ Seu cônjuge já rezou hoje!`;
                    statusText.style.color = 'var(--success)';
                } else {
                    statusText.innerHTML = `⏳ Seu cônjuge ainda não rezou hoje.`;
                    statusText.style.color = 'var(--text-muted)';
                }
            }
            checkAIAdvice();
        });
    }

    function setupNudgeListener() {
        if (nudgeUnsubscribe) nudgeUnsubscribe();
        nudgeUnsubscribe = db.collection('users').doc(userId).onSnapshot(doc => {
            const data = doc.data();
            if (data && data.lastNudge && data.lastNudge > (Date.now() - 60000)) {
                if (Notification.permission === 'granted') {
                    new Notification("Toque de Oração", { body: "Seu cônjuge está te chamando para rezar! 🙏" });
                } else {
                    alert("🔔 Toque de Oração: Seu cônjuge está te chamando para rezar!");
                }
            }
        });
    }

    function setupIntentionsListener() {
        if (!coupleId) return;
        if (intentionsUnsubscribe) intentionsUnsubscribe();
        intentionsUnsubscribe = db.collection('couples').doc(coupleId).collection('intentions').orderBy('createdAt', 'desc').limit(15).onSnapshot(snapshot => {
            const list = document.getElementById('intentionsList');
            if (list) {
                list.innerHTML = '';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const item = document.createElement('div');
                    item.className = `intention-item ${data.prayed ? 'prayed' : ''}`;
                    item.innerHTML = `
                        <span class="intention-text">${data.text}</span>
                        <span class="intention-author">${data.author}</span>
                        <span class="delete-intention" data-id="${doc.id}">🗑️</span>
                    `;
                    item.onclick = async (e) => {
                        if (e.target.classList.contains('delete-intention')) {
                            if (confirm("Excluir esta intenção?")) {
                                await db.collection('couples').doc(coupleId).collection('intentions').doc(doc.id).delete();
                            }
                            return;
                        }
                        await db.collection('couples').doc(coupleId).collection('intentions').doc(doc.id).update({ prayed: !data.prayed });
                    };
                    list.appendChild(item);
                });
            }
        });
    }

    if (addIntentionBtn) {
        addIntentionBtn.onclick = async () => {
            const input = document.getElementById('intentionInput');
            const text = input ? input.value.trim() : '';
            if (text && coupleId) {
                await db.collection('couples').doc(coupleId).collection('intentions').add({
                    text,
                    author: userName,
                    prayed: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                if (input) input.value = '';
            }
        };
    }

    if (nudgeBtn) {
        nudgeBtn.onclick = async () => {
            if (!partnerId) return;
            await db.collection('users').doc(partnerId).update({ lastNudge: Date.now() });
            alert("Toque de oração enviado!");
        };
    }

    // Navigation Logic
    function setActiveNav(id) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const navItem = document.getElementById(id);
        if (navItem) navItem.classList.add('active');
    }

    if (navHome) navHome.onclick = () => { setActiveNav('navHome'); if (mainView) mainView.style.display = 'flex'; loadHomePCEs(); };
    if (navPce) navPce.onclick = () => { setActiveNav('navPce'); pceModal.classList.add('show'); updatePceStats(); };
    if (navDiary) navDiary.onclick = () => { setActiveNav('navDiary'); diaryModal.classList.add('show'); loadDiary(); };
    if (navCouple) navCouple.onclick = () => { setActiveNav('navCouple'); coupleModal.classList.add('show'); };

    // PCE Logic
    async function updatePceStats() {
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const monthPrefix = `${today.getFullYear()}-${today.getMonth() + 1}-`;
        
        const wordSnapshot = await db.collection('users').doc(userId).collection('pces').doc('word').get();
        const wordCompleted = wordSnapshot.exists ? 100 : 0;
        
        const completedInMonth = completedDays.filter(d => d.startsWith(monthPrefix)).length;
        const conjugalPerc = Math.round((completedInMonth / daysInMonth) * 100);
        
        const sitSnapshot = await db.collection('users').doc(userId).collection('pces').doc('sitdown').get();
        const sitPerc = sitSnapshot.exists ? 100 : 0;
        
        const ruleSnapshot = await db.collection('users').doc(userId).collection('pces').doc('ruleoflife').get();
        const rulePerc = ruleSnapshot.exists ? 100 : 0;

        const medSnapshot = await db.collection('users').doc(userId).collection('pces').doc('meditation').get();
        const medPerc = medSnapshot.exists ? 100 : 0;

        const retSnapshot = await db.collection('users').doc(userId).collection('pces').doc('retreat').get();
        const retPerc = retSnapshot.exists ? 100 : 0;

        const stats = [
            { id: 'statBar1', valId: 'statVal1', perc: wordCompleted },
            { id: 'statBar2', valId: 'statVal2', perc: conjugalPerc },
            { id: 'statBar3', valId: 'statVal3', perc: sitPerc },
            { id: 'statBar4', valId: 'statVal4', perc: rulePerc },
            { id: 'statBar5', valId: 'statVal5', perc: medPerc },
            { id: 'statBar6', valId: 'statVal6', perc: retPerc }
        ];

        stats.forEach(s => {
            const bar = document.getElementById(s.id);
            const val = document.getElementById(s.valId);
            if (bar) bar.style.width = `${s.perc}%`;
            if (val) val.textContent = `${s.perc}%`;
        });
    }

    if (pceHistoryBtn) {
        pceHistoryBtn.onclick = async () => {
            const list = document.getElementById('pceHistoryList');
            if (list) list.innerHTML = '<p>Carregando histórico...</p>';
            pceHistoryModal.classList.add('show');
            
            const snapshot = await db.collection('users').doc(userId).collection('pce_history').orderBy('timestamp', 'desc').limit(30).get();
            if (list) {
                list.innerHTML = '';
                if (snapshot.empty) {
                    list.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Nenhum histórico encontrado.</p>';
                } else {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const item = document.createElement('div');
                        item.style.marginBottom = '18px';
                        item.style.padding = '12px';
                        item.style.borderBottom = '1px solid var(--border)';
                        item.innerHTML = `
                            <div style="font-weight:700; color:var(--accent); font-size:0.85em; letter-spacing:0.5px;">${data.type.toUpperCase()} - ${data.date}</div>
                            <div style="font-size:0.95em; margin-top:6px; line-height:1.4;">${data.content}</div>
                        `;
                        list.appendChild(item);
                    });
                }
            }
        };
    }

    const pce1Btn = document.getElementById('pce1Btn');
    if (pce1Btn) pce1Btn.onclick = () => { pceModal.classList.remove('show'); wordModal.classList.add('show'); loadWord(); };
    
    const pce2Btn = document.getElementById('pce2Btn');
    if (pce2Btn) pce2Btn.onclick = () => { pceModal.classList.remove('show'); navCouple.click(); };
    
    const pce3Btn = document.getElementById('pce3Btn');
    if (pce3Btn) pce3Btn.onclick = () => { pceModal.classList.remove('show'); sitDownModal.classList.add('show'); loadSitDown(); };
    
    const pce4Btn = document.getElementById('pce4Btn');
    if (pce4Btn) pce4Btn.onclick = () => { pceModal.classList.remove('show'); ruleOfLifeModal.classList.add('show'); loadRuleOfLife(); };
    
    const pce5Btn = document.getElementById('pce5Btn');
    if (pce5Btn) pce5Btn.onclick = () => { pceModal.classList.remove('show'); meditationModal.classList.add('show'); loadMeditation(); };
    
    const pce6Btn = document.getElementById('pce6Btn');
    if (pce6Btn) pce6Btn.onclick = () => { pceModal.classList.remove('show'); retreatModal.classList.add('show'); loadRetreat(); };

    async function loadWord() {
        const doc = await db.collection('users').doc(userId).collection('pces').doc('word').get();
        if (doc.exists) {
            const data = doc.data();
            const wordPassage = document.getElementById('wordPassage');
            const wordKeyWord = document.getElementById('wordKeyWord');
            if (wordPassage) wordPassage.value = data.passage || '';
            if (wordKeyWord) wordKeyWord.value = data.keyWord || '';
        }
    }

    if (saveWord) {
        saveWord.onclick = async () => {
            const passage = document.getElementById('wordPassage').value;
            const keyWord = document.getElementById('wordKeyWord').value;
            const dateKey = getCurrentDateKey();
            await db.collection('users').doc(userId).collection('pces').doc('word').set({ passage, keyWord, updatedAt: Date.now() });
            await db.collection('users').doc(userId).collection('pce_history').add({
                type: 'Escuta da Palavra', date: dateKey, content: `Passagem: ${passage}\nPalavra: ${keyWord}`, timestamp: Date.now()
            });
            alert("Escuta da Palavra salva!");
            wordModal.classList.remove('show');
        };
    }

    async function loadSitDown() {
        const doc = await db.collection('users').doc(userId).collection('pces').doc('sitdown').get();
        if (doc.exists) {
            const data = doc.data();
            const sitDownDate = document.getElementById('sitDownDate');
            const sitDownNotes = document.getElementById('sitDownNotes');
            if (sitDownDate) sitDownDate.value = data.date || '';
            if (sitDownNotes) sitDownNotes.value = data.notes || '';
        }
    }

    if (sitDownGuideBtn) sitDownGuideBtn.onclick = () => sitDownGuideModal.classList.add('show');
    const closeSitDownGuideModal = document.getElementById('closeSitDownGuideModal');
    if (closeSitDownGuideModal) closeSitDownGuideModal.onclick = () => sitDownGuideModal.classList.remove('show');

    if (saveSitDown) {
        saveSitDown.onclick = async () => {
            const date = document.getElementById('sitDownDate').value;
            const notes = document.getElementById('sitDownNotes').value;
            await db.collection('users').doc(userId).collection('pces').doc('sitdown').set({ date, notes, updatedAt: Date.now() });
            await db.collection('users').doc(userId).collection('pce_history').add({
                type: 'Dever de Sentar-se', date: date, content: notes, timestamp: Date.now()
            });
            alert("Dever de Sentar-se salvo!");
            sitDownModal.classList.remove('show');
        };
    }

    async function loadRuleOfLife() {
        const doc = await db.collection('users').doc(userId).collection('pces').doc('ruleoflife').get();
        if (doc.exists) {
            const ruleOfLifeText = document.getElementById('ruleOfLifeText');
            if (ruleOfLifeText) ruleOfLifeText.value = doc.data().text || '';
        }
    }

    if (saveRuleOfLife) {
        saveRuleOfLife.onclick = async () => {
            const text = document.getElementById('ruleOfLifeText').value;
            const dateKey = getCurrentDateKey();
            await db.collection('users').doc(userId).collection('pces').doc('ruleoflife').set({ text, updatedAt: Date.now() });
            await db.collection('users').doc(userId).collection('pce_history').add({
                type: 'Regra de Vida', date: dateKey, content: text, timestamp: Date.now()
            });
            alert("Regra de Vida salva!");
            ruleOfLifeModal.classList.remove('show');
        };
    }

    async function loadMeditation() {
        const doc = await db.collection('users').doc(userId).collection('pces').doc('meditation').get();
        if (doc.exists) {
            const data = doc.data();
            const meditationDuration = document.getElementById('meditationDuration');
            const meditationNotes = document.getElementById('meditationNotes');
            if (meditationDuration) meditationDuration.value = data.duration || '';
            if (meditationNotes) meditationNotes.value = data.notes || '';
        }
    }

    if (saveMeditation) {
        saveMeditation.onclick = async () => {
            const duration = document.getElementById('meditationDuration').value;
            const notes = document.getElementById('meditationNotes').value;
            const dateKey = getCurrentDateKey();
            await db.collection('users').doc(userId).collection('pces').doc('meditation').set({ duration, notes, updatedAt: Date.now() });
            await db.collection('users').doc(userId).collection('pce_history').add({
                type: 'Oração Pessoal', date: dateKey, content: `Duração: ${duration}min\nNotas: ${notes}`, timestamp: Date.now()
            });
            alert("Oração Pessoal salva!");
            meditationModal.classList.remove('show');
        };
    }

    async function loadRetreat() {
        const doc = await db.collection('users').doc(userId).collection('pces').doc('retreat').get();
        if (doc.exists) {
            const data = doc.data();
            const retreatDate = document.getElementById('retreatDate');
            const retreatNotes = document.getElementById('retreatNotes');
            if (retreatDate) retreatDate.value = data.date || '';
            if (retreatNotes) retreatNotes.value = data.notes || '';
        }
    }

    if (saveRetreat) {
        saveRetreat.onclick = async () => {
            const date = document.getElementById('retreatDate').value;
            const notes = document.getElementById('retreatNotes').value;
            const dateKey = getCurrentDateKey();
            await db.collection('users').doc(userId).collection('pces').doc('retreat').set({ date, notes, updatedAt: Date.now() });
            await db.collection('users').doc(userId).collection('pce_history').add({
                type: 'Retiro Anual', date: date, content: notes, timestamp: Date.now()
            });
            alert("Retiro Anual salva!");
            retreatModal.classList.remove('show');
        };
    }

    const closeWordModal = document.getElementById('closeWordModal');
    if (closeWordModal) closeWordModal.onclick = () => wordModal.classList.remove('show');
    
    const closeSitDownModal = document.getElementById('closeSitDownModal');
    if (closeSitDownModal) closeSitDownModal.onclick = () => sitDownModal.classList.remove('show');
    
    const closeRuleOfLifeModal = document.getElementById('closeRuleOfLifeModal');
    if (closeRuleOfLifeModal) closeRuleOfLifeModal.onclick = () => ruleOfLifeModal.classList.remove('show');
    
    const closeMeditationModal = document.getElementById('closeMeditationModal');
    if (closeMeditationModal) closeMeditationModal.onclick = () => meditationModal.classList.remove('show');
    
    const closeRetreatModal = document.getElementById('closeRetreatModal');
    if (closeRetreatModal) closeRetreatModal.onclick = () => retreatModal.classList.remove('show');
    
    const closePceModal = document.getElementById('closePceModal');
    if (closePceModal) closePceModal.onclick = () => { pceModal.classList.remove('show'); setActiveNav('navHome'); };
    
    const closePceHistoryModal = document.getElementById('closePceHistoryModal');
    if (closePceHistoryModal) closePceHistoryModal.onclick = () => pceHistoryModal.classList.remove('show');

    // Diary Logic
    async function loadDiary() {
        const list = document.getElementById('diaryList');
        if (list) list.innerHTML = '<p>Carregando...</p>';
        const snapshot = await db.collection('users').doc(userId).collection('prayers').orderBy('timestamp', 'desc').limit(50).get();
        allDiaryEntries = [];
        snapshot.forEach(doc => allDiaryEntries.push(doc.data()));
        renderDiaryList(allDiaryEntries);
    }

    function renderDiaryList(entries) {
        const list = document.getElementById('diaryList');
        if (list) {
            list.innerHTML = '';
            if (entries.length === 0) {
                list.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Nenhuma oração encontrada.</p>';
                return;
            }
            entries.forEach(data => {
                const item = document.createElement('div');
                item.className = 'diary-item';
                item.innerHTML = `<div class="diary-date">${data.date}</div><div class="diary-method">${data.method || 'Simples'}</div>`;
                item.onclick = () => showDiaryDetail(data);
                list.appendChild(item);
            });
        }
    }

    const diarySearch = document.getElementById('diarySearch');
    if (diarySearch) {
        diarySearch.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allDiaryEntries.filter(entry => {
                const dateMatch = entry.date.toLowerCase().includes(term);
                const methodMatch = (entry.method || '').toLowerCase().includes(term);
                const gospelMatch = entry.gospel && entry.gospel.referencia.toLowerCase().includes(term);
                let reflectionMatch = false;
                if (entry.reflections) {
                    reflectionMatch = Object.values(entry.reflections).some(val => val.toLowerCase().includes(term));
                }
                return dateMatch || methodMatch || gospelMatch || reflectionMatch;
            });
            renderDiaryList(filtered);
        };
    }

    function showDiaryDetail(data) {
        currentDiaryEntry = data;
        const content = document.getElementById('detailContent');
        const detailDate = document.getElementById('detailDate');
        if (detailDate) detailDate.textContent = data.date;
        let html = `<p><strong>Método:</strong> ${data.method || 'Simples'}</p>`;
        if (data.gospel) html += `<p><strong>Evangelho:</strong> ${data.gospel.referencia}</p>`;
        if (data.reflections) {
            Object.entries(data.reflections).forEach(([key, val]) => {
                if (val) html += `<div style="margin-top:15px;"><strong style="text-transform:capitalize;">${key}:</strong><p>${val}</p></div>`;
            });
        }
        if (content) content.innerHTML = html;
        diaryDetailModal.classList.add('show');
    }

    if (shareReflectionBtn) {
        shareReflectionBtn.onclick = () => {
            if (!currentDiaryEntry) return;
            let text = `*Minha Oração - ${currentDiaryEntry.date}*\n\n`;
            if (currentDiaryEntry.gospel) text += `Evangelho: ${currentDiaryEntry.gospel.referencia}\n\n`;
            if (currentDiaryEntry.reflections) {
                Object.entries(currentDiaryEntry.reflections).forEach(([key, val]) => {
                    if (val) text += `*${key.toUpperCase()}*:\n${val}\n\n`;
                });
            }
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        };
    }

    const closeDiaryDetailModal = document.getElementById('closeDiaryDetailModal');
    if (closeDiaryDetailModal) closeDiaryDetailModal.onclick = () => diaryDetailModal.classList.remove('show');
    
    const closeDiaryModal = document.getElementById('closeDiaryModal');
    if (closeDiaryModal) closeDiaryModal.onclick = () => { diaryModal.classList.remove('show'); setActiveNav('navHome'); };

    // AI Advice
    async function checkAIAdvice() {
        if (!conjugalTime || !partnerId) return;
        const now = new Date();
        const [h, m] = conjugalTime.split(':').map(Number);
        const scheduled = new Date();
        scheduled.setHours(h, m, 0);
        
        const dateKey = getCurrentDateKey();
        const partnerDoc = await db.collection('users').doc(partnerId).collection('prayers').doc(dateKey).get();
        
        const aiAdviceArea = document.getElementById('aiAdviceArea');
        const aiAdviceText = document.getElementById('aiAdviceText');
        
        if (now > scheduled && !partnerDoc.exists) {
            if (aiAdviceArea) aiAdviceArea.style.display = 'block';
            const advices = [
                "A paciência é o tempero do amor. Talvez seu cônjuge precise de um incentivo carinhoso agora.",
                "A oração conjugal é o coração da ENS. Se o horário passou, que tal propor um momento curto de silêncio juntos?",
                "Deus habita no meio de vocês. Use este tempo de espera para agradecer por uma qualidade do seu cônjuge.",
                "A união é construída nos pequenos gestos. Envie um 'Toque de Oração' para mostrar que você está esperando."
            ];
            if (aiAdviceText) aiAdviceText.textContent = advices[Math.floor(Math.random() * advices.length)];
        } else {
            if (aiAdviceArea) aiAdviceArea.style.display = 'none';
        }
    }

    // Core Functions
    function getCurrentDateKey() { return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`; }

    function updateDayCounter() {
        const currentMonthPrefix = `${today.getFullYear()}-${today.getMonth() + 1}-`;
        const count = completedDays.filter(d => d.startsWith(currentMonthPrefix)).length;
        if (monthlyCountElement) monthlyCountElement.textContent = `🔥 ${count} dias este mês`;
        
        // Calculate Streak
        let streak = 0;
        let checkDate = new Date();
        while (true) {
            const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
            if (completedDays.includes(key)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                if (streak === 0) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    const yesterdayKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
                    if (completedDays.includes(yesterdayKey)) {
                        checkDate.setDate(checkDate.getDate());
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        if (streakCountElement) streakCountElement.textContent = `⚡ ${streak} dias seguidos`;
    }

    function renderCalendar(month, year, grid, label) {
        const headers = grid.querySelectorAll('.calendar-day-name');
        grid.innerHTML = '';
        headers.forEach(h => grid.appendChild(h));
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
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) dayDiv.classList.add('today');
            if (completedDays.includes(dateString)) dayDiv.classList.add('completed');
            grid.appendChild(dayDiv);
        }
    }

    async function fetchLiturgia() {
        try {
            const response = await fetch('https://liturgia.up.railway.app/');
            const data = await response.json();
            const colors = { 
                'Verde': '#2d5a27', 
                'Roxo': '#4a148c', 
                'Branco': '#2c3e6b', 
                'Vermelho': '#b71c1c',
                'Rosa': '#d81b60'
            };
            const color = colors[data.cor] || '#2c3e6b';
            if (liturgicalBar) liturgicalBar.style.backgroundColor = color;
            
            const liturgicalCelebration = document.getElementById('liturgicalCelebration');
            const saintOfTheDay = document.getElementById('saintOfTheDay');
            if (data.celebracao && liturgicalCelebration) liturgicalCelebration.textContent = data.celebracao;
            if (data.santo_do_dia && saintOfTheDay) saintOfTheDay.textContent = `Santo do Dia: ${data.santo_do_dia}`;
            if (data.evangelho) gospelData = data.evangelho;
        } catch (e) { console.error(e); }
    }

    methodBtns.forEach(btn => {
        btn.onclick = () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMethod = btn.dataset.method;
            prepareCards();
            if (sliderWrapper) window.scrollTo({ top: sliderWrapper.offsetTop - 20, behavior: 'smooth' });
        };
    });

    function prepareCards() {
        if (!gospelData) return;
        const chunks = gospelData.texto.split('.').map(s => s.trim()).filter(s => s.length > 0);
        allCardsData = [];
        for (let i = 0; i < chunks.length; i += 2) {
            allCardsData.push({ type: 'gospel', text: chunks.slice(i, i + 2).join('. ') + '.', title: i === 0 ? gospelData.titulo : null });
        }
        if (currentMethod === 'lectio') {
            allCardsData.push(
                { type: 'step', step: 1, title: 'LEITURA', text: 'Leia o evangelho devagar, saboreando cada palavra.' },
                { type: 'step', step: 2, title: 'MEDITAÇÃO', text: 'O que este texto diz para você hoje?', input: true, label: 'meditation' },
                { type: 'step', step: 3, title: 'ORAÇÃO', text: 'Fale com Deus sobre o que leu.', input: true, label: 'prayer' },
                { type: 'step', step: 4, title: 'CONTEMPLAÇÃO', text: 'Fique em silêncio por 2 minutos sob o olhar de Deus.', timer: 120 }
            );
        } else if (currentMethod === 'rapido') {
            allCardsData.push(
                { type: 'step', step: 1, title: 'PASSO 1', text: 'O que o texto diz?', input: true, label: 'step1' },
                { type: 'step', step: 2, title: 'PASSO 2', text: 'O que Deus pede de mim?', input: true, label: 'step2' }
            );
        }
        renderCards();
    }

    function renderCards() {
        if (!cardsWrapper) return;
        cardsWrapper.innerHTML = '';
        allCardsData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = `slider-card ${index === 0 ? 'active' : ''}`;
            if (data.type === 'gospel') {
                card.innerHTML = `${data.title ? `<div class="card-title">${data.title}</div>` : ''}<div class="card-ref">${gospelData.referencia}</div><div class="card-text">${data.text}</div>`;
            } else {
                card.innerHTML = `<div class="step-header"><div class="step-number">${data.step}</div><div class="step-title">${data.title}</div></div><div class="card-text">${data.text}</div>`;
                if (data.input) {
                    const ta = document.createElement('textarea');
                    ta.placeholder = "Escreva aqui sua reflexão...";
                    ta.dataset.label = data.label;
                    card.appendChild(ta);
                }
                if (data.timer) {
                    const timerDiv = document.createElement('div');
                    timerDiv.className = 'timer-display';
                    timerDiv.textContent = '02:00';
                    
                    const soundControls = document.createElement('div');
                    soundControls.className = 'sound-controls';
                    
                    const rainBtn = document.createElement('button');
                    rainBtn.className = 'sound-btn';
                    rainBtn.innerHTML = '🌧️ Chuva';
                    rainBtn.onclick = () => toggleSound('rain', rainBtn);
                    
                    const chantBtn = document.createElement('button');
                    chantBtn.className = 'sound-btn';
                    chantBtn.innerHTML = '🔔 Sinos';
                    chantBtn.onclick = () => toggleSound('chant', chantBtn);
                    
                    soundControls.appendChild(rainBtn);
                    soundControls.appendChild(chantBtn);
                    
                    const startBtn = document.createElement('button');
                    startBtn.className = 'btn btn-secondary';
                    startBtn.textContent = 'Iniciar Silêncio';
                    startBtn.onclick = () => startTimer(data.timer, timerDiv);
                    
                    card.appendChild(timerDiv);
                    card.appendChild(soundControls);
                    card.appendChild(startBtn);
                }
            }
            cardsWrapper.appendChild(card);
        });
        currentCardIndex = 0;
        updateSlider();
        if (sliderWrapper) sliderWrapper.style.display = 'block';
        if (prayerActions) prayerActions.style.display = 'flex';
    }

    function toggleSound(type, btn) {
        const rain = document.getElementById('audioRain');
        const chant = document.getElementById('audioChant');
        
        document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
        
        if (currentAudio) {
            currentAudio.pause();
            if (currentAudio === (type === 'rain' ? rain : chant)) {
                currentAudio = null;
                return;
            }
        }
        
        currentAudio = type === 'rain' ? rain : chant;
        if (currentAudio) {
            currentAudio.play();
            btn.classList.add('active');
        }
    }

    function startTimer(seconds, display) {
        if (timerInterval) clearInterval(timerInterval);
        let timeLeft = seconds;
        timerInterval = setInterval(() => {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (currentAudio) currentAudio.pause();
                alert("Tempo de silêncio concluído! 🙏");
            }
            timeLeft--;
        }, 1000);
    }

    function updateSlider() {
        const cards = document.querySelectorAll('.slider-card');
        cards.forEach((c, i) => {
            c.classList.remove('active', 'prev');
            if (i === currentCardIndex) c.classList.add('active');
            else if (i < currentCardIndex) c.classList.add('prev');
        });
        if (progressIndicator) progressIndicator.textContent = `${currentCardIndex + 1} / ${allCardsData.length}`;
        if (prevBtn) prevBtn.style.visibility = currentCardIndex === 0 ? 'hidden' : 'visible';
        if (nextBtn) nextBtn.style.visibility = currentCardIndex === allCardsData.length - 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) nextBtn.onclick = () => { if (currentCardIndex < allCardsData.length - 1) { currentCardIndex++; updateSlider(); } };
    if (prevBtn) prevBtn.onclick = () => { if (currentCardIndex > 0) { currentCardIndex--; updateSlider(); } };

    if (shareBtn) {
        shareBtn.onclick = () => {
            if (navigator.share && gospelData) {
                navigator.share({
                    title: 'Evangelho do Dia',
                    text: `*${gospelData.titulo}*\n\n${gospelData.texto}\n\nRef: ${gospelData.referencia}`,
                    url: window.location.href
                });
            } else {
                alert("Compartilhamento não suportado neste navegador.");
            }
        };
    }

    if (markAsDoneButton) {
        markAsDoneButton.onclick = async () => {
            const dateKey = getCurrentDateKey();
            const reflections = {};
            document.querySelectorAll('#cardsWrapper textarea').forEach(ta => reflections[ta.dataset.label] = ta.value);
            await db.collection('users').doc(userId).collection('prayers').doc(dateKey).set({
                date: dateKey, timestamp: Date.now(), gospel: gospelData, method: currentMethod, reflections
            });
            if (!completedDays.includes(dateKey)) {
                completedDays.push(dateKey);
                localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedDays));
            }
            successOverlay.classList.add('show');
            setTimeout(() => {
                successOverlay.classList.remove('show');
                if (sliderWrapper) sliderWrapper.style.display = 'none';
                if (prayerActions) prayerActions.style.display = 'none';
                if (calendarGrid && calendarMonthLabel) {
                    renderCalendar(today.getMonth(), today.getFullYear(), calendarGrid, calendarMonthLabel);
                }
                updateDayCounter();
                loadHomePCEs();
            }, 2000);
        };
    }

    // UI Handlers
    if (startAppBtn) {
        startAppBtn.onclick = async () => {
            const userNameInput = document.getElementById('userNameInput');
            const name = userNameInput ? userNameInput.value.trim() : '';
            if (name) {
                userName = name;
                localStorage.setItem(STORAGE_KEY_USER_NAME, userName);
                welcomeModal.classList.remove('show');
                await init();
            }
        };
    }

    const closeCoupleModal = document.getElementById('closeCoupleModal');
    if (closeCoupleModal) closeCoupleModal.onclick = () => { coupleModal.classList.remove('show'); setActiveNav('navHome'); };
    
    init();
});