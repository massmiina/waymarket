'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useUser, useClerk } from '@clerk/nextjs';
import { 
  User as UserIcon, 
  Settings, 
  Heart, 
  MessageSquare, 
  ShoppingBag, 
  ArchiveRestore,
  ChevronRight,
  Shield,
  LogOut,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { currentUser, favorites, messages } = useMarket();
  const [userCount, setUserCount] = React.useState<number>(0);
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isSuccess = searchParams?.get('success') === 'pro_activated';

  React.useEffect(() => {
    fetch('/api/stats/user-count')
      .then(res => res.json())
      .then(data => setUserCount(data.count || 0));
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, le middleware devrait s'en occuper,
  // mais on ajoute une sécurité au cas où.
  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const DashboardCard = ({ icon: Icon, title, description, href, badge }: any) => (
    <Link href={href} className="flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:p-5 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group active:scale-[0.98] text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 w-full">
        <div className="p-2 sm:p-3.5 bg-indigo-50 text-indigo-600 rounded-xl sm:rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex flex-col min-w-0 w-full">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{title}</h3>
            {badge > 0 && (
              <span className="bg-red-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-1 hidden sm:block">{description}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Navbar />
      
      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-12 flex-grow">
        {isSuccess && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-glacier to-indigo-600 rounded-2xl sm:rounded-[2rem] text-white shadow-xl shadow-glacier/20 animate-in zoom-in duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-24 h-24 sm:w-32 sm:h-32" />
            </div>
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 text-left">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-black uppercase tracking-widest mb-0.5 sm:mb-1">Félicitations !</h2>
                <p className="text-xs sm:font-medium text-white/90">Statut **Way Market Pro** actif.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Hero Profile Header */}
        <div className="relative mb-8 sm:mb-12">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 sm:gap-8 relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
            
            <div className="flex items-center gap-4 sm:gap-8 z-10 w-full">
              {/* Avatar Clerk */}
              <div className="relative group shrink-0">
                <div className="w-16 h-16 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={user.imageUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-4 border-white shadow-sm"></div>
              </div>

              <div className="text-left flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                  <h1 className="text-xl sm:text-4xl font-black text-gray-900 tracking-tight truncate w-full">
                    {user.firstName}
                  </h1>
                  {currentUser?.isPro ? (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-glacier text-white text-[8px] sm:text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-glacier/20 flex items-center gap-1 animate-in zoom-in-50 duration-500">
                      <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Pro
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-100 text-slate-500 text-[8px] sm:text-[10px] font-bold rounded-full uppercase tracking-widest">
                      Perso
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-1.5 sm:mt-3">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] sm:text-sm font-medium">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    <span className="hidden sm:inline">Identité vérifiée</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] sm:text-sm font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Depuis {new Date(user.createdAt!).getFullYear()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <button 
                  onClick={() => router.push(currentUser?.isPro ? '/pro' : '/pro')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition shadow-xl active:scale-95 ${
                    currentUser?.isPro 
                      ? 'bg-slate-900 text-white shadow-slate-200/20' 
                      : 'bg-glacier text-white shadow-glacier/20 animate-pulse'
                  }`}
                >
                  <span>{currentUser?.isPro ? '💎 Gérer mon abonnement Pro' : (userCount < 1000 ? '⭐ Offre PRO Gratuite' : 'Devenir Pro')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
          
          <div className="col-span-2 sm:col-span-1 space-y-4 sm:space-y-6">
            <h2 className="text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Ma Boutique</h2>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              <DashboardCard 
                icon={ArchiveRestore} 
                title="Ventes" 
                description="Gérez vos annonces" 
                href="/mes-ventes"
                badge={0}
              />
              <DashboardCard 
                icon={ShoppingBag} 
                title="Achats" 
                description="Suivi transactions" 
                href="/account/orders"
                badge={0}
              />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-4 sm:space-y-6">
            <h2 className="text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Activité</h2>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              <DashboardCard 
                icon={Heart} 
                title="Favoris" 
                description="Vos coups de cœur" 
                href="/favorites"
                badge={favorites.length}
              />
              <DashboardCard 
                icon={MessageSquare} 
                title="Messages" 
                description="Vos discussions" 
                href="/messages"
                badge={messages.filter(m => !m.read).length}
              />
            </div>
          </div>

        </div>

        {/* Logout Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center sm:justify-end">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-8 py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition shadow-sm active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter de Way Market</span>
          </button>
        </div>

      </main>
      
      <footer className="w-full max-w-5xl mx-auto px-4 py-8 text-center text-gray-400 text-sm font-medium">
        <p>Way Market © 2026 - Sécurisé par Clerk</p>
      </footer>
    </div>
  );
}
