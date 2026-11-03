// Exports the /cv/ page to public/cv/Julian-Betancourt-CV.pdf.
// Usage: npm run cv   (builds the site first, then prints with Chromium)
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const PORT = 4330;
const OUT = 'public/cv/Julian-Betancourt-CV.pdf';

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], { stdio: 'ignore' });
try {
  const url = `http://localhost:${PORT}/cv/`;
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {}
    if (i > 60) throw new Error(`Preview server did not start on ${url}`);
    await new Promise((r) => setTimeout(r, 250));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: OUT, format: 'Letter', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
  await browser.close();
  console.log(`CV written to ${OUT}`);
} finally {
  server.kill();
}
