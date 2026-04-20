'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarket, Category } from '@/contexts/MarketContext';
import { 
  UploadCloud, 
  CheckCircle, 
  X, 
  Car, 
  Sofa, 
  Smartphone, 
  Gamepad2, 
  Shirt, 
  Home, 
  Box,
  ChevronRight,
  Wrench,
  XCircle,
  Image as ImageIcon,
  MapPin,
  Tag,
  Info,
  Euro,
  Sparkles
} from 'lucide-react';
import { useUploadThing } from "@/lib/uploadthing";
import { 
  CATEGORIES, 
  CAR_DATA, 
  CONDITIONS, 
  FUEL_TYPES, 
  GEARBOX_TYPES,
  COLORS,
  CRITAIR,
  CLOTHING_SIZES,
  STORAGE_CAPACITIES,
  HEATING_TYPES
} from "@/lib/constants";

export default function CreateListing() {
  const router = useRouter();
  const { currentUser, isLoading } = useMarket();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/auth');
    }
  }, [currentUser, isLoading, router]);

  // Form State
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [details, setDetails] = useState<Record<string, string | number | boolean>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Dynamic Car Data
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedMakeId, setSelectedMakeId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        setImages(prev => [...prev, ...res.map(f => f.url)]);
      }
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadError: (error) => {
      alert(`Erreur d'upload: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const limit = currentUser?.isPro ? 10 : 3;
    if (images.length + files.length > limit) {
      alert(`Vous ne pouvez pas ajouter plus de ${limit} photos.`);
      return;
    }

    setIsUploading(true);
    await startUpload(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Auto-scroll to next section
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) router.push('/auth');
  }, [currentUser, router]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDetailChange = (key: string, value: string | number | boolean) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  // Fetch makes on category select
  useEffect(() => {
    if (category === 'Véhicules') {
      const fetchMakes = async () => {
        setLoadingMakes(true);
        try {
          const res = await fetch('/api/cars/makes');
          const data = await res.json();
          if (Array.isArray(data)) setMakes(data);
        } catch (error) {
          console.error('Error fetching makes:', error);
        } finally {
          setLoadingMakes(false);
        }
      };
      fetchMakes();
    }
  }, [category]);

  // Fetch models on make select
  useEffect(() => {
    if (selectedMakeId) {
      const fetchModels = async () => {
        setLoadingModels(true);
        try {
          const res = await fetch(`/api/cars/models?makeId=${selectedMakeId}`);
          const data = await res.json();
          if (Array.isArray(data)) setModels(data);
        } catch (error) {
          console.error('Error fetching models:', error);
        } finally {
          setLoadingModels(false);
        }
      };
      fetchModels();
    } else {
      setModels([]);
    }
  }, [selectedMakeId]);

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!category) missing.push("Catégorie");
    if (!title.trim()) missing.push("Titre");
    if (!description.trim()) missing.push("Description");
    if (!condition) missing.push("État");
    if (images.length === 0) missing.push("Au moins une photo");
    if (price === '' || isNaN(Number(price.replace(/[^0-9.]/g, '')))) missing.push("Prix valide");
    if (!location.trim()) missing.push("Localisation");

    if (category === 'Véhicules') {
      if (!details.brand) missing.push("Marque");
      if (!details.model) missing.push("Modèle");
      if (!details.mileage) missing.push("Kilométrage");
      if (!details.year) missing.push("Année");
      if (!details.fuelType) missing.push("Carburant");
      if (!details.gearbox) missing.push("Boîte à vitesse");
      if (!details.color) missing.push("Couleur");
      if (!details.critair) missing.push("Crit'Air");
    }

    if (category === 'Immobilier') {
      if (!details.type) missing.push("Type de bien");
      if (!details.surfaceArea) missing.push("Surface");
      if (!details.rooms) missing.push("Pièces");
      if (!details.heating) missing.push("Chauffage");
    }

    if (category === 'Électronique') {
      if (!details.brand) missing.push("Marque");
      if (!details.model) missing.push("Modèle");
      if (!details.storage) missing.push("Capacité");
    }

    if (category === 'Vêtements') {
      if (!details.size) missing.push("Taille");
      if (!details.brand) missing.push("Marque");
    }
    
    return missing;
  };

  const validateAll = () => {
    return getMissingFields().length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = getMissingFields();
    if (!currentUser || missing.length > 0) {
      if (missing.length > 0) alert(`Champs manquants : ${missing.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Sanitize price: remove spaces, replace comma with dot
      const cleanPrice = price.replace(/\s/g, '').replace(',', '.');
      
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category as Category,
          title,
          description,
          price: Number(cleanPrice),
          location,
          images: images,
          details: { ...details, condition },
          sellerId: currentUser.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/mes-ventes'), 2000);
      } else {
        // Detailed error messages from API
        const errorMsg = data.details 
          ? Object.entries(data.details).map(([field, errors]: [string, any]) => `${field}: ${errors.join(', ')}`).join('\n')
          : data.error;
        
        alert(`Erreur de publication :\n${errorMsg || "Impossible de publier l'annonce"}`);
      }
    } catch (err) {
      alert("Une erreur de réseau est survenue. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
        <div className="w-full h-10 bg-slate-100 rounded-2xl mb-8 animate-pulse max-w-sm"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="h-[400px] bg-white rounded-[2.5rem] border border-slate-50 shadow-sm animate-pulse"></div>
          <div className="h-[400px] bg-white rounded-[2.5rem] border border-slate-50 shadow-sm animate-pulse"></div>
        </div>
      </main>
    </div>
  );

  if (!currentUser) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">C&apos;est en ligne !</h2>
          <p className="text-xl text-gray-500 max-w-md">Votre annonce est maintenant visible par des milliers d&apos;acheteurs.</p>
        </div>
      </div>
    );
  }

  const maxPhotos = currentUser?.isPro ? 10 : 3;

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-forest-green/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Form Area */}
          <div className="flex-1 space-y-6 sm:space-y-8 pb-32">
            <div className="mb-8 sm:mb-12">
              <h1 className="text-4xl sm:text-6xl font-black text-forest-green tracking-tight mb-2 sm:mb-4 leading-tight font-[family-name:var(--font-playfair)] italic">
                Vendre un <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-light to-forest-green">trésor</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-500 font-medium">L&apos;excellence du commerce authentique commence ici.</p>
            </div>

            {/* SECTION 1: CATEGORY */}
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-emerald-900/5 rounded-[32px] p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-forest-green rounded-2xl flex items-center justify-center text-emerald-light shadow-lg shadow-emerald-900/20">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-forest-green font-[family-name:var(--font-playfair)] italic">1. Catégorie</h2>
                  <p className="text-slate-500 font-medium text-sm">Choisissez la nature de votre trésor</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        setTimeout(() => scrollTo(detailsRef), 200);
                      }}
                      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${
                        isSelected 
                          ? 'border-emerald bg-emerald text-white shadow-neon transform scale-[1.02]' 
                          : 'border-slate-50 bg-white hover:border-emerald/30 hover:shadow-lg text-slate-400 hover:text-emerald'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-white' : 'text-emerald'}`} />
                      <span className="font-black text-[10px] uppercase tracking-widest font-[family-name:var(--font-outfit)]">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: PHOTOS */}
            <div className={`transition-all duration-500 ${category ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-emerald-900/5 rounded-[32px] p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-forest-green rounded-2xl flex items-center justify-center text-emerald-light shadow-lg shadow-emerald-900/20">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-forest-green font-[family-name:var(--font-playfair)] italic">2. Photos</h2>
                    <p className="text-slate-500 font-medium text-sm">Une belle photo captive l&apos;attention de l&apos;élite</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Photo Gallery Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((imageUrl, i) => (
                      <div key={i} className={`relative aspect-square rounded-2xl overflow-hidden group shadow-md border-2 border-white transition-all hover:scale-[1.02] ${i === 0 ? 'md:col-span-2 md:row-span-2 ring-4 ring-emerald/10' : ''}`}>
                        <img src={imageUrl} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {i === 0 && (
                          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-emerald text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                            Principale
                          </div>
                        )}
                      </div>
                    ))}

                    {images.length < maxPhotos && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={`aspect-square rounded-2xl border-2 border-dashed border-emerald/20 bg-emerald/5 flex flex-col items-center justify-center text-emerald gap-2 transition-all hover:bg-emerald/10 hover:border-emerald/40 group ${images.length === 0 ? 'md:col-span-2 md:row-span-2 ring-4 ring-emerald/5' : ''}`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-emerald border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{uploadProgress}%</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest font-[family-name:var(--font-outfit)]">Ajouter</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: CONTENT & DESCRIPTION */}
            <div className={`transition-all duration-500 ${images.length > 0 ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`} ref={detailsRef}>
              <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-emerald-900/5 rounded-[32px] p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-forest-green rounded-2xl flex items-center justify-center text-emerald-light shadow-lg shadow-emerald-900/20">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-forest-green font-[family-name:var(--font-playfair)] italic">3. Description</h2>
                    <p className="text-slate-500 font-medium text-sm">Précisez les qualités de votre offre d&apos;exception</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* --- INTEGRATED VEHICLE SELECTORS --- */}
                  {category === 'Véhicules' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-emerald-50/20 rounded-[24px] border border-emerald/10 mb-4 animate-in fade-in zoom-in duration-300">
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Marque</label>
                        {selectedMakeId === 'other' ? (
                          <div className="relative">
                            <input 
                              type="text"
                              value={String(details.brand || '')}
                              onChange={e => handleDetailChange('brand', e.target.value)}
                              className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all"
                              placeholder="Saisissez la marque"
                            />
                            <button 
                              onClick={() => {
                                setSelectedMakeId('');
                                handleDetailChange('brand', '');
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald uppercase tracking-widest hover:underline"
                            >
                              Retour
                            </button>
                          </div>
                        ) : (
                          <select 
                            value={selectedMakeId} 
                            onChange={e => {
                              const makeId = e.target.value;
                              const makeName = makes.find(m => m.id === makeId)?.name || '';
                              setSelectedMakeId(makeId);
                              handleDetailChange('brand', makeName);
                              handleDetailChange('model', ''); // Reset model name
                            }} 
                            className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none"
                          >
                            <option value="">{loadingMakes ? 'Chargement...' : 'Sélectionner une marque'}</option>
                            {makes.map(make => <option key={make.id} value={make.id}>{make.name}</option>)}
                            {!loadingMakes && <option value="other">Autre / Manuelle</option>}
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Modèle</label>
                        {selectedMakeId === 'other' ? (
                          <input 
                            type="text"
                            value={String(details.model || '')}
                            onChange={e => handleDetailChange('model', e.target.value)}
                            className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all"
                            placeholder="Saisissez le modèle"
                          />
                        ) : (
                          <select 
                            value={String(details.model || '')} 
                            onChange={e => handleDetailChange('model', e.target.value)} 
                            disabled={!selectedMakeId || loadingModels}
                            className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            <option value="">
                              {loadingModels ? 'Chargement...' : (!selectedMakeId ? 'Choisissez d\'abord la marque' : 'Sélectionner un modèle')}
                            </option>
                            {models.map(model => <option key={model.id} value={model.name}>{model.name}</option>)}
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Kilométrage</label>
                        <input type="number" value={details.mileage as number || ''} onChange={e => handleDetailChange('mileage', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Ex: 85000" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Année</label>
                        <input type="number" value={details.year as number || ''} onChange={e => handleDetailChange('year', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Ex: 2018" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Carburant</label>
                        <select 
                          value={String(details.fuelType || '')} 
                          onChange={e => handleDetailChange('fuelType', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {FUEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Boîte de vitesse</label>
                        <select 
                          value={String(details.gearbox || '')} 
                          onChange={e => handleDetailChange('gearbox', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {GEARBOX_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Couleur</label>
                        <select 
                          value={String(details.color || '')} 
                          onChange={e => handleDetailChange('color', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {COLORS.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Crit&apos;Air</label>
                        <select 
                          value={String(details.critair || '')} 
                          onChange={e => handleDetailChange('critair', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {CRITAIR.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Puissance (ch)</label>
                        <input type="number" value={details.hp as number || ''} onChange={e => handleDetailChange('hp', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Ex: 110" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Places</label>
                        <input type="number" value={details.seats as number || ''} onChange={e => handleDetailChange('seats', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="5" />
                      </div>
                    </div>
                  )}

                  {category === 'Immobilier' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-emerald-50/20 rounded-[24px] border border-emerald/10 mb-4 animate-in fade-in zoom-in duration-300">
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Type de bien</label>
                        <input type="text" value={String(details.type || '')} onChange={e => handleDetailChange('type', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Maison, Appartement..." />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Surface (m²)</label>
                          <input type="number" value={details.surfaceArea as number || ''} onChange={e => handleDetailChange('surfaceArea', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="75" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Pièces</label>
                          <input type="number" value={details.rooms as number || ''} onChange={e => handleDetailChange('rooms', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="3" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Chauffage</label>
                        <select 
                          value={String(details.heating || '')} 
                          onChange={e => handleDetailChange('heating', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {HEATING_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Étage</label>
                          <input type="number" value={details.floor as number || ''} onChange={e => handleDetailChange('floor', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="2" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">DPE</label>
                          <input type="text" value={String(details.energyClass || '')} onChange={e => handleDetailChange('energyClass', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="A, B, C..." />
                        </div>
                      </div>
                    </div>
                  )}

                  {category === 'Électronique' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-emerald-50/20 rounded-[24px] border border-emerald/10 mb-4 animate-in fade-in zoom-in duration-300">
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Marque</label>
                        <input type="text" value={String(details.brand || '')} onChange={e => handleDetailChange('brand', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Apple, Samsung..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Modèle</label>
                        <input type="text" value={String(details.model || '')} onChange={e => handleDetailChange('model', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="iPhone 15, Galaxy S23..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Capacité</label>
                        <select 
                          value={String(details.storage || '')} 
                          onChange={e => handleDetailChange('storage', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {STORAGE_CAPACITIES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Couleur</label>
                        <select 
                          value={String(details.color || '')} 
                          onChange={e => handleDetailChange('color', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {COLORS.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {category === 'Vêtements' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-emerald-50/20 rounded-[24px] border border-emerald/10 mb-4 animate-in fade-in zoom-in duration-300">
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Taille</label>
                        <select 
                          value={String(details.size || '')} 
                          onChange={e => handleDetailChange('size', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {CLOTHING_SIZES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Marque</label>
                        <input type="text" value={String(details.brand || '')} onChange={e => handleDetailChange('brand', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Nike, Zara, Gucci..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Couleur</label>
                        <select 
                          value={String(details.color || '')} 
                          onChange={e => handleDetailChange('color', e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionner</option>
                          {COLORS.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Matière</label>
                        <input type="text" value={String(details.material || '')} onChange={e => handleDetailChange('material', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Coton, Lin, Cuir..." />
                      </div>
                    </div>
                  )}

                  {category === 'Mobilier' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-emerald-50/20 rounded-[24px] border border-emerald/10 mb-4 animate-in fade-in zoom-in duration-300">
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Matière</label>
                        <input type="text" value={String(details.material || '')} onChange={e => handleDetailChange('material', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Bois, Métal, Velours..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-1.5 ml-1">Dimensions</label>
                        <input type="text" value={String(details.dimensions || '')} onChange={e => handleDetailChange('dimensions', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="120 x 80 x 45 cm" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black text-forest-green/40 uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">Titre de l&apos;offre</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 text-forest-green font-bold focus:border-emerald focus:ring-4 focus:ring-emerald/5 outline-none transition-all placeholder:text-slate-200" 
                      placeholder={category === 'Véhicules' ? "Ex: Peugeot 208 1.2 PureTech" : "Ex: Sac à dos vintage en cuir"} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-forest-green/40 uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">État</label>
                      <select 
                        value={condition} 
                        onChange={e => setCondition(e.target.value)}
                        className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 text-forest-green font-bold focus:border-emerald outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Sélectionner</option>
                        {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-forest-green/40 uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">Prix (€)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={price} 
                          onChange={e => setPrice(e.target.value)} 
                          className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 text-forest-green font-bold focus:border-emerald outline-none transition-all pr-12"
                          placeholder="0.00"
                        />
                        <Euro className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-forest-green/40 uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">Description détaillée</label>
                    <textarea 
                      rows={6} 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 text-forest-green focus:border-emerald outline-none transition-all resize-none" 
                      placeholder="Dites tout aux futurs acheteurs..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-forest-green/40 uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">Ville ou Code Postal</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 text-forest-green font-bold focus:border-emerald outline-none transition-all pl-12"
                        placeholder="Ex: Paris"
                      />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    onClick={handleSubmit}
                    disabled={!validateAll() || isSubmitting}
                    className="w-full group relative flex items-center justify-center gap-3 bg-emerald hover:bg-emerald-light disabled:opacity-30 disabled:grayscale text-white font-black text-xl py-6 rounded-3xl shadow-neon transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden font-[family-name:var(--font-outfit)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                    <Sparkles className="w-6 h-6" />
                    {isSubmitting ? 'Envoi...' : 'Lancer la vente d\'élite'}
                  </button>
                  {!validateAll() && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald/10 animate-pulse">
                      <p className="text-center text-forest-green font-black text-[9px] uppercase tracking-widest mb-2 font-[family-name:var(--font-outfit)]">
                        CHAMPS REQUIS MANQUANTS
                      </p>
                      <p className="text-center text-emerald text-[10px] font-bold italic">
                        {getMissingFields().join(' • ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 4: REMAINING SPECIFIC DETAILS (Non-Vehicles) */}
            {category && category !== 'Véhicules' && (
              <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-emerald-900/5 rounded-[32px] p-8 md:p-10 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-forest-green rounded-2xl flex items-center justify-center text-emerald-light shadow-lg shadow-emerald-900/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-forest-green font-[family-name:var(--font-playfair)] italic">Cure de Détails</h2>
                    <p className="text-slate-500 font-medium text-sm">Spécificités pour votre {category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category === 'Immobilier' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">Type de bien</label>
                        <input type="text" value={String(details.type || '')} onChange={e => handleDetailChange('type', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Maison, Appartement..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">Surface (m²)</label>
                        <input type="number" value={details.surfaceArea as number || ''} onChange={e => handleDetailChange('surfaceArea', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Ex: 75" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">Pièces</label>
                        <input type="number" value={details.rooms as number || ''} onChange={e => handleDetailChange('rooms', Number(e.target.value))} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Ex: 3" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">DPE</label>
                        <input type="text" value={String(details.energyClass || '')} onChange={e => handleDetailChange('energyClass', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="A, B, C, D..." />
                      </div>
                    </>
                  )}

                  {(category === 'Mobilier' || category === 'Électronique') && (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">{category === 'Mobilier' ? 'Matière' : 'Marque'}</label>
                        <input type="text" value={String(details[category === 'Mobilier' ? 'material' : 'brand'] || '')} onChange={e => handleDetailChange(category === 'Mobilier' ? 'material' : 'brand', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Détail important..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald uppercase tracking-widest mb-2 ml-1 font-[family-name:var(--font-outfit)]">{category === 'Mobilier' ? 'Dimensions' : 'Modèle'}</label>
                        <input type="text" value={String(details[category === 'Mobilier' ? 'dimensions' : 'model'] || '')} onChange={e => handleDetailChange(category === 'Mobilier' ? 'dimensions' : 'model', e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 font-bold focus:border-emerald outline-none transition-all" placeholder="Plus d'infos..." />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Side Preview (Desktop Only) */}
          <div className="hidden lg:block w-96 relative">
            <div className="sticky top-12">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Aperçu en direct</h3>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-forest-green/40"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald/40"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-light/40"></div>
                </div>
              </div>

              <div className="group relative bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-emerald-900/5 border-4 border-white transition-all duration-500 hover:scale-[1.02]">
                <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                  {images[0] ? (
                    <img src={images[0]} alt="Aperçu" className="w-full h-full object-cover transition-opacity duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <div className="w-20 h-20 bg-slate-100 rounded-[24px] flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest">Votre chef-d&apos;œuvre ici</span>
                    </div>
                  )}
                  {price && (
                    <div className="absolute top-6 right-6 px-5 py-2.5 bg-emerald text-white font-black rounded-2xl shadow-neon transform rotate-2">
                      {price} €
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-emerald/10 text-emerald text-[9px] font-black uppercase tracking-wider rounded-lg">
                      {category || 'CATÉGORIE'}
                    </span>
                    {condition && (
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-wider rounded-lg">
                        {condition}
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-forest-green leading-tight mb-2 truncate font-[family-name:var(--font-playfair)] italic">
                    {(category === 'Véhicules' && details.brand) ? `${details.brand} ${details.model || ''}` : (title || 'Titre de l\'annonce')}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald" />
                    <span className="text-sm font-bold truncate">{location || 'Localisation'}</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-2xl"></div>
              </div>
              
              <div className="mt-8 p-6 bg-emerald-50/30 rounded-3xl border border-emerald/10 border-dashed">
                <p className="text-xs text-forest-green/60 font-medium leading-relaxed italic">
                  💡 **Secret d&apos;Élite** : Partagez l&apos;histoire de ce trésor. Les acheteurs de Way Market recherchent l&apos;authenticité au-delà de l&apos;objet.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
