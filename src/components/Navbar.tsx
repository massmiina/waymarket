'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  PlusCircle, 
  MessageCircle, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  Package,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useMarket, Message } from '@/contexts/MarketContext';

import { Show, UserButton, SignInButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, favorites, messages } = useMarket();
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
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors font-medium ${
          pathname === '/favorites' ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        <div className="relative">
          <Heart className="h-5 w-5" />
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {favorites.length}
            </span>
          )}
        </div>
        <span className="sm:hidden md:block">Favoris</span>
      </Link>

      <Link
        href="/mes-ventes"
        onClick={closeMobileMenu}
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors font-medium ${
          pathname === '/mes-ventes' ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        <Package className="h-5 w-5" />
        <span className="sm:hidden md:block">Mes ventes</span>
      </Link>

      <Link
        href="/messages"
        onClick={closeMobileMenu}
        className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors font-medium ${
          pathname === '/messages' ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        <div className="relative">
          <MessageCircle className="h-5 w-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span className="sm:hidden md:block">Messages</span>
      </Link>
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-2 sm:p-2.5 rounded-xl shadow-sm">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900">
              Way Market
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-bold uppercase tracking-wider ${
                pathname === '/' ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-sm">Accueil</span>
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            
            <NavLinks />

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            <Show when="signed-in">
              <div className="flex items-center space-x-4">
                <Link
                  href="/compte"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden md:block text-sm">Mon Profil</span>
                </Link>
                <UserButton />
              </div>
            </Show>
            
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition">
                  <UserIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm">Se connecter</span>
                </button>
              </SignInButton>
            </Show>

            <Link
              href="/create"
              className="ml-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden lg:block">Déposer une annonce</span>
              <span className="lg:hidden">Déposer</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden gap-3">
            <Link
              href="/create"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Déposer</span>
            </Link>
            <Link
              href="/menu"
              className="p-2 -mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

