// A stable fingerprint of a CV page's visible text. PDFs can't be compared byte for byte (Chromium stamps a
// creation date), so `npm run cv` records this fingerprint next to the PDFs, and the tests compare it with the
// current page to catch PDFs that weren't regenerated after a content change.
import { createHash } from 'node:crypto';

export async function cvFingerprint(page) {
  const text = await page.evaluate(() => document.body.innerText);
  return createHash('sha256').update(text.replace(/\s+/g, ' ').trim()).digest('hex');
}

export const CVS = [
  { path: '/cv/', out: 'public/cv/Julian-Betancourt-CV.pdf' },
  { path: '/es/cv/', out: 'public/cv/Julian-Betancourt-CV-ES.pdf' },
];

export const MANIFEST = 'public/cv/cv-manifest.json';
