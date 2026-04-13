import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is missing. Checkout will not work properly.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27' as any,
  typescript: true,
});
