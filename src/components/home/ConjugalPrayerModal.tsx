"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ConjugalPrayerModalProps {
  onClose: () => void;
  coupleId: string;
  onSuccess: () => void;
}

const REASONS = [
  { id: 'tempo', label: 'Falta de tempo' },
  { id: 'cansaco', label: 'Cansaço' },
  { id: 'conflito', label: 'Conflito entre nós' },
  { id: 'distracoes', label: 'Distrações' },
  { id: 'conhecimento', label: 'Não sabemos como fazer' },
  { id: 'outro', label: 'Outro motivo' },
];

const ConjugalPrayerModal = ({ onClose, coupleId, onSuccess }: ConjugalPrayerModalProps) => {
  const [view, setView] = useState<'initial' | 'reason' | 'success'>('initial');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleMarkAsDone = async () => {
    setIsSubmitting(true);
    try {
      const prayerRef = doc(db, 'couples', coupleId, 'conjugalPrayer', 'dates');
      await setDoc(prayerRef, { [today]: true }, { merge: true });
      setView('success');
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReasons = async () => {
    setIsSubmitting(true);
    try {
      const logRef = doc(db, 'couples', coupleId, 'conjugalPrayer', 'logs');
      await setDoc(logRef, { 
        [today]: {
          reasons: selectedReasons,
          timestamp: Date.now()
        }
      }, { merge: true });
      
      toast.info("Entendemos. Vamos tentar amanhã com a graça de Deus! 💪");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReason = (id: string) => {
    setSelectedReasons(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative border">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          {view === 'initial' && (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-[#e8f0f7] rounded-2xl flex items-center justify-center text-3xl mx-auto">
                💑
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#2c3e6b]">Oração Conjugal</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A oração conjugal deve ser feita juntos, presencialmente.<br/>
                  <strong>Vocês já fizeram a oração conjugal hoje?</strong>
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleMarkAsDone}
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-[#c9a84c] text-white font-bold text-lg shadow-lg shadow-yellow-200/30"
                >
                  ✅ Sim, já fizemos!
                </Button>
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-14 rounded-2xl border-2 border-[#2c3e6b] text-[#2c3e6b] font-bold"
                >
                  ⏰ Ainda não, mas vamos fazer
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setView('reason')}
                  className="w-full text-muted-foreground hover:text-destructive"
                >
                  ❌ Não conseguimos hoje
                </Button>
              </div>
            </motion.div>
          )}

          {view === 'reason' && (
            <motion.div 
              key="reason"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-[#2c3e6b]">O que dificultou?</h2>
                <p className="text-xs text-muted-foreground">Selecione os motivos abaixo</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {REASONS.map((reason) => (
                  <div 
                    key={reason.id}
                    className="flex items-center space-x-3 p-3 rounded-xl border bg-muted/30"
                  >
                    <Checkbox 
                      id={reason.id} 
                      checked={selectedReasons.includes(reason.id)}
                      onCheckedChange={() => toggleReason(reason.id)}
                    />
                    <Label htmlFor={reason.id} className="text-sm font-medium cursor-pointer flex-1">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleSendReasons}
                disabled={selectedReasons.length === 0 || isSubmitting}
                className="w-full h-14 rounded-2xl bg-[#2c3e6b] text-white font-bold"
              >
                Enviar Resposta
              </Button>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#2c3e6b]">Que bênção! 🙏</h2>
                <p className="text-lg text-muted-foreground">Deus abençoe vocês!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ConjugalPrayerModal;