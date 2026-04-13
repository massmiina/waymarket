'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Calendar, Package, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { currentUser, listings, deleteListing } = useMarket();
  const router = useRouter();

  React.useEffect(() => {
    if (!currentUser) {
      router.push('/auth');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const myListings = listings.filter(l => l.sellerId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes Ventes</h1>
          </div>
          <Link href="/create" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            + Nouvelle annonce
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {myListings.length > 0 ? (
            <div className="space-y-4">
              {myListings.map(listing => (
                <div key={listing.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-full sm:w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow w-full text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
                    <p className="text-indigo-600 font-bold mt-1">{listing.price} €</p>
                    <p className="text-xs text-gray-500 mt-1">Publiée le {new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0 mt-4 sm:mt-0 justify-center">
                    <Link href={`/listings/${listing.id}`} className="p-2 text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 rounded-lg transition" title="Voir l'annonce">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => {
                        if (window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
                          deleteListing(listing.id);
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 bg-white border border-gray-200 rounded-lg transition" 
                      title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">Vous n'avez aucune annonce en ligne.</p>
              <Link href="/create" className="text-indigo-600 font-medium hover:underline mt-2 inline-block">
                Commencez à vendre dès maintenant
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
