'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import { useMarket } from '@/contexts/MarketContext';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { listings, favorites, currentUser } = useMarket();

  if (!currentUser) return null;

  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-8 flex-grow w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-red-100 p-3 rounded-full text-red-500">
            <Heart className="w-6 h-6 fill-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
        </div>

        {favoriteListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {favoriteListings.map(listing => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori pour le moment</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Vous n&apos;avez pas encore ajouté d&apos;annonces à vos favoris. Parcourez nos annonces et cliquez sur le cœur pour les sauvegarder ici.
            </p>
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition">
              Découvrir les annonces
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
