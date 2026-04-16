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
    <div className="grid grid-cols-3 sm:flex sm:overflow-x-auto py-2 sm:py-4 hide-scrollbar gap-2 sm:gap-4">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl transition border ${
            activeCategory === cat.name
              ? 'bg-glacier/5 border-glacier/20 text-glacier font-black uppercase tracking-widest'
              : 'bg-white/50 border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900 font-bold uppercase tracking-widest'
          }`}
        >
          <div className="transform scale-90 sm:scale-100">
            {cat.icon}
          </div>
          <span className="text-[8px] sm:text-xs text-center line-clamp-1">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
