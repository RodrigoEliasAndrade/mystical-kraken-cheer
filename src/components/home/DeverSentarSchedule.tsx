"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DeverSentarScheduleProps {
  coupleId: string;
  currentSchedule?: any;
  onBack: () => void;
}

const DeverSentarSchedule = ({ coupleId, currentSchedule, onBack }: DeverSentarScheduleProps) => {
  const [dayOfMonth, setDayOfMonth] = useState(currentSchedule?.dayOfMonth ?? 15);
  const [time, setTime] = useState(currentSchedule?.time ?? "21:00");
  const [isSaving, setIsSaving] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const deverRef = doc(db, 'couples', coupleId, 'pces', 'deverSentar');
      await setDoc(deverRef, {
        schedule: {
          dayOfMonth: dayOfMonth,
          time: time,
          reminderEnabled: true
        }
      }, { merge: true });
      
      toast.success("Agendamento mensal salvo! 📅");
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
        <h2 className="text-xl font-bold text-[#2c3e6b]">Agendamento Mensal</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b] ml-1 flex items-center gap-2">
            <Calendar size={12} /> Dia do Mês
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
            <Clock size={12} /> Horário Preferido
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
          {isSaving ? "Salvando..." : "Confirmar Agendamento"}
        </Button>
      </div>
    </div>
  );
};

export default DeverSentarSchedule;