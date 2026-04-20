import { NextResponse } from 'next/server';
import { syncCarData } from '@/lib/cars/sync';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const auth = await currentUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({ where: { id: auth.id } });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      // Also allow if a secret token is provided (for Cron)
      const { searchParams } = new URL(request.url);
      const token = searchParams.get('token');
      if (token !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Start sync (it might take time, but Vercel limits are 30s-300s)
    await syncCarData();

    return NextResponse.json({ success: true, message: 'Sync complete' });

  } catch (error) {
    console.error('Car sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
