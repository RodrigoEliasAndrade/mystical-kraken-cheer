"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import PrayerCalendar from '@/components/home/PrayerCalendar';
import PceSummary from '@/components/home/PceSummary';
import PceCard from '@/components/home/PceCard';
import PrayerMethods from '@/components/home/PrayerMethods';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [liturgia, setLiturgia] = useState<any>(null);
  const [showMethods, setShowMethods] = useState(false);
  
  useEffect(() => {
    fetch('https://liturgia.up.railway.app/')
      .then(res => res.json())
      .then(data => setLiturgia(data))
      .catch(err => console.error("Erro ao buscar liturgia:", err));
  }, []);

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
          <PrayerCalendar completedDays={[]} />
          
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2c3e6b] mb-4 px-1">
              Meus PCEs
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <PceCard 
                icon="🙏"
                title="Oração Pessoal Diária"
                status="Pendente"
                info="🔥 5 dias seguidos"
                onClick={() => setShowMethods(true)}
              />
              <PceCard 
                icon="💑"
                title="Oração Conjugal Diária"
                status="Ainda não"
                info="📍 Horário: 21h15"
              />
              <PceCard 
                icon="💬"
                title="Dever de Sentar-se Mensal"
                status="Aguardando"
                info="📅 Próximo: 15/02"
              />
              <PceCard 
                icon="📝"
                title="Regra de Vida Mensal"
                status="Aguardando"
                info="📅 Revisão: 28/02"
              />
              <PceCard 
                icon="👥"
                title="Reunião de Equipe Mensal"
                status="Pendente"
                info="📅 Data: 20/02"
              />
              <PceCard 
                icon="⛪"
                title="Retiro Anual"
                status="Pendente"
              />
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
          <PrayerMethods onClose={() => setShowMethods(false)} />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Index;