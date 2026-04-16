'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  PlusCircle, 
  MessageCircle, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  Package,
  Menu,
  X,
  Home,
  ShieldAlert
} from 'lucide-react';
import { useMarket, Message } from '@/contexts/MarketContext';
import Image from 'next/image';

import { Show, UserButton, SignInButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, favorites, messages, isLoading: isMarketLoading } = useMarket();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadMessagesCount = messages.filter(
    (m: Message) => m.receiverId === currentUser?.id && !m.read
  ).length;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const NavLinks = () => (
    <>
      <Link
        href="/favorites"
        onClick={closeMobileMenu}
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
          pathname === '/favorites' ? 'text-glacier bg-glacier/5' : 'text-slate-400 hover:text-glacier hover:bg-slate-50'
        }`}
      >
        <div className="relative">
          <Heart className="h-4 w-4" />
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-glacier text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black">
              {favorites.length}
            </span>
          )}
        </div>
        <span className="sm:hidden md:block">Favoris</span>
      </Link>

      <Link
        href="/mes-ventes"
        onClick={closeMobileMenu}
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
          pathname === '/mes-ventes' ? 'text-glacier bg-glacier/5' : 'text-slate-400 hover:text-glacier hover:bg-slate-50'
        }`}
      >
        <Package className="h-4 w-4" />
        <span className="sm:hidden md:block">Mes ventes</span>
      </Link>

      <Link
        href="/messages"
        onClick={closeMobileMenu}
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
          pathname === '/messages' ? 'text-glacier bg-glacier/5' : 'text-slate-400 hover:text-glacier hover:bg-slate-50'
        }`}
      >
        <div className="relative">
          <MessageCircle className="h-4 w-4" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span className="sm:hidden md:block">Messages</span>
      </Link>
    </>
  );

  return (
    <nav className="glass-card sticky top-0 z-50 border-none shadow-none">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Final Perfect Logo - Pure Line Art (v7) */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="bg-white rounded-2xl group-hover:bg-glacier transition-colors duration-500 shadow-lg shadow-slate-200/20 overflow-hidden flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
              <Image 
                src="/images/tower-logo-v7.png" 
                alt="Way Market Tower" 
                width={56} 
                height={56} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-tighter text-slate-900 leading-none">
              Way Market
            </span>
          </Link>

          {/* Minimalist Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-1 md:space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
                pathname === '/' ? 'text-glacier' : 'text-slate-400 hover:text-glacier'
              }`}
            >
              Accueil
            </Link>

            <NavLinks />

            <Show when="signed-in">
              <div className="flex items-center space-x-4 ml-4">
                {currentUser?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 transition"
                    title="Console Admin"
                  >
                    <ShieldAlert className="h-5 w-5" />
                  </Link>
                )}
                <Link
                  href="/compte"
                  className="p-2 rounded-full text-slate-400 hover:text-glacier transition"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
                <UserButton />
              </div>
            </Show>
            
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-5 py-2 rounded-xl font-bold text-[10px] text-glacier uppercase tracking-widest border border-glacier/20 hover:bg-glacier/5 transition">
                  Se connecter
                </button>
              </SignInButton>
            </Show>

            <Link
              href="/create"
              className="ml-4 flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black bg-peaks text-white hover:bg-glacier shadow-lg shadow-peaks/5 transition-all uppercase tracking-widest"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Vendre</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden gap-3">
             {currentUser?.role === 'ADMIN' && (
               <Link
                href="/admin"
                className="p-2 rounded-full bg-red-50 text-red-500"
              >
                <ShieldAlert className="h-5 w-5" />
              </Link>
             )}
            <Link
              href="/menu"
              className="p-2 text-slate-400"
            >
              <Menu className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

