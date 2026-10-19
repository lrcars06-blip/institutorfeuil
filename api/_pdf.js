// Génère la carte cadeau en PDF (A5 paysage), jointe aux e-mails. Pure JS : fonctionne sur Vercel.
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { fontBytes } from './_fonts.js';
import { SHOP, frDate } from './_lib.js';

const PAL = {
  plum:  { bg: [0.18, 0.09, 0.14], bg2: [0.29, 0.13, 0.22], ink: [0.97, 0.95, 0.93], acc: [0.85, 0.76, 0.60], line: [0.85, 0.76, 0.60] },
  ivory: { bg: [0.96, 0.94, 0.90], bg2: [0.90, 0.85, 0.78], ink: [0.18, 0.09, 0.14], acc: [0.66, 0.51, 0.29], line: [0.66, 0.51, 0.29] },
  rose:  { bg: [0.92, 0.76, 0.81], bg2: [0.79, 0.54, 0.61], ink: [0.23, 0.12, 0.18], acc: [0.48, 0.18, 0.30], line: [0.48, 0.18, 0.30] },
};
const c = (a) => rgb(a[0], a[1], a[2]);
async function loadFont(doc, key) {
  try { return await doc.embedFont(await fontBytes(key), { subset: false }); }
  catch (e) { console.error('font', key, e?.message); return null; }
}
const wrap = (font, size, text, maxW) => {
  const words = String(text).split(/\s+/), lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (font.widthOfTextAtSize(t, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur); return lines;
};
const safe = (s) => String(s ?? '').replace(/[^\x20-\x7E -ſ–—‘’“”…€]/g, '');

export async function giftCardPdf(g) {
  const p = PAL[g.theme] || PAL.plum;
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`Carte cadeau — ${SHOP.name}`);
  doc.setAuthor(SHOP.name);
  const serifIt = (await loadFont(doc, 'serif_italic')) || await doc.embedFont(StandardFonts.TimesRomanItalic);
  const script  = (await loadFont(doc, 'script')) || serifIt;
  const sans    = (await loadFont(doc, 'sans')) || await doc.embedFont(StandardFonts.Helvetica);
  const mono    = await doc.embedFont(StandardFonts.Courier);

  const W = 595, H = 420; // A5 paysage (points)
  const page = doc.addPage([W, H]);
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: c(p.bg) });
  // halo décoratif
  page.drawSvgPath(`M 0 0 L ${W} 0 L ${W} ${H * 0.62} Z`, { x: 0, y: H, color: c(p.bg2), opacity: 0.55 });
  page.drawCircle({ x: W - 70, y: H - 40, size: 140, color: c(p.bg2), opacity: 0.45 });
  page.drawCircle({ x: W - 70, y: H - 40, size: 140, borderColor: c(p.line), borderWidth: 0.5, borderOpacity: 0.35 });
  page.drawRectangle({ x: 18, y: 18, width: W - 36, height: H - 36, borderColor: c(p.line), borderWidth: 0.8, borderOpacity: 0.7 });

  const M = 44;
  page.drawText(safe("L'Institut d'Orfeuil"), { x: M, y: H - 78, size: 34, font: script, color: c(p.acc) });
  page.drawText('CARTE CADEAU', { x: W - M - sans.widthOfTextAtSize('CARTE CADEAU', 9) - 8, y: H - 60, size: 9, font: sans, color: c(p.ink), opacity: 0.75 });
  page.drawText('Châlons-en-Champagne', { x: W - M - serifIt.widthOfTextAtSize('Châlons-en-Champagne', 11) - 8, y: H - 74, size: 11, font: serifIt, color: c(p.ink), opacity: 0.7 });

  let y = H - 150;
  if (g.kind === 'soin') {
    const lines = wrap(serifIt, 26, safe(g.label), W - 2 * M - 40);
    for (const l of lines) { page.drawText(l, { x: M, y, size: 26, font: serifIt, color: c(p.ink) }); y -= 30; }
    page.drawText(safe(g.duration).toUpperCase(), { x: M, y: y - 4, size: 9, font: sans, color: c(p.ink), opacity: 0.7 });
    y -= 30;
  } else {
    page.drawText(`${g.euros} €`, { x: M, y: y - 20, size: 60, font: serifIt, color: c(p.ink) });
    y -= 60;
  }

  page.drawText('POUR', { x: M, y: y - 12, size: 7, font: sans, color: c(p.ink), opacity: 0.6 });
  page.drawText(safe(g.toName), { x: M, y: y - 34, size: 22, font: serifIt, color: c(p.ink) });
  if (g.message) {
    const lines = wrap(serifIt, 13, `« ${safe(g.message)} »`, W - 2 * M - 180).slice(0, 3);
    let my = y - 62;
    for (const l of lines) { page.drawText(l, { x: M, y: my, size: 13, font: serifIt, color: c(p.ink), opacity: 0.9 }); my -= 16; }
    page.drawText(`— ${safe(g.fromName)}`, { x: M, y: my - 2, size: 12, font: serifIt, color: c(p.ink), opacity: 0.85 });
  } else {
    page.drawText(`De la part de ${safe(g.fromName)}`, { x: M, y: y - 62, size: 12, font: serifIt, color: c(p.ink), opacity: 0.85 });
  }

  // bloc code, à droite
  const bx = W - M - 190, by = 52, bw = 190, bh = 92;
  page.drawRectangle({ x: bx, y: by, width: bw, height: bh, color: c(p.ink), opacity: 0.08, borderColor: c(p.line), borderWidth: 0.6, borderOpacity: 0.6 });
  page.drawText('VOTRE CODE', { x: bx + 14, y: by + bh - 20, size: 7, font: sans, color: c(p.ink), opacity: 0.6 });
  page.drawText(safe(g.code), { x: bx + 14, y: by + bh - 44, size: 17, font: mono, color: c(p.acc) });
  page.drawText(`Valable jusqu'au ${frDate(g.expires)}`, { x: bx + 14, y: by + 26, size: 8, font: sans, color: c(p.ink), opacity: 0.8 });
  page.drawText('À présenter à l’institut, sur rendez-vous', { x: bx + 14, y: by + 13, size: 7, font: sans, color: c(p.ink), opacity: 0.6 });

  page.drawText(safe(`${SHOP.address} · ${SHOP.phone}`), { x: M, y: 40, size: 8, font: sans, color: c(p.ink), opacity: 0.6 });
  page.drawText(g.kind === 'amount' ? 'Utilisable en une ou plusieurs fois, sur les soins et les produits.' : 'Une autre prestation peut être choisie ; la différence éventuelle est réglée sur place.',
    { x: M, y: 28, size: 7, font: sans, color: c(p.ink), opacity: 0.5 });

  return Buffer.from(await doc.save());
}
