// POST /api/checkout — crée la page de paiement Stripe pour une carte cadeau.
import Stripe from 'stripe';
import { validateOrder, toMetadata, json } from './_lib.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Requête invalide.' }, 400); }

  const { order, error } = validateOrder(body);
  if (error) return json({ error }, 400);

  const site = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
  const metadata = toMetadata(order);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      submit_type: 'pay',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: order.euros * 100,
          product_data: {
            name: order.kind === 'soin' ? `Carte cadeau — ${order.label}` : `Carte cadeau — ${order.euros} €`,
            description: `Pour ${order.toName}, de la part de ${order.fromName}. À utiliser à L'Institut d'Orfeuil, Châlons-en-Champagne.`,
          },
        },
      }],
      metadata,
      payment_intent_data: { metadata, description: `Carte cadeau ${order.euros} € pour ${order.toName}` },
      success_url: `${site}/?cadeau=merci#cadeau`,
      cancel_url: `${site}/?cadeau=annule#cadeau`,
    });
    return json({ url: session.url });
  } catch (e) {
    console.error('checkout', e?.message);
    return json({ error: 'Le paiement est momentanément indisponible. Réessayez ou appelez le 09 75 40 79 83.' }, 502);
  }
}
