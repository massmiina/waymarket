'use client';

import React, { useState } from 'react';
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
  ChevronLeft,
  Wrench,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';
import { UploadDropzone } from "@/lib/uploadthing";
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

const CONDITIONS = [
  "Neuf avec étiquette",
  "Neuf",
  "Très bon état",
  "Bon état",
  "État satisfaisant",
  "Pour pièces"
];

export default function CreateListing() {
  const router = useRouter();
  const { currentUser, addListing } = useMarket();
  const [success, setSuccess] = useState(false);

  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);

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

  React.useEffect(() => {
    if (!currentUser) {
      router.push('/auth');
    }
  }, [currentUser, router]);

  const handleDetailChange = (key: string, value: string | number | boolean) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const validateStep1 = () => !!category;
  const validateStep2 = () => {
    if (!title.trim() || !description.trim() || !condition) return false;
    // Basic dynamic validation checks
    if (category === 'Véhicules' && (!details.brand || !details.model || !details.year || !details.mileage || !details.fuelType || !details.gearbox)) return false;
    if (category === 'Mobilier' && (!details.type || !details.material || !details.dimensions)) return false;
    if (category === 'Électronique' && (!details.brand || !details.model)) return false;
    if (category === 'Immobilier' && (!details.type || !details.rooms || !details.surfaceArea || !details.energyClass)) return false;
    return true;
  };
  const validateStep3 = () => images.length > 0; // Explicitly making at least 1 photo required
  const validateStep4 = () => price !== '' && Number(price) >= 0 && !!location.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !validateStep4()) return;

    setIsUploading(true); // Reusing upload state for submission indicator
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
        setTimeout(() => {
          router.push('/mes-ventes');
        }, 2000);
      } else {
        // Handle specific errors like 'User not found' which might mean sync is still in progress
        if (res.status === 404 && data.syncNeeded) {
          alert("Votre compte est en cours de synchronisation. Veuillez patienter quelques secondes et réessayer.");
          // Attempt to trigger a sync in the background
          window.location.reload(); 
        } else {
          alert(`Erreur: ${data.error || "Impossible de publier l'annonce"}`);
        }
        console.error('Submission Error:', data);
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur de réseau est survenue lors de la publication.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentUser) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <CheckCircle2 className="h-20 w-20 text-green-500 mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Annonce publiée avec succès !</h2>
          <p className="text-gray-500">Redirection vers vos annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        
        {/* Stepper Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Déposer une annonce</h1>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full z-0 transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
            <div className="relative z-10 flex justify-between">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  currentStep >= step ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {step}
                </div>
              ))}
            </div>
            <div className="relative z-10 flex justify-between mt-2 px-1 text-xs font-medium text-gray-500 hidden sm:flex">
              <span className={currentStep >= 1 ? 'text-indigo-600' : ''}>Catégorie</span>
              <span className={currentStep >= 2 ? 'text-indigo-600' : ''}>Détails</span>
              <span className={currentStep >= 3 ? 'text-indigo-600' : ''}>Photos</span>
              <span className={currentStep >= 4 ? 'text-indigo-600' : ''}>Validation</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8 min-h-[400px]">
          
          {/* STEP 1: CATEGORY */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Que souhaitez-vous vendre ?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        setDetails({});
                        setTimeout(nextStep, 150); // Auto-advance for better UX
                      }}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 group ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm transform scale-[0.98]' 
                          : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50 text-gray-600 hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`w-10 h-10 mb-3 transition-transform group-hover:-translate-y-1 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="font-semibold text-sm">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span>Détails de l&apos;annonce</span>
                <span className="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">{category}</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Titre de l&apos;annonce *</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="Ex: iPhone 13 Pro Max, Canapé 3 places..." />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">État de l&apos;article *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CONDITIONS.map(cond => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setCondition(cond)}
                        className={`p-2.5 rounded-xl border text-sm font-medium transition text-center ${
                          condition === cond 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none" placeholder="Décrivez votre article en détail, mentionnez les éventuels défauts, etc..." />
                </div>
              </div>

              {/* Dynamic Categories */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 mt-6">
                <h3 className="font-semibold text-gray-900">Caractéristiques spécifiques</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category === 'Véhicules' && (
                    <>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Marque *</label><input type="text" value={String(details.brand || '')} onChange={e => handleDetailChange('brand', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Modèle *</label><input type="text" value={String(details.model || '')} onChange={e => handleDetailChange('model', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Année *</label><input type="number" value={details.year as number || ''} onChange={e => handleDetailChange('year', Number(e.target.value))} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Kilométrage *</label><input type="number" value={details.mileage as number || ''} onChange={e => handleDetailChange('mileage', Number(e.target.value))} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Carburant *</label>
                        <select value={String(details.fuelType || '')} onChange={e => handleDetailChange('fuelType', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500 bg-white">
                          <option value="" disabled>Sélectionner</option>
                          <option value="Essence">Essence</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybride">Hybride</option>
                          <option value="Électrique">Électrique</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Boîte de vitesse *</label>
                        <select value={String(details.gearbox || '')} onChange={e => handleDetailChange('gearbox', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500 bg-white">
                          <option value="" disabled>Sélectionner</option>
                          <option value="Manuelle">Manuelle</option>
                          <option value="Automatique">Automatique</option>
                          <option value="Séquentielle">Séquentielle</option>
                        </select>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Puissance (CV)</label><input type="number" value={details.power as number || ''} onChange={e => handleDetailChange('power', Number(e.target.value))} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nombre de portes</label><input type="number" value={details.doors as number || ''} onChange={e => handleDetailChange('doors', Number(e.target.value))} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nombre de places</label><input type="number" value={details.seats as number || ''} onChange={e => handleDetailChange('seats', Number(e.target.value))} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Crit'Air</label>
                        <select value={String(details.critair || '')} onChange={e => handleDetailChange('critair', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500 bg-white">
                          <option value="">Non renseigné</option>
                          <option value="0">Crit'Air 0 (Vert)</option>
                          <option value="1">Crit'Air 1 (Violet)</option>
                          <option value="2">Crit'Air 2 (Jaune)</option>
                          <option value="3">Crit'Air 3 (Orange)</option>
                          <option value="4">Crit'Air 4 (Bordeaux)</option>
                          <option value="5">Crit'Air 5 (Gris)</option>
                        </select>
                      </div>

                      <div className="col-span-1 sm:col-span-2 mt-4 mb-2">
                        <h4 className="text-sm font-bold text-gray-800 border-b pb-2">Bonus (Recommandé)</h4>
                      </div>
                      
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={!!details.firstHand} onChange={e => handleDetailChange('firstHand', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        Première main
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={!!details.maintenanceHistory} onChange={e => handleDetailChange('maintenanceHistory', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        Entretien à jour
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={!!details.accidentHistory} onChange={e => handleDetailChange('accidentHistory', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        Véhicule accidenté (Historique)
                      </label>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Contrôle technique (Date)</label>
                        <input type="date" value={String(details.technicalInspection || '')} onChange={e => handleDetailChange('technicalInspection', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" />
                      </div>
                    </>
                  )}
                  {category === 'Mobilier' && (
                    <>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Type de meuble</label><input type="text" value={String(details.type || '')} onChange={e => handleDetailChange('type', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Matière</label><input type="text" value={String(details.material || '')} onChange={e => handleDetailChange('material', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Dimensions</label><input type="text" value={String(details.dimensions || '')} onChange={e => handleDetailChange('dimensions', e.target.value)} placeholder="LxLxH" className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                    </>
                  )}
                  {category === 'Électronique' && (
                    <>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Marque</label><input type="text" value={String(details.brand || '')} onChange={e => handleDetailChange('brand', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Modèle</label><input type="text" value={String(details.model || '')} onChange={e => handleDetailChange('model', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Accessoires</label><input type="text" value={String(details.accessories || '')} onChange={e => handleDetailChange('accessories', e.target.value)} placeholder="Boîte, Chargeur..." className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                    </>
                  )}
                  {category === 'Immobilier' && (
                    <>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Type de bien</label><input type="text" value={String(details.type || '')} onChange={e => handleDetailChange('type', e.target.value)} placeholder="Appartement, Maison" className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Pièces</label><input type="number" value={details.rooms as number || ''} onChange={e => handleDetailChange('rooms', Number(e.target.value))} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Surface (m²)</label><input type="number" value={details.surfaceArea as number || ''} onChange={e => handleDetailChange('surfaceArea', Number(e.target.value))} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Classe Énergie</label><input type="text" value={String(details.energyClass || '')} onChange={e => handleDetailChange('energyClass', e.target.value)} placeholder="A, B, C..." className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                    </>
                  )}
                  {(category === 'Jouets' || category === 'Autres' || category === 'Vêtements' || category === 'Équipements auto') && (
                    <>
                      {category === 'Vêtements' && <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Taille</label><input type="text" value={String(details.size || '')} onChange={e => handleDetailChange('size', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>}
                      {category === 'Équipements auto' && <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Type d'équipement / Pièce</label><input type="text" value={String(details.equipmentType || '')} onChange={e => handleDetailChange('equipmentType', e.target.value)} placeholder="Pneus, Autoradio, Moteur..." className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>}
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Marque (Optionnel)</label><input type="text" value={String(details.brand || '')} onChange={e => handleDetailChange('brand', e.target.value)} className="w-full border-gray-300 rounded-lg p-2.5 border outline-none focus:border-indigo-500" /></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTOS */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ajoutez des photos</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Une annonce avec de belles photos se vend 4 fois plus vite ! 
                (Max {currentUser?.isPro ? '10' : '3'} photos {!currentUser?.isPro && "- Devenez PRO pour en ajouter 10"})
              </p>
              
              <div className="space-y-6">
                {images.length < (currentUser?.isPro ? 10 : 3) && (
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res) {
                        const urls = res.map(file => file.url);
                        setImages(prev => [...prev, ...urls]);
                        setIsUploading(false);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Erreur lors de l'upload: ${error.message}`);
                      setIsUploading(false);
                    }}
                    onUploadBegin={() => {
                      setIsUploading(true);
                    }}
                    appearance={{
                      container: "border-2 border-indigo-200 border-dashed rounded-2xl bg-gray-50 hover:bg-indigo-50/50 transition duration-300",
                      label: "text-indigo-600 font-bold hover:text-indigo-500",
                      allowedContent: "text-gray-500 font-medium",
                      button: "bg-indigo-600 hover:bg-indigo-700 ut-ready:bg-indigo-600 ut-uploading:bg-indigo-400 mt-4 px-6 py-2 rounded-xl"
                    }}
                    content={{
                      label: "Déposez vos images ici",
                      allowedContent: "Images PNG, JPG jusqu'à 4MB"
                    }}
                  />
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                    {images.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md group">
                        <img src={url} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== index))} 
                          className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/90 text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider">
                            Photo principale
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {isUploading && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-indigo-50 rounded-xl text-indigo-700 font-medium animate-pulse">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Téléchargement des images...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: PRICE & SUBMIT */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dernière étape</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 p-6 rounded-2xl border border-indigo-100">
                  <label className="block text-lg font-bold text-indigo-900 mb-2">Quel est votre prix ? *</label>
                  <div className="relative max-w-sm">
                    <input 
                      required 
                      type="number" 
                      min="0" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      className="w-full pl-6 pr-12 py-4 text-2xl font-bold text-gray-900 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition" 
                      placeholder="0" 
                    />
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                      <span className="text-2xl font-bold text-gray-400">€</span>
                    </div>
                  </div>
                </div>

                <div className="max-w-sm">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Localisation du bien *</label>
                  <input 
                    required 
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition" 
                    placeholder="Ex: Paris, 75001" 
                  />
                </div>
                
                {/* Summary Box */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 mt-8">
                   <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-200 bg-gray-100 flex items-center justify-center">
                     {images[0] ? (
                       <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <ImageIcon className="w-6 h-6 text-gray-300" />
                     )}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-gray-900 truncate">{title || "Sans titre"}</h4>
                     <p className="text-sm font-medium text-indigo-600 mt-1">{price || '0'} €</p>
                   </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Stepper Footer Controls */}
        <div className="flex items-center justify-between mt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
            >
              <ChevronLeft className="w-5 h-5" /> Retour
            </button>
          ) : <div></div>}

          {currentStep < 4 ? (
            <div className="flex flex-col items-end gap-2">
              {!validateStep1() && <span className="text-xs text-red-500 font-medium italic">Sélectionnez une catégorie</span>}
              {currentStep === 2 && !validateStep2() && <span className="text-xs text-red-500 font-medium italic">Remplissez tous les champs obligatoires (*)</span>}
              {currentStep === 3 && !validateStep3() && <span className="text-xs text-red-500 font-medium italic">Ajoutez au moins une photo pour continuer</span>}
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !validateStep1()) ||
                  (currentStep === 2 && !validateStep2()) ||
                  (currentStep === 3 && !validateStep3())
                }
                className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Continuer <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-2 text-right">
              {!validateStep4() && <span className="text-xs text-red-500 font-medium italic">Prix et localisation obligatoires</span>}
              <button
                onClick={handleSubmit}
                disabled={!validateStep4() || !validateStep3() || !validateStep2() || !validateStep1() || isUploading}
                className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 text-lg"
              >
                {isUploading ? 'Publication...' : 'Publier mon annonce'} <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
