'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function MessagesListPage() {
  const { currentUser, conversations, isLoading } = useMarket();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !currentUser) router.push('/auth');
  }, [currentUser, router, isLoading]);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-lg mb-8"></div>
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100"></div>)}
        </div>
      </main>
    </div>
  );

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
          <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {conversations.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {conversations.map(conv => {
                const lastMsg = conv.lastMessage;
                return (
                  <Link
                    key={conv.id}
                    href={`/messages/${conv.id}`}
                    className="group block w-full p-6 transition-all hover:bg-gray-50/50"
                  >
                    <div className="flex items-center gap-5">
                      {/* Listing Image */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                          {conv.listing.images[0] ? (
                            <img src={conv.listing.images[0]} alt={conv.listing.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                              <MessageCircle className="w-8 h-8 text-indigo-200" />
                            </div>
                          )}
                        </div>
                        {/* Other User Avatar Mini */}
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white">
                          <img 
                            src={conv.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${conv.otherUser.name}`} 
                            alt={conv.otherUser.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-indigo-600 transition-colors">
                            {conv.listing.title}
                          </h3>
                          <span className="text-xs text-gray-400 font-medium whitespace-nowrap pt-1">
                            {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center gap-4">
                          <p className={`text-sm truncate max-w-[80%] ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                            <span className="text-gray-400 font-medium">{conv.otherUser.name}: </span>
                            {lastMsg ? lastMsg.content : "Aucun message"}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-indigo-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm animate-bounce-subtle">
                              {conv.unreadCount} nouvea{conv.unreadCount > 1 ? 'x' : 'u'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Votre messagerie est vide</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm italic">
                C&apos;est ici que vous pourrez discuter avec vos acheteurs et vendeurs.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
              >
                Explorer les annonces
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
