import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json();
    
    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing User ID or Email' }, { status: 400 });
    }

    // 1. Update User to Pro status
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
    
    // 2. FINANCIAL LOGGING: Record the sale
    await db.subscriptionRecord.create({
      data: {
        userId: user.id,
        amount: 19.99,
        status: 'SUCCEEDED',
        plan: 'PRO_MONTHLY'
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error in subscription flow:', error);
    return NextResponse.json({ 
      error: 'Activation failed', 
      details: error.message || error.toString() 
    }, { status: 500 });
  }
}
