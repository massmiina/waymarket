import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
    }

    // Toggle Pro status for this mock implementation
    const user = await db.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isPro: true } as any
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Error toggling Pro status:', error);
    return NextResponse.json({ 
      error: 'Subscription failed', 
      details: error.message || error.toString() 
    }, { status: 500 });
  }
}
