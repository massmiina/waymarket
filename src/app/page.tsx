'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';
import CategoryFilter from '@/components/CategoryFilter';
import { useMarket, Category } from '@/contexts/MarketContext';
import { Search, SlidersHorizontal, MapPin, Euro, Calendar, Gauge, Crown } from 'lucide-react';
import { CAR_DATA, FUEL_TYPES, GEARBOX_TYPES, COLORS, CLOTHING_SIZES } from '@/lib/constants';

export default function Home() {
  const { listings, isLoading, metadata, fetchMoreListings, currentUser } = useMarket();
  const [userCount, setUserCount] = useState<number>(0);
  const [showOffer, setShowOffer] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'Toutes'>('Toutes');
  
  useEffect(() => {
    fetch('/api/stats/user-count')
      .then(res => res.json())
      .then(data => {
        setUserCount(data.count || 0);
        setShowOffer(data.count < 1000);
      })
      .catch(() => setShowOffer(false));
  }, []);

  const handleLoadMore = async () => {
    setIsMoreLoading(true);
    await fetchMoreListings();
    setIsMoreLoading(false);
  };
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
    <div className="min-h-screen bg-background">
      
      {/* ADAPTIVE SEARCH HERO (Ultra-Minimalist) */}
      <section className="relative min-h-[30vh] flex flex-col pt-32 pb-12 sm:items-center sm:justify-center overflow-hidden bg-background">
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:items-center">
          
          {/* Adaptive Search Bar (Only focal point) */}
          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="bg-white rounded-full shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] border border-slate-100 p-2 group hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-500">
              <div className="flex items-center gap-4 px-2 sm:px-4">
                
                {/* Keyword Section (flex: 2) */}
                <div className="flex-[2] min-w-0 group/field">
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/50 rounded-full border border-transparent group-focus-within/field:border-emerald/20 group-focus-within/field:bg-white transition-all">
                    <Search className="h-4 w-4 text-slate-300 group-focus-within/field:text-emerald" />
                    <input
                      type="text"
                      placeholder="Article, marque..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border-none focus:ring-0 bg-transparent text-forest-green font-bold text-sm placeholder:text-slate-400 placeholder:font-medium"
                    />
                  </div>
                </div>

                {/* Location Section (flex: 1) */}
                <div className="flex-1 min-w-0 group/field">
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/50 rounded-full border border-transparent group-focus-within/field:border-emerald/20 group-focus-within/field:bg-white transition-all">
                    <MapPin className="h-4 w-4 text-slate-300 group-focus-within/field:text-emerald" />
                    <input
                      type="text"
                      placeholder="Ville"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="w-full border-none focus:ring-0 bg-transparent text-forest-green font-bold text-sm placeholder:text-slate-400 placeholder:font-medium"
                    />
                  </div>
                </div>

                {/* Search Action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`hidden sm:flex p-4 rounded-full transition-all items-center justify-center ${
                      isFiltersOpen 
                        ? 'bg-emerald/10 text-emerald border border-emerald/20' 
                        : 'bg-slate-50 text-slate-400 hover:bg-emerald/5 hover:text-emerald border border-transparent'
                    }`}
                    title="Filtres"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  <button className="h-12 w-12 sm:h-14 sm:w-14 bg-emerald text-white rounded-full flex items-center justify-center hover:bg-emerald-hover transition-all shadow-xl shadow-emerald/10 active:scale-95 group flex-shrink-0">
                    <Search className="h-5 w-5" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-12 flex-grow">
        
        {/* Expanded Filters (Minimalist Style) */}
        {isFiltersOpen && (
          <div className="bg-background border-t border-b border-slate-50 py-12 px-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Localisation</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-forest-green">
                      <MapPin className="h-4 w-4" />
                   </div>
                   <input
                    type="text"
                    placeholder="Ex: Paris"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-emerald bg-background font-bold transition-all focus:outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Budget Max</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-slate-900">
                    <Euro className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-emerald bg-background font-bold transition-all focus:outline-none placeholder:text-slate-300"
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
                        className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-emerald bg-background font-bold transition-all focus:outline-none appearance-none cursor-pointer"
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
                        className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-background font-bold transition-all focus:outline-none placeholder:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Carburant</label>
                    <select
                      value={fuelQuery}
                      onChange={(e) => setFuelQuery(e.target.value)}
                      className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-background font-bold transition-all focus:outline-none appearance-none cursor-pointer"
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
                      className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-background font-bold transition-all focus:outline-none appearance-none cursor-pointer"
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
                    className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-background font-bold transition-all focus:outline-none appearance-none cursor-pointer"
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
                      className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-background font-bold transition-all focus:outline-none appearance-none cursor-pointer"
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
                    className="block w-full pl-6 pr-10 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-background font-bold transition-all focus:outline-none appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-300"
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
                      className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-glacier bg-background font-bold transition-all focus:outline-none placeholder:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Categories Bar (Visible when main filters are hidden) */}

        {/* Listings Grid (Editorial Spacing) */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-12 sm:gap-16">
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
                  className="inline-flex items-center gap-2 px-10 py-4 bg-background border border-slate-200 rounded-full text-glacier font-black hover:bg-slate-50 transition shadow-xl shadow-peaks/5 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px]"
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
            <h3 className="text-xl font-black text-forest-green mb-2 uppercase tracking-widest font-[family-name:var(--font-playfair)] italic">Le calme avant la tempête</h3>
            <p className="text-slate-400 text-sm font-medium">Aucune annonce ne correspond à votre recherche pour le moment.</p>
          </div>
        )}

      </main>
    </div>
  );
}
