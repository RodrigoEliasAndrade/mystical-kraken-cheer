"use client";

import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PrayerCalendarProps {
  completedDays: string[];
  deverData?: any;
  onDayClick?: (date: string, type: 'prayer' | 'dever_scheduled' | 'dever_completed') => void;
}

const PrayerCalendar = ({ completedDays, deverData, onDayClick }: PrayerCalendarProps) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDeverMarker = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const isCompleted = deverData?.completions?.includes(dateKey) || 
                        deverData?.notes?.some((n: any) => n.date === dateKey);
    const isScheduled = deverData?.schedule?.dayOfWeek === getDay(day);

    if (isCompleted) {
      return isToday(day) ? '💚' : '✅';
    }
    if (isScheduled) {
      return '💑';
    }
    return null;
  };

  return (
    <div className="bg-card rounded-[2rem] p-6 border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
          {format(today, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
          <span className="text-[#c9a84c]">✨ {completedDays.length} dias</span>
          <span className="text-primary">⚡ Streak: 0</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-[10px] font-bold text-muted-foreground text-center pb-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const isPrayerCompleted = completedDays.includes(dateKey);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const deverMarker = getDeverMarker(day);
          
          return (
            <div
              key={idx}
              onClick={() => {
                if (deverMarker === '✅' || deverMarker === '💚') {
                  onDayClick?.(dateKey, 'dever_completed');
                } else if (deverMarker === '💑') {
                  onDayClick?.(dateKey, 'dever_scheduled');
                }
              }}
              className={cn(
                "aspect-square flex flex-col items-center justify-center text-xs rounded-xl transition-all duration-300 relative cursor-pointer",
                !isCurrentMonth && "opacity-20",
                isPrayerCompleted ? "bg-[#c9a84c] text-white shadow-md shadow-yellow-200" : "bg-muted/50 text-muted-foreground",
                isToday(day) && !isPrayerCompleted && "border-2 border-[#c9a84c] text-[#c9a84c] font-bold"
              )}
            >
              <span>{format(day, 'd')}</span>
              {deverMarker && (
                <span className="text-[8px] absolute -bottom-1">{deverMarker}</span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-center gap-4 text-[8px] font-bold uppercase text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1"><span>💑</span> Agendado</div>
        <div className="flex items-center gap-1"><span>✅</span> Concluído</div>
        <div className="flex items-center gap-1"><span>💚</span> Hoje</div>
      </div>
    </div>
  );
};

export default PrayerCalendar;