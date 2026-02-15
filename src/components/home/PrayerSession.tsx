"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft, Volume2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrayerSessionProps {
  method: 'simples' | 'lectio' | 'rapido';
  liturgia: any;
  onCancel: () => void;
  onComplete: (reflections: any) => void;
}

const PrayerSession = ({ method, liturgia, onCancel, onComplete }: PrayerSessionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [reflections, setReflections] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const gospel = liturgia?.evangelho;
  const gospelText = gospel?.texto || "";
  
  // Split gospel into smaller chunks based on sentences to ensure it fits on screen
  const sentences = gospelText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const maxSentencesPerChunk = 3;
  const gospelChunks = [];
  for (let i = 0; i < sentences.length; i += maxSentencesPerChunk) {
    gospelChunks.push(sentences.slice(i, i + maxSentencesPerChunk).join(" "));
  }

  const steps = {
    simples: [
      { type: 'text', title: 'ORIENTAÇÃO', content: 'Leia com atenção o Evangelho de hoje e deixe a Palavra tocar seu coração.' },
      ...gospelChunks.map((chunk, i) => ({ type: 'gospel_chunk', content: chunk, part: i + 1, total: gospelChunks.length })),
      { type: 'text', title: 'REFLITA EM SILÊNCIO', content: 'Reserve alguns momentos para deixar a Palavra ecoar em seu coração.' },
      { type: 'finish' }
    ],
    lectio: [
      { type: 'text', title: 'ORIENTAÇÃO', content: 'LECTIO - Leia com atenção saboreando cada palavra' },
      ...gospelChunks.map((chunk, i) => ({ type: 'gospel_chunk', content: chunk, part: i + 1, total: gospelChunks.length })),
      { type: 'input', title: 'MEDITATIO', content: 'O que esta palavra diz para você hoje?', label: 'meditacao', placeholder: 'Sua meditação...' },
      { type: 'input', title: 'ORATIO', content: 'Fale com Deus sobre o que você sentiu', label: 'oracao', placeholder: 'Sua oração...' },
      { type: 'timer', title: 'CONTEMPLATIO', content: 'Fique em silêncio por 2 minutos sob o olhar de Deus' },
      { type: 'finish' }
    ],
    rapido: [
      { type: 'text', title: 'ORIENTAÇÃO', content: 'Leia o Evangelho e responda às perguntas práticas para hoje' },
      ...gospelChunks.map((chunk, i) => ({ type: 'gospel_chunk', content: chunk, part: i + 1, total: gospelChunks.length })),
      { type: 'input', title: 'O QUE ESTE TEXTO DIZ?', content: '', label: 'texto_diz', placeholder: 'Em poucas palavras...' },
      { type: 'input', title: 'O QUE DEUS PEDE DE MIM?', content: '', label: 'deus_pede', placeholder: 'Deus está me pedindo...' },
      { type: 'input', title: 'O QUE VOU VIVER HOJE?', content: '', label: 'viver_hoje', placeholder: 'Hoje vou...' },
      { type: 'finish' }
    ]
  }[method];

  const playSino = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);
      
      oscillator.start(now);
      oscillator.stop(now + 1);
    } catch (error) {
      console.error("Erro ao tocar sino:", error);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playSino();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStep = (step: any) => {
    switch (step.type) {
      case 'gospel_chunk':
        return (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <p className="text-[10px] font-black text-[#c9a84c] uppercase tracking-widest">Evangelho - Parte {step.part}/{step.total}</p>
              <p className="text-[10px] font-bold text-muted-foreground">{gospel?.referencia}</p>
            </div>
            <ScrollArea className="flex-1 pr-4">
              <div className="text-xl font-medium leading-relaxed text-[#2c3e6b] pb-4">
                {step.content}
              </div>
            </ScrollArea>
          </div>
        );
      case 'text':
        return (
          <div className="text-center space-y-6 py-4 flex flex-col justify-center h-full">
            {step.title && <h3 className="text-xl font-black text-[#c9a84c] tracking-widest uppercase">{step.title}</h3>}
            <p className="text-lg font-medium text-[#2c3e6b] leading-relaxed">{step.content}</p>
          </div>
        );
      case 'input':
        return (
          <div className="space-y-4 flex flex-col h-full">
            <div className="text-center space-y-1 shrink-0">
              {step.title && <h3 className="text-lg font-black text-[#c9a84c] tracking-widest uppercase">{step.title}</h3>}
              {step.content && <p className="text-sm font-medium text-[#2c3e6b]">{step.content}</p>}
            </div>
            <Textarea 
              value={reflections[step.label] || ''}
              onChange={(e) => setReflections({ ...reflections, [step.label]: e.target.value })}
              placeholder={step.placeholder}
              className="flex-1 min-h-[120px] rounded-2xl border-2 border-[#e8f0f7] focus:border-[#c9a84c] text-base resize-none"
            />
          </div>
        );
      case 'timer':
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        return (
          <div className="text-center space-y-6 py-4 flex flex-col justify-center h-full">
            <div className="space-y-2">
              {step.title && <h3 className="text-xl font-black text-[#c9a84c] tracking-widest uppercase">{step.title}</h3>}
              <p className="text-base font-medium text-[#2c3e6b]">{step.content}</p>
            </div>
            <div className="text-5xl font-black text-[#2c3e6b] tabular-nums">
              {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
            </div>
            <div className="flex flex-col gap-3 items-center">
              <Button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-48 h-12 rounded-full bg-[#2c3e6b] text-white font-bold"
              >
                {isTimerRunning ? 'Pausar' : 'Iniciar Silêncio'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={playSino}
                className="text-[#c9a84c] font-bold flex gap-2 text-xs"
              >
                <Volume2 size={16} /> 🔔 Testar Som
              </Button>
            </div>
          </div>
        );
      case 'finish':
        return (
          <div className="text-center space-y-6 py-4 flex flex-col justify-center h-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#2c3e6b]">Oração Concluída</h3>
              <p className="text-sm text-muted-foreground">Que Deus te abençoe e acompanhe seu dia!</p>
            </div>
            <Button 
              onClick={() => onComplete(reflections)}
              className="w-full h-14 rounded-2xl bg-[#c9a84c] text-white text-base font-bold shadow-lg shadow-yellow-200/30"
            >
              Concluir Oração
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b bg-white shrink-0">
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <ArrowLeft size={20} className="text-[#2c3e6b]" />
        </Button>
        <div className="text-center">
          <h2 className="text-[10px] font-black text-[#2c3e6b] uppercase tracking-[0.2em]">
            {method === 'simples' ? 'Liturgia Simples' : method === 'lectio' ? 'Lectio Divina' : 'Método Rápido'}
          </h2>
          <p className="text-[9px] font-bold text-[#c9a84c] uppercase tracking-widest mt-0.5">
            Passo {currentStep + 1} de {steps.length}
          </p>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-4 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#e8f0f7] flex-1 flex flex-col min-h-0"
          >
            {renderStep(steps[currentStep])}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-4 flex gap-3 bg-white border-t shrink-0">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex-1 h-12 rounded-xl border-2 border-[#2c3e6b] text-[#2c3e6b] font-bold disabled:opacity-30 text-sm"
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex-1 h-12 rounded-xl bg-[#2c3e6b] text-white font-bold disabled:opacity-30 text-sm"
        >
          Próximo <ChevronRight size={18} className="ml-1" />
        </Button>
      </footer>
    </div>
  );
};

export default PrayerSession;