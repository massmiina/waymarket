import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const makes = await db.carMake.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(makes);

  } catch (error) {
    console.error('Fetch makes error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
