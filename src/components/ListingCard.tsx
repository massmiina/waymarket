'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin } from 'lucide-react';
import { Listing } from '@/contexts/MarketContext';
import { useMarket } from '@/contexts/MarketContext';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { favorites, toggleFavorite } = useMarket();
  const isFavorite = favorites.includes(listing.id);

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 group flex flex-col h-full w-full relative">
      <Link href={`/listings/${listing.id}`} className="relative aspect-[4/3] w-full overflow-hidden block shrink-0">
        <Image
          src={listing.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-md text-[11px] font-bold text-gray-800 shadow-sm">
          {listing.category}
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(listing.id);
        }}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors text-gray-400 hover:text-red-500 shadow-sm z-10 active:scale-95"
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <Link href={`/listings/${listing.id}`} className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
          {listing.title}
        </h3>
        <p className="text-lg font-extrabold text-gray-900 mb-3">{listing.price} €</p>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{listing.location}</span>
          </div>
          <span>
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
