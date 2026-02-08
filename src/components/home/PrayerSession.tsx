"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft, Volume2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

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
  
  // Split gospel into 4 parts for better readability
  const sentences = gospelText.split(/[.!?]/).filter(s => s.trim().length > 0);
  const chunkSize = Math.ceil(sentences.length / 4);
  const gospelChunks = [];
  for (let i = 0; i < 4; i++) {
    const chunk = sentences.slice(i * chunkSize, (i + 1) * chunkSize).join(". ") + ".";
    if (chunk.length > 1) gospelChunks.push(chunk);
  }

  const steps = {
    simples: [
      { type: 'text', title: 'ORIENTAÇÃO', content: 'Leia com atenção o Evangelho de hoje e deixe a Palavra tocar seu coração.' },
      ...gospelChunks.map((chunk, i) => ({ type: 'gospel_chunk', content: chunk, part: i + 1 })),
      { type: 'text', title: 'REFLITA EM SILÊNCIO', content: 'Reserve alguns momentos para deixar a Palavra ecoar em seu coração.' },
      { type: 'finish' }
    ],
    lectio: [
      { type: 'text', title: 'ORIENTAÇÃO', content: 'LECTIO - Leia com atenção saboreando cada palavra' },
      ...gospelChunks.map((chunk, i) => ({ type: 'gospel_chunk', content: chunk, part: i + 1 })),
      { type: 'input', title: 'MEDITATIO', content: 'O que esta palavra diz para você hoje?', label: 'meditacao', placeholder: 'Sua meditação...' },
      { type: 'input', title: 'ORATIO', content: 'Fale com Deus sobre o que você sentiu', label: 'oracao', placeholder: 'Sua oração...' },
      { type: 'timer', title: 'CONTEMPLATIO', content: 'Fique em silêncio por 2 minutos sob o olhar de Deus' },
      { type: 'finish' }
    ],
    rapido: [
      { type: 'text', title: 'ORIENTAÇÃO', content: 'Leia o Evangelho e responda às perguntas práticas para hoje' },
      ...gospelChunks.map((chunk, i) => ({ type: 'gospel_chunk', content: chunk, part: i + 1 })),
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
          <div className="space-y-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">Evangelho - Parte {step.part}</p>
              <p className="text-[10px] font-bold text-muted-foreground">{gospel?.referencia}</p>
            </div>
            <div className="text-2xl font-medium leading-relaxed text-[#2c3e6b]">
              {step.content}
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="text-center space-y-6 py-10">
            {step.title && <h3 className="text-2xl font-black text-[#c9a84c] tracking-widest">{step.title}</h3>}
            <p className="text-xl font-medium text-[#2c3e6b] leading-relaxed">{step.content}</p>
          </div>
        );
      case 'input':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              {step.title && <h3 className="text-2xl font-black text-[#c9a84c] tracking-widest">{step.title}</h3>}
              {step.content && <p className="text-lg font-medium text-[#2c3e6b]">{step.content}</p>}
            </div>
            <Textarea 
              value={reflections[step.label] || ''}
              onChange={(e) => setReflections({ ...reflections, [step.label]: e.target.value })}
              placeholder={step.placeholder}
              className="min-h-[180px] rounded-2xl border-2 border-[#e8f0f7] focus:border-[#c9a84c] text-lg"
            />
          </div>
        );
      case 'timer':
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        return (
          <div className="text-center space-y-8 py-6">
            <div className="space-y-2">
              {step.title && <h3 className="text-2xl font-black text-[#c9a84c] tracking-widest">{step.title}</h3>}
              <p className="text-lg font-medium text-[#2c3e6b]">{step.content}</p>
            </div>
            <div className="text-6xl font-black text-[#2c3e6b] tabular-nums">
              {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
            </div>
            <div className="flex flex-col gap-4 items-center">
              <Button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-48 h-14 rounded-full bg-[#2c3e6b] text-white font-bold"
              >
                {isTimerRunning ? 'Pausar' : 'Iniciar Silêncio'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={playSino}
                className="text-[#c9a84c] font-bold flex gap-2"
              >
                <Volume2 size={20} /> 🔔 Testar Som
              </Button>
            </div>
          </div>
        );
      case 'finish':
        return (
          <div className="text-center space-y-8 py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#2c3e6b]">Oração Concluída</h3>
              <p className="text-muted-foreground">Que Deus te abençoe e acompanhe seu dia!</p>
            </div>
            <Button 
              onClick={() => onComplete(reflections)}
              className="w-full h-16 rounded-2xl bg-[#c9a84c] text-white text-lg font-bold shadow-lg shadow-yellow-200/30"
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
    <div className="fixed inset-0 z-[60] bg-background flex flex-col">
      <header className="p-6 flex items-center justify-between border-b bg-white">
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <ArrowLeft size={24} className="text-[#2c3e6b]" />
        </Button>
        <div className="text-center">
          <h2 className="text-xs font-black text-[#2c3e6b] uppercase tracking-[0.2em]">
            {method === 'simples' ? 'Liturgia Simples' : method === 'lectio' ? 'Lectio Divina' : 'Método Rápido'}
          </h2>
          <p className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest mt-0.5">
            {currentStep + 1} / {steps.length}
          </p>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#e8f0f7] min-h-[420px] flex flex-col justify-center"
          >
            {renderStep(steps[currentStep])}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-6 flex gap-4 bg-white border-t">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex-1 h-14 rounded-2xl border-2 border-[#2c3e6b] text-[#2c3e6b] font-bold disabled:opacity-30"
        >
          <ChevronLeft size={20} className="mr-2" /> Voltar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex-1 h-14 rounded-2xl bg-[#2c3e6b] text-white font-bold disabled:opacity-30"
        >
          Próximo <ChevronRight size={20} className="ml-2" />
        </Button>
      </footer>
    </div>
  );
};

export default PrayerSession;