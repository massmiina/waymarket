import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation Schema for creating a listing
const listingSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  price: z.number().positive("Le prix doit être positif"),
  category: z.string(),
  location: z.string(),
  sellerId: z.string(),
  images: z.array(z.string()).default([]),
  details: z.object({}).passthrough().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extraction des filtres
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const status = searchParams.get('status') || 'ACTIVE';

    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Construction de la requête Prisma
    const where: any = {
      status: status === 'ALL' ? undefined : status,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (category && category !== 'Toutes') {
      where.category = category;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Exécution de la requête avec pagination et comptage
    const [records, total] = await Promise.all([
      db.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              isPro: true,
              avatarUrl: true
            } as any
          }
        }
      }),
      db.listing.count({ where })
    ]);
    
    const listings = records.map(l => ({
      ...l,
      images: JSON.parse(l.images),
      details: l.details ? JSON.parse(l.details) : undefined,
      createdAt: l.createdAt.toISOString()
    }));

    return NextResponse.json({
      listings,
      metadata: {
        total,
        page,
        limit,
        hasMore: total > skip + listings.length
      }
    });
  } catch (error: any) {
    console.error('Listings GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    console.log('--- POST LISTING ATTEMPT ---');
    console.log('Received Data:', JSON.stringify(rawData, null, 2));
    
    // Validation avec Zod
    const validated = listingSchema.safeParse(rawData);
    
    if (!validated.success) {
      console.warn('Validation failed:', validated.error.format());
      return NextResponse.json({ 
        error: 'Données invalides. Veuillez vérifier tous les champs.', 
        details: validated.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { data } = validated;

    // --- SECURITY CHECK: Photo limits based on Pro status ---
    console.log('Checking user existence for ID:', data.sellerId);
    const user = await db.user.findUnique({ where: { id: data.sellerId } });
    
    if (!user) {
      console.error('CRITICAL: User not found in DB even though they are logged in via Clerk.');
      return NextResponse.json({ 
        error: 'Utilisateur non reconnu dans la base de données. Essayez de vous reconnecter.',
        syncNeeded: true 
      }, { status: 404 });
    }

    console.log('User found. Pro Status:', (user as any).isPro);

    const photoLimit = (user as any).isPro ? 10 : 3;
    if (data.images.length > photoLimit) {
      console.warn(`Photo limit exceeded: ${data.images.length} > ${photoLimit}`);
      return NextResponse.json({ 
        error: `Limite de photos dépassée. Les membres ${(user as any).isPro ? 'Pro' : 'Classiques'} sont limités à ${photoLimit} photos.` 
      }, { status: 403 });
    }
    // -------------------------------------------------------

    console.log('Creating listing in database...');
    const created = await db.listing.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        location: data.location,
        images: JSON.stringify(data.images),
        details: data.details ? JSON.stringify(data.details) : null,
        sellerId: data.sellerId,
        status: 'ACTIVE'
      } as any
    });

    console.log('Listing created successfully with ID:', created.id);

    return NextResponse.json({
      ...created,
      images: JSON.parse(created.images),
      details: created.details ? JSON.parse(created.details) : undefined,
      createdAt: created.createdAt.toISOString()
    }, { status: 201 });
  } catch (error: any) {
    console.error('Listings POST Error:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur lors de la publication.',
      details: error.message 
    }, { status: 500 });
  }
}
