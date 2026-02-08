"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WordOfGodModalProps {
  onClose: () => void;
  userId: string;
}

const WordOfGodModal = ({ onClose, userId }: WordOfGodModalProps) => {
  const [passage, setPassage] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!passage.trim()) return;
    setIsSubmitting(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Salva o estado atual
      await setDoc(doc(db, 'users', userId, 'pces', 'word'), {
        passage,
        keyWord,
        updatedAt: Date.now()
      });

      // Salva no histórico
      await addDoc(collection(db, 'users', userId, 'pce_history'), {
        type: 'Escuta da Palavra',
        date: today,
        content: `Passagem: ${passage}\nPalavra: ${keyWord}`,
        timestamp: Date.now()
      });

      toast.success("Escuta da Palavra registrada! 📖");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative border">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80">
          <X size={20} />
        </button>

        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-[#e8f0f7] rounded-2xl flex items-center justify-center text-3xl mx-auto">📖</div>
          <h2 className="text-2xl font-bold text-[#2c3e6b]">Escuta da Palavra</h2>
          <p className="text-sm text-muted-foreground">Registre sua leitura bíblica de hoje</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b] ml-1">Passagem Lida</label>
            <Input 
              placeholder="Ex: João 1, 1-14" 
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              className="h-12 rounded-xl border-2 border-[#e8f0f7] focus:border-[#c9a84c]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b] ml-1">Palavra que marcou</label>
            <Textarea 
              placeholder="Uma frase ou palavra que tocou seu coração..."
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              className="min-h-[120px] rounded-xl border-2 border-[#e8f0f7] focus:border-[#c9a84c]"
            />
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || !passage}
            className="w-full h-14 rounded-2xl bg-[#c9a84c] text-white font-bold text-lg mt-4"
          >
            {isSubmitting ? "Salvando..." : "Salvar Registro"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WordOfGodModal;