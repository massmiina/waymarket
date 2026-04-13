'use client';

import React from 'react';
import Link from 'next/link';
import { useMarket } from '@/contexts/MarketContext';
import { 
  User as UserIcon, 
  Heart, 
  ArchiveRestore, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Home,
  Search,
  Zap,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';

export default function MenuPage() {
  const { currentUser } = useMarket();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const MenuCard = ({ href, icon: Icon, label, description, color }: any) => (
    <Link 
      href={href} 
      className="group relative overflow-hidden bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 blur-2xl transition-all group-hover:opacity-10 ${color}`}></div>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-gray-900 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-0.5">{label}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {/* Profile Section */}
        <div className="relative overflow-hidden bg-white px-8 py-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-black border-4 border-indigo-50 shadow-inner overflow-hidden">
                {clerkUser?.imageUrl ? (
                  <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  clerkUser?.firstName?.charAt(0) || '?'
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                {clerkUser ? `Bonjour, ${clerkUser.firstName}` : 'Bienvenue sur Way Market'}
              </h1>
              <p className="text-gray-500 font-medium mb-6">
                {clerkUser ? clerkUser.primaryEmailAddress?.emailAddress : 'Connectez-vous pour gérer vos annonces et messages'}
              </p>
              
              {!clerkUser ? (
                <Link href="/auth" className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform active:scale-95">
                  <UserIcon className="w-5 h-5" />
                  Se connecter
                </Link>
              ) : (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Vérifié
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" />
                    Top Vendeur
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hub Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-4">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] ml-4 pt-2">Navigation</h2>
            <MenuCard 
              href="/" 
              icon={Home} 
              label="Accueil" 
              description="Retourner à la page principale"
              color="bg-blue-500 text-blue-600"
            />
            <MenuCard 
              href="/favorites" 
              icon={Heart} 
              label="Mes Favoris" 
              description="Retrouvez vos coups de cœur"
              color="bg-pink-500 text-pink-600"
            />
            <MenuCard 
              href="/messages" 
              icon={MessageSquare} 
              label="Messages" 
              description="Vos conversations avec les vendeurs"
              color="bg-amber-500 text-amber-600"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] ml-4 pt-2">Mon Activité</h2>
            <MenuCard 
              href="/create" 
              icon={PlusCircle} 
              label="Déposer une annonce" 
              description="Vendez vos objets rapidement"
              color="bg-emerald-500 text-emerald-600"
            />
            <MenuCard 
              href="/mes-ventes" 
              icon={ArchiveRestore} 
              label="Mes annonces" 
              description="Gérez ce que vous vendez"
              color="bg-indigo-500 text-indigo-600"
            />
            <MenuCard 
              href="/compte" 
              icon={Settings} 
              label="Paramètres" 
              description="Modifier votre profil et préférences"
              color="bg-gray-500 text-gray-600"
            />
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition">Aide</Link>
            <Link href="#" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition">Confidentialité</Link>
            <Link href="#" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition">CGU</Link>
          </div>
          
          {clerkUser && (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 text-red-600 font-bold hover:bg-red-50 rounded-2xl transition active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Se déconnecter
            </button>
          )}
        </div>

        <div className="text-center mt-12 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-400 rounded-full text-xs font-black tracking-widest uppercase">
            Way Market <div className="w-1 h-1 bg-indigo-300 rounded-full"></div> 2026
          </div>
        </div>

      </main>
    </div>
  );
}
