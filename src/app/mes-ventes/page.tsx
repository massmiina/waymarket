'use client';

import React from 'react';
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
    <div className="min-h-screen bg-background flex flex-col">
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        
        {/* Header Area (Messagerie Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-forest-green tracking-tighter leading-none font-[family-name:var(--font-playfair)] italic">Mes Ventes</h1>
            <p className="text-[10px] font-black text-emerald/40 uppercase tracking-[0.2em]">Poste de gestion Elite</p>
          </div>
          <Link 
            href="/create" 
            className="px-8 py-4 bg-emerald text-white font-black rounded-2xl hover:bg-emerald-hover transition-all shadow-neon active:scale-95 text-[10px] uppercase tracking-widest flex items-center gap-2 font-[family-name:var(--font-outfit)]"
          >
            + Nouvelle annonce
          </Link>
        </div>

        {/* Content Area */}
        {myListings.length > 0 ? (
          <div className="space-y-4">
            {myListings.map(listing => (
              <div 
                key={listing.id} 
                className="group relative bg-white rounded-[32px] p-6 border border-white shadow-xl shadow-emerald-900/5 hover:shadow-emerald-900/10 hover:border-emerald/10 transition-all duration-500 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Image Thumbnail */}
                  <div className="w-full sm:w-24 h-24 rounded-[24px] overflow-hidden border border-slate-100 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Text Details */}
                  <div className="flex-grow w-full text-center sm:text-left min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-black text-forest-green tracking-tight truncate font-[family-name:var(--font-playfair)] italic">{listing.title}</h3>
                      <span className="text-lg font-black text-emerald shrink-0 font-[family-name:var(--font-outfit)]">{listing.price} €</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <p className="text-[10px] font-black text-forest-green/30 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-emerald" />
                        Publiée le {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-center">
                    <Link 
                      href={`/listings/${listing.id}`} 
                      className="p-3.5 bg-slate-50 text-slate-400 hover:text-emerald border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-lg"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => {
                        if (window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
                          deleteListing(listing.id);
                        }
                      }}
                      className="p-3.5 bg-slate-50 text-slate-400 hover:text-red-500 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[44px] shadow-2xl shadow-emerald-900/5 border border-white">
            <div className="w-24 h-24 bg-emerald/5 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <Package className="h-10 w-10 text-emerald/20" />
            </div>
            <h3 className="text-2xl font-black text-forest-green tracking-tight mb-3 font-[family-name:var(--font-playfair)] italic">Rien en stock</h3>
            <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto text-sm leading-relaxed">
              Vous n&apos;avez aucune annonce en ligne pour le moment.
            </p>
            <Link 
              href="/create" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald text-white font-black rounded-2xl hover:bg-emerald-hover transition-all shadow-neon active:scale-95 text-[10px] uppercase tracking-widest font-[family-name:var(--font-outfit)]"
            >
              Créer ma première annonce
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
