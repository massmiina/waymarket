'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { Send, ChevronLeft, MapPin, MoreVertical, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { 
    currentUser, 
    conversations, 
    fetchMessagesForConversation, 
    sendMessage, 
    markMessagesAsRead,
    isLoading 
  } = useMarket();
  const router = useRouter();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === resolvedParams.id);

  // Initial Load & Polling
  useEffect(() => {
    if (!currentUser) return;

    const loadMessages = async () => {
      const msgs = await fetchMessagesForConversation(resolvedParams.id);
      setMessages(msgs);
      // Mark as read when opening
      markMessagesAsRead(resolvedParams.id);
    };

    loadMessages();

    // Polling every 5 seconds for new messages
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [resolvedParams.id, currentUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation || !currentUser || isSending) return;

    const text = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      // Use the helper from context
      await sendMessage(
        conversation.listingId, // We'll add this to the API
        conversation.otherUserId,
        text
      );
      
      // Refresh messages
      const msgs = await fetchMessagesForConversation(resolvedParams.id);
      setMessages(msgs);
    } catch (err) {
      console.error("Send error:", err);
      setInputText(text);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-grow flex flex-col max-w-5xl mx-auto w-full bg-white shadow-xl overflow-hidden sm:my-4 sm:rounded-3xl border border-gray-100">
        
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/messages')} className="p-2 hover:bg-gray-50 rounded-full transition sm:hidden">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
              <img 
                src={conversation.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${conversation.otherUser.name}`} 
                alt={conversation.otherUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{conversation.otherUser.name}</h2>
              <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                En ligne
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
               <ShieldCheck className="w-4 h-4 text-indigo-600" />
               <span className="text-xs font-bold text-indigo-700">Paiement sécurisé</span>
             </div>
             <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
               <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Listing Context Bar */}
        <Link href={`/listings/${conversation.id}`} className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition shrink-0">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden border border-gray-100">
            <img src={conversation.listing.images[0]} alt={conversation.listing.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="text-sm font-bold text-gray-900 truncate">{conversation.listing.title}</h4>
            <p className="text-sm font-extrabold text-indigo-600">{conversation.listing.price} €</p>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180" />
        </Link>

        {/* Messages Space */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#f8f9fc]">
          <div className="text-center py-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100">
              Début de la discussion
            </span>
          </div>

          {messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className={`text-[9px] mt-1 font-medium ${isMe ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-grow bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:scale-95 shadow-lg shadow-indigo-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
            Restez sur Way Market pour garantir la sécurité de vos transactions.
          </p>
        </div>

      </main>
    </div>
  );
}
