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
    <Link href={href} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group active:scale-[0.98]">
      <div className="flex items-center gap-5">
        <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{title}</h3>
            {badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Navbar />
      
      <main className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex-grow">
        {isSuccess && (
          <div className="mb-8 p-6 bg-gradient-to-r from-glacier to-indigo-600 rounded-[2rem] text-white shadow-xl shadow-glacier/20 animate-in zoom-in duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest mb-1">Félicitations !</h2>
                <p className="font-medium text-white/90">Votre statut **Way Market Pro** est désormais actif. Profitez de votre visibilité boostée !</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Hero Profile Header */}
        <div className="relative mb-8 sm:mb-12">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8 relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 z-10 w-full">
              {/* Avatar Clerk */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={user.imageUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
              </div>

              <div className="text-center sm:text-left flex-grow">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    {user.firstName} {user.lastName || ''}
                  </h1>
                  {currentUser?.isPro ? (
                    <span className="px-3 py-1 bg-glacier text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-glacier/20 flex items-center gap-1.5 animate-in zoom-in-50 duration-500">
                      <Shield className="w-3.5 h-3.5" />
                      Membre Pro
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">
                      Particulier
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Identité vérifiée</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>Inscrit en {new Date(user.createdAt!).getFullYear()}</span>
                  </div>
                </div>
              </div>

              {!currentUser?.isPro && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => router.push('/pro')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-glacier text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition shadow-xl shadow-glacier/20 active:scale-95 animate-pulse"
                  >
                    <span>{userCount < 1000 ? '⭐ Profiter de l\'offre PRO (Gratuit)' : 'Devenir Pro'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-6">
            <h2 className="text-lg font-black text-gray-900 ml-2">Ma Boutique</h2>
            <div className="grid gap-4">
              <DashboardCard 
                icon={ArchiveRestore} 
                title="Mes annonces" 
                description="Gérez vos ventes en cours" 
                href="/mes-ventes"
                badge={0}
              />
              <DashboardCard 
                icon={ShoppingBag} 
                title="Mes achats" 
                description="Suivi de vos transactions" 
                href="/account/orders"
                badge={0}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-black text-gray-900 ml-2">Activité</h2>
            <div className="grid gap-4">
              <DashboardCard 
                icon={Heart} 
                title="Mes favoris" 
                description="Retrouvez vos coups de cœur" 
                href="/favorites"
                badge={favorites.length}
              />
              <DashboardCard 
                icon={MessageSquare} 
                title="Messagerie" 
                description="Discutez avec les vendeurs" 
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
