'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, CheckCircle, Package, Users, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { currentUser, listings, isLoading } = useMarket();
  const router = useRouter();
  const [stats, setStats] = useState({ totalListings: 0, totalUsers: 0 });

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      alert("Erreur serveur.");
    }
  };

  if (isLoading || !currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-glacier border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Console Admin</h1>
            <p className="text-sm text-slate-500 font-medium">Gestion mobile de Way Market</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <Package className="w-5 h-5 text-glacier mb-2" />
            <div className="text-2xl font-black text-slate-900">{listings.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annonces</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <Users className="w-5 h-5 text-indigo-500 mb-2" />
            <div className="text-2xl font-black text-slate-900">Actif</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Serveur OK</div>
          </div>
        </div>

        <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight flex items-center gap-2">
           <AlertTriangle className="w-5 h-5 text-orange-400" />
           Modération des annonces
        </h2>

        <div className="space-y-3">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-50">
                  <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate text-sm">{listing.title}</h3>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{listing.location} • {listing.price}€</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link 
                  href={`/listings/${listing.id}`}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-glacier/10 hover:text-glacier transition"
                >
                  <CheckCircle className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          {listings.length === 0 && (
            <div className="text-center py-12 text-slate-400 font-medium italic">
              Aucune annonce à modérer.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
