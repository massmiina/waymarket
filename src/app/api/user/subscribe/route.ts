import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json();
    
    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing User ID or Email' }, { status: 400 });
    }

    // Upsert Pro status: Create user if missing, then toggle Pro
    const user = await db.user.upsert({
      where: { id: userId },
      update: {
        isPro: true,
        email: email.toLowerCase().trim(),
        name: name || email.split('@')[0]
      },
      create: {
        id: userId,
        email: email.toLowerCase().trim(),
        name: name || email.split('@')[0],
        isPro: true,
        role: 'USER'
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error in subscription upsert:', error);
    return NextResponse.json({ 
      error: 'Activation failed', 
      details: error.message || error.toString() 
    }, { status: 500 });
  }
}
