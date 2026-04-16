'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useMarket, Category } from '@/contexts/MarketContext';
import { 
  UploadCloud, 
  CheckCircle2, 
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
import "@uploadthing/react/styles.css";

const CATEGORIES: { id: Category; label: string; icon: React.FC<any> }[] = [
  { id: 'Véhicules', label: 'Véhicules', icon: Car },
  { id: 'Équipements auto', label: 'Équipements', icon: Wrench },
  { id: 'Immobilier', label: 'Immobilier', icon: Home },
  { id: 'Électronique', label: 'Électronique', icon: Smartphone },
  { id: 'Mobilier', label: 'Mobilier', icon: Sofa },
  { id: 'Vêtements', label: 'Vêtements', icon: Shirt },
  { id: 'Jouets', label: 'Jouets', icon: Gamepad2 },
  { id: 'Autres', label: 'Autres', icon: Box },
];

const CAR_DATA: Record<string, string[]> = {
  "Peugeot": ["208", "308", "508", "2008", "3008", "5008", "Partner", "Expert", "Autre"],
  "Renault": ["Clio", "Megane", "Captur", "Kadjar", "Arkana", "Twingo", "Zoe", "Kangoo", "Autre"],
  "Citroën": ["C1", "C3", "C4", "C5", "Berlingo", "Picasso", "Autre"],
  "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan", "Touareg", "ID.3", "ID.4", "Autre"],
  "Audi": ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "e-tron", "Autre"],
  "BMW": ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5", "i3", "Autre"],
  "Mercedes-Benz": ["Classe A", "Classe C", "Classe E", "GLA", "GLC", "GLE", "Autre"],
  "Toyota": ["Yaris", "Corolla", "Auris", "RAV4", "C-HR", "Aygo", "Autre"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mondeo", "Autre"],
  "Dacia": ["Sandero", "Duster", "Lodgy", "Jogger", "Autre"],
  "Fiat": ["500", "Panda", "Tipo", "Ducato", "Autre"],
  "Opel": ["Corsa", "Astra", "Mokka", "Grandland", "Autre"],
  "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Autre"],
  "Kia": ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "Autre"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
  "Nissan": ["Micra", "Juke", "Qashqai", "Leaf", "Autre"],
  "Mini": ["Hatch", "Countryman", "Clubman", "Autre"],
  "Volvo": ["XC40", "XC60", "XC90", "V40", "Autre"],
  "Autre": ["Modèle personnalisé"]
};

const CONDITIONS = [
  "Neuf",
  "Très bon état",
  "Bon état",
  "Satisfaisant"
];

export default function CreateListing() {
  const router = useRouter();
  const { currentUser } = useMarket();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
  const photosRef = useRef<HTMLDivElement>(null);
  const validationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) router.push('/auth');
  }, [currentUser, router]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDetailChange = (key: string, value: string | number | boolean) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const validateAll = () => {
    const basic = !!category && !!title.trim() && !!description.trim() && !!condition && images.length > 0 && price !== '' && !!location.trim();
    if (category === 'Véhicules') {
      return basic && !!details.brand && !!details.model && !!details.mileage && !!details.year;
    }
    return basic;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !validateAll()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category as Category,
          title,
          description,
          price: Number(price),
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
        alert(`Erreur: ${data.error || "Impossible de publier l'annonce"}`);
      }
    } catch (err) {
      alert("Une erreur de réseau est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">C&apos;est en ligne !</h2>
          <p className="text-xl text-gray-500 max-w-md">Votre annonce est maintenant visible par des milliers d&apos;acheteurs.</p>
        </div>
      </div>
    );
  }

  const maxPhotos = currentUser?.isPro ? 10 : 3;
  const photoSlots = Array.from({ length: maxPhotos });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
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
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100/40 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Form Area */}
          <div className="flex-1 space-y-8 pb-32">
            <div className="mb-12">
              <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
                Vendre un <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">trésor</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium">Donnez une seconde vie à vos objets en quelques secondes.</p>
            </div>

            {/* SECTION 1: CATEGORY */}
            <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 rounded-[32px] p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Catégorie</h2>
                  <p className="text-gray-500 font-medium">Choisissez ce qui décrit le mieux votre objet</p>
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
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200 transform scale-[1.02]' 
                          : 'border-gray-50 bg-white hover:border-indigo-200 hover:shadow-lg text-gray-600'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                      <span className="font-bold text-xs uppercase tracking-wider">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: PHOTOS */}
            <div className={`transition-all duration-500 ${category ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`} ref={photosRef}>
              <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 rounded-[32px] p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">2. Photos</h2>
                    <p className="text-gray-500 font-medium">Une belle photo = une vente 4x plus rapide</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Photo Gallery Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {photoSlots.map((_, i) => {
                      const imageUrl = images[i];
                      const isFirst = i === 0;
                      
                      if (imageUrl) {
                        return (
                          <div key={i} className={`relative aspect-square rounded-2xl overflow-hidden group shadow-md border-2 border-white transition-all hover:scale-[1.02] ${isFirst ? 'md:col-span-2 md:row-span-2 ring-4 ring-indigo-100' : ''}`}>
                            <img src={imageUrl} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            {isFirst && (
                              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                                Principale
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Only show the next available slot as a button
                      if (i === images.length) {
                        return (
                          <button
                            key={i}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`aspect-square rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/30 flex flex-col items-center justify-center text-pink-400 gap-2 transition-all hover:bg-pink-50 hover:border-pink-300 group ${isFirst ? 'md:col-span-2 md:row-span-2 ring-4 ring-pink-50' : ''}`}
                          >
                            {isUploading ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{uploadProgress}%</span>
                              </div>
                            ) : (
                              <>
                                <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <UploadCloud className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Ajouter</span>
                              </>
                            )}
                          </button>
                        );
                      }

                      // Placeholder slots
                      return (
                        <div key={i} className="aspect-square rounded-2xl border-2 border-gray-100 bg-gray-50/50"></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: CONTENT & DESCRIPTION */}
            <div className={`transition-all duration-500 ${images.length > 0 ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`} ref={detailsRef}>
              <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 rounded-[32px] p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">3. Description</h2>
                    <p className="text-gray-500 font-medium">Informations essentielles sur votre offre</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* --- INTEGRATED VEHICLE SELECTORS --- */}
                  {category === 'Véhicules' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-indigo-50/50 rounded-[24px] border border-indigo-100 mb-4 animate-in fade-in zoom-in duration-300">
                      <div>
                        <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 ml-1">Marque</label>
                        <select 
                          value={String(details.brand || '')} 
                          onChange={e => {
                            handleDetailChange('brand', e.target.value);
                            handleDetailChange('model', ''); // Reset model on brand change
                          }} 
                          className="w-full bg-white border-2 border-indigo-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all appearance-none"
                        >
                          <option value="">Sélectionner une marque</option>
                          {Object.keys(CAR_DATA).sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 ml-1">Modèle</label>
                        <select 
                          value={String(details.model || '')} 
                          onChange={e => handleDetailChange('model', e.target.value)} 
                          disabled={!details.brand}
                          className="w-full bg-white border-2 border-indigo-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          <option value="">{details.brand ? 'Sélectionner un modèle' : 'Choisissez d\'abord la marque'}</option>
                          {details.brand && CAR_DATA[String(details.brand)]?.map(model => <option key={model} value={model}>{model}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 ml-1">Kilométrage</label>
                        <input type="number" value={details.mileage as number || ''} onChange={e => handleDetailChange('mileage', Number(e.target.value))} className="w-full bg-white border-2 border-indigo-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Ex: 85000" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 ml-1">Année</label>
                        <input type="number" value={details.year as number || ''} onChange={e => handleDetailChange('year', Number(e.target.value))} className="w-full bg-white border-2 border-indigo-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Ex: 2018" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Titre de l&apos;offre</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 text-gray-900 font-bold focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300" 
                      placeholder={category === 'Véhicules' ? "Ex: Peugeot 208 1.2 PureTech" : "Ex: Sac à dos vintage en cuir"} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">État</label>
                      <select 
                        value={condition} 
                        onChange={e => setCondition(e.target.value)}
                        className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 text-gray-900 font-bold focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Sélectionner</option>
                        {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Prix (€)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={price} 
                          onChange={e => setPrice(e.target.value)} 
                          className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 text-gray-900 font-bold focus:border-indigo-600 outline-none transition-all pr-12"
                          placeholder="0.00"
                        />
                        <Euro className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description détaillée</label>
                    <textarea 
                      rows={6} 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 text-gray-900 focus:border-indigo-600 outline-none transition-all resize-none" 
                      placeholder="Dites tout aux futurs acheteurs..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ville ou Code Postal</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 text-gray-900 font-bold focus:border-indigo-600 outline-none transition-all pl-12"
                        placeholder="Ex: Paris"
                      />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    onClick={handleSubmit}
                    disabled={!validateAll() || isSubmitting}
                    className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white font-black text-xl py-6 rounded-3xl shadow-2xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                    <Sparkles className="w-6 h-6" />
                    {isSubmitting ? 'Envoi...' : 'Lancer la vente'}
                  </button>
                  {!validateAll() && (
                    <p className="text-center text-gray-400 font-medium mt-4 text-sm animate-pulse italic">
                      Complétez tous les champs pour activer le bouton
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 4: REMAINING SPECIFIC DETAILS (Non-Vehicles) */}
            {category && category !== 'Véhicules' && (
              <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 rounded-[32px] p-8 md:p-10 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-violet-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Spécifications</h2>
                    <p className="text-gray-500 font-medium">Détails spécifiques pour votre {category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category === 'Immobilier' && (
                    <>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Type de bien</label>
                        <input type="text" value={String(details.type || '')} onChange={e => handleDetailChange('type', e.target.value)} className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Maison, Appartement..." />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Surface (m²)</label>
                        <input type="number" value={details.surfaceArea as number || ''} onChange={e => handleDetailChange('surfaceArea', Number(e.target.value))} className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Ex: 75" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pièces</label>
                        <input type="number" value={details.rooms as number || ''} onChange={e => handleDetailChange('rooms', Number(e.target.value))} className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Ex: 3" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">DPE</label>
                        <input type="text" value={String(details.energyClass || '')} onChange={e => handleDetailChange('energyClass', e.target.value)} className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="A, B, C, D..." />
                      </div>
                    </>
                  )}

                  {(category === 'Mobilier' || category === 'Électronique') && (
                    <>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{category === 'Mobilier' ? 'Matière' : 'Marque'}</label>
                        <input type="text" value={String(details[category === 'Mobilier' ? 'material' : 'brand'] || '')} onChange={e => handleDetailChange(category === 'Mobilier' ? 'material' : 'brand', e.target.value)} className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Détail important..." />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{category === 'Mobilier' ? 'Dimensions' : 'Modèle'}</label>
                        <input type="text" value={String(details[category === 'Mobilier' ? 'dimensions' : 'model'] || '')} onChange={e => handleDetailChange(category === 'Mobilier' ? 'dimensions' : 'model', e.target.value)} className="w-full bg-white border-2 border-gray-50 rounded-2xl p-4 font-bold focus:border-indigo-600 outline-none transition-all" placeholder="Plus d'infos..." />
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
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>

              <div className="group relative bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-indigo-200/50 border-4 border-white transition-all duration-500 hover:scale-[1.02]">
                <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
                  {images[0] ? (
                    <img src={images[0]} alt="Aperçu" className="w-full h-full object-cover transition-opacity duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <div className="w-20 h-20 bg-gray-100 rounded-[24px] flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-widest">Votre photo ici</span>
                    </div>
                  )}
                  {price && (
                    <div className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 text-white font-black rounded-2xl shadow-xl transform rotate-3">
                      {price} €
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      {category || 'CATÉGORIE'}
                    </span>
                    {condition && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-wider rounded-lg">
                        {condition}
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 leading-tight mb-2 truncate">
                    {(category === 'Véhicules' && details.brand) ? `${details.brand} ${details.model || ''}` : (title || 'Titre de l\'annonce')}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-bold truncate">{location || 'Localisation'}</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
              </div>
              
              <div className="mt-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 border-dashed">
                <p className="text-xs text-indigo-900/60 font-medium leading-relaxed">
                  💡 **Astuce** : Décrivez l&apos;histoire de votre objet. Les acheteurs adorent savoir d&apos;où viennent les trésors qu&apos;ils achètent.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
