// Polices pour le PDF : les .woff2 déjà servis par le site sont téléchargés une fois (cache mémoire)
// puis décompressés en TTF (pdf-lib ne lit pas le woff2). En cas d'échec, _pdf.js retombe sur les polices standard.
import { decompress } from 'wawoff2';

const FILES = {
  serif_italic: 'cormorant-garamond-latin-400-italic.woff2',
  script: 'pinyon-script-latin-400-normal.woff2',
  sans: 'manrope-latin-wght-normal.woff2',
};
const cache = {};

export async function fontBytes(key, siteUrl) {
  if (cache[key]) return cache[key];
  const base = (siteUrl || process.env.SITE_URL || 'https://institutdorfeuil.com').replace(/\/$/, '');
  const res = await fetch(`${base}/${FILES[key]}`);
  if (!res.ok) throw new Error(`font ${key}: HTTP ${res.status}`);
  const woff2 = new Uint8Array(await res.arrayBuffer());
  cache[key] = Buffer.from(await decompress(woff2));
  return cache[key];
}
