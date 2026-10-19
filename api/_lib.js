// Logique partagée : validation, codes, e-mails. Les fichiers préfixés « _ » ne sont pas exposés comme routes par Vercel.
import { randomInt } from 'node:crypto';
import { SOINS } from './_soins.js';

export const SHOP = {
  name: "L'Institut d'Orfeuil",
  address: "2 Rue d'Orfeuil, 51000 Châlons-en-Champagne",
  phone: '09 75 40 79 83',
  phoneIntl: '+33975407983',
  booking: 'https://www.planity.com/linstitut-dorgeuil-51000-chalons-en-champagne',
};
export const RULES = { min: 20, max: 2000, validityMonths: 12 };
const THEMES = { plum: 'Aubergine', ivory: 'Ivoire', rose: 'Rose poudré' };

/* ---------- validation de la commande (ne jamais faire confiance au navigateur) ---------- */
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 120;

export function validateOrder(body) {
  const b = body && typeof body === 'object' ? body : {};
  const order = {
    kind: b.kind === 'soin' ? 'soin' : 'amount',
    toName: clean(b.toName, 28),
    fromName: clean(b.fromName, 28),
    message: clean(b.message, 140),
    theme: THEMES[b.theme] ? b.theme : 'plum',
    delivery: b.delivery === 'buyer' ? 'buyer' : 'recipient',
    toEmail: clean(b.toEmail, 120).toLowerCase(),
  };
  if (!order.toName) return { error: 'Indiquez le prénom du bénéficiaire.' };
  if (!order.fromName) return { error: 'Indiquez de la part de qui est le cadeau.' };
  if (order.delivery === 'recipient' && !isEmail(order.toEmail)) return { error: "L'adresse e-mail du bénéficiaire n'est pas valide." };
  if (order.delivery === 'buyer') order.toEmail = '';

  if (order.kind === 'soin') {
    const soin = SOINS[String(b.soinKey || '')];
    if (!soin) return { error: "Ce soin n'est pas disponible en carte cadeau." };
    Object.assign(order, { soinKey: b.soinKey, label: soin.name, duration: soin.duration, euros: soin.price });
  } else {
    const euros = Math.round(Number(b.amount));
    if (!Number.isFinite(euros) || euros < RULES.min || euros > RULES.max) return { error: `Montant entre ${RULES.min} € et ${RULES.max} €.` };
    Object.assign(order, { label: `Carte cadeau ${euros} €`, duration: '', euros });
  }
  return { order };
}

/* ---------- métadonnées Stripe (≤ 500 caractères par valeur) ---------- */
export function toMetadata(o) {
  return {
    gift: '1', gift_kind: o.kind, gift_label: o.label, gift_duration: o.duration, gift_euros: String(o.euros),
    gift_to: o.toName, gift_to_email: o.toEmail, gift_from: o.fromName, gift_message: o.message,
    gift_theme: o.theme, gift_delivery: o.delivery,
  };
}
export function fromMetadata(m = {}) {
  return {
    kind: m.gift_kind, label: m.gift_label, duration: m.gift_duration, euros: Number(m.gift_euros),
    toName: m.gift_to, toEmail: m.gift_to_email, fromName: m.gift_from, message: m.gift_message,
    theme: m.gift_theme || 'plum', delivery: m.gift_delivery, code: m.gift_code, expires: m.gift_expires,
    balanceCents: m.gift_balance_cents != null ? Number(m.gift_balance_cents) : null, status: m.gift_status,
    lastUse: m.gift_last_use,
  };
}

/* ---------- code unique ---------- */
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans 0/O/1/I
export function generateCode() {
  const part = () => Array.from({ length: 4 }, () => ALPHA[randomInt(ALPHA.length)]).join('');
  return `ORF-${part()}-${part()}`;
}
export const CODE_RE = /^ORF-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

export function expiryFrom(date = new Date()) {
  const d = new Date(date); d.setMonth(d.getMonth() + RULES.validityMonths); return d.toISOString().slice(0, 10);
}
export const frDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- e-mails ---------- */
const PAL = {
  plum: { bg: '#2E1724', bg2: '#4A2238', ink: '#F8F3ED', acc: '#D9C29A', line: 'rgba(217,194,154,.45)' },
  ivory: { bg: '#F6EFE6', bg2: '#E6D8C8', ink: '#2E1724', acc: '#A8834A', line: 'rgba(168,131,74,.45)' },
  rose: { bg: '#EBC3CE', bg2: '#C98A9C', ink: '#3B1E2E', acc: '#7A2E4C', line: 'rgba(122,46,76,.4)' },
};
const shell = (inner, preheader) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(SHOP.name)}</title></head>
<body style="margin:0;padding:0;background:#F3ECE4;font-family:Helvetica,Arial,sans-serif;color:#2E1724">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3ECE4"><tr><td align="center" style="padding:32px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td align="center" style="padding:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:26px;color:#2E1724">L'Institut d'Orfeuil<div style="font-family:Helvetica,Arial,sans-serif;font-style:normal;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#9B2C58;margin-top:6px">Châlons-en-Champagne</div></td></tr>
${inner}
<tr><td align="center" style="padding:28px 10px 0;font-size:12px;line-height:1.7;color:#7A6670">${esc(SHOP.name)} · ${esc(SHOP.address)}<br><a href="tel:${SHOP.phoneIntl}" style="color:#7A6670">${SHOP.phone}</a></td></tr>
</table></td></tr></table></body></html>`;

function giftCardBlock(g) {
  const p = PAL[g.theme] || PAL.plum;
  const value = g.kind === 'soin'
    ? `<div style="font-family:Georgia,serif;font-style:italic;font-size:30px;line-height:1.15;color:${p.ink}">${esc(g.label)}</div><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${p.ink};opacity:.75;margin-top:8px">${esc(g.duration)}</div>`
    : `<div style="font-family:Georgia,serif;font-size:64px;font-weight:normal;line-height:1;color:${p.ink}">${g.euros}&nbsp;€</div>`;
  return `<tr><td style="background:${p.bg};background-image:linear-gradient(135deg,${p.bg2},${p.bg});border-radius:18px;padding:12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${p.line};border-radius:12px"><tr><td style="padding:28px 28px 26px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:Georgia,serif;font-style:italic;font-size:24px;color:${p.acc}">L'Institut d'Orfeuil</td>
<td align="right" style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${p.ink};opacity:.75;line-height:1.6">Carte<br>cadeau</td></tr></table>
<div style="padding:34px 0 30px">${value}</div>
<div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${p.ink};opacity:.65">Pour</div>
<div style="font-family:Georgia,serif;font-style:italic;font-size:24px;color:${p.ink};margin-top:2px">${esc(g.toName)}</div>
</td></tr></table></td></tr>`;
}

function codeBlock(g) {
  return `<tr><td style="padding:22px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:14px"><tr><td style="padding:30px 30px 28px">
${g.message ? `<div style="font-family:Georgia,serif;font-style:italic;font-size:21px;line-height:1.45;color:#2E1724">« ${esc(g.message)} »</div>` : ''}
<div style="font-family:Georgia,serif;font-size:17px;color:#2E1724;margin-top:${g.message ? 12 : 0}px">— ${esc(g.fromName)}</div>
<div style="height:1px;background:#EFE5DA;margin:26px 0"></div>
<div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#7A6670">Votre code</div>
<div style="font-family:'Courier New',monospace;font-size:28px;font-weight:bold;letter-spacing:3px;color:#9B2C58;margin:6px 0 4px">${esc(g.code)}</div>
<div style="font-size:13px;color:#7A6670">Valable jusqu'au ${frDate(g.expires)} · à présenter à l'institut</div>
<div style="height:1px;background:#EFE5DA;margin:26px 0"></div>
<div style="font-size:14px;line-height:1.7;color:#4A3A42"><b style="color:#2E1724">Comment en profiter ?</b><br>Prenez rendez-vous en ligne ou par téléphone, puis communiquez ce code à l'institut le jour de votre venue.${g.kind === 'amount' ? ' Le montant peut être utilisé en une ou plusieurs fois, sur les soins comme sur les produits.' : ''}</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px"><tr>
<td style="background:#C6A46A;border-radius:999px"><a href="${SHOP.booking}" style="display:inline-block;padding:14px 26px;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:#2E1724;text-decoration:none">Prendre rendez-vous</a></td>
<td width="10"></td>
<td style="border:1px solid #D9C9BA;border-radius:999px"><a href="tel:${SHOP.phoneIntl}" style="display:inline-block;padding:13px 22px;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:#2E1724;text-decoration:none">${SHOP.phone}</a></td>
</tr></table>
</td></tr></table></td></tr>`;
}

export function emailGift(g) {
  const intro = `<tr><td style="padding:0 6px 22px;font-family:Georgia,serif;font-size:22px;line-height:1.4;color:#2E1724;text-align:center">${esc(g.toName)}, <em>${esc(g.fromName)}</em> vous offre un moment rien qu'à vous.</td></tr>`;
  return {
    subject: `${g.fromName} vous offre un cadeau — L'Institut d'Orfeuil`,
    html: shell(intro + giftCardBlock(g) + codeBlock(g), `Votre carte cadeau : ${g.kind === 'soin' ? g.label : g.euros + ' €'}`),
  };
}

export function emailBuyer(g, { buyerName, sentTo }) {
  const head = sentTo
    ? `Merci${buyerName ? ' ' + esc(buyerName) : ''} ! Votre carte cadeau a bien été envoyée à <b>${esc(sentTo)}</b>. Voici une copie pour vos archives.`
    : `Merci${buyerName ? ' ' + esc(buyerName) : ''} ! Voici votre carte cadeau, prête à être offerte : transférez cet e-mail ou imprimez-le.`;
  const intro = `<tr><td style="padding:0 6px 22px;font-size:15px;line-height:1.6;color:#2E1724;text-align:center">${head}</td></tr>`;
  return {
    subject: sentTo ? `Votre carte cadeau a été envoyée à ${g.toName}` : `Votre carte cadeau pour ${g.toName}`,
    html: shell(intro + giftCardBlock(g) + codeBlock(g), 'Confirmation de votre carte cadeau'),
  };
}

export function emailShop(g, { buyerEmail, buyerName, paymentId, livemode }) {
  const row = (k, v) => `<tr><td style="padding:9px 0;font-size:13px;color:#7A6670;width:42%;border-bottom:1px solid #EFE5DA">${k}</td><td style="padding:9px 0;font-size:14px;color:#2E1724;border-bottom:1px solid #EFE5DA"><b>${v}</b></td></tr>`;
  const url = `https://dashboard.stripe.com/${livemode ? '' : 'test/'}payments/${paymentId}`;
  const inner = `<tr><td style="background:#FFFFFF;border-radius:14px;padding:30px">
<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#4CA36B;font-weight:bold">● Paiement reçu${livemode ? '' : ' (TEST)'}</div>
<div style="font-family:Georgia,serif;font-size:28px;color:#2E1724;margin:8px 0 18px">Nouvelle carte cadeau — ${g.euros} €</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('Code', `<span style="font-family:'Courier New',monospace;color:#9B2C58;letter-spacing:2px">${esc(g.code)}</span>`)}
${row('Offre', g.kind === 'soin' ? `${esc(g.label)} (${esc(g.duration)})` : `Montant libre ${g.euros} €`)}
${row('Bénéficiaire', esc(g.toName) + (g.toEmail ? `<br><span style="font-weight:normal">${esc(g.toEmail)}</span>` : ''))}
${row('Acheteur', esc(g.fromName) + `<br><span style="font-weight:normal">${esc(buyerName || '')} ${esc(buyerEmail || '')}</span>`)}
${row('Envoi', g.delivery === 'buyer' ? "À l'acheteur" : 'Directement au bénéficiaire')}
${row('Message', esc(g.message || '—'))}
${row('Valable jusqu\'au', frDate(g.expires))}
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr><td style="background:#2E1724;border-radius:999px"><a href="${url}" style="display:inline-block;padding:13px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:#F8F3ED;text-decoration:none">Voir le paiement dans Stripe</a></td></tr></table>
</td></tr>`;
  return { subject: `💳 Carte cadeau vendue — ${g.euros} € — ${g.code}`, html: shell(inner, `Paiement reçu : ${g.euros} €`) };
}

export const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
