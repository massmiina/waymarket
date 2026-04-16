'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageCircle, 
  User,
  Plus
} from 'lucide-react';
import { useMarket, Message } from '@/contexts/MarketContext';
import { isMobile } from 'react-device-detect';

export default function MobileNavbar() {
  const pathname = usePathname();
  const { currentUser, messages } = useMarket();
  
  // Hide on desktop
  const [show, setShow] = React.useState(false);
  
  React.useEffect(() => {
    // We use a state to avoid hydration mismatch while still using react-device-detect
    setShow(isMobile);
  }, []);

  if (!show) return null;

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
    <div className="fixed bottom-0 left-0 right-0 z-[60] sm:hidden">
      {/* Background with Blur - Glassmorphism */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100/50"></div>
      
      {/* Safe Area Container */}
      <div className="relative flex items-center justify-around h-16 pb-safe px-1">
        
        <NavItem href="/" icon={Home} label="Accueil" />
        
        <Link 
          href="/" 
          className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-slate-400"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Search className="h-5 w-5" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Découvrir</span>
        </Link>
        
        {/* Floating Action Button for Sell */}
        <div className="relative -top-5">
          <Link 
            href="/create"
            className="flex items-center justify-center w-12 h-12 bg-peaks text-white rounded-full shadow-2xl shadow-peaks/40 ring-4 ring-white transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6 stroke-[3px]" />
          </Link>
        </div>
        
        <NavItem 
          href="/messages" 
          icon={MessageCircle} 
          label="Messages" 
          badgeCount={unreadMessagesCount} 
        />
        
        <NavItem href="/compte" icon={User} label="Moi" />
        
      </div>
    </div>
  );
}
