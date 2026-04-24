'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  User,
  Plus
} from 'lucide-react';
import { useMarket, Message } from '@/contexts/MarketContext';

export default function MobileNavbar() {
  const pathname = usePathname();
  const { currentUser, messages } = useMarket();

  const unreadMessagesCount = messages.filter(
    (m: Message) => m.receiverId === currentUser?.id && !m.read
  ).length;

  const NavItem = ({ href, icon: Icon, label, badgeCount }: any) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href}
        className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${
          isActive ? 'text-glacier' : 'text-slate-400'
        }`}
      >
        <div className="relative">
          <Icon className={`h-6 w-6 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(40,154,196,0.3)]' : ''}`} />
          {badgeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full font-black border-2 border-white">
              {badgeCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex sm:hidden">
      {/* Background with Blur - Premium Glassmorphism */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl border-t border-slate-100/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]"></div>
      
      {/* Safe Area Container */}
      <div className="relative flex items-center justify-around h-20 w-full pb-safe px-2">
        
        <NavItem href="/" icon={Home} label="Accueil" />
        
        <NavItem href="/favoris" icon={Heart} label="Favoris" />
        
        {/* Floating Action Button for Sell - "The Plus Button" */}
        <div className="relative -top-6">
          <Link 
            href="/create"
            className="flex items-center justify-center w-14 h-14 bg-emerald text-white rounded-full shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-emerald/50 ring-4 ring-background transition-all hover:scale-110 active:scale-90 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald to-emerald-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus className="relative h-8 w-8 stroke-[2.5px]" />
          </Link>
        </div>
        
        <NavItem 
          href="/messages" 
          icon={MessageCircle} 
          label="Messages" 
          badgeCount={unreadMessagesCount} 
        />
        
        <NavItem href="/compte" icon={User} label="Profil" />
        
      </div>
    </div>
  );
}
