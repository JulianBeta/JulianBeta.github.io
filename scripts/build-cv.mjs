// Exports the /cv/ (English) and /es/cv/ (Spanish) pages to PDFs in public/cv/.
// Usage: npm run cv   (builds the site first, then prints with Chromium)
import { spawn } from 'node:child_process';
import { copyFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const PORT = 4330;
const CVS = [
  { path: '/cv/', out: 'public/cv/Julian-Betancourt-CV.pdf' },
  { path: '/es/cv/', out: 'public/cv/Julian-Betancourt-CV-ES.pdf' },
];

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], { stdio: 'ignore' });
try {
  const base = `http://localhost:${PORT}`;
  const url = `${base}/cv/`;
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {}
    if (i > 60) throw new Error(`Preview server did not start on ${url}`);
    await new Promise((r) => setTimeout(r, 250));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print' });
  for (const { path, out } of CVS) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
    // Also refresh the already-built site so `astro preview` / tests serve the new PDF.
    copyFileSync(out, out.replace(/^public\//, 'dist/'));
    console.log(`CV written to ${out}`);
  }
  await browser.close();
} finally {
  server.kill();
}
