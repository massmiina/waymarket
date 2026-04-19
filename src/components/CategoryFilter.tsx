'use client';

import React from 'react';
import { Category } from '@/contexts/MarketContext';
import { Car, Sofa, Smartphone, Gamepad2, ShoppingBag, Home, LayoutGrid, Wrench } from 'lucide-react';

const categories: { name: Category | 'Toutes'; icon: React.ReactNode }[] = [
  { name: 'Toutes', icon: <LayoutGrid className="w-5 h-5 mb-1" /> },
  { name: 'Véhicules', icon: <Car className="w-5 h-5 mb-1" /> },
  { name: 'Équipements auto', icon: <Wrench className="w-5 h-5 mb-1" /> },
  { name: 'Mobilier', icon: <Sofa className="w-5 h-5 mb-1" /> },
  { name: 'Électronique', icon: <Smartphone className="w-5 h-5 mb-1" /> },
  { name: 'Jouets', icon: <Gamepad2 className="w-5 h-5 mb-1" /> },
  { name: 'Vêtements', icon: <ShoppingBag className="w-5 h-5 mb-1" /> },
  { name: 'Immobilier', icon: <Home className="w-5 h-5 mb-1" /> },
  { name: 'Autres', icon: <ShoppingBag className="w-5 h-5 mb-1 opacity-50" /> },
];

interface CategoryFilterProps {
  activeCategory: Category | 'Toutes';
  onSelect: (category: Category | 'Toutes') => void;
}

export default function CategoryFilter({ activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="grid grid-cols-3 sm:flex sm:overflow-x-auto py-2 sm:py-4 hide-scrollbar gap-2 sm:gap-3">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 border-2 ${
            activeCategory === cat.name
              ? 'bg-emerald border-emerald text-white shadow-xl shadow-emerald/20 transform scale-[1.05] z-10'
              : 'bg-white border-slate-50 text-slate-400 hover:border-emerald/20 hover:text-emerald font-bold uppercase tracking-widest'
          }`}
        >
          <div className={`transition-transform duration-500 ${activeCategory === cat.name ? 'scale-110' : 'group-hover:scale-110'}`}>
            {cat.icon}
          </div>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-center line-clamp-1 mt-1">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
