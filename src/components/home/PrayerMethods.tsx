"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrayerMethodsProps {
  onClose: () => void;
  onSelect: (method: 'simples' | 'lectio' | 'rapido') => void;
}

const PrayerMethods = ({ onClose, onSelect }: PrayerMethodsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative border">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#e8f0f7] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🙏
          </div>
          <h2 className="text-2xl font-bold text-[#2c3e6b]">Oração Pessoal</h2>
          <p className="text-sm text-muted-foreground mt-2">Escolha como deseja rezar hoje</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => onSelect('simples')}
            variant="outline"
            className="w-full h-16 rounded-2xl text-lg font-bold border-2 border-[#2c3e6b] text-[#2c3e6b] hover:bg-[#2c3e6b]/5 bg-white active:bg-[#c9a84c] active:text-white active:border-[#c9a84c] transition-all"
          >
            Liturgia Simples
          </Button>
          
          <Button 
            onClick={() => onSelect('lectio')}
            variant="outline" 
            className="w-full h-16 rounded-2xl text-lg font-bold border-2 border-[#2c3e6b] text-[#2c3e6b] hover:bg-[#2c3e6b]/5 bg-white active:bg-[#c9a84c] active:text-white active:border-[#c9a84c] transition-all"
          >
            Lectio Divina
          </Button>
          
          <Button 
            onClick={() => onSelect('rapido')}
            variant="outline" 
            className="w-full h-16 rounded-2xl text-lg font-bold border-2 border-[#2c3e6b] text-[#2c3e6b] hover:bg-[#2c3e6b]/5 bg-white active:bg-[#c9a84c] active:text-white active:border-[#c9a84c] transition-all"
          >
            Método Rápido
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PrayerMethods;