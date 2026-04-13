'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Share2, AlertCircle, ChevronLeft } from 'lucide-react';
import { useMarket } from '@/contexts/MarketContext';

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { listings, currentUser, favorites, toggleFavorite, sendMessage } = useMarket();
  
  const listing = listings.find(l => l.id === resolvedParams.id);
  const isFavorite = listing ? favorites.includes(listing.id) : false;

  const [messageText, setMessageText] = React.useState('');
  const [messageSent, setMessageSent] = React.useState(false);

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

  const handleSendMessage = async () => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    if (messageText.trim()) {
      await sendMessage(listing.id, listing.sellerId, messageText);
      setMessageText('');
      setMessageSent(true);
      // Wait a moment so they see the success message, then redirect to the messages hub
      setTimeout(() => {
        router.push('/messages');
      }, 1500);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-glacier mb-8 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Retour
        </button>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-peaks/5 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 h-[450px] md:h-auto relative bg-slate-100">
             <Image
              src={listing.images[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
              alt={listing.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute top-6 left-6 glass-card px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-800 shadow-lg border-white/60">
              {listing.category}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="flex justify-between items-start gap-6">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter">
                {listing.title}
              </h1>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className="p-3.5 rounded-2xl glass-card hover:bg-white transition-all text-slate-400 hover:text-red-500 shadow-md border-slate-100 active:scale-90"
                  title="Ajouter aux favoris"
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="p-3.5 rounded-2xl glass-card hover:bg-white transition-all text-slate-400 hover:text-glacier shadow-md border-slate-100" title="Partager">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <p className="text-4xl font-black text-peaks tracking-tighter">{listing.price} €</p>
              <div className="h-1 w-12 bg-glacier rounded-full"></div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] my-8">
              <div className="w-8 h-8 bg-slate-50 flex items-center justify-center rounded-xl">
                <MapPin className="h-4 w-4 text-glacier" />
              </div>
              <span>{listing.location}</span>
            </div>

            <div className="border-t border-slate-100 py-8 mb-8">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-glacier rounded-full"></span>
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {listing.description}
              </p>
            </div>

            {/* Dynamic Details block based on category */}
            {listing.details && Object.keys(listing.details).length > 0 && (
              <div className="bg-slate-50/50 rounded-2xl p-6 mb-10 border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Fiche Technique</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  {Object.entries(listing.details).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">{key}</span>
                      <span className="text-slate-900 font-bold text-sm">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Contacter le vendeur</h3>
              {listing.sellerId !== currentUser?.id ? (
                <div className="flex flex-col gap-4">
                  <textarea
                    rows={3}
                    placeholder="Bonjour, votre annonce m'intéresse..."
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-slate-700 font-medium focus:outline-none focus:border-glacier bg-slate-50/30 transition-all resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="w-full bg-peaks text-white font-black py-4 rounded-2xl hover:bg-glacier shadow-xl shadow-peaks/5 hover:shadow-glacier/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                  >
                    Envoyer le message
                  </button>
                  {messageSent && <p className="text-green-600 text-xs font-black uppercase tracking-widest mt-2 text-center animate-pulse">Message envoyé avec succès !</p>}
                </div>
              ) : (
                <div className="bg-glacier/5 text-glacier p-5 rounded-2xl font-bold text-sm text-center border border-glacier/10">
                  C'est votre annonce
                </div>
              )}
            </div>
            
          </div>
        </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
