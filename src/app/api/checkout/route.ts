import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

// NOTE: You must add this PRICE_ID from your Stripe Dashboard
// Dashboard -> Products -> Create Product -> Copy "api id" of the price
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_placeholder';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    // Server-side check for 1000 users limit
    const userCount = await db.user.count();
    if (userCount < 1000) {
      return NextResponse.json({ 
        error: 'Le mode Pro est actuellement gratuit pour les 1000 premiers membres. Veuillez utiliser l\'activation gratuite.' 
      }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
    }

    const origin = request.headers.get('origin');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/compte?success=true`,
      cancel_url: `${origin}/pro?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
