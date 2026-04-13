import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const listing = await db.listing.findUnique({ 
      where: { id: params.id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            isPro: true,
            avatarUrl: true
          } as any
        }
      }
    });
    
    if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      ...listing,
      images: JSON.parse(listing.images),
      details: listing.details ? JSON.parse(listing.details) : undefined,
      createdAt: listing.createdAt.toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { userId: authUserId } = getAuth(request as any);
  const params = await context.params;

  if (!authUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user is admin or owner
    const [listing, user] = await Promise.all([
      db.listing.findUnique({ where: { id: params.id } }),
      db.user.findUnique({ where: { id: authUserId } })
    ]);

    if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isAdmin = (user as any)?.role === 'ADMIN';
    const isOwner = listing.sellerId === authUserId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.listing.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch(e) {
    console.error(e);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
