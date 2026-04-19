'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  ChevronLeft, 
  MapPin, 
  MoreVertical, 
  Shield,
  CheckCircle,
  Package,
  ExternalLink,
  Clock,
  Info,
  MessageCircle
} from 'lucide-react';
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
      markMessagesAsRead(resolvedParams.id);
    };

    loadMessages();
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
      await sendMessage(
        conversation.listingId,
        conversation.otherUserId,
        text
      );
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
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden font-sans">
      <main className="flex-grow flex flex-col max-w-5xl mx-auto w-full bg-white shadow-2xl shadow-emerald-900/5 overflow-hidden sm:my-6 sm:rounded-[40px] border border-white">
        
        {/* CHAT HEADER: User Info */}
        <div className="px-6 py-4 border-b border-slate-50 bg-white flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/messages')} className="p-2 hover:bg-slate-50 rounded-2xl transition sm:hidden">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-emerald border-2 border-white shadow-lg ring-1 ring-slate-100">
                <img 
                  src={conversation.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${conversation.otherUser.name}&background=059669&color=ffffff`} 
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-forest-green leading-tight tracking-tight font-[family-name:var(--font-playfair)] italic">{conversation.otherUser.name}</h2>
                {conversation.otherUser.isPro && (
                  <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald/10 text-emerald text-[7px] font-black rounded-full uppercase tracking-widest">
                    <Shield className="w-2.5 h-2.5 text-emerald" />
                    Pro
                  </span>
                )}
              </div>
              <p className="text-[9px] font-black text-forest-green/40 uppercase tracking-widest">Actif maintenant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 bg-emerald/5 px-4 py-2 rounded-2xl border border-emerald/10">
               <Shield className="w-4 h-4 text-emerald" />
               <span className="text-[10px] font-black text-emerald uppercase tracking-widest">Transaction sécurisée</span>
             </div>
             <button className="p-3 hover:bg-slate-50 rounded-2xl text-forest-green/20 transition-all">
               <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* PRODUCT CONTEXT BAR (Glassmorphism Sticky) */}
        <div className="relative z-10 shrink-0">
          <Link 
            href={`/listings/${conversation.listingId}`} 
            className="group flex items-center gap-4 px-6 py-3 bg-white/60 backdrop-blur-xl border-b border-slate-50 hover:bg-white transition-all duration-300"
          >
            <div className="relative w-14 h-14 bg-slate-200 rounded-2xl overflow-hidden shadow-md border-2 border-white group-hover:scale-105 transition-transform">
              <img src={conversation.listing.images[0]} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 text-emerald/40" />
                <h4 className="text-xs font-black text-forest-green tracking-tight truncate uppercase font-[family-name:var(--font-outfit)]">EN VENTE : {conversation.listing.title}</h4>
              </div>
              <p className="text-lg font-black text-emerald tracking-tighter">{conversation.listing.price.toLocaleString('fr-FR')} €</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald transition-all hover:bg-emerald hover:text-white">
              L&apos;annonce <ExternalLink className="h-3 w-3" />
            </div>
          </Link>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#FBFDFF] scrollbar-hide">
          <div className="flex flex-col items-center py-8">
            <div className="p-4 bg-emerald/5 rounded-[32px] mb-4">
              <MessageCircle className="h-8 w-8 text-emerald/20" />
            </div>
            <span className="text-[10px] font-black text-forest-green/20 uppercase tracking-[0.2em]">C&apos;est le début de votre histoire</span>
          </div>

          {messages.map((msg, idx) => {
            const isMe = currentUser && msg.senderId === currentUser.id;
            return (
              <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`group relative max-w-[80%] md:max-w-[70%] space-y-1`}>
                  <div className={`px-5 py-3 rounded-3xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                    isMe 
                      ? 'bg-gradient-to-tr from-forest-green to-emerald text-white rounded-tr-none shadow-neon/10' 
                      : 'bg-white text-forest-green border-2 border-slate-50 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-2 text-[9px] font-black uppercase tracking-widest ${isMe ? 'justify-end text-forest-green/20' : 'text-forest-green/20'}`}>
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <CheckCircle className="h-2.5 w-2.5 text-emerald" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-6 bg-white border-t border-slate-50 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-[28px] pl-6 pr-14 py-4 text-sm font-bold text-forest-green placeholder:text-slate-300 focus:outline-none focus:border-emerald focus:bg-white transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <div className="p-1.5 bg-slate-100 rounded-full text-slate-300">
                  <Info className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="bg-emerald text-white p-4 rounded-full hover:bg-emerald-hover hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-emerald/20"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-black text-forest-green/20 uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 bg-emerald rounded-full"></div>
            Way Market : Votre sécurité est notre priorité
          </div>
        </div>

      </main>
    </div>
  );
}
