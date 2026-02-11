"use client";

import React, { useEffect, useState } from 'react';
import { Bell, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName?: string;
  partnerName?: string;
  celebration?: string;
  saint?: string;
}

const Header = ({ 
  userName = "Rodrigo", 
  partnerName = "Vivian", 
  celebration, 
  saint 
}: HeaderProps) => {
  const [liturgicalColor, setLiturgicalColor] = useState("#2c3e6b");
  const goldColor = "#c9a84c"; // Dourado solicitado

  useEffect(() => {
    fetch('https://liturgia.up.railway.app/')
      .then(res => res.json())
      .then(data => {
        const colors: Record<string, string> = { 
          'Verde': '#2d5a27', 
          'Roxo': '#4a148c', 
          'Branco': '#ffffff', 
          'Vermelho': '#b71c1c',
          'Rosa': '#d81b60'
        };
        if (data.cor && colors[data.cor]) {
          setLiturgicalColor(colors[data.cor]);
        }
      })
      .catch(err => console.error("Erro ao buscar cor litúrgica:", err));
  }, []);

  return (
    <header 
      className="relative pt-12 pb-10 px-6 text-center text-white rounded-b-[2.5rem] shadow-xl transition-colors duration-1000"
      style={{ backgroundColor: liturgicalColor }}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-none">
          <ScrollText size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-none">
          <Bell size={20} />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl" style={{ color: liturgicalColor === '#ffffff' ? '#2c3e6b' : goldColor }}>✝</span>
        <h1 className={`text-xl font-black tracking-[0.2em] uppercase ${liturgicalColor === '#ffffff' ? 'text-[#2c3e6b]' : 'text-white'}`}>
          ENS DIA A DIA
        </h1>
        <p className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 -mt-1 ${liturgicalColor === '#ffffff' ? 'text-[#2c3e6b]' : 'text-white'}`}>
          Equipes de Nossa Senhora
        </p>
        
        <div className="mt-4">
          <p className={`text-sm font-bold opacity-90 ${liturgicalColor === '#ffffff' ? 'text-[#2c3e6b]' : 'text-white'}`}>
            {userName} & {partnerName}
          </p>
          {celebration && (
            <p className={`text-xs italic opacity-80 mt-1 max-w-[280px] mx-auto leading-tight ${liturgicalColor === '#ffffff' ? 'text-[#2c3e6b]' : 'text-white'}`}>
              {celebration}
            </p>
          )}
          {saint && (
            <p className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: liturgicalColor === '#ffffff' ? '#2c3e6b' : goldColor }}>
              {saint}
            </p>
          )}
        </div>
        
        <div 
          className="mt-6 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg"
          style={{ 
            backgroundColor: liturgicalColor === '#ffffff' ? '#2c3e6b' : goldColor,
            color: 'white'
          }}
        >
          Oração Diária
        </div>
      </div>
    </header>
  );
};

export default Header;