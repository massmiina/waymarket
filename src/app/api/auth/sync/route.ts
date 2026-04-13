import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { id, email, name, avatarUrl } = await request.json();
    
    if (!id || !email) {
      return NextResponse.json({ error: 'Missing ID or Email' }, { status: 400 });
    }

    const user = await db.user.upsert({
      where: { id },
      update: {
        email,
        name: name || email.split('@')[0],
        avatarUrl,
      },
      create: {
        id,
        email,
        name: name || email.split('@')[0],
        avatarUrl,
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
