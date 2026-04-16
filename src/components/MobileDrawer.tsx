'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  Home, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  LogOut,
  Shield,
  Zap,
  Package,
  ChevronRight,
  TrendingUp,
  User as UserIcon
} from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useMarket } from '@/contexts/MarketContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { currentUser, favorites, messages } = useMarket();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const menuItems = [
    { href: '/', icon: Home, label: 'Accueil', color: 'text-blue-500' },
    { href: '/favorites', icon: Heart, label: 'Favoris', color: 'text-pink-500', badge: favorites.length },
    { href: '/messages', icon: MessageSquare, label: 'Messages', color: 'text-amber-500', badge: messages.filter(m => !m.read).length },
    { href: '/mes-ventes', icon: Package, label: 'Mes annonces', color: 'text-indigo-500' },
    { href: '/pro', icon: Zap, label: 'Passer Pro', color: 'text-yellow-500' },
    { href: '/compte', icon: Settings, label: 'Paramètres', color: 'text-slate-500' },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer content */}
      <div 
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-glacier rounded-lg flex items-center justify-center text-white font-black text-xs">W</div>
             <span className="font-black text-slate-800 tracking-tighter uppercase text-xs">Way Market</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all hover:rotate-90 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Summary */}
        <div className="p-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             
             <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  {clerkUser?.imageUrl ? (
                    <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white font-black">?</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-black truncate text-sm">
                    {clerkUser?.firstName || 'Utilisateur'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {currentUser?.isPro ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-glacier/20 text-glacier text-[8px] font-black uppercase tracking-widest rounded-full">
                        <Shield className="w-2.5 h-2.5" />
                        Pro
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[8px] font-bold uppercase tracking-widest rounded-full">
                        Membre
                      </span>
                    )}
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-4">Gérer</h4>
          
          <div className="grid grid-cols-1 gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98] ${
                    isActive ? 'bg-glacier/5 border border-glacier/10' : 'bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white shadow-sm ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold text-sm ${isActive ? 'text-glacier' : 'text-slate-600'}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-glacier' : 'text-slate-300'}`} />
                  </div>
                </Link>
              );
            })}
          </div>

          <Link
            href="/create"
            onClick={onClose}
            className="mt-6 flex items-center justify-center gap-2 w-full p-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5 text-glacier" />
            Vendre un objet
          </Link>
        </div>

        {/* Footer */}
        <div className="p-6 mt-auto border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest transition-opacity hover:opacity-70 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">v0.1.0</span>
        </div>
      </div>
    </>
  );
}
