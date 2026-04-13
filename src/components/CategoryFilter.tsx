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
    <div className="flex overflow-x-auto py-4 hide-scrollbar gap-2 sm:gap-4 snap-x">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[88px] p-2 rounded-xl transition snap-start border ${
            activeCategory === cat.name
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          {cat.icon}
          <span className="text-[10px] sm:text-xs text-center">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
