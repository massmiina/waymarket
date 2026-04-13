import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  if (conversationId) {
    const messages = await db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { name: true, avatarUrl: true } }
      }
    });
    return NextResponse.json(messages);
  }

  // Backwards compatibility or global fetch (less used now)
  const messages = await db.message.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.listingId || !data.senderId || !data.receiverId || !data.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get or Create Conversation
    // In a listing context, the buyer is the person interested. 
    // We need to determine who is the buyer and who is the seller based on the listing owner.
    const listing = await db.listing.findUnique({
      where: { id: data.listingId },
      select: { sellerId: true }
    });

    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    const buyerId = data.senderId === listing.sellerId ? data.receiverId : data.senderId;
    const sellerId = listing.sellerId;

    let conversation = await db.conversation.findUnique({
      where: {
        listingId_buyerId_sellerId: {
          listingId: data.listingId,
          buyerId,
          sellerId
        }
      }
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          listingId: data.listingId,
          buyerId,
          sellerId
        }
      });
    }

    // 2. Create the Message
    const created = await db.message.create({
      data: {
        content: data.content,
        conversationId: conversation.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        listingId: data.listingId,
        status: 'UNREAD'
      }
    });

    // 3. Update the conversation updatedAt timestamp
    await db.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Message POST Error:', error);
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { conversationId, userId } = await request.json();

    if (!conversationId || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.message.updateMany({
      where: { 
        conversationId, 
        receiverId: userId,
        status: 'UNREAD' 
      },
      data: { status: 'READ' }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
