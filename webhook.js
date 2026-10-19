// POST /api/webhook — appelé par Stripe après paiement : génère le code et envoie les 3 e-mails.
import Stripe from 'stripe';
import { Resend } from 'resend';
import { fromMetadata, generateCode, expiryFrom, emailGift, emailBuyer, emailShop } from './_lib.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const raw = await request.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, request.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return new Response('Signature invalide', { status: 400 });
  }

  const handled = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
  if (!handled.includes(event.type)) return new Response('ignoré', { status: 200 });

  const session = event.data.object;
  if (session.metadata?.gift !== '1' || session.payment_status !== 'paid') return new Response('ignoré', { status: 200 });

  try {
    await fulfill(session, event.livemode);
    return new Response('ok', { status: 200 });
  } catch (e) {
    console.error('webhook', e?.message);
    return new Response('erreur', { status: 500 }); // Stripe réessaiera ; les envois sont idempotents
  }
}

async function fulfill(session, livemode) {
  const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  let pi = await stripe.paymentIntents.retrieve(piId);

  // 1. Code unique, enregistré une seule fois sur le paiement (sert de base de données)
  if (!pi.metadata.gift_code) {
    const g0 = fromMetadata(pi.metadata);
    pi = await stripe.paymentIntents.update(piId, {
      metadata: {
        gift_code: generateCode(),
        gift_expires: expiryFrom(new Date(session.created * 1000)),
        gift_status: 'active',
        gift_balance_cents: g0.kind === 'amount' ? String(g0.euros * 100) : '',
      },
    });
  }
  const g = fromMetadata(pi.metadata);
  const buyerEmail = session.customer_details?.email;
  const buyerName = session.customer_details?.name || '';
  const from = process.env.MAIL_FROM;          // ex. "L'Institut d'Orfeuil <cadeaux@institut-orfeuil.fr>"
  const shopEmail = process.env.SHOP_EMAIL;    // boîte de la gérante
  const send = async (key, payload) => {
    const { error } = await resend.emails.send({ from, replyTo: shopEmail, ...payload }, { idempotencyKey: `${piId}-${key}` });
    if (error) throw new Error(`${key}: ${error.message}`);
  };

  // 2. Bénéficiaire (si envoi direct)
  const direct = g.delivery === 'recipient' && g.toEmail;
  if (direct) await send('recipient', { to: g.toEmail, ...emailGift(g) });

  // 3. Acheteur (copie ou carte à offrir lui-même)
  if (buyerEmail) await send('buyer', { to: buyerEmail, ...emailBuyer(g, { buyerName, sentTo: direct ? g.toEmail : null }) });

  // 4. Gérante
  if (shopEmail) await send('shop', { to: shopEmail, replyTo: buyerEmail || shopEmail, ...emailShop(g, { buyerEmail, buyerName, paymentId: piId, livemode }) });
}
