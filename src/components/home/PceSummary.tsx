"use client";

import React from 'react';
import { Card } from '@/components/ui/card';

interface PceSummaryProps {
  ruleOfLife?: string;
  lastWord?: string;
}

const PceSummary = ({ ruleOfLife, lastWord }: PceSummaryProps) => {
  return (
    <div className="space-y-4 mt-6">
      <Card className="p-5 rounded-[2rem] border-none bg-[#2c3e6b]/5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2c3e6b] block mb-2">
          Minha Regra de Vida
        </span>
        <p className="text-sm leading-relaxed text-foreground/80 italic">
          {ruleOfLife || "Nenhuma regra definida para este mês."}
        </p>
      </Card>

      <Card className="p-5 rounded-[2rem] border-none bg-[#c9a84c]/10">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c] block mb-2">
          Última Escuta da Palavra
        </span>
        <p className="text-sm leading-relaxed text-foreground/80">
          {lastWord || "Nenhum registro recente."}
        </p>
      </Card>
    </div>
  );
};

export default PceSummary;