import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { id, email, name, avatarUrl, role } = await request.json();
    
    if (!id || !email) {
      return NextResponse.json({ error: 'Missing ID or Email' }, { status: 400 });
    }

    const ADMIN_EMAILS = ['yasmina.dzhv@gmail.com', 'dzhamayevtimur@gmail.com'];
    const finalRole = (ADMIN_EMAILS.includes(email.toLowerCase()) || role === 'ADMIN') ? 'ADMIN' : 'USER';

    const user = await db.user.upsert({
      where: { id },
      update: {
        email,
        name: name || email.split('@')[0],
        avatarUrl,
        role: finalRole,
      } as any,
      create: {
        id,
        email,
        name: name || email.split('@')[0],
        avatarUrl,
        role: finalRole,
      } as any
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
