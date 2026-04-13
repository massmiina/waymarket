import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const messages = await db.message.findMany();
  return NextResponse.json(messages.map(m => ({
    ...m,
    timestamp: m.createdAt.toISOString(),
    read: m.status === 'READ'
  })));
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.listingId || !data.senderId || !data.receiverId || !data.content) {
      return NextResponse.json({ error: 'Missing required fields for message' }, { status: 400 });
    }

    const created = await db.message.create({
      data: {
        listingId: data.listingId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        status: 'UNREAD'
      }
    });

    return NextResponse.json({
        ...created,
        timestamp: created.createdAt.toISOString(),
        read: false
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { listingId, senderId, receiverId } = await request.json();

    if (!listingId || !senderId || !receiverId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.message.updateMany({
      where: { listingId, senderId, receiverId },
      data: { status: 'READ' }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
