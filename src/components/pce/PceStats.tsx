"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PceStatsProps {
  stats: {
    label: string;
    value: number;
    color: string;
  }[];
}

const PceStats = ({ stats }: PceStatsProps) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 border shadow-sm space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2c3e6b] text-center">
        Progresso Mensal
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-muted-foreground">{stat.label}</span>
              <span style={{ color: stat.color }}>{stat.value}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${stat.value}%`, 
                  backgroundColor: stat.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PceStats;