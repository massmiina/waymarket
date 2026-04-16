'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  Home, 
  Heart, 
  PlusCircle, 
  Settings, 
  MessageSquare,
  Package,
  Shield,
  Zap,
  User as UserIcon
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useMarket } from '@/contexts/MarketContext';

export default function MenuPage() {
  const { user: clerkUser } = useUser();
  const { currentUser } = useMarket();

  const MenuCard = ({ href, icon: Icon, label, description, color }: any) => (
    <Link 
      href={href} 
      className="group relative overflow-hidden bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col items-center text-center sm:items-start sm:text-left"
    >
      <div className={`absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full opacity-5 blur-xl transition-all group-hover:opacity-10 ${color}`}></div>
      <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${color} bg-opacity-10 text-gray-900 group-hover:scale-110 transition-transform duration-300 mb-2 sm:mb-0`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="flex-1 min-w-0 w-full">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-0.5 line-clamp-1">{label}</h3>
        <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-1 hidden sm:block">{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-12">
        
        {/* Profile Section */}
        <div className="relative overflow-hidden bg-white px-6 py-8 sm:px-8 sm:py-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 mb-6 sm:mb-10 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          
          <div className="relative flex items-center gap-4 sm:gap-8">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl sm:text-3xl font-black border-4 border-indigo-50 shadow-inner overflow-hidden">
                {clerkUser?.imageUrl ? (
                  <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  clerkUser?.firstName?.charAt(0) || '?'
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-[3px] sm:border-4 border-white shadow-sm"></div>
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight line-clamp-1">
                {clerkUser ? `Bonjour, ${clerkUser.firstName}` : 'Bienvenue'}
              </h1>
              <p className="text-sm text-gray-500 font-medium line-clamp-1 mb-3 sm:mb-6">
                {clerkUser ? clerkUser.primaryEmailAddress?.emailAddress : 'Way Market'}
              </p>
              
              {!clerkUser ? (
                <Link href="/auth" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform active:scale-95">
                  Se connecter
                </Link>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-[9px] font-black rounded-full uppercase tracking-wider">
                    <Shield className="w-3 h-3" />
                    Vérifié
                  </span>
                  {currentUser?.isPro && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-glacier/10 text-glacier text-[9px] font-black rounded-full uppercase tracking-wider">
                      <Zap className="w-3 h-3" />
                      Pro
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hub Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
          
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <h2 className="text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-[0.2em] ml-2 pt-2">Navigation</h2>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
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
                label="Favoris" 
                description="Retrouvez vos coups de cœur"
                color="bg-pink-500 text-pink-600"
              />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <h2 className="text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-[0.2em] ml-2 pt-2">Activité</h2>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              <MenuCard 
                href="/create" 
                icon={PlusCircle} 
                label="Vendre" 
                description="Vendez vos objets rapidement"
                color="bg-emerald-500 text-emerald-600"
              />
              <MenuCard 
                href="/compte" 
                icon={Settings} 
                label="Profil" 
                description="Modifier vos préférences"
                color="bg-gray-500 text-gray-600"
              />
              <div className="col-span-2 sm:col-span-1">
                <MenuCard 
                  href="/pro" 
                  icon={Zap} 
                  label="Passer Pro" 
                  description="Boostez votre visibilité"
                  color="bg-yellow-500 text-yellow-600"
                />
              </div>

              {currentUser?.role === 'ADMIN' && (
                <div className="col-span-2 sm:col-span-1">
                  <MenuCard 
                    href="/admin" 
                    icon={Shield} 
                    label="Console Admin" 
                    description="Gérer la plateforme"
                    color="bg-indigo-500 text-indigo-600"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
