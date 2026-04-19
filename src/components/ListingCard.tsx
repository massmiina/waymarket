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
    <div className="group flex flex-col h-full w-full relative transition-all duration-700">
      {/* Image Container (Elite Gallery Style) */}
      <Link href={`/listings/${listing.id}`} className="relative aspect-[4/5] w-full overflow-hidden block shrink-0 rounded-[32px] border border-slate-50 shadow-sm group-hover:shadow-2xl group-hover:shadow-emerald-900/10 transition-all duration-700">
        <Image
          src={listing.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Subtle Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-forest-green border border-white/50">
            {listing.category}
          </div>
        </div>

        {/* Favorite Button (Emerald Elite Style) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(listing.id);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-emerald transition-all border border-white/50 active:scale-90 shadow-sm"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-emerald text-emerald' : ''}`} />
        </button>
      </Link>

      {/* Content Area (Editorial Typography) */}
      <div className="pt-6 flex flex-col flex-grow px-2">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-xl font-black text-forest-green tracking-tighter leading-tight line-clamp-2">
            <Link href={`/listings/${listing.id}`} className="hover:text-emerald transition-colors font-[family-name:var(--font-playfair)] italic">
              {listing.title}
            </Link>
          </h3>
          <span className="text-xl font-black text-forest-green tracking-tighter shrink-0">{listing.price} €</span>
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <MapPin className="h-3 w-3" />
            {listing.location}
          </div>
          {listing.seller?.isPro && (
             <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 bg-emerald/10 text-emerald rounded-full">
               <Shield className="h-2.5 w-2.5 text-emerald" />
               Pro
             </span>
          )}
        </div>

        {/* Admin Secret Action */}
        {currentUser?.role === 'ADMIN' && (
          <div className="mt-4 pt-4 border-t border-slate-50">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Supprimer l&apos;annonce
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
