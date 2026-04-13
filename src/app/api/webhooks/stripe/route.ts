import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const userId = session.client_reference_id || session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Missing UserId in session metadata' }, { status: 400 });
    }

    // Upgrade the user to Pro status
    await db.user.update({
      where: { id: userId },
      data: { isPro: true } as any // Cast for type sync
    });

    console.log(`User ${userId} upgraded to PRO via Stripe.`);
  }

  return NextResponse.json({ received: true });
}
