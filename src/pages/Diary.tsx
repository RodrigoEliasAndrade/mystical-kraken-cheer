"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookOpen, Calendar, ChevronRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrayerEntry {
  id: string;
  date: string;
  method: string;
  gospel?: {
    referencia: string;
    titulo: string;
  };
  reflections?: Record<string, string>;
  timestamp: number;
}

const Diary = () => {
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "user_demo_456"; // Mock

  useEffect(() => {
    const q = query(
      collection(db, 'users', userId, 'prayers'),
      orderBy('timestamp', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrayerEntry[];
      setEntries(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 p-6">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-black text-[#2c3e6b] uppercase tracking-tight">
          Meu Diário<br/>Espiritual
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Suas conversas com Deus</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Carregando memórias...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={entry.id}
            >
              <Card className="p-5 rounded-[2rem] border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#e8f0f7] rounded-xl flex items-center justify-center text-primary">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#c9a84c]">
                        {entry.date}
                      </p>
                      <p className="text-xs font-bold text-[#2c3e6b] uppercase">
                        {entry.method === 'simples' ? 'Liturgia Simples' : entry.method === 'lectio' ? 'Lectio Divina' : 'Método Rápido'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground group-hover:text-[#c9a84c] transition-colors" />
                </div>

                {entry.gospel && (
                  <div className="mb-3 flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-muted/30 px-3 py-1 rounded-full w-fit">
                    <BookOpen size={12} /> {entry.gospel.referencia}
                  </div>
                )}

                {entry.reflections && Object.values(entry.reflections)[0] && (
                  <div className="relative pl-4 border-l-2 border-[#c9a84c]/30">
                    <Quote size={12} className="absolute -left-1.5 -top-1 text-[#c9a84c] opacity-50" />
                    <p className="text-sm text-foreground/70 line-clamp-2 italic leading-relaxed">
                      {Object.values(entry.reflections)[0]}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="text-4xl opacity-20">✍️</div>
              <p className="text-sm text-muted-foreground">Você ainda não tem registros.<br/>Comece sua oração hoje!</p>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Diary;