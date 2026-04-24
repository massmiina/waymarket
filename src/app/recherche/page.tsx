'use client';
import React, { useState } from 'react';
import { useMarket } from '@/contexts/MarketContext';
import ListingCard from '@/components/ListingCard';
import CategoryBlocks from '@/components/CategoryBlocks';
import { Search, MapPin, SlidersHorizontal, Euro, Car, Crown, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function RecherchePage() {
  const { listings, currentUser } = useMarket();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<any>('Toutes');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');

  // Car Filters
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [manualBrand, setManualBrand] = useState('');
  const [manualModel, setManualModel] = useState('');

  // Fetch makes on mount
  React.useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await fetch('/api/cars/makes');
        const data = await res.json();
        if (Array.isArray(data)) setMakes(data);
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    };
    fetchMakes();
  }, []);

  // Fetch models on brand select
  React.useEffect(() => {
    if (selectedBrandId) {
      const fetchModels = async () => {
        try {
          const res = await fetch(`/api/cars/models?makeId=${selectedBrandId}`);
          const data = await res.json();
          if (Array.isArray(data)) setModels(data);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      };
      fetchModels();
    } else {
      setModels([]);
    }
  }, [selectedBrandId]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = listing.location.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Toutes' || listing.category === activeCategory;
    const matchesPrice = !maxPrice || listing.price <= parseInt(maxPrice);
    
    // Car Specific Filters
    let matchesCarBrand = true;
    let matchesCarModel = true;

    if (activeCategory === 'Véhicules' && listing.category === 'Véhicules' && (selectedBrandName || selectedModel || manualBrand || manualModel)) {
      const details = listing.details;
      const brandToMatch = selectedBrandId === 'other' ? manualBrand : selectedBrandName;
      const modelToMatch = selectedModel === 'other' ? manualModel : selectedModel;

      if (brandToMatch && !details?.brand?.toLowerCase().includes(brandToMatch.toLowerCase())) matchesCarBrand = false;
      if (modelToMatch && !details?.model?.toLowerCase().includes(modelToMatch.toLowerCase())) matchesCarModel = false;
    }
    
    return matchesSearch && matchesLocation && matchesCategory && matchesPrice && matchesCarBrand && matchesCarModel;
  });

  return (
    <div className="min-h-screen bg-background">
      
      {/* UNIFIED SEARCH HERO (Isolated on this page) */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-background px-4 pt-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px] opacity-80"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-100 rounded-full blur-[120px] opacity-50"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          
          <div className="mb-8 text-center">
             <h1 className="text-3xl font-black text-forest-green tracking-tighter mb-2">Rechercher une annonce</h1>
             <p className="text-[10px] font-black text-forest-green/50 uppercase tracking-widest">Trouvez exactement ce que vous cherchez</p>
          </div>

          {/* Main Search Island */}
          <div className="w-full bg-white rounded-full shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 p-2 sm:p-3 animate-in fade-in zoom-in duration-700">
            <div className="flex items-center gap-4 px-2 sm:px-4">
              
              {/* Keyword Section (flex: 2) */}
              <div className="flex-[2] min-w-0 group/field">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/50 rounded-full border border-transparent group-focus-within/field:border-emerald/20 group-focus-within/field:bg-white transition-all">
                  <Search className="h-4 w-4 text-slate-300 group-focus-within/field:text-emerald" />
                  <input
                    type="text"
                    placeholder="Article, marque, service..."
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
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald text-white rounded-full flex items-center justify-center shadow-neon hover:shadow-neon-hover hover:bg-emerald-hover transition-all cursor-pointer active:scale-95">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Color Blocks Filter */}
          <div className="w-full mt-12 overflow-x-auto hide-scrollbar">
            <CategoryBlocks activeCategory={activeCategory} onSelect={setActiveCategory} />
          </div>

          <div className="mt-8">
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-forest-green/40 hover:text-emerald transition-all group"
            >
              <SlidersHorizontal className="h-3 w-3 group-hover:rotate-180 transition-transform duration-700" />
              {isFiltersOpen ? 'Masquer les filtres' : 'Filtres Experts'}
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
        {isFiltersOpen && (
          <div className="bg-background border-t border-b border-slate-50 py-12 px-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-forest-green/50 mb-2 block">Budget Max</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-green/20 group-focus-within:text-emerald">
                        <Euro className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="block w-full pl-12 pr-6 py-4 border-2 border-slate-50 rounded-2xl focus:border-emerald bg-background font-bold transition-all focus:outline-none placeholder:text-forest-green/10 text-forest-green"
                    />
                  </div>
                </div>

                {activeCategory === 'Véhicules' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-forest-green/50 mb-2 block">Marque</label>
                      <div className="space-y-2">
                        <select 
                          value={selectedBrandId} 
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedBrandId(id);
                            setSelectedBrandName(makes.find(m => m.id === id)?.name || '');
                            setSelectedModel('');
                            if (id !== 'other') setManualBrand('');
                          }}
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none text-forest-green"
                        >
                          <option value="">Toutes les marques</option>
                          {makes.map(make => (
                            <option key={make.id} value={make.id}>{make.name}</option>
                          ))}
                          <option value="other">Autre / Saisie manuelle</option>
                        </select>
                        {selectedBrandId === 'other' && (
                          <input 
                            type="text"
                            placeholder="Tapez la marque..."
                            value={manualBrand}
                            onChange={(e) => setManualBrand(e.target.value)}
                            className="w-full bg-white border-2 border-emerald/30 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all text-forest-green animate-in fade-in slide-in-from-top-2"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-forest-green/50 mb-2 block">Modèle</label>
                      <div className="space-y-2">
                        <select 
                          value={selectedModel} 
                          onChange={(e) => {
                            setSelectedModel(e.target.value);
                            if (e.target.value !== 'other') setManualModel('');
                          }}
                          disabled={!selectedBrandId}
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-300 text-forest-green"
                        >
                          <option value="">Tous les modèles</option>
                          {models.map(model => (
                            <option key={model.id} value={model.name}>{model.name}</option>
                          ))}
                          {selectedBrandId && <option value="other">Autre / Saisie manuelle</option>}
                        </select>
                        {selectedModel === 'other' && (
                          <input 
                            type="text"
                            placeholder="Tapez le modèle..."
                            value={manualModel}
                            onChange={(e) => setManualModel(e.target.value)}
                            className="w-full bg-white border-2 border-emerald/30 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all text-forest-green animate-in fade-in slide-in-from-top-2"
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="md:col-span-2 flex justify-end mt-4">
                   <button 
                     onClick={() => {
                       setMaxPrice('');
                       setSelectedBrandId('');
                       setSelectedBrandName('');
                       setSelectedModel('');
                       setManualBrand('');
                       setManualModel('');
                     }}
                     className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
                   >
                     <XCircle className="w-3.5 h-3.5" />
                     Réinitialiser les filtres
                   </button>
                </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-12 sm:gap-16">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        
        {filteredListings.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-forest-green/40 font-bold text-lg">Aucune annonce ne correspond à votre recherche.</p>
          </div>
        )}
      </main>
    </div>
  );
}
