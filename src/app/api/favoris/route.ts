import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const favorites = await db.favorite.findMany({ where: { userId } });
  return NextResponse.json(favorites.map(f => f.listingId));
}

export async function POST(request: Request) {
  try {
    const { userId, listingId } = await request.json();

    if (!userId || !listingId) {
      return NextResponse.json({ error: 'Missing userId or listingId' }, { status: 400 });
    }

    const existing = await db.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } }
    });

    if (existing) {
      await db.favorite.delete({ where: { id: existing.id } });
    } else {
      await db.favorite.create({ data: { userId, listingId } });
    }

    const updatedFavorites = await db.favorite.findMany({ where: { userId } });
    return NextResponse.json(updatedFavorites.map(f => f.listingId));
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
