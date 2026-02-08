"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import PceStats from '@/components/pce/PceStats';
import PceCard from '@/components/home/PceCard';
import WordOfGodModal from '@/components/pce/WordOfGodModal';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { format, startOfMonth } from 'date-fns';

const PCE = () => {
  const [showWordModal, setShowWordModal] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Escuta da Palavra', value: 0, color: '#2c3e6b' },
    { label: 'Oração Conjugal', value: 0, color: '#c9a84c' },
    { label: 'Oração Pessoal', value: 0, color: '#4caf7a' },
    { label: 'Dever de Sentar-se', value: 0, color: '#6366f1' },
  ]);

  const userId = "user_demo_456"; // Mock
  const coupleId = "couple_demo_123"; // Mock

  useEffect(() => {
    // Simulação de cálculo de estatísticas baseada no mês atual
    const calculateStats = async () => {
      const today = new Date();
      const monthStart = startOfMonth(today);
      
      // Aqui buscaríamos os logs do Firebase para calcular as porcentagens reais
      // Por enquanto, usaremos valores simulados que poderiam vir de uma query real
      setStats([
        { label: 'Escuta da Palavra', value: 65, color: '#2c3e6b' },
        { label: 'Oração Conjugal', value: 80, color: '#c9a84c' },
        { label: 'Oração Pessoal', value: 90, color: '#4caf7a' },
        { label: 'Dever de Sentar-se', value: 100, color: '#6366f1' },
      ]);
    };

    calculateStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 p-6">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-black text-[#2c3e6b] uppercase tracking-tight">
          Pontos Concretos<br/>de Esforço
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Sua jornada de santidade em casal</p>
      </header>

      <div className="space-y-8">
        <PceStats stats={stats} />

        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2c3e6b] px-1">
            Ações Diárias
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <PceCard 
              icon="📖" 
              title="Escuta da Palavra" 
              status="Registrar leitura" 
              onClick={() => setShowWordModal(true)}
            />
            <PceCard 
              icon="💑" 
              title="Oração Conjugal" 
              status="Ver status" 
              info="Sincronizado"
            />
            <PceCard 
              icon="🧘" 
              title="Oração Pessoal" 
              status="Meditação diária" 
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2c3e6b] px-1">
            Ações Mensais e Anuais
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <PceCard 
              icon="🪑" 
              title="Dever de Sentar-se" 
              status="Diálogo mensal" 
              info="Pendente"
            />
            <PceCard 
              icon="📜" 
              title="Regra de Vida" 
              status="Meu esforço" 
              info="Definido"
            />
            <PceCard 
              icon="⛪" 
              title="Retiro Anual" 
              status="Planejar retiro" 
            />
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showWordModal && (
          <WordOfGodModal 
            userId={userId}
            onClose={() => setShowWordModal(false)}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default PCE;