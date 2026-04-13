'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function MessagesListPage() {
  const { currentUser, messages, listings } = useMarket();
  const router = useRouter();

  React.useEffect(() => {
    if (!currentUser) router.push('/auth');
  }, [currentUser, router]);

  if (!currentUser) return null;

  const conversationGroups = messages.reduce((acc, msg) => {
    const isParticipant = msg.senderId === currentUser.id || msg.receiverId === currentUser.id;
    if (!isParticipant) return acc;

    const partnerId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
    const conversationId = `${msg.listingId}_${partnerId}`;

    if (!acc[conversationId]) {
      const relatedListing = listings.find(l => l.id === msg.listingId);
      acc[conversationId] = {
        id: conversationId,
        listingId: msg.listingId,
        partnerId,
        listingTitle: relatedListing?.title || 'Annonce supprimée',
        listingImage: relatedListing?.images[0],
        unreadCount: 0,
        messages: []
      };
    }

    acc[conversationId].messages.push(msg);
    if (msg.receiverId === currentUser.id && !msg.read) {
      acc[conversationId].unreadCount++;
    }

    return acc;
  }, {} as Record<string, {
    id: string;
    listingId: string;
    partnerId: string;
    listingTitle: string;
    listingImage?: string;
    unreadCount: number;
    messages: typeof messages;
  }>);

  const conversations = Object.values(conversationGroups).sort((a, b) => {
    const lastMsgA = a.messages[a.messages.length - 1];
    const lastMsgB = b.messages[b.messages.length - 1];
    return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Vos Conversations</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {conversations.length > 0 ? (
            <div className="flex flex-col">
              {conversations.map(conv => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                return (
                  <Link
                    key={conv.id}
                    href={`/messages/${conv.id}`}
                    className="w-full text-left p-4 sm:p-5 border-b border-gray-50 hover:bg-indigo-50/30 transition flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                      {conv.listingImage ? (
                        <img src={conv.listingImage} alt={conv.listingTitle} className="w-full h-full object-cover" />
                      ) : (
                        <MessageCircle className="w-8 h-8 text-gray-400 absolute inset-0 m-auto" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 truncate text-base sm:text-lg">{conv.listingTitle}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold ml-2 shrink-0">
                            {conv.unreadCount} nouvea{conv.unreadCount > 1 ? 'x' : 'u'}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm sm:text-base truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                        {lastMsg.senderId === currentUser.id ? 'Vous: ' : ''}{lastMsg.content}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center m-auto">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun message</h3>
              <p className="text-gray-500">Vous navez pas encore de conversations.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
