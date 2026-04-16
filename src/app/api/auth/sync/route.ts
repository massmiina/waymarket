import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body || !body.id || !body.email) {
      return NextResponse.json({ error: 'Missing ID or Email' }, { status: 400 });
    }

    const { id, email, name, avatarUrl, role } = body;
    const ADMIN_EMAILS = ['yasmina.dzhv@gmail.com', 'dzhamayevtimur@gmail.com'];
    const finalRole = (ADMIN_EMAILS.includes(email.toLowerCase().trim()) || role === 'ADMIN') ? 'ADMIN' : 'USER';

    const user = await db.user.upsert({
      where: { id: String(id) },
      update: {
        email: String(email).toLowerCase().trim(),
        name: String(name || email.split('@')[0]),
        avatarUrl: avatarUrl ? String(avatarUrl) : null,
        role: finalRole,
      },
      create: {
        id: String(id),
        email: String(email).toLowerCase().trim(),
        name: String(name || email.split('@')[0]),
        avatarUrl: avatarUrl ? String(avatarUrl) : null,
        role: finalRole,
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
