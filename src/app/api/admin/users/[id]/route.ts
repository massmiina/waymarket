import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { logAdminAction } from '@/lib/admin';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await currentUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({ where: { id: auth.id } });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const { role, isPro, isBanned } = await request.json();

    const oldUser = await db.user.findUnique({ where: { id } });
    if (!oldUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        role: role !== undefined ? role : oldUser.role,
        isPro: isPro !== undefined ? isPro : oldUser.isPro,
        isBanned: isBanned !== undefined ? isBanned : oldUser.isBanned,
      }
    });

    // Audit Logging
    await logAdminAction(auth.id, 'USER_UPDATE', { 
      targetUserId: id,
      targetUserName: oldUser.name,
      changes: { role, isPro, isBanned }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await currentUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({ where: { id: auth.id } });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const userToDelete = await db.user.findUnique({ where: { id } });

    if (!userToDelete) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await db.user.delete({ where: { id } });

    // Audit Logging
    await logAdminAction(auth.id, 'USER_DELETE', { 
      targetUserId: id,
      targetUserName: userToDelete.name 
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin user delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
