"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PceCardProps {
  icon: string;
  title: string;
  status: string;
  info?: string;
  isCompleted?: boolean;
  onClick?: () => void;
}

const PceCard = ({ icon, title, status, info, isCompleted, onClick }: PceCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="p-4 rounded-2xl border-none bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
    >
      <div className="w-12 h-12 rounded-xl bg-[#e8f0f7] flex items-center justify-center text-2xl">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2c3e6b] mb-0.5">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-medium",
            isCompleted ? "text-green-600" : "text-muted-foreground"
          )}>
            {isCompleted ? "✅ " : "⏳ "}{status}
          </span>
          {info && (
            <span className="text-[10px] text-[#c9a84c] font-bold bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">
              {info}
            </span>
          )}
        </div>
      </div>
      
      <ChevronRight size={18} className="text-muted-foreground group-hover:text-[#c9a84c] transition-colors" />
    </Card>
  );
};

export default PceCard;