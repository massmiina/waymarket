import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const listing = await db.listing.findUnique({ where: { id: params.id } });
  
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    ...listing,
    images: JSON.parse(listing.images),
    details: listing.details ? JSON.parse(listing.details) : undefined,
    createdAt: listing.createdAt.toISOString()
  });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await db.listing.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
