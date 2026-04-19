'use client';

import React from 'react';
import { Category } from '@/contexts/MarketContext';
import { Car, Sofa, Smartphone, Gamepad2, ShoppingBag, Home, LayoutGrid, Wrench } from 'lucide-react';

const categories: { name: Category | 'Toutes'; icon: React.ReactNode; color: string }[] = [
  { name: 'Toutes', icon: <LayoutGrid />, color: 'bg-forest-green' },
  { name: 'Véhicules', icon: <Car />, color: 'bg-emerald' },
  { name: 'Équipements auto', icon: <Wrench />, color: 'bg-emerald-light' },
  { name: 'Mobilier', icon: <Sofa />, color: 'bg-forest-green' },
  { name: 'Électronique', icon: <Smartphone />, color: 'bg-emerald' },
  { name: 'Jouets', icon: <Gamepad2 />, color: 'bg-emerald-light' },
  { name: 'Vêtements', icon: <ShoppingBag />, color: 'bg-forest-green' },
  { name: 'Immobilier', icon: <Home />, color: 'bg-emerald' },
  { name: 'Autres', icon: <ShoppingBag />, color: 'bg-slate-900' },
];

interface CategoryBlocksProps {
  activeCategory: Category | 'Toutes';
  onSelect: (category: Category | 'Toutes') => void;
}

export default function CategoryBlocks({ activeCategory, onSelect }: CategoryBlocksProps) {
  return (
    <div className="grid grid-cols-3 sm:flex sm:overflow-x-auto py-8 gap-4 sm:gap-6 hide-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`group flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-[2.5rem] transition-all duration-500 shadow-xl ${
            activeCategory === cat.name
              ? `${cat.color} scale-105 shadow-2xl`
              : `bg-white hover:bg-slate-50 border border-slate-100`
          }`}
        >
          <div className={`mb-3 transition-all duration-500 ${
            activeCategory === cat.name ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-900'
          }`}>
            {React.cloneElement(cat.icon as React.ReactElement<{ size?: number }>, { size: 18 })}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-colors duration-500 ${
            activeCategory === cat.name ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'
          }`}>
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}
