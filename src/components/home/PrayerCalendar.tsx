"use client";

import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PrayerCalendarProps {
  completedDays: string[];
}

const PrayerCalendar = ({ completedDays }: PrayerCalendarProps) => {
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
          const isCompleted = completedDays.includes(dateKey);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={idx}
              className={cn(
                "aspect-square flex items-center justify-center text-xs rounded-xl transition-all duration-300",
                !isCurrentMonth && "opacity-20",
                isCompleted ? "bg-[#c9a84c] text-white shadow-md shadow-yellow-200" : "bg-muted/50 text-muted-foreground",
                isToday(day) && !isCompleted && "border-2 border-[#c9a84c] text-[#c9a84c] font-bold"
              )}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerCalendar;