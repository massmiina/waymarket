'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { MessageCircle, ChevronRight, Inbox, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MessagesListPage() {
  const { currentUser, conversations, isLoading } = useMarket();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !currentUser) router.push('/auth');
  }, [currentUser, router, isLoading]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="h-10 w-48 bg-slate-100 rounded-2xl mb-8 animate-pulse"></div>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-28 bg-white rounded-3xl border border-slate-50 shadow-sm animate-pulse"></div>
          ))}
        </div>
      </main>
    </div>
  );

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Messagerie</h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Vos discussions en cours</p>
          </div>
          <div className="px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            {conversations.length} Discussion{conversations.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Conversations Container */}
        <div className="space-y-4">
          {conversations.length > 0 ? (
            conversations.map(conv => {
              const lastMsg = conv.lastMessage;
              const hasUnread = conv.unreadCount > 0;
              
              return (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}`}
                  className="group relative block bg-white rounded-[32px] p-6 border border-white shadow-xl shadow-slate-200/40 hover:shadow-indigo-100 hover:border-indigo-50 transition-all duration-500 overflow-hidden"
                >
                  {/* Unread Glow Effect */}
                  {hasUnread && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                  )}

                  <div className="flex items-center gap-6">
                    {/* Visual Thumbnails Stack */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-[24px] overflow-hidden border border-slate-100 shadow-md group-hover:scale-110 transition-transform duration-700">
                        {conv.listing.images[0] ? (
                          <img src={conv.listing.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                            <Inbox className="h-8 w-8 text-slate-200" />
                          </div>
                        )}
                      </div>
                      
                      {/* Floating User Avatar */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                        <img 
                          src={conv.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${conv.otherUser.name}`} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-black tracking-tight truncate ${hasUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                          {conv.listing.title}
                        </h3>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap pl-4">
                          {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-4">
                        <p className={`text-sm truncate ${hasUnread ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}`}>
                          <span className="text-indigo-400 font-black uppercase text-[9px] tracking-widest mr-2">
                            {conv.otherUser.name.split(' ')[0]}
                          </span>
                          {lastMsg ? lastMsg.content : "Aucun message encore..."}
                        </p>
                        
                        {hasUnread && (
                          <div className="relative flex items-center justify-center">
                            <span className="absolute w-6 h-6 bg-indigo-500 rounded-full animate-ping opacity-20"></span>
                            <span className="relative h-2.5 w-2.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-24 text-center bg-white rounded-[44px] shadow-2xl shadow-slate-200/50 border border-white">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                <MessageCircle className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Le calme plat...</h3>
              <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto text-sm leading-relaxed">
                C&apos;est ici que vous pourrez discuter avec vos acheteurs et vendeurs.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 text-[10px] uppercase tracking-widest"
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
