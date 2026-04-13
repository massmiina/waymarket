'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';
import CategoryFilter from '@/components/CategoryFilter';
import { useMarket, Category } from '@/contexts/MarketContext';
import { Search, SlidersHorizontal, MapPin, Euro } from 'lucide-react';

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
  }).sort((a, b) => {
    const aPro = a.seller?.isPro ? 1 : 0;
    const bPro = b.seller?.isPro ? 1 : 0;
    return bPro - aPro; // Pro first
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* ULTRA-MINIMALIST HERO */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-[#f0f4f8]">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200/50 via-white to-white"></div>
          {/* Subtle Mountain Jagged Pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-[40vh] mountain-jagged bg-slate-100 opacity-20"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-glacier/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-6">
          <div className="glass-card p-2 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-300 group-focus-within:text-glacier transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-14 pr-6 py-5 border-none rounded-[2rem] focus:ring-0 bg-transparent text-slate-900 font-bold text-xl placeholder-slate-300 transition-all"
              />
            </div>
          </div>
          
          {/* Quick Filters Toggle */}
          <div className="mt-8 flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-full border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-glacier transition-colors"
                >
                  {isFiltersOpen ? 'Masquer les filtres' : 'Affiner la recherche'}
                </button>
             </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-12 flex-grow">
        
        {/* Expanded Filters */}
        {isFiltersOpen && (
          <div className="glass-card p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 mb-12 animate-in fade-in zoom-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Localisation</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-glacier">
                      <MapPin className="h-4 w-4" />
                   </div>
                   <input
                    type="text"
                    placeholder="Ex: Gudauri"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Budget Max</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-glacier">
                    <Euro className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50">
              <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />
            </div>
          </div>
        )}

        {/* Categories Bar (Visible when main filters are hidden) */}
        {!isFiltersOpen && (
          <div className="mb-12 flex justify-center">
            <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-100">
               <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />
            </div>
          </div>
        )}

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
              <div className="mt-20 text-center pb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isMoreLoading}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white border border-slate-200 rounded-full text-glacier font-black hover:bg-slate-50 transition shadow-xl shadow-peaks/5 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px]"
                >
                  {isMoreLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-glacier border-t-transparent rounded-full animate-spin"></div>
                      Chargement...
                    </>
                  ) : (
                    <>Afficher plus</>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 glass-card rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100/20">
            <div className="inline-flex p-6 rounded-full bg-slate-50 mb-6 font-bold text-3xl">🏔️</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-widest">Le calme avant la tempête</h3>
            <p className="text-slate-400 text-sm font-medium">Aucune annonce ne correspond à votre recherche pour le moment.</p>
          </div>
        )}

      </main>
    </div>
  );
}
