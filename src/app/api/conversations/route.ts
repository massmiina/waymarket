import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        listing: {
          select: {
            title: true,
            price: true,
            images: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        buyer: { select: { name: true, avatarUrl: true, isPro: true } },
        seller: { select: { name: true, avatarUrl: true, isPro: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const formatted = conversations.map(conv => {
      const otherUser = conv.buyerId === userId ? conv.seller : conv.buyer;
      const lastMessage = conv.messages[0];
      
      return {
        id: conv.id,
        listingId: conv.listingId,
        listing: {
          ...conv.listing,
          images: JSON.parse(conv.listing.images)
        },
        otherUser,
        otherUserId: conv.buyerId === userId ? conv.sellerId : conv.buyerId,
        lastMessage,
        updatedAt: conv.updatedAt,
        unreadCount: conv.messages.filter(m => m.receiverId === userId && m.status === 'UNREAD').length
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Conversations GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
