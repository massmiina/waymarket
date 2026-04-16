'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Shield, Trash2 } from 'lucide-react';
import { Listing } from '@/contexts/MarketContext';
import { useMarket } from '@/contexts/MarketContext';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { currentUser, favorites, toggleFavorite } = useMarket();
  const isFavorite = favorites.includes(listing.id);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    
    try {
      const res = await fetch(`/api/listings/${listing.id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload(); // Quick refresh
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    }
  };

  return (
    <div className="bg-white rounded-[1.5rem] shadow-xl shadow-peaks/5 border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-peaks/10 transition-all duration-500 group flex flex-col h-full w-full relative">
      <Link href={`/listings/${listing.id}`} className="relative aspect-[4/3] w-full overflow-hidden block shrink-0">
        <Image
          src={listing.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <div className="glass-card px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm border-white/50">
            {listing.category}
          </div>
          {listing.seller?.isPro && (
            <div className="bg-gradient-to-r from-glacier to-indigo-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-xl shadow-glacier/30 flex items-center gap-1.5 animate-in slide-in-from-top-2 duration-700 ring-2 ring-white/20">
              <Shield className="h-3.5 w-3.5" />
              Pro
            </div>
          )}
        </div>
      </Link>

      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(listing.id);
          }}
          className="p-2.5 rounded-xl glass-card hover:bg-white transition-all text-slate-400 hover:text-red-500 shadow-sm border-white/50 active:scale-90"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-90 flex items-center justify-center animate-in fade-in zoom-in duration-300"
            title="Supprimer (Admin)"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <Link href={`/listings/${listing.id}`} className="p-3 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 group-hover:text-glacier transition-colors line-clamp-2 leading-tight mb-1 sm:mb-2 text-sm sm:text-lg">
          {listing.title}
        </h3>
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <p className="text-lg sm:text-2xl font-black text-peaks tracking-tighter">{listing.price} €</p>
          <div className="hidden sm:block h-1 w-8 bg-glacier rounded-full opacity-60"></div>
        </div>
        
        <div className="mt-auto pt-2 sm:pt-4 border-t border-slate-50 flex items-center justify-between text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-50 flex items-center justify-center rounded-lg">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:h-3 text-glacier" />
            </div>
            <span className="truncate max-w-[60px] sm:max-w-[100px]">{listing.location}</span>
          </div>
          <span className="bg-slate-50 px-1.5 py-0.5 rounded-md hidden xxs:block">
            {new Date(listing.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            })}
          </span>
        </div>
      </Link>
    </div>
  );
}
