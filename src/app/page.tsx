'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';
import CategoryFilter from '@/components/CategoryFilter';
import { useMarket, Category } from '@/contexts/MarketContext';
import { Search, SlidersHorizontal, MapPin, Euro, Calendar, Gauge, Crown, Zap } from 'lucide-react';
import { CAR_DATA, FUEL_TYPES, GEARBOX_TYPES, COLORS, CLOTHING_SIZES } from '@/lib/constants';

export default function Home() {
  const { listings, isLoading, metadata, fetchMoreListings } = useMarket();
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'Toutes'>('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Advanced Filters
  const [brandQuery, setBrandQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [minYear, setMinYear] = useState('');
  const [fuelQuery, setFuelQuery] = useState('');
  const [gearboxQuery, setGearboxQuery] = useState('');
  const [colorQuery, setColorQuery] = useState('');
  const [sizeQuery, setSizeQuery] = useState('');

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
    
    // Cast details to any for flexible cross-category filtering
    const details = (listing.details as any) || {};

    // Vehicle Specific Filtering
    if (activeCategory === 'Véhicules' && listing.category === 'Véhicules') {
      const matchesBrand = brandQuery === '' || details.brand === brandQuery;
      const matchesModel = modelQuery === '' || details.model === modelQuery;
      const matchesMileage = maxMileage === '' || (details.mileage as number) <= Number(maxMileage);
      const matchesYear = minYear === '' || (details.year as number) >= Number(minYear);
      const matchesFuel = fuelQuery === '' || details.fuelType === fuelQuery;
      const matchesGearbox = gearboxQuery === '' || details.gearbox === gearboxQuery;
      const matchesColor = colorQuery === '' || details.color === colorQuery;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesLocation && matchesBrand && matchesModel && matchesMileage && matchesYear && matchesFuel && matchesGearbox && matchesColor;
    }

    // Generic Color & Size Filtering (for applicable categories)
    const matchesColor = colorQuery === '' || details.color === colorQuery;
    const matchesSize = sizeQuery === '' || details.size === sizeQuery;
                          
    return matchesCategory && matchesSearch && matchesPrice && matchesLocation && matchesColor && matchesSize;
  }).sort((a, b) => {
    const aPro = a.seller?.isPro ? 1 : 0;
    const bPro = b.seller?.isPro ? 1 : 0;
    return bPro - aPro; // Pro first
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* ULTRA-MINIMALIST HERO */}
      <section className="relative h-[45vh] sm:h-[65vh] flex items-center justify-center overflow-hidden bg-[#f0f4f8]">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200/50 via-white to-white"></div>
          {/* Subtle Mountain Jagged Pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-[20vh] sm:h-[40vh] mountain-jagged bg-slate-100 opacity-20"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-glacier/5 blur-[80px] sm:blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-4 sm:px-6">
          <div className="glass-card p-1.5 sm:p-2 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Localisation</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-glacier">
                      <MapPin className="h-4 w-4" />
                   </div>
                   <input
                    type="text"
                    placeholder="Ex: Paris"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none placeholder:text-slate-200"
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
                    className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none placeholder:text-slate-200"
                  />
                </div>
              </div>

              {/* Vehicle specific UI */}
              {activeCategory === 'Véhicules' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Marque</label>
                    <div className="relative group">
                      <select
                        value={brandQuery}
                        onChange={(e) => {
                          setBrandQuery(e.target.value);
                          setModelQuery('');
                        }}
                        className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Toutes</option>
                        {Object.keys(CAR_DATA).sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-glacier">
                        <SlidersHorizontal className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Kilométrage Max</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-glacier">
                        <Gauge className="h-4 w-4" />
                      </div>
                      <input
                        type="number"
                        placeholder="Ex: 100000"
                        value={maxMileage}
                        onChange={(e) => setMaxMileage(e.target.value)}
                        className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none placeholder:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Carburant</label>
                    <select
                      value={fuelQuery}
                      onChange={(e) => setFuelQuery(e.target.value)}
                      className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Tous</option>
                      {FUEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Boîte de vitesse</label>
                    <select
                      value={gearboxQuery}
                      onChange={(e) => setGearboxQuery(e.target.value)}
                      className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Toutes</option>
                      {GEARBOX_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Generic Filters (Color for most, Size for clothing) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Couleur</label>
                  <select
                    value={colorQuery}
                    onChange={(e) => setColorQuery(e.target.value)}
                    className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Toutes</option>
                    {COLORS.map(color => <option key={color} value={color}>{color}</option>)}
                  </select>
                </div>

                {activeCategory === 'Vêtements' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Taille</label>
                    <select
                      value={sizeQuery}
                      onChange={(e) => setSizeQuery(e.target.value)}
                      className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Toutes</option>
                      {CLOTHING_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Second Row for Vehicle details if Category is Véhicules */}
            {activeCategory === 'Véhicules' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Modèle</label>
                  <select
                    disabled={!brandQuery}
                    value={modelQuery}
                    onChange={(e) => setModelQuery(e.target.value)}
                    className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-300"
                  >
                    <option value="">{brandQuery ? 'Tous les modèles' : 'Choisir une marque'}</option>
                    {brandQuery && CAR_DATA[brandQuery]?.map(model => <option key={model} value={model}>{model}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Année Min</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-glacier">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      placeholder="Ex: 2015"
                      value={minYear}
                      onChange={(e) => setMinYear(e.target.value)}
                      className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-white font-bold transition-all focus:outline-none placeholder:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-50">
              <CategoryFilter activeCategory={activeCategory} onSelect={(cat) => {
                setActiveCategory(cat);
                // Reset sub-filters when category changes
                setBrandQuery('');
                setModelQuery('');
                setMaxMileage('');
                setMinYear('');
                setFuelQuery('');
                setGearboxQuery('');
                setColorQuery('');
                setSizeQuery('');
              }} />
            </div>
          </div>
        )}

        {/* Categories Bar (Visible when main filters are hidden) */}
        {!isFiltersOpen && (
          <div className="mb-8 sm:mb-12 flex justify-center">
            <div className="w-full max-w-xl bg-white/50 backdrop-blur-sm p-2 sm:p-1.5 rounded-[2rem] sm:rounded-full border border-slate-100">
               <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
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
        {/* PREMIUM PRO SECTION */}
        <section className="mt-24 sm:mt-32 mb-12 sm:mb-20">
          <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 sm:p-16 text-center shadow-2xl shadow-slate-900/10">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-glacier rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-400 rounded-full blur-[120px] opacity-10 -ml-32 -mb-32"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-glacier/10 border border-glacier/20 rounded-full text-glacier text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Crown className="w-3.5 h-3.5" />
                Way Market Elite
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Passez au niveau <span className="text-glacier text-shadow-sm shadow-glacier/50">supérieur</span>
              </h2>
              <p className="text-slate-400 font-medium mb-10 text-base sm:text-lg">
                Visibilité boostée, badge de confiance et outils exclusifs. Pour une durée limitée, le mode Pro est gratuit pour les 1000 premiers membres.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/pro"
                  className="w-full sm:w-auto px-10 py-4 bg-glacier text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-glacier/20 active:scale-95"
                >
                  Découvrir les avantages
                </Link>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-glacier" />
                  Activation Instantanée
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
