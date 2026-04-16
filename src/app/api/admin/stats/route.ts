import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await currentUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Security check: Only admins can see global stats
    const user = await db.user.findUnique({
      where: { id: auth.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Fetch Key Stats
    const [totalUsers, totalListings, totalMessages, proUsers] = await Promise.all([
      db.user.count(),
      db.listing.count(),
      db.message.count(),
      db.user.count({ where: { isPro: true } })
    ]);

    // 2. Fetch Recent Activity (last 6 of each)
    const [recentListings, recentUsers] = await Promise.all([
      db.listing.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { seller: { select: { name: true, avatarUrl: true } } }
      }),
      db.user.findMany({
        take: 6,
        orderBy: { memberSince: 'desc' },
        select: { id: true, name: true, avatarUrl: true, memberSince: true }
      })
    ]);

    // Format activity list
    const activity = [
      ...recentListings.map(l => ({
        id: l.id,
        type: 'LISTING',
        title: l.title,
        user: l.seller.name,
        avatar: l.seller.avatarUrl,
        date: l.createdAt
      })),
      ...recentUsers.map(u => ({
        id: u.id,
        type: 'USER',
        title: 'Nouveau membre',
        user: u.name,
        avatar: u.avatarUrl,
        date: u.memberSince
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 3. Generate Chart Data (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const [userCount, listingCount] = await Promise.all([
        db.user.count({
          where: { memberSince: { gte: date, lt: nextDay } }
        }),
        db.listing.count({
          where: { createdAt: { gte: date, lt: nextDay } }
        })
      ]);

      chartData.push({
        name: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        users: userCount,
        listings: listingCount
      });
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        totalListings,
        totalMessages,
        proUsers
      },
      activity: activity.slice(0, 10),
      chartData,
      pendingListings: await db.listing.findMany({
        where: { status: 'PENDING_REVIEW' },
        orderBy: { createdAt: 'desc' },
        include: { seller: { select: { name: true, avatarUrl: true } } }
      }).then(list => list.map(l => ({
        ...l,
        images: JSON.parse(l.images),
        details: JSON.parse(l.details || '{}')
      })))
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
