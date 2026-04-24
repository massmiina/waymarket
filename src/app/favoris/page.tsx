'use client';

import React from 'react';
import ListingCard from '@/components/ListingCard';
import { useMarket } from '@/contexts/MarketContext';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { listings, favorites, currentUser } = useMarket();

  if (!currentUser) return null;

  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex-grow w-full">
        
        {/* Header Area (Messagerie Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-forest-green tracking-tighter leading-none font-[family-name:var(--font-playfair)] italic">Mes Favoris</h1>
            <p className="text-[9px] sm:text-[10px] font-black text-emerald/40 uppercase tracking-[0.2em]">Votre collection privée</p>
          </div>
          <div className="px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-forest-green/40 flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 fill-emerald text-emerald" />
            {favoriteListings.length} Article{favoriteListings.length > 1 ? 's' : ''}
          </div>
        </div>

        {favoriteListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favoriteListings.map(listing => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-24 text-center bg-white rounded-[44px] shadow-2xl shadow-emerald/5 border border-white">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-emerald/5 rounded-[28px] sm:rounded-[32px] flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Heart className="h-6 w-6 sm:h-10 sm:h-10 text-emerald/20" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-forest-green tracking-tight mb-2 sm:mb-3 font-[family-name:var(--font-playfair)] italic">Votre cœur est vide</h3>
            <p className="text-forest-green/40 font-medium mb-8 sm:mb-10 max-w-[240px] sm:max-w-xs mx-auto text-xs sm:text-sm leading-relaxed">
              Ajoutez des annonces à vos favoris pour les retrouver facilement ici.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald text-white font-black rounded-2xl hover:bg-emerald-hover transition-all shadow-xl shadow-emerald/10 active:scale-95 text-[10px] uppercase tracking-widest font-[family-name:var(--font-outfit)]"
            >
              Parcourir les annonces
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
