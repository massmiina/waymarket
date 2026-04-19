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
    const [totalUsers, totalListings, totalMessages, proUsers, revRecords] = await Promise.all([
      db.user.count(),
      db.listing.count({ where: { status: 'ACTIVE' } }),
      db.message.count(),
      db.user.count({ where: { isPro: true } }),
      db.subscriptionRecord.findMany()
    ]);

    // Financial Calculation
    const totalRevenue = revRecords.reduce((acc, curr) => acc + curr.amount, 0);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyRevenue = revRecords
      .filter(r => r.createdAt >= thirtyDaysAgo)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0;

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

      const [userCount, listingCount, dayRevenue] = await Promise.all([
        db.user.count({
          where: { memberSince: { lt: nextDay } } // Total users up to that point
        }),
        db.listing.count({
          where: { createdAt: { lt: nextDay }, status: 'ACTIVE' } // Total active listings up to that point
        }),
        db.subscriptionRecord.findMany({
          where: { createdAt: { gte: date, lt: nextDay } }
        })
      ]);

      chartData.push({
        name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        users: userCount,
        listings: listingCount,
        revenue: dayRevenue.reduce((acc, curr) => acc + curr.amount, 0)
      });
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        totalListings,
        totalMessages,
        proUsers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        conversionRate: Math.round(conversionRate * 10) / 10
      },
      activity: activity.slice(0, 10),
      chartData,
      pendingListings: await db.listing.findMany({
        where: { status: { in: ['PENDING_REVIEW', 'SUSPICIOUS'] } }, // Include both
        orderBy: { createdAt: 'desc' },
        include: { seller: { select: { name: true, avatarUrl: true } } }
      }).then(list => list.map(l => {
        let images = [];
        let details = {};
        try { images = JSON.parse(l.images); } catch(e) { console.error('JSON Parse Error (Images):', l.id); }
        try { details = JSON.parse(l.details || '{}'); } catch(e) { console.error('JSON Parse Error (Details):', l.id); }
        return { ...l, images, details };
      }))
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
