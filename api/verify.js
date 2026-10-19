// POST /api/verify — réservé à l'institut (code PIN) : consulter et débiter une carte cadeau.
import Stripe from 'stripe';
import { timingSafeEqual } from 'node:crypto';
import { fromMetadata, CODE_RE, json } from './_lib.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const pinOk = (pin) => {
  const a = Buffer.from(String(pin || '')), b = Buffer.from(String(process.env.ADMIN_PIN || ''));
  return b.length >= 6 && a.length === b.length && timingSafeEqual(a, b);
};

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Requête invalide.' }, 400); }
  if (!pinOk(body.pin)) { await new Promise((r) => setTimeout(r, 800)); return json({ error: 'Code PIN incorrect.' }, 401); }

  const code = String(body.code || '').toUpperCase().replace(/\s/g, '');
  if (!CODE_RE.test(code)) return json({ error: 'Format attendu : ORF-XXXX-XXXX' }, 400);

  const found = await stripe.paymentIntents.search({ query: `metadata['gift_code']:'${code}'`, limit: 1 });
  const pi = found.data[0];
  if (!pi || pi.status !== 'succeeded') return json({ error: "Carte introuvable. Si elle vient d'être achetée, réessayez dans une minute." }, 404);

  let g = fromMetadata(pi.metadata);
  const today = new Date().toISOString().slice(0, 10);
  const expired = g.expires && g.expires < today;

  if (body.action === 'redeem') {
    if (expired) return json({ error: 'Carte expirée.', card: view(g, pi, expired) }, 409);
    if (g.status === 'used') return json({ error: 'Carte déjà utilisée.', card: view(g, pi, expired) }, 409);
    const stamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    let meta;
    if (g.kind === 'soin') {
      meta = { gift_status: 'used', gift_last_use: `${stamp} — soin réalisé` };
    } else {
      const cents = Math.round(Number(body.amount) * 100);
      if (!Number.isFinite(cents) || cents <= 0) return json({ error: 'Montant à débiter invalide.' }, 400);
      if (cents > g.balanceCents) return json({ error: `Solde insuffisant (${(g.balanceCents / 100).toFixed(2).replace('.', ',')} €).` }, 409);
      const left = g.balanceCents - cents;
      meta = { gift_balance_cents: String(left), gift_status: left === 0 ? 'used' : 'active', gift_last_use: `${stamp} — ${(cents / 100).toFixed(2).replace('.', ',')} € débités` };
    }
    const updated = await stripe.paymentIntents.update(pi.id, { metadata: meta });
    g = fromMetadata(updated.metadata);
    return json({ ok: true, card: view(g, updated, expired) });
  }
  return json({ card: view(g, pi, expired) });
}

function view(g, pi, expired) {
  return {
    code: g.code, kind: g.kind, label: g.label, duration: g.duration, euros: g.euros,
    balance: g.kind === 'amount' ? g.balanceCents / 100 : null,
    status: expired ? 'expired' : g.status, expires: g.expires, lastUse: g.lastUse || '',
    toName: g.toName, fromName: g.fromName, purchased: new Date(pi.created * 1000).toISOString().slice(0, 10),
  };
}
