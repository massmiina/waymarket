'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Heart, 
  Plus, 
  Settings, 
  MessageSquare,
  Package,
  Shield,
  Zap,
  User as UserIcon,
  X,
  Search,
  Bell,
  ArrowRight
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const { user: clerkUser } = useUser();
  const { currentUser } = useMarket();
  const router = useRouter();

  const MenuCard = ({ href, icon: Icon, label, description, badge }: any) => (
    <Link 
      href={href} 
      className="group relative overflow-hidden bg-white/60 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-2xl hover:shadow-emerald/10 transition-all duration-500 hover:-translate-y-1 active:scale-[0.98] flex items-center gap-5"
    >
      <div className="relative shrink-0">
        <div className="p-4 rounded-2xl bg-emerald text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          <Icon className="w-6 h-6 stroke-[2.5px]" />
        </div>
        <div className="absolute inset-0 bg-emerald blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-forest-green tracking-tight">{label}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-emerald text-white text-[8px] font-black rounded-full uppercase tracking-widest animate-pulse">{badge}</span>
          )}
        </div>
        <p className="text-xs text-forest-green/40 mt-0.5 font-medium">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-forest-green/10 group-hover:text-emerald group-hover:translate-x-1 transition-all" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-emerald/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-forest-green/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header with Close Button */}
      <header className="relative z-10 flex justify-between items-center px-6 py-6 sm:px-12 sm:py-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Way Market</span>
          <h2 className="text-2xl font-[family-name:var(--font-playfair)] italic font-bold text-forest-green">Menu</h2>
        </div>
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-50 text-forest-green hover:scale-110 active:scale-90 transition-all"
        >
          <X className="w-5 h-5 stroke-[2.5px]" />
        </button>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-6 pb-20">
        
        {/* Profile Card - Ultra Premium */}
        <div className="relative overflow-hidden bg-forest-green px-8 py-10 rounded-[2.5rem] shadow-2xl shadow-forest-green/20 mb-10 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          
          <div className="relative flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-3xl font-black border-2 border-white/20 shadow-xl overflow-hidden">
                {clerkUser?.imageUrl ? (
                  <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  clerkUser?.firstName?.charAt(0) || <UserIcon className="w-10 h-10" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald w-6 h-6 rounded-full border-4 border-forest-green shadow-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white tracking-tight font-[family-name:var(--font-playfair)] italic">
                {clerkUser ? `${clerkUser.firstName} ${clerkUser.lastName || ''}` : 'Bienvenue'}
              </h1>
              <p className="text-[9px] text-emerald font-black uppercase tracking-[0.3em] mt-1 mb-4 opacity-80">
                {clerkUser ? clerkUser.primaryEmailAddress?.emailAddress : 'Way Market Elite Access'}
              </p>
              
              {!clerkUser ? (
                <Link href="/auth" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald text-white font-bold rounded-xl text-sm hover:scale-105 transition-transform shadow-lg shadow-emerald/20">
                  S'identifier
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                   <Link href="/compte" className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition">Gérer mon profil</Link>
                   <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                   <Link href="/pro" className="text-[10px] font-black uppercase tracking-widest text-emerald hover:text-emerald-light transition">Passer Pro</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-10">
          
          <section>
            <h2 className="text-[10px] font-black text-forest-green/20 uppercase tracking-[0.5em] mb-6 ml-4">Découvrir</h2>
            <div className="grid gap-4">
              <MenuCard 
                href="/" 
                icon={Home} 
                label="Accueil" 
                description="Explorez les dernières annonces d'élite"
              />
              <MenuCard 
                href="/recherche" 
                icon={Search} 
                label="Recherche Avancée" 
                description="Filtres précis, immobilier, véhicules"
              />
              <MenuCard 
                href="/favoris" 
                icon={Heart} 
                label="Mes Favoris" 
                description="Votre sélection de biens d'exception"
              />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-forest-green/20 uppercase tracking-[0.5em] mb-6 ml-4">Services</h2>
            <div className="grid gap-4">
              <MenuCard 
                href="/create" 
                icon={Plus} 
                label="Publier une annonce" 
                description="Vendez au meilleur prix sur Way Market"
                badge="Nouveau"
              />
              <MenuCard 
                href="/messages" 
                icon={MessageSquare} 
                label="Messagerie" 
                description="Discutez avec vos acheteurs et vendeurs"
              />
              {currentUser?.role === 'ADMIN' && (
                <MenuCard 
                  href="/admin" 
                  icon={Shield} 
                  label="Console Admin" 
                  description="Accès restreint au centre de contrôle"
                />
              )}
            </div>
          </section>

        </div>

        <div className="mt-16 text-center">
            <p className="text-[10px] font-bold text-forest-green/20 uppercase tracking-[0.5em]">Way Market • Elite Caucasian Marketplace</p>
            <p className="text-[9px] text-forest-green/10 mt-2">Version 2.4.0 Elite Edition</p>
        </div>
      </main>
    </div>
  );
}
