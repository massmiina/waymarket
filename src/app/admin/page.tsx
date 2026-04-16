'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Package, 
  Users, 
  ShieldAlert, 
  Zap, 
  MessageCircle,
  Clock,
  UserPlus,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { currentUser, listings, isLoading: isMarketLoading } = useMarket();
  const router = useRouter();
  const [adminStats, setAdminStats] = useState<any>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    if (!isMarketLoading && (!currentUser || currentUser.role !== 'ADMIN')) {
      router.push('/');
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          setAdminStats(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch admin stats');
      } finally {
        setIsStatsLoading(false);
      }
    };

    if (currentUser?.role === 'ADMIN') {
      fetchAdminStats();
    }
  }, [currentUser, isMarketLoading, router]);

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

  if (isMarketLoading || isStatsLoading || !currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, value, label, color, trend }: any) => (
    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">{value}</div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</div>
        </div>
        {trend && (
          <div className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{trend}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Navbar />
      
      <main className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-grow">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-200">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">Station de Contrôle</h1>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Activité Globale • En Direct</p>
            </div>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
             <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100">Statistiques</button>
             <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition">Modération</button>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <StatCard 
            icon={Users} 
            value={adminStats?.stats?.totalUsers || 0} 
            label="Utilisateurs" 
            color="bg-blue-500"
            trend="+12%"
          />
          <StatCard 
            icon={Package} 
            value={adminStats?.stats?.totalListings || 0} 
            label="Annonces" 
            color="bg-emerald-500"
          />
          <StatCard 
            icon={Zap} 
            value={adminStats?.stats?.proUsers || 0} 
            label="Membres PRO" 
            color="bg-amber-500"
          />
          <StatCard 
            icon={MessageCircle} 
            value={adminStats?.stats?.totalMessages || 0} 
            label="Messages" 
            color="bg-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ACTIVITY FEED */}
          <div className="lg:col-span-1 space-y-6">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Clock className="w-4 h-4" /> Activité Récente
                </h2>
                <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-tight">Voir tout</button>
             </div>
             
             <div className="space-y-4">
                {adminStats?.activity?.map((act: any) => (
                  <div key={act.id} className="flex items-start gap-3 group animate-in slide-in-from-left-4 duration-500">
                     <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md">
                           {act.avatar ? (
                             <img src={act.avatar} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                {act.user?.charAt(0)}
                             </div>
                           )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm ${act.type === 'LISTING' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                           {act.type === 'LISTING' ? <PlusCircle className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                        </div>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                           <span className="text-indigo-600 mr-1">{act.user}</span> 
                           {act.type === 'LISTING' ? 'a posté' : 'vient de s\'inscrire'}
                        </p>
                        <p className="text-[11px] font-medium text-gray-400 line-clamp-1 italic">
                           {act.type === 'LISTING' ? act.title : 'Bienvenue sur Way Market'}
                        </p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* SIMPLIFIED MODERATION LIST */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <AlertTriangle className="w-4 h-4 text-orange-400" /> Modération Prioritaire
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listings.slice(0, 6).map(listing => (
                <div key={listing.id} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-sm flex flex-col gap-4 group hover:border-glacier/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-50">
                      <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 truncate text-sm">{listing.title}</h3>
                      <p className="text-[10px] font-black text-glacier uppercase tracking-widest">{listing.price}€</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/listings/${listing.id}`}
                      className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-glacier hover:text-white transition flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <CheckCircle className="w-4 h-4" /> Voir
                    </Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 bg-white border border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2">
               Voir toutes les annonces à modérer <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
