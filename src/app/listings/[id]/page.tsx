'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Share2, AlertCircle } from 'lucide-react';
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
        <button onClick={() => router.back()} className="text-gray-500 hover:text-indigo-600 mb-6 font-medium text-sm">
          ← Retour
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 h-[400px] md:h-auto relative bg-gray-100">
             <Image
              src={listing.images[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-semibold text-gray-700 shadow-sm">
              {listing.category}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {listing.title}
              </h1>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition text-gray-600 border border-gray-200"
                  title="Ajouter aux favoris"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition text-gray-600 border border-gray-200" title="Partager">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="text-3xl font-extrabold text-indigo-600 mt-4 mb-6">{listing.price} €</p>
            
            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <MapPin className="h-5 w-5" />
              <span>{listing.location}</span>
            </div>

            <div className="border-t border-b border-gray-100 py-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Dynamic Details block based on category */}
            {listing.details && Object.keys(listing.details).length > 0 && (
              <div className="bg-gray-50 rounded-xl p-5 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Critères</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  {Object.entries(listing.details).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">{key}</span>
                      <span className="text-gray-900 font-medium mt-0.5">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Contacter le vendeur</h3>
              {listing.sellerId !== currentUser?.id ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    rows={3}
                    placeholder="Bonjour, votre annonce m'intéresse..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Envoyer le message
                  </button>
                  {messageSent && <p className="text-green-600 text-sm font-medium mt-1">Message envoyé avec succès !</p>}
                </div>
              ) : (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg font-medium">
                  C&apos;est votre annonce.
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
