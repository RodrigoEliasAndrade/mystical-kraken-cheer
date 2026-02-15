"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { format, addMonths, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DeverSentarScheduleProps {
  coupleId: string;
  deverData?: any;
  onBack: () => void;
}

const DeverSentarSchedule = ({ coupleId, deverData, onBack }: DeverSentarScheduleProps) => {
  // Determina se estamos agendando para este mês ou para o próximo
  const today = new Date();
  const thisMonthKey = format(today, 'yyyy-MM');
  const nextMonthKey = format(addMonths(today, 1), 'yyyy-MM');
  
  const isCompletedThisMonth = deverData?.lastCompleted?.startsWith(thisMonthKey);
  const initialMonth = isCompletedThisMonth ? addMonths(today, 1) : today;
  
  const [targetDate, setTargetDate] = useState(initialMonth);
  const monthKey = format(targetDate, 'yyyy-MM');
  
  const currentSchedule = deverData?.schedules?.[monthKey];
  const [dayOfMonth, setDayOfMonth] = useState(currentSchedule?.dayOfMonth ?? 15);
  const [time, setTime] = useState(currentSchedule?.time ?? "21:00");
  const [isSaving, setIsSaving] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const deverRef = doc(db, 'couples', coupleId, 'pces', 'deverSentar');
      await setDoc(deverRef, {
        schedules: {
          [monthKey]: {
            dayOfMonth: dayOfMonth,
            time: time,
            reminderEnabled: true
          }
        }
      }, { merge: true });
      
      toast.success(`Agendamento de ${format(targetDate, 'MMMM', { locale: ptBR })} salvo! 📅`);
      onBack();
    } catch (error) {
      toast.error("Erro ao salvar agendamento.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold text-[#2c3e6b]">Agendar Momento</h2>
      </div>

      <div className="bg-[#f5f5f5] p-4 rounded-2xl flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTargetDate(addMonths(targetDate, -1))}
          disabled={format(targetDate, 'yyyy-MM') === thisMonthKey}
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#c9a84c]">Mês de Referência</p>
          <p className="text-sm font-bold text-[#2c3e6b] capitalize">
            {format(targetDate, 'MMMM yyyy', { locale: ptBR })}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTargetDate(addMonths(targetDate, 1))}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b] ml-1 flex items-center gap-2">
            <Calendar size={12} /> Escolha o Dia
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => (
              <Button
                key={d}
                variant="outline"
                onClick={() => setDayOfMonth(d)}
                className={`h-10 w-full p-0 rounded-lg border-2 transition-all text-xs ${
                  dayOfMonth === d 
                    ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c] font-bold" 
                    : "border-[#e8f0f7] text-muted-foreground"
                }`}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b] ml-1 flex items-center gap-2">
            <Clock size={12} /> Horário
          </label>
          <Input 
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-14 rounded-2xl border-2 border-[#e8f0f7] text-center text-xl font-bold text-[#2c3e6b]"
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-14 rounded-2xl bg-[#2c3e6b] text-white font-bold text-lg shadow-lg"
        >
          {isSaving ? "Salvando..." : "Confirmar para este mês"}
        </Button>
      </div>
    </div>
  );
};

export default DeverSentarSchedule;