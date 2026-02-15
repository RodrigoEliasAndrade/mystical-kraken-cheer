"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface DeverSentarScheduleProps {
  coupleId: string;
  currentSchedule?: any;
  onBack: () => void;
}

const DAYS = [
  { id: 0, label: 'Domingo' },
  { id: 1, label: 'Segunda' },
  { id: 2, label: 'Terça' },
  { id: 3, label: 'Quarta' },
  { id: 4, label: 'Quinta' },
  { id: 5, label: 'Sexta' },
  { id: 6, label: 'Sábado' },
];

const DeverSentarSchedule = ({ coupleId, currentSchedule, onBack }: DeverSentarScheduleProps) => {
  const [day, setDay] = useState(currentSchedule?.dayOfWeek ?? 5);
  const [time, setTime] = useState(currentSchedule?.time ?? "21:00");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const deverRef = doc(db, 'couples', coupleId, 'pces', 'deverSentar');
      await setDoc(deverRef, {
        schedule: {
          dayOfWeek: day,
          time: time,
          reminderEnabled: true
        }
      }, { merge: true });
      
      toast.success("Agendamento salvo! 📅");
      onBack();
    } catch (error) {
      toast.error("Erro ao salvar agendamento.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold text-[#2c3e6b]">Agendar Horário</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2c3e6b] ml-1 flex items-center gap-2">
            <Calendar size={12} /> Dia da Semana
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DAYS.map((d) => (
              <Button
                key={d.id}
                variant="outline"
                onClick={() => setDay(d.id)}
                className={`h-12 rounded-xl border-2 transition-all ${
                  day === d.id 
                    ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c] font-bold" 
                    : "border-[#e8f0f7] text-muted-foreground"
                }`}
              >
                {d.label}
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