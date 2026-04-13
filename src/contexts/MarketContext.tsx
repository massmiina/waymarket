'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

export type Category = 
  | 'Véhicules' 
  | 'Mobilier' 
  | 'Électronique' 
  | 'Jouets' 
  | 'Vêtements' 
  | 'Immobilier' 
  | 'Équipements auto'
  | 'Autres';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  memberSince: string;
}

export interface ListingBase {
  id: string;
  sellerId: string;
  category: Category;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  createdAt: string;
}

export interface VehicleListing extends ListingBase {
  category: 'Véhicules';
  details: {
    brand: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    gearbox: string;
    power?: number;
    doors?: number;
    seats?: number;
    critair?: string;
    firstHand?: boolean;
    maintenanceHistory?: boolean;
    technicalInspection?: string;
    accidentHistory?: boolean;
  };
}

export interface FurnitureListing extends ListingBase {
  category: 'Mobilier';
  details: {
    type: string;
    material: string;
    dimensions: string;
    condition: string;
  };
}

export interface ElectronicsListing extends ListingBase {
  category: 'Électronique';
  details: {
    brand: string;
    model: string;
    condition: string;
    accessories: string;
  };
}

export interface RealEstateListing extends ListingBase {
  category: 'Immobilier';
  details: {
    type: string;
    rooms: number;
    surfaceArea: number; // in sqm
    energyClass: string;
  };
}

export interface OtherListing extends ListingBase {
  category: 'Jouets' | 'Vêtements' | 'Autres' | 'Équipements auto';
  details?: {
    condition?: string;
    brand?: string;
    size?: string;
    equipmentType?: string;
  };
}

export type Listing = VehicleListing | FurnitureListing | ElectronicsListing | RealEstateListing | OtherListing;

export interface Message {
  id: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listing: {
    title: string;
    price: number;
    images: string[];
  };
  otherUser: {
    name: string;
    avatarUrl: string | null;
  };
  otherUserId: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

interface MarketContextType {
  currentUser: User | null;
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'sellerId' | 'createdAt'>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  favorites: string[]; 
  toggleFavorite: (listingId: string) => Promise<void>;
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (listingId: string, receiverId: string, content: string) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  fetchMessagesForConversation: (conversationId: string) => Promise<Message[]>;
  metadata: { total: number; page: number; limit: number; hasMore: boolean };
  fetchMoreListings: () => Promise<void>;
  isLoading: boolean;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Sync Clerk User with DB and fetch user-specific data
  useEffect(() => {
    async function syncAndFetchUser() {
      if (!isUserLoaded || !clerkUser) {
        setCurrentUser(null);
        setFavorites([]);
        return;
      }

      try {
        const syncRes = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName,
            avatarUrl: clerkUser.imageUrl,
          })
        });

        if (syncRes.ok) {
          const syncedUser = await syncRes.json();
          setCurrentUser(syncedUser);
          
          // Fetch user-specific data
          const [favRes, convsRes] = await Promise.all([
            fetch(`/api/favorites?userId=${syncedUser.id}`),
            fetch(`/api/conversations?userId=${syncedUser.id}`)
          ]);

          if (favRes.ok) setFavorites(await favRes.json());
          if (convsRes.ok) setConversations(await convsRes.json());
        }
      } catch (err) {
        console.error("Sync error:", err);
      }
    }

    syncAndFetchUser();
  }, [clerkUser, isUserLoaded]);

  // Listings state with metadata
  const [listings, setListings] = useState<Listing[]>([]);
  const [metadata, setMetadata] = useState<{ total: number; page: number; limit: number; hasMore: boolean }>({
    total: 0,
    page: 1,
    limit: 12,
    hasMore: false
  });

  // Global Data Fetch
  useEffect(() => {
    async function loadGlobalData() {
      try {
        const [listingsRes, msgsRes] = await Promise.all([
          fetch('/api/listings?page=1&limit=12'),
          fetch('/api/messages')
        ]);
        
        if (listingsRes.ok) {
          const data = await listingsRes.json();
          setListings(data.listings);
          setMetadata(data.metadata);
        }
        if (msgsRes.ok) {
          setMessages(await msgsRes.json());
        }
      } catch (err) {
        console.error("Global Data Load error:", err);
      } finally {
        setIsDataLoading(false);
      }
    }
    
    loadGlobalData();
  }, []);

  const fetchConversations = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/conversations?userId=${currentUser.id}`);
      if (res.ok) {
        setConversations(await res.json());
      }
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  };

  const fetchMessagesForConversation = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (err) {
      console.error("Fetch conversation messages error:", err);
      return [];
    }
  };

  const fetchMoreListings = async () => {
    if (!metadata.hasMore || isDataLoading) return;
    
    const nextPage = metadata.page + 1;
    try {
      const res = await fetch(`/api/listings?page=${nextPage}&limit=${metadata.limit}`);
      if (res.ok) {
        const data = await res.json();
        setListings(prev => [...prev, ...data.listings]);
        setMetadata(data.metadata);
      }
    } catch (err) {
      console.error("Fetch more error:", err);
    }
  };

  const addListing = async (listingData: Omit<Listing, 'id' | 'sellerId' | 'createdAt'>) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...listingData, sellerId: currentUser.id })
      });
      
      if (res.ok) {
        const newListing = await res.json();
        setListings(prev => [newListing, ...prev]);
      }
    } catch (error) {
      console.error("Add listing error:", error);
    }
  };

  const deleteListing = async (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));

    try {
      await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const toggleFavorite = async (listingId: string) => {
    if (!currentUser) return;
    
    const newFavorites = favorites.includes(listingId)
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId];
    
    setFavorites(newFavorites);

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, listingId })
      });
      
      if (res.ok) {
        setFavorites(await res.json());
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };

  const sendMessage = async (listingId: string, receiverId: string, content: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, senderId: currentUser.id, receiverId, content })
      });
      
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
        // Refresh conversations list to show new message / new conversation
        await fetchConversations();
      }
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!currentUser) return;
    
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));

    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, userId: currentUser.id })
      });
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  return (
    <MarketContext.Provider value={{
      currentUser,
      listings,
      addListing,
      deleteListing,
      favorites,
      toggleFavorite,
      messages,
      conversations,
      sendMessage,
      markMessagesAsRead,
      fetchMessagesForConversation,
      metadata,
      fetchMoreListings,
      isLoading: !isUserLoaded || !isAuthLoaded || isDataLoading
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
