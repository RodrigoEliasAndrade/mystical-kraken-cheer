"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft, Volume2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const gospel = liturgia?.evangelho;

  const steps = {
    simples: [
      { type: 'gospel', title: 'Evangelho do Dia' },
      { type: 'text', content: 'Reflita sobre o que mais tocou você' },
      { type: 'text', content: 'O que Deus está dizendo hoje?' },
      { type: 'input', label: 'reflexao', placeholder: 'Escreva aqui sua reflexão...' },
      { type: 'finish' }
    ],
    lectio: [
      { type: 'gospel', title: 'Evangelho do Dia' },
      { type: 'text', title: 'LECTIO', content: 'Leia com atenção saboreando cada palavra.' },
      { type: 'text', title: 'MEDITATIO', content: 'O que esta palavra diz para você hoje?' },
      { type: 'input', label: 'meditacao', placeholder: 'Sua meditação...' },
      { type: 'text', title: 'ORATIO', content: 'Fale com Deus sobre o que você sentiu.' },
      { type: 'input', label: 'oracao', placeholder: 'Sua oração...' },
      { type: 'text', title: 'CONTEMPLATIO', content: 'Fique em silêncio por 2 minutos sob o olhar de Deus.' },
      { type: 'timer' },
      { type: 'finish' }
    ],
    rapido: [
      { type: 'gospel', title: 'Evangelho do Dia' },
      { type: 'text', content: 'O que Deus está dizendo?' },
      { type: 'input', label: 'deus_diz', placeholder: 'O que você ouviu...' },
      { type: 'text', content: 'O que vou fazer hoje?' },
      { type: 'input', label: 'acao', placeholder: 'Seu propósito para hoje...' },
      { type: 'finish' }
    ]
  }[method];

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3');
    }
    audioRef.current.play();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStep = (step: any) => {
    switch (step.type) {
      case 'gospel':
        return (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
            <h3 className="text-xl font-bold text-[#2c3e6b]">{gospel?.titulo}</h3>
            <p className="text-xs font-bold text-[#c9a84c] uppercase tracking-wider">{gospel?.referencia}</p>
            <div className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {gospel?.texto}
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
          <div className="space-y-4">
            <p className="text-sm font-bold text-[#2c3e6b] uppercase tracking-wider">Sua Reflexão</p>
            <Textarea 
              value={reflections[step.label] || ''}
              onChange={(e) => setReflections({ ...reflections, [step.label]: e.target.value })}
              placeholder={step.placeholder}
              className="min-h-[200px] rounded-2xl border-2 border-[#e8f0f7] focus:border-[#c9a84c] text-lg"
            />
          </div>
        );
      case 'timer':
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        return (
          <div className="text-center space-y-8 py-10">
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
                onClick={playSound}
                className="text-[#c9a84c] font-bold flex gap-2"
              >
                <Volume2 size={20} /> Testar Som
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
              Concluir e Salvar
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
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#e8f0f7] min-h-[400px] flex flex-col justify-center"
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