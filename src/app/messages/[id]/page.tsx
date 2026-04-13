'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { currentUser, messages, listings, sendMessage, markMessagesAsRead } = useMarket();
  const router = useRouter();

  const [replyText, setReplyText] = useState('');

  React.useEffect(() => {
    if (!currentUser) router.push('/auth');
  }, [currentUser, router]);

  const conversationId = resolvedParams.id;
  const [listingId, partnerId] = conversationId.split('_');

  const activeMessages = messages.filter(msg => 
    msg.listingId === listingId && 
    (msg.senderId === partnerId || msg.receiverId === partnerId) &&
    (msg.senderId === currentUser?.id || msg.receiverId === currentUser?.id)
  );

  const relatedListing = listings.find(l => l.id === listingId);

  React.useEffect(() => {
    if (currentUser && activeMessages.length > 0) {
      activeMessages.forEach(msg => {
        if (msg.receiverId === currentUser.id && !msg.read) {
          markMessagesAsRead(msg.listingId, msg.senderId);
        }
      });
    }
  }, [currentUser, activeMessages, markMessagesAsRead]);

  if (!currentUser) return null;

  if (activeMessages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Conversation introuvable</h2>
            <button onClick={() => router.push('/messages')} className="mt-4 text-indigo-600 font-medium hover:underline">
              Retour aux messages
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendMessage(listingId, partnerId, replyText);
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full flex-grow flex flex-col h-[calc(100vh-64px)]">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-grow flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/messages')} 
                className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition mr-1"
                title="Retour"
              >
                 <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/listings/${listingId}`)}>
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative hover:opacity-80 transition">
                  {relatedListing?.images[0] ? (
                    <img src={relatedListing.images[0]} alt="Produit" className="w-full h-full object-cover" />
                  ) : <MessageCircle className="w-5 h-5 text-gray-400 absolute inset-0 m-auto" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 hover:text-indigo-600 transition">{relatedListing?.title || 'Annonce supprimée'}</h3>
                  <p className="text-xs text-gray-500">
                    Cliquez pour voir l&apos;annonce
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {activeMessages.map(msg => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                    isMe ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.content}
                    <div className={`text-[10px] mt-1.5 text-right w-full block ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                type="text"
                className="flex-grow border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Rédigez votre message..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!replyText.trim()}
                className="bg-indigo-600 text-white p-3 px-4 sm:px-6 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                <span className="hidden sm:inline">Envoyer</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
