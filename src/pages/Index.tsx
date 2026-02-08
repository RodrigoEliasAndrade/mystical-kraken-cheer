"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import PrayerCalendar from '@/components/home/PrayerCalendar';
import PceSummary from '@/components/home/PceSummary';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [liturgia, setLiturgia] = useState<any>(null);
  const [userName] = useState("Usuário");
  
  useEffect(() => {
    fetch('https://liturgia.up.railway.app/')
      .then(res => res.json())
      .then(data => setLiturgia(data))
      .catch(err => console.error("Erro ao buscar liturgia:", err));
  }, []);

  const liturgicalColors: Record<string, string> = {
    'Verde': '#2d5a27',
    'Roxo': '#4a148c',
    'Branco': '#2c3e6b',
    'Vermelho': '#b71c1c',
    'Rosa': '#d81b60'
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        userName={userName}
        liturgicalColor={liturgia ? liturgicalColors[liturgia.cor] : undefined}
        celebration={liturgia?.celebracao}
        saint={liturgia?.santo_do_dia}
      />

      <main className="px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PrayerCalendar completedDays={[]} />
          
          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold tracking-tight text-[#2c3e6b]">Começar Oração</h2>
              <p className="text-sm text-muted-foreground">Escolha um método para o seu momento com Deus hoje.</p>
              
              <div className="grid grid-cols-1 gap-3 mt-2">
                <Button className="h-16 rounded-2xl justify-between px-6 text-lg font-bold bg-[#c9a84c] hover:bg-[#b8973d] text-white shadow-lg shadow-yellow-200/50 border-none">
                  Liturgia Simples
                  <Play size={20} fill="currentColor" />
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl font-bold border-2 border-[#2c3e6b] text-[#2c3e6b] hover:bg-[#2c3e6b]/5">Lectio Divina</Button>
                  <Button variant="outline" className="h-14 rounded-2xl font-bold border-2 border-[#2c3e6b] text-[#2c3e6b] hover:bg-[#2c3e6b]/5">Método Rápido</Button>
                </div>
              </div>
            </div>

            <PceSummary />
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;