'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';
import CategoryFilter from '@/components/CategoryFilter';
import { useMarket, Category } from '@/contexts/MarketContext';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const { listings, isLoading, metadata, fetchMoreListings } = useMarket();
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'Toutes'>('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState('');
  const [gearboxQuery, setGearboxQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleLoadMore = async () => {
    setIsMoreLoading(true);
    await fetchMoreListings();
    setIsMoreLoading(false);
  };

  const filteredListings = listings.filter((listing) => {
    const matchesCategory = activeCategory === 'Toutes' || listing.category === activeCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = maxPrice === '' || listing.price <= Number(maxPrice);
    const matchesLocation = locationQuery === '' || listing.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    let matchesGearbox = true;
    if (activeCategory === 'Véhicules' && gearboxQuery !== '') {
      if (listing.category === 'Véhicules' && listing.details && 'gearbox' in listing.details) {
        matchesGearbox = listing.details.gearbox === gearboxQuery;
      } else {
        matchesGearbox = false;
      }
    }
                          
    return matchesCategory && matchesSearch && matchesPrice && matchesLocation && matchesGearbox;
  });

  return (
    <>
      <Navbar />
      
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-8 flex-grow">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Annonces récentes</h1>
          <p className="text-gray-500 mt-1">Trouvez la perle rare parmi nos annonces</p>
        </div>

        {/* Filters Box */}
        <div className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 mb-8">
          
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            {/* Recherche mot clé Principale */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 text-gray-900 font-medium"
              />
            </div>
            
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="md:hidden flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 active:scale-[0.98] transition"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ${isFiltersOpen ? 'block' : 'hidden md:grid'} mb-4 mt-4`}>
            {/* Localisation */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 text-lg flex items-center pointer-events-none text-gray-400">
                📍
              </div>
              <input
                type="text"
                placeholder="Localisation (ex: Paris)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
              />
            </div>

            {/* Price Max */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 text-base flex items-center pointer-events-none text-gray-400 font-medium">
                €
              </div>
              <input
                type="number"
                min="0"
                placeholder="Budget maximal"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
            
            {/* Gearbox filter (Only for Vehicles) */}
            {activeCategory === 'Véhicules' && (
              <div className="relative mt-2 lg:mt-0">
                <select
                  value={gearboxQuery}
                  onChange={(e) => setGearboxQuery(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 text-gray-600 outline-none"
                >
                  <option value="">Boîtes de vitesses (Toutes)</option>
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                  <option value="Séquentielle">Séquentielle</option>
                </select>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100">
            <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {metadata.hasMore && (
              <div className="mt-12 text-center pb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isMoreLoading}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-gray-200 rounded-2xl text-indigo-600 font-bold hover:bg-gray-50 transition shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {isMoreLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      Afficher plus d'annonces
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Aucune annonce trouvée</h3>
            <p className="text-gray-500 text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
          </div>
        )}

      </main>
    </>
  );
}
