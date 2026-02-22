"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, Clock, 
  Heart, MessageSquare, BookOpen, Sparkles, 
  Check, Play, Pause, RotateCcw, Send
} from 'lucide-react';
import { getDailyWisdom } from '@/data/wisdom';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ConjugalPrayerFlowProps {
  liturgia: any;
  onClose: () => void;
  onComplete: (data: any) => void;
}

const ConjugalPrayerFlow = ({ liturgia, onClose, onComplete }: ConjugalPrayerFlowProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [startTime] = useState(Date.now());
  const [wisdom] = useState(getDailyWisdom());
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [journal, setJournal] = useState("");
  const [intentions, setIntentions] = useState({ family: "", friends: "", world: "", couple: "" });
  const [checklist, setChecklist] = useState({ phones: false, close: false, breath: false });

  // Timer logic for Card 2
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const nextCard = () => setCurrentCard(prev => Math.min(prev + 1, 7));
  const prevCard = () => setCurrentCard(prev => Math.max(prev - 1, 0));

  const handleFinish = () => {
    const duration = Math.round((Date.now() - startTime) / 60000);
    onComplete({
      duration,
      journalEntry: journal,
      wisdomDay: wisdom.day,
      intentions
    });
  };

  const cards = [
    // Card 1: Wisdom
    <div key="c1" className="space-y-6 text-center py-4">
      <div className="inline-block px-3 py-1 bg-[#c9a84c]/10 text-[#c9a84c] text-[10px] font-black rounded-full uppercase tracking-widest">
        💎 {wisdom.category}
      </div>
      <div className="space-y-4">
        <p className="text-xl italic font-medium text-[#2c3e6b] leading-relaxed">
          " {wisdom.quote} "
        </p>
        <p className="text-sm font-bold text-muted-foreground">— {wisdom.author}</p>
      </div>
      <div className="bg-[#f5f5f5] p-5 rounded-2xl text-left space-y-3">
        <div className="flex items-center gap-2 text-[#2c3e6b] font-bold text-xs">
          <Sparkles size={16} className="text-[#c9a84c]" /> Reflexão
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{wisdom.reflection}</p>
      </div>
      <div className="bg-[#c9a84c]/5 p-5 rounded-2xl text-left border border-[#c9a84c]/20">
        <div className="flex items-center gap-2 text-[#c9a84c] font-bold text-xs">
          <Heart size={16} /> Desafio de Hoje
        </div>
        <p className="text-sm text-[#2c3e6b] font-medium mt-2">{wisdom.challenge}</p>
      </div>
    </div>,

    // Card 2: Preparation
    <div key="c2" className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-[#2c3e6b]">🕯️ Preparação</h3>
        <p className="text-sm text-muted-foreground">Encontrem um lugar tranquilo</p>
      </div>
      <div className="space-y-3">
        {[
          { id: 'phones', label: 'Desliguem celulares' },
          { id: 'close', label: 'Sentem-se próximos' },
          { id: 'breath', label: 'Respirem profundo juntos (3x)' }
        ].map(item => (
          <div key={item.id} className="flex items-center space-x-3 p-4 rounded-xl bg-[#f5f5f5]">
            <Checkbox 
              id={item.id} 
              checked={(checklist as any)[item.id]} 
              onCheckedChange={(val) => setChecklist({...checklist, [item.id]: !!val})}
            />
            <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer flex-1">{item.label}</Label>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t text-center space-y-4">
        <p className="text-sm font-medium text-[#2c3e6b]">💑 Olhem um para o outro</p>
        <p className="text-xs text-muted-foreground">30 segundos de silêncio para aquietar o coração</p>
        <div className="flex flex-col items-center gap-3">
          <div className="text-3xl font-black text-[#c9a84c] tabular-nums">{timer}s</div>
          <Button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="rounded-full bg-[#2c3e6b] px-8"
          >
            {isTimerRunning ? <Pause size={20} /> : timer === 30 ? 'Iniciar Timer' : <Play size={20} />}
          </Button>
        </div>
      </div>
    </div>,

    // Card 3: Welcoming God
    <div key="c3" className="space-y-8 text-center py-8">
      <div className="w-16 h-16 bg-[#e8f0f7] rounded-full flex items-center justify-center mx-auto text-3xl">🙏</div>
      <div className="space-y-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">Rezem juntos:</p>
        <p className="text-xl font-medium text-[#2c3e6b] leading-relaxed whitespace-pre-line">
          "Senhor Jesus,
          Tu estás aqui conosco.
          Obrigado por este momento
          que podemos estar juntos,
          diante de Ti, como casal.
          Vem, Espírito Santo,
          inspirar nossa oração.
          Amém."
        </p>
      </div>
    </div>,

    // Card 4: Word of God
    <div key="c4" className="space-y-6 py-4 flex flex-col h-full">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-[#2c3e6b]">📖 Palavra de Deus</h3>
        <p className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">
          {liturgia?.evangelho?.referencia || "Evangelho do Dia"}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar bg-[#f5f5f5] p-5 rounded-2xl border border-[#e8f0f7]">
        <p className="text-sm leading-relaxed text-[#2c3e6b] italic">
          {liturgia?.evangelho?.texto || "Carregando palavra..."}
        </p>
      </div>
      <div className="bg-[#c9a84c]/10 p-4 rounded-2xl border-l-4 border-[#c9a84c]">
        <p className="text-xs font-black text-[#c9a84c] uppercase mb-1">💭 Para refletir juntos:</p>
        <p className="text-sm font-medium text-[#2c3e6b]">
          Como podemos amar mais como Jesus ama no nosso dia a dia?
        </p>
      </div>
    </div>,

    // Card 5: Faith Sharing
    <div key="c5" className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-[#2c3e6b]">💬 Partilha de Fé</h3>
        <p className="text-sm text-muted-foreground">Momento de abrir o coração um ao outro</p>
      </div>
      <div className="space-y-4">
        {[
          { icon: "💭", q: "Essa semana, onde eu vi Deus agindo na minha vida?" },
          { icon: "💑", q: "O que eu sou grato(a) por você, meu amor?" },
          { icon: "🙏", q: "Onde precisamos da graça de Deus como casal?" }
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border-2 border-[#e8f0f7] flex gap-3">
            <span className="text-xl">{item.icon}</span>
            <p className="text-sm font-medium text-[#2c3e6b] leading-tight">{item.q}</p>
          </div>
        ))}
      </div>
      <div className="pt-4 text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sugestão: 5 a 10 minutos de conversa</p>
      </div>
    </div>,

    // Card 6: Intercession
    <div key="c6" className="space-y-4 py-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-[#2c3e6b]">🕊️ Intercessão</h3>
        <p className="text-xs text-muted-foreground">Apresentem juntos a Deus:</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase ml-1">👨‍👩‍👧‍👦 Família</Label>
          <Input 
            placeholder="Intenções pelos filhos e parentes..." 
            value={intentions.family}
            onChange={e => setIntentions({...intentions, family: e.target.value})}
            className="rounded-xl border-2 border-[#e8f0f7]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase ml-1">🤝 Amigos e Equipe</Label>
          <Input 
            placeholder="Pela nossa equipe ENS e amigos..." 
            value={intentions.friends}
            onChange={e => setIntentions({...intentions, friends: e.target.value})}
            className="rounded-xl border-2 border-[#e8f0f7]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase ml-1">💑 Nosso Casal</Label>
          <Input 
            placeholder="Pela nossa união e santidade..." 
            value={intentions.couple}
            onChange={e => setIntentions({...intentions, couple: e.target.value})}
            className="rounded-xl border-2 border-[#e8f0f7]"
          />
        </div>
      </div>
    </div>,

    // Card 7: Thanksgiving
    <div key="c7" className="space-y-6 text-center py-4">
      <div className="space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-[#c9a84c]">Rezem juntos:</p>
        <p className="text-xl font-medium text-[#2c3e6b] leading-relaxed">
          "Obrigado, Senhor,
          por este momento.
          Obrigado pelo nosso amor.
          Obrigado por estar conosco
          sempre.
          Amém."
        </p>
      </div>
      <div className="h-px bg-[#e8f0f7] w-full" />
      <div className="space-y-4">
        <h4 className="text-sm font-black text-[#c9a84c] uppercase tracking-widest">💑 Benção Mútua</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Façam o sinal da cruz um sobre o outro dizendo:<br/>
          <span className="font-bold text-[#2c3e6b]">"Que Deus te abençoe, meu amor"</span>
        </p>
      </div>
    </div>,

    // Card 8: Completion
    <div key="c8" className="space-y-6 py-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#2c3e6b]">Oração Concluída!</h3>
        <p className="text-sm text-muted-foreground">Que Deus abençoe o amor de vocês!</p>
      </div>
      
      <div className="bg-[#f5f5f5] p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-muted-foreground uppercase">Duração</span>
          <span className="text-sm font-bold text-[#2c3e6b]">{Math.round((Date.now() - startTime) / 60000)} min</span>
        </div>
        <div className="h-px bg-white" />
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground">Diário Espiritual (opcional)</Label>
          <Textarea 
            placeholder="Querem registrar algo sobre este momento?"
            value={journal}
            onChange={e => setJournal(e.target.value)}
            className="min-h-[100px] rounded-xl border-none bg-white"
          />
        </div>
      </div>

      <Button 
        onClick={handleFinish}
        className="w-full h-14 rounded-2xl bg-[#c9a84c] text-white font-bold text-lg shadow-lg shadow-yellow-200/30"
      >
        ⭐ Salvar e Finalizar
      </Button>
    </div>
  ];

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#e8f0f7] rounded-lg flex items-center justify-center text-[#2c3e6b]">
            <Heart size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b]">
            Passo {currentCard + 1} de 8
          </span>
        </div>
        <Progress value={((currentCard + 1) / 8) * 100} className="w-24 h-1.5" />
      </header>

      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col"
          >
            {cards[currentCard]}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex gap-3 mt-6 shrink-0">
        <Button 
          variant="outline" 
          onClick={prevCard}
          disabled={currentCard === 0}
          className="flex-1 h-12 rounded-xl border-2 border-[#2c3e6b] text-[#2c3e6b] font-bold disabled:opacity-30"
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        {currentCard < 7 && (
          <Button 
            onClick={nextCard}
            className="flex-1 h-12 rounded-xl bg-[#2c3e6b] text-white font-bold"
          >
            Próximo <ChevronRight size={18} className="ml-1" />
          </Button>
        )}
      </footer>
    </div>
  );
};

export default ConjugalPrayerFlow;