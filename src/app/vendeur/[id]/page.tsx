'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Clock, 
  ChevronLeft,
  MapPin,
  Tag,
  Star
} from 'lucide-react';
import Image from 'next/image';

export default function SellerProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { listings } = useMarket();
  
  // Find all listings for this seller
  const sellerListings = listings.filter(l => l.sellerId === resolvedParams.id);
  
  // Get seller info from his listings (as a shortcut for now)
  const seller = sellerListings[0]?.seller;

  if (!seller && sellerListings.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <UserIcon className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Utilisateur introuvable</h2>
          <button onClick={() => router.push('/')} className="mt-6 text-indigo-600 font-bold hover:underline">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all mb-12"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-indigo-100 group-hover:shadow-indigo-50 transition-all">
            <ChevronLeft className="h-3 w-3" />
          </div>
          Retour
        </button>

        {/* SELLER HEADER (Glassmorphism) */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 rounded-[40px] blur-3xl -z-10"></div>
          
          <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white shadow-2xl shadow-indigo-100/50 flex flex-col md:flex-row items-center md:items-start gap-12 text-center md:text-left">
            
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-slate-100 overflow-hidden ring-8 ring-white shadow-2xl shadow-indigo-200 border border-slate-100">
                {seller?.avatarUrl ? (
                  <Image src={seller.avatarUrl} alt="" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                    <UserIcon className="h-20 w-20" />
                  </div>
                )}
              </div>
              {seller?.isPro && (
                <div className="absolute -bottom-2 -right-2 p-3 bg-amber-400 rounded-2xl shadow-xl border-4 border-white rotate-12 transition-transform hover:rotate-0">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-grow space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    {seller?.name || 'Vendeur particulier'}
                  </h1>
                  {seller?.isPro && (
                    <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200">
                      Professionnel Vérifié
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Membre depuis {formatDate(seller?.memberSince || new Date())}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    Localisation vérifiée
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center md:items-start min-w-[140px]">
                  <span className="text-2xl font-black text-slate-900">{sellerListings.length}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annonces actives</span>
                </div>
                <div className="px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center md:items-start min-w-[140px]">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-black text-slate-900">5.0</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiabilité Way Market</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="px-8 py-5 bg-indigo-600 text-white font-black rounded-[24px] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px]">
                Contacter le vendeur
              </button>
              <button className="px-8 py-5 bg-white text-slate-600 font-black rounded-[24px] border border-slate-100 shadow-sm hover:border-slate-200 transition-all uppercase tracking-widest text-[10px]">
                Partager le profil
              </button>
            </div>
          </div>
        </div>

        {/* LISTINGS SECTION */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <Tag className="h-6 w-6 text-indigo-600" />
              Toutes les annonces de {seller?.name?.split(' ')[0]}
            </h2>
            <div className="h-px bg-slate-100 flex-grow mx-8 hidden sm:block"></div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {sellerListings.length} Trésors
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sellerListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {sellerListings.length === 0 && (
            <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">Ce vendeur n'a pas d'autres annonces pour le moment.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
