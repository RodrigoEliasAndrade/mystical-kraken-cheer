"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import PrayerCalendar from '@/components/home/PrayerCalendar';
import PceSummary from '@/components/home/PceSummary';
import PceCard from '@/components/home/PceCard';
import PrayerMethods from '@/components/home/PrayerMethods';
import PrayerSession from '@/components/home/PrayerSession';
import ConjugalPrayerModal from '@/components/home/ConjugalPrayerModal';
import DeverSentarModal from '@/components/home/DeverSentarModal';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths } from 'date-fns';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Index = () => {
  const [liturgia, setLiturgia] = useState<any>(null);
  const [showMethods, setShowMethods] = useState(false);
  const [showConjugalModal, setShowConjugalModal] = useState(false);
  const [showDeverModal, setShowDeverModal] = useState(false);
  const [deverModalView, setDeverModalView] = useState<'main' | 'details'>('main');
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [activeMethod, setActiveMethod] = useState<'simples' | 'lectio' | 'rapido' | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [conjugalCompleted, setConjugalCompleted] = useState(false);
  const [conjugalStats, setConjugalStats] = useState({ monthlyCount: 0, currentStreak: 0 });
  const [deverData, setDeverData] = useState<any>(null);
  
  const coupleId = "couple_demo_123";
  const userId = "user_demo_456";
  const today = new Date();
  const todayKey = format(today, 'yyyy-MM-dd');
  const thisMonthKey = format(today, 'yyyy-MM');

  useEffect(() => {
    fetch('https://liturgia.up.railway.app/')
      .then(res => res.json())
      .then(data => setLiturgia(data))
      .catch(err => console.error("Erro ao buscar liturgia:", err));

    const saved = localStorage.getItem('prayerCompletedDays');
    if (saved) setCompletedDays(JSON.parse(saved));

    // Carrega stats do localStorage
    const stats = JSON.parse(localStorage.getItem('oracaoConjugalStats') || '{"monthlyCount": 0, "currentStreak": 0, "lastDate": ""}');
    setConjugalStats(stats);

    const prayerRef = doc(db, 'couples', coupleId, 'conjugalPrayer', 'dates');
    const unsubPrayer = onSnapshot(prayerRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setConjugalCompleted(!!data[todayKey]?.completed);
      }
    });

    const deverRef = doc(db, 'couples', coupleId, 'pces', 'deverSentar');
    const unsubDever = onSnapshot(deverRef, (doc) => {
      if (doc.exists()) {
        setDeverData(doc.data());
      }
    });

    return () => {
      unsubPrayer();
      unsubDever();
    };
  }, [coupleId, todayKey]);

  const handleSelectMethod = (method: 'simples' | 'lectio' | 'rapido') => {
    setActiveMethod(method);
    setShowMethods(false);
  };

  const handleCompletePrayer = (reflections: any) => {
    const newCompleted = [...new Set([...completedDays, todayKey])];
    setCompletedDays(newCompleted);
    localStorage.setItem('prayerCompletedDays', JSON.stringify(newCompleted));
    setActiveMethod(null);
    toast.success("Oração concluída! Que Deus te abençoe!");
  };

  const handleCalendarClick = (date: string, type: string) => {
    setSelectedDate(date);
    if (type === 'dever_completed') {
      setDeverModalView('details');
      setShowDeverModal(true);
    } else if (type === 'dever_scheduled') {
      setDeverModalView('main');
      setShowDeverModal(true);
    }
  };

  const isTodayCompleted = completedDays.includes(todayKey);
  const isDeverCompletedThisMonth = deverData?.lastCompleted?.startsWith(thisMonthKey);

  const getDeverStatusText = () => {
    if (isDeverCompletedThisMonth) return "✅ Concluído este mês";
    return "⏳ Aguardando diálogo";
  };

  const getDeverInfoText = () => {
    if (isDeverCompletedThisMonth) {
      const nextMonth = addMonths(today, 1);
      const nextMonthKey = format(nextMonth, 'yyyy-MM');
      const nextSchedule = deverData?.schedules?.[nextMonthKey];
      if (nextSchedule) return `📅 Próximo: ${nextSchedule.dayOfMonth}/${format(nextMonth, 'MM')}`;
      return "✨ Agendar próximo mês";
    }
    
    const currentSchedule = deverData?.schedules?.[thisMonthKey];
    if (currentSchedule) return `⏰ Agendado: Dia ${currentSchedule.dayOfMonth} às ${currentSchedule.time}`;
    return "📅 Agendar para este mês";
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <Header 
        celebration={liturgia?.celebracao}
        saint={liturgia?.santo_do_dia}
      />

      <main className="px-6 -mt-8 relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <PrayerCalendar 
            completedDays={completedDays} 
            deverData={deverData}
            onDayClick={handleCalendarClick}
          />
          
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2c3e6b] mb-4 px-1">
              Meus PCEs
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <PceCard 
                icon="🙏"
                title="Oração Pessoal Diária"
                status={isTodayCompleted ? "Completo hoje" : "Pendente"}
                isCompleted={isTodayCompleted}
                info={`🔥 ${completedDays.length} dias`}
                onClick={() => setShowMethods(true)}
              />
              <PceCard 
                icon="💑"
                title="Oração Conjugal Diária"
                status={conjugalCompleted ? "✅ Completo hoje" : "⏳ Pendente"}
                isCompleted={conjugalCompleted}
                info={conjugalCompleted 
                  ? `🔥 Sequência: ${conjugalStats.currentStreak} dias` 
                  : `💎 Palavra de hoje disponível`}
                onClick={() => setShowConjugalModal(true)}
              />
              <PceCard 
                icon="💬" 
                title="Dever de Sentar-se Mensal" 
                status={getDeverStatusText()} 
                isCompleted={isDeverCompletedThisMonth}
                info={getDeverInfoText()} 
                onClick={() => {
                  setDeverModalView('main');
                  setShowDeverModal(true);
                }}
              />
              <PceCard icon="📝" title="Regra de Vida Mensal" status="Aguardando" info="📅 Revisão: 28/02" />
              <PceCard icon="👥" title="Reunião de Equipe Mensal" status="Pendente" info="📅 Data: 20/02" />
              <PceCard icon="⛪" title="Retiro Anual" status="Pendente" />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2c3e6b] mb-4 px-1">
              Resumo do Mês
            </h2>
            <PceSummary 
              ruleOfLife="Ser mais paciente com as crianças durante o jantar."
              lastWord={liturgia?.evangelho?.referencia}
            />
          </section>
        </motion.div>
      </main>

      <AnimatePresence>
        {showMethods && (
          <PrayerMethods 
            onClose={() => setShowMethods(false)} 
            onSelect={handleSelectMethod}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConjugalModal && (
          <ConjugalPrayerModal 
            coupleId={coupleId}
            userId={userId}
            onClose={() => setShowConjugalModal(false)}
            onSuccess={() => {
              const stats = JSON.parse(localStorage.getItem('oracaoConjugalStats') || '{}');
              setConjugalStats(stats);
              setConjugalCompleted(true);
            }}
            liturgia={liturgia}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeverModal && (
          <DeverSentarModal 
            coupleId={coupleId}
            onClose={() => setShowDeverModal(false)}
            onSuccess={() => {}}
            initialView={deverModalView}
            selectedDate={selectedDate}
            deverData={deverData}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMethod && liturgia && (
          <PrayerSession 
            method={activeMethod}
            liturgia={liturgia}
            onCancel={() => setActiveMethod(null)}
            onComplete={handleCompletePrayer}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Index;