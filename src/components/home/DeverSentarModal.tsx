"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, MessageSquare, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { doc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'sonner';
import DeverSentarGuide from './DeverSentarGuide';
import DeverSentarSchedule from './DeverSentarSchedule';
import DeverSentarDetails from './DeverSentarDetails';

interface DeverSentarModalProps {
  onClose: () => void;
  coupleId: string;
  onSuccess: () => void;
  initialView?: 'main' | 'details';
  selectedDate?: string;
  deverData?: any;
}

const DeverSentarModal = ({ 
  onClose, 
  coupleId, 
  onSuccess, 
  initialView = 'main',
  selectedDate,
  deverData 
}: DeverSentarModalProps) => {
  const [view, setView] = useState<'main' | 'guide' | 'schedule' | 'details'>(initialView);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    if (!isConfirmed) return;
    
    setIsSubmitting(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const deverRef = doc(db, 'couples', coupleId, 'pces', 'deverSentar');
      
      const newNote = {
        date: today,
        text: note.trim() || "Dever de sentar-se realizado."
      };

      await setDoc(deverRef, {
        lastCompleted: today,
        monthlyCount: increment(1),
        notes: arrayUnion(newNote),
        completions: arrayUnion(today)
      }, { merge: true });

      setShowSuccess(true);
      onSuccess();
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o registro.");
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
        <AnimatePresence mode="wait">
          {view === 'main' && !showSuccess && (
            <motion.div key="main" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={onClose} className="absolute top-0 right-0 p-2 rounded-full bg-muted hover:bg-muted/80">
                <X size={20} />
              </button>

              <div className="text-center space-y-4 mb-8">
                <div className="w-16 h-16 bg-[#e8f0f7] rounded-2xl flex items-center justify-center text-3xl mx-auto">🪑</div>
                <h2 className="text-2xl font-bold text-[#2c3e6b]">💑 Dever de Sentar-se</h2>
                <p className="text-sm text-muted-foreground">Um momento para vocês dois</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#f5f5f5] border-2 border-transparent transition-all has-[:checked]:border-[#c9a84c] has-[:checked]:bg-[#c9a84c]/5">
                  <Checkbox 
                    id="confirm" 
                    checked={isConfirmed} 
                    onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
                    className="w-6 h-6 rounded-lg border-2"
                  />
                  <Label htmlFor="confirm" className="text-base font-bold text-[#2c3e6b] cursor-pointer flex-1">
                    ✅ Já conversamos hoje!
                  </Label>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b] ml-1 flex items-center gap-2">
                    <MessageSquare size={12} /> Como foi o momento de vocês? (opcional)
                  </label>
                  <Textarea 
                    placeholder="Compartilhe brevemente o que sentiram..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px] rounded-2xl border-2 border-[#e8f0f7] focus:border-[#c9a84c] resize-none"
                  />
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={!isConfirmed || isSubmitting}
                  className="w-full h-14 rounded-2xl bg-[#c9a84c] text-white font-bold text-lg shadow-lg"
                >
                  {isSubmitting ? "Salvando..." : "Marcar como concluído"}
                </Button>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setView('schedule')} className="h-12 rounded-xl border-2 border-[#e8f0f7] text-[10px] font-bold uppercase tracking-wider flex gap-2">
                    <CalendarIcon size={14} /> Agendar
                  </Button>
                  <Button variant="outline" onClick={() => setView('guide')} className="h-12 rounded-xl border-2 border-[#e8f0f7] text-[10px] font-bold uppercase tracking-wider flex gap-2">
                    <BookOpen size={14} /> Como fazer?
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'guide' && (
            <motion.div key="guide" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <DeverSentarGuide onBack={() => setView('main')} />
            </motion.div>
          )}

          {view === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <DeverSentarSchedule coupleId={coupleId} currentSchedule={deverData?.schedule} onBack={() => setView('main')} />
            </motion.div>
          )}

          {view === 'details' && selectedDate && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <DeverSentarDetails date={selectedDate} data={deverData} onBack={onClose} />
            </motion.div>
          )}

          {showSuccess && (
            <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#2c3e6b]">Que lindo!</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">Que Deus abençoe o diálogo de vocês! 🙏</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DeverSentarModal;