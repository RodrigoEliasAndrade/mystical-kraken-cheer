"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, MessageSquare, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DeverSentarDetailsProps {
  date: string;
  data: any;
  onBack: () => void;
}

const DeverSentarDetails = ({ date, data, onBack }: DeverSentarDetailsProps) => {
  const completion = data?.completions?.find((c: any) => c.date === date) || 
                     data?.notes?.find((n: any) => n.date === date);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold text-[#2c3e6b]">Detalhes do Momento</h2>
      </div>

      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#c9a84c]">
            {format(parseISO(date), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
          <h3 className="text-2xl font-bold text-[#2c3e6b]">Dever de Sentar-se</h3>
          <p className="text-sm text-green-600 font-bold">✅ Concluído com sucesso</p>
        </div>

        {completion?.text && (
          <div className="bg-[#f5f5f5] p-6 rounded-[2rem] text-left space-y-3 border-2 border-dashed border-[#e8f0f7]">
            <div className="flex items-center gap-2 text-[#2c3e6b]">
              <MessageSquare size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Notas do Casal</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 italic">
              "{completion.text}"
            </p>
          </div>
        )}

        <Button 
          onClick={onBack}
          className="w-full h-14 rounded-2xl bg-[#2c3e6b] text-white font-bold"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default DeverSentarDetails;