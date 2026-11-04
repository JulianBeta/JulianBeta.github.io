// Exports the /cv/ (English) and /es/cv/ (Spanish) pages to PDFs in public/cv/, and records each page's text
// fingerprint in public/cv/cv-manifest.json so the tests can tell when the committed PDFs are out of date.
// Usage: npm run cv   (type-checks and builds the site first, then prints with Chromium)
import { spawn } from 'node:child_process';
import { copyFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { CVS, MANIFEST, cvFingerprint } from './cv-fingerprint.mjs';

const PORT = 4330;
const base = `http://localhost:${PORT}`;

// Server errors (port in use, missing dist/) are shown instead of surfacing later as a vague timeout.
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], { stdio: ['ignore', 'ignore', 'inherit'] });
let browser;
try {
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(`${base}/cv/`)).ok) break;
    } catch {}
    if (i > 60) throw new Error(`Preview server did not start on ${base}`);
    await new Promise((r) => setTimeout(r, 250));
  }
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print' });
  const manifest = {};
  for (const { path, out } of CVS) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
    manifest[out.split('/').pop()] = { source: path, textSha256: await cvFingerprint(page) };
    // Also refresh the already-built site so `astro preview` / tests serve the new PDF.
    copyFileSync(out, out.replace(/^public\//, 'dist/'));
    console.log(`CV written to ${out}`);
  }
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  copyFileSync(MANIFEST, MANIFEST.replace(/^public\//, 'dist/'));
} finally {
  await browser?.close();
  server.kill();
}
