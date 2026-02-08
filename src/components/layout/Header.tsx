"use client";

import React from 'react';
import { Bell, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName: string;
  partnerName?: string;
  celebration?: string;
  saint?: string;
}

const Header = ({ userName, partnerName, celebration, saint }: HeaderProps) => {
  // Fixed Blue Color: #2c3e6b
  const bgColor = "#2c3e6b";

  return (
    <header 
      className="relative pt-12 pb-10 px-6 text-center text-white rounded-b-[2.5rem] shadow-xl"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
          <ScrollText size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
          <Bell size={20} />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl text-[#c9a84c]">✝</span>
        <h1 className="text-lg font-bold tracking-widest uppercase">Equipes de Nossa Senhora</h1>
        
        <div className="mt-2">
          <p className="text-sm font-bold opacity-90">
            {userName} {partnerName ? `& ${partnerName}` : ''}
          </p>
          {celebration && (
            <p className="text-xs italic opacity-80 mt-1 max-w-[280px] mx-auto leading-tight">
              {celebration}
            </p>
          )}
          {saint && (
            <p className="text-[10px] font-bold text-[#c9a84c] mt-1 uppercase tracking-wider">
              {saint}
            </p>
          )}
        </div>
        
        <div className="mt-4 px-5 py-1.5 bg-[#c9a84c] rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white shadow-lg">
          Oração Diária
        </div>
      </div>
    </header>
  );
};

export default Header;