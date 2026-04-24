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
  Shield,
  Search
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
        href="/favoris"
        onClick={closeMobileMenu}
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
          pathname === '/favoris' ? 'text-emerald bg-emerald/10' : 'text-slate-400 hover:text-emerald hover:bg-emerald/5'
        }`}
      >
        <div className="relative">
          <Heart className={`h-4 w-4 ${pathname === '/favoris' ? 'fill-emerald' : ''}`} />
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-emerald text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black">
              {favorites.length}
            </span>
          )}
        </div>
        <span className="sm:hidden md:block">Favoris</span>
      </Link>

      <Link
        href="/messages"
        onClick={closeMobileMenu}
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
          pathname === '/messages' ? 'text-emerald bg-emerald/10' : 'text-slate-400 hover:text-emerald hover:bg-emerald/5'
        }`}
      >
        <div className="relative">
          <MessageCircle className="h-4 w-4" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black">
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
        <div className="flex justify-between items-center h-14 sm:h-20">
          
          {/* Restored Logo - Pure Line Art (v7) */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-4 group">
            <div className="bg-white rounded-xl sm:rounded-2xl group-hover:bg-slate-900 transition-colors duration-500 shadow-lg shadow-slate-200/20 overflow-hidden flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
              <Image 
                src="/images/tower-logo-v7.png" 
                alt="Way Market Tower" 
                width={56} 
                height={56} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-playfair)] italic font-bold text-lg sm:text-xl tracking-tight text-forest-green leading-none">
                Way Market
              </span>
              <span className="font-bold text-[7px] uppercase tracking-[0.6em] text-slate-400 mt-2 animate-in fade-in duration-1000">
                КАВКАЗ • ELITE
              </span>
            </div>
          </Link>

          {/* Minimalist Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-1 md:space-x-4 desktop-only">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
                pathname === '/' ? 'text-emerald bg-emerald/10' : 'text-slate-400 hover:text-emerald hover:bg-emerald/5'
              }`}
            >
              Accueil
            </Link>

            {/* NEW ELITE SEARCH SECTION POSITIONED RIGHT AFTER ACCUEIL */}
            <Link
              href="/recherche"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
                pathname === '/recherche' ? 'text-emerald bg-emerald/10' : 'text-slate-400 hover:text-emerald hover:bg-emerald/5'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Recherche</span>
            </Link>

            <NavLinks />

            <Show when="signed-in">
              <div className="flex items-center space-x-4 ml-4">
                {currentUser?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald/10 text-emerald rounded-full hover:bg-emerald/20 transition shadow-sm border border-emerald/20"
                    title="Console Admin"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Admin</span>
                  </Link>
                )}
                <Link
                  href="/compte"
                  className="p-2 rounded-full text-emerald hover:text-emerald-hover transition"
                >
                  <UserIcon className="h-5 w-5 text-emerald" />
                </Link>
                <UserButton />
              </div>
            </Show>
            
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-5 py-2 rounded-xl font-bold text-[10px] text-emerald uppercase tracking-widest border border-emerald/20 hover:bg-emerald/5 transition">
                  Se connecter
                </button>
              </SignInButton>
            </Show>

            <Link
              href="/create"
              className="ml-4 flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black bg-emerald text-white hover:bg-emerald-hover shadow-neon hover:shadow-neon-hover transition-all uppercase tracking-widest"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Vendre</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

