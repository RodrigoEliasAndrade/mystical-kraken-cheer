"use client";

import React from 'react';
import { Home, Target, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'home', label: 'Início', icon: Home, path: '/' },
  { id: 'pce', label: 'PCEs', icon: Target, path: '/pce' },
  { id: 'diary', label: 'Diário', icon: BookOpen, path: '/diary' },
  { id: 'couple', label: 'Casal', icon: Users, path: '/couple' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t flex items-center justify-around px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 flex-1 py-2 transition-all duration-300",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-1 rounded-xl transition-all duration-300",
              isActive && "bg-primary/10"
            )}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;