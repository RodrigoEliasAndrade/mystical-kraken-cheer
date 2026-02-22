"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'sonner';
import ConjugalPrayerFlow from './ConjugalPrayerFlow';

interface ConjugalPrayerModalProps {
  onClose: () => void;
  coupleId: string;
  userId: string;
  onSuccess: () => void;
  liturgia?: any;
}

const ConjugalPrayerModal = ({ onClose, coupleId, userId, onSuccess, liturgia }: ConjugalPrayerModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (data: any) => {
    setIsSubmitting(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const prayerRef = doc(db, 'couples', coupleId, 'conjugalPrayer', 'dates');
      
      // Salva a conclusão diária
      await setDoc(prayerRef, { 
        [today]: { 
          completed: true, 
          timestamp: Date.now(),
          duration: data.duration,
          wisdomDay: data.wisdomDay
        } 
      }, { merge: true });

      // Salva no histórico/diário se houver nota
      if (data.journalEntry) {
        await addDoc(collection(db, 'users', userId, 'prayers'), {
          date: today,
          method: 'conjugal',
          reflections: { journal: data.journalEntry },
          duration: data.duration,
          timestamp: Date.now()
        });
      }

      // Atualiza estatísticas no localStorage para feedback imediato
      const stats = JSON.parse(localStorage.getItem('oracaoConjugalStats') || '{"monthlyCount": 0, "currentStreak": 0, "lastDate": ""}');
      const newStats = {
        monthlyCount: stats.lastDate.startsWith(format(new Date(), 'yyyy-MM')) ? stats.monthlyCount + 1 : 1,
        currentStreak: stats.lastDate === format(new Date(Date.now() - 86400000), 'yyyy-MM-dd') ? stats.currentStreak + 1 : 1,
        lastDate: today
      };
      localStorage.setItem('oracaoConjugalStats', JSON.stringify(newStats));

      toast.success("Oração Conjugal registrada! Que bênção! 🙏");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar oração.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative border max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <ConjugalPrayerFlow 
          liturgia={liturgia}
          onClose={onClose}
          onComplete={handleComplete}
        />
      </div>
    </motion.div>
  );
};

export default ConjugalPrayerModal;