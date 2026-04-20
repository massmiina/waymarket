import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const makeId = searchParams.get('makeId');

    if (!makeId) {
      return NextResponse.json({ error: 'makeId is required' }, { status: 400 });
    }

    const models = await db.carModel.findMany({
      where: { makeId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(models);

  } catch (error) {
    console.error('Fetch models error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
