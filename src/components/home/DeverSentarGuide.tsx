"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, CheckCircle2, Heart, MessageCircle, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DeverSentarGuideProps {
  onBack: () => void;
}

const DeverSentarGuide = ({ onBack }: DeverSentarGuideProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold text-[#2c3e6b]">Guia de Formação</h2>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-8 pb-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#e8f0f7] rounded-2xl flex items-center justify-center text-3xl mx-auto">💑</div>
            <h3 className="text-lg font-black text-[#2c3e6b] uppercase tracking-tight">O Dever de Sentar-se</h3>
            <p className="text-sm text-muted-foreground italic">"Um presente que vocês se dão"</p>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#c9a84c]">
              <BookOpen size={18} />
              <h4 className="font-bold uppercase text-xs tracking-widest">O que é?</h4>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Um momento sagrado de diálogo entre o casal, idealizado pelo Padre Henri Caffarel, fundador das Equipes de Nossa Senhora.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#c9a84c]">
              <Users size={18} />
              <h4 className="font-bold uppercase text-xs tracking-widest">Como fazer?</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#f5f5f5] p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-[#2c3e6b]">✅ Preparação</p>
                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                  <li>Escolham um lugar tranquilo, sem distrações</li>
                  <li>Desliguem celulares e TV</li>
                  <li>Reservem pelo menos 30 minutos</li>
                  <li>Sentem-se frente a frente, olhos nos olhos</li>
                </ul>
              </div>

              <div className="bg-[#f5f5f5] p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-[#2c3e6b]">✅ Diálogo</p>
                <p className="text-[11px] text-muted-foreground mb-2">Não é para resolver problemas práticos, é para se CONHECEREM profundamente.</p>
                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                  <li>Como vocês se sentiram essa semana?</li>
                  <li>O que te alegrou? O que te preocupou?</li>
                  <li>Como está nossa relação?</li>
                  <li>Como posso te amar melhor?</li>
                </ul>
              </div>

              <div className="bg-[#f5f5f5] p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-[#2c3e6b]">✅ Atitude</p>
                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                  <li>ESCUTAR com o coração, não para responder</li>
                  <li>ACOLHER sem julgar</li>
                  <li>AGRADECER pela partilha</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="p-6 bg-[#2c3e6b] text-white rounded-[2rem] text-center space-y-3">
            <Heart className="mx-auto text-[#c9a84c]" size={24} />
            <p className="text-sm italic leading-relaxed">
              "O Dever de Sentar-se não é uma obrigação, é um presente que vocês se dão."
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">- Padre Caffarel</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DeverSentarGuide;