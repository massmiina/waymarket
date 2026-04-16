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
        name: String(name || email.split('@')[0]).substring(0, 100), // Safety limit
        avatarUrl: avatarUrl ? String(avatarUrl) : null,
        role: finalRole,
      },
      create: {
        id: String(id),
        email: String(email).toLowerCase().trim(),
        name: String(name || email.split('@')[0]).substring(0, 100), // Safety limit
        avatarUrl: avatarUrl ? String(avatarUrl) : null,
        role: finalRole,
      }
    });

    console.log('✅ User sync successful for:', user.id);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error('❌ CRITICAL SYNC ERROR:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Sync failed', 
      details: error.message || 'Unknown database error',
      code: error.code 
    }, { status: 500 });
  }
}
