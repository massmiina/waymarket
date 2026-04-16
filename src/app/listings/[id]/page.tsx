'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  MapPin, 
  Share2, 
  AlertCircle, 
  ChevronLeft, 
  Gauge, 
  Calendar, 
  Zap, 
  Fuel, 
  Sparkles,
  User as UserIcon,
  Shield,
  MessageCircle,
  Clock,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { useMarket } from '@/contexts/MarketContext';

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { listings, currentUser, favorites, toggleFavorite, sendMessage } = useMarket();
  
  const listing = listings.find(l => l.id === resolvedParams.id);
  const isFavorite = listing ? favorites.includes(listing.id) : false;

  const [activeImage, setActiveImage] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Annonce introuvable</h2>
            <button onClick={() => router.push('/')} className="mt-4 text-indigo-600 font-medium hover:underline">
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </>
    );
  }

  // Parse details
  let details: any = {};
  try {
    details = listing.details ? JSON.parse(listing.details) : {};
  } catch (e) {
    // If it's already an object (though prisma says string)
    details = listing.details || {};
  }

  const handleSendMessage = async () => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    if (messageText.trim()) {
      await sendMessage(listing.id, listing.sellerId, messageText);
      setMessageText('');
      setMessageSent(true);
      setTimeout(() => {
        router.push('/messages');
      }, 1500);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Define specs with icons
  const specs = [];
  if (details.mileage) specs.push({ label: 'Kilométrage', value: `${details.mileage} km`, icon: Gauge });
  if (details.year) specs.push({ label: 'Année', value: details.year, icon: Calendar });
  if (details.fuelType) specs.push({ label: 'Carburant', value: details.fuelType, icon: Fuel });
  if (details.gearbox) specs.push({ label: 'Boîte', value: details.gearbox, icon: Zap });
  if (details.condition) specs.push({ label: 'État', value: details.condition, icon: Sparkles });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all mb-8"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-indigo-100 group-hover:shadow-indigo-50 transition-all">
            <ChevronLeft className="h-3 w-3" />
          </div>
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: GALLERY & DESCRIPTION (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery Card */}
            <div className="bg-white rounded-[32px] p-4 shadow-2xl shadow-indigo-100/50 border border-white">
              <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden bg-slate-100">
                <Image
                  src={listing.images[activeImage] || listing.images[0] || 'https://via.placeholder.com/1200x800'}
                  alt={listing.title}
                  fill
                  priority
                  className="object-cover transition-all duration-700 hover:scale-105"
                />
                
                {/* Actions overlay */}
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  <button
                    onClick={() => toggleFavorite(listing.id)}
                    className="p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl text-slate-400 hover:text-red-500 transition-all active:scale-90"
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500 border-none' : ''}`} />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl text-slate-400 hover:text-indigo-600 transition-all">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-widest rounded-xl">
                  {activeImage + 1} / {listing.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 px-2 scrollbar-hide">
                  {listing.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-24 aspect-square rounded-[18px] overflow-hidden flex-shrink-0 transition-all ${
                        activeImage === i 
                          ? 'ring-4 ring-indigo-500 scale-95' 
                          : 'opacity-60 hover:opacity-100 hover:scale-[1.02]'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-indigo-100/50 border border-white space-y-12">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {listing.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.location}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                    {listing.title}
                  </h1>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tighter">
                    {listing.price.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              {specs.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {specs.map((spec, i) => {
                    const Icon = spec.icon;
                    return (
                      <div key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
                        <Icon className="h-6 w-6 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</span>
                        <span className="text-sm font-bold text-slate-900">{spec.value}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Description */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <div className="w-6 h-1 bg-indigo-600 rounded-full"></div>
                  Description du trésor
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: SELLER & CONTACT (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Seller Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-indigo-100/50 border border-white group">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-20 h-20 rounded-full bg-slate-100 overflow-hidden ring-4 ring-slate-50 border-4 border-white shadow-xl shadow-slate-200">
                  {listing.seller?.avatarUrl ? (
                    <Image src={listing.seller.avatarUrl || '/default-avatar.png'} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <UserIcon className="h-10 w-10" />
                    </div>
                  )}
                  {listing.seller?.isPro && (
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-amber-400 rounded-full shadow-lg border-2 border-white">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                    {listing.seller?.name || 'Vendeur particulier'}
                  </h4>
                  <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    <Clock className="h-3 w-3" />
                    Depuis {formatDate(listing.seller?.memberSince || listing.createdAt)}
                  </p>
                </div>
              </div>

              {listing.seller?.isPro && (
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 mb-8">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    Vendeur Professionnel
                  </p>
                  <p className="text-[10px] text-amber-500 font-medium mt-1 leading-relaxed">
                    Transaction sécurisée et vérifiée par l&apos;enseigne Way Market.
                  </p>
                </div>
              )}

              <button 
                onClick={() => router.push(`/vendeur/${listing.sellerId}`)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-lg rounded-2xl transition-all group font-bold text-sm text-slate-600"
              >
                Toutes les annonces
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Contact Card */}
            <div className="sticky top-8 bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 overflow-hidden">
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-black tracking-tight">Posez une question</h3>
                
                {listing.sellerId !== currentUser?.id ? (
                  <div className="space-y-4">
                    <textarea
                      rows={4}
                      placeholder="Bonjour, votre trésor m'intéresse..."
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-6 text-white placeholder:text-white/40 font-medium focus:outline-none focus:bg-white/20 transition-all resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="w-full bg-white text-indigo-600 font-black py-5 rounded-[24px] shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Envoyer le message
                    </button>
                    {messageSent && (
                      <div className="flex items-center justify-center gap-2 animate-pulse">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Message envoyé !</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[24px] text-center">
                    <p className="text-sm font-bold opacity-80">C&apos;est votre propre trésor !</p>
                    <button 
                      onClick={() => router.push('/mes-ventes')}
                      className="mt-4 text-[10px] font-black uppercase tracking-widest text-white underline underline-offset-4"
                    >
                      Gérer mon annonce
                    </button>
                  </div>
                )}
              </div>
              
              {/* Background Glow */}
              <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-400 rounded-full blur-[80px] pointer-events-none"></div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
