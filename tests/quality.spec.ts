import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { pages } from './pages';

for (const { path, lang } of pages) {
  test.describe(`${path}`, () => {
    test('has no WCAG A/AA accessibility violations', async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });

    test('has SEO metadata and language alternates', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page).toHaveTitle(/Julian Betancourt Cuervo/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://julianbeta.github.io${path}`);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute('href', `https://julianbeta.github.io${path}`);
    });

    test('every internal link resolves', async ({ page, request }) => {
      await page.goto(path);
      const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
      const origin = new URL(page.url()).origin;
      const internal = [...new Set(hrefs.filter((h) => h.startsWith(origin)).map((h) => h.split('#')[0]))];
      expect(internal.length).toBeGreaterThan(0);
      for (const url of internal) {
        const res = await request.get(url);
        expect.soft(res.status(), url).toBe(200);
      }
    });

    test('in-page anchors target existing elements', async ({ page }) => {
      await page.goto(path);
      const ids = await page.locator('a[href*="#"]').evaluateAll((as) =>
        as
          .map((a) => new URL((a as HTMLAnchorElement).href))
          .filter((u) => u.pathname === location.pathname && u.hash.length > 1)
          .map((u) => u.hash.slice(1)),
      );
      for (const id of new Set(ids)) {
        await expect.soft(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
      }
    });
  });
}

test('the 404 page links somewhere real and is not indexed', async ({ page, request }) => {
  await page.goto('/this-page-does-not-exist/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('link[rel="canonical"], link[rel="alternate"][hreflang]')).toHaveCount(0);
  const hrefs = await page.locator('main a[href], [data-testid="lang-switch"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  expect(hrefs).toContain(new URL('/es/', page.url()).href);
  for (const href of new Set(hrefs)) expect.soft((await request.get(href)).status(), href).toBe(200);
});

test('unknown routes return the 404 page', async ({ request }) => {
  const res = await request.get('/this-page-does-not-exist/');
  expect(res.status()).toBe(404);
  expect(await res.text()).toContain('expected page, received nothing');
});

for (const feed of ['/rss.xml', '/es/rss.xml']) {
  test(`${feed} is a valid RSS feed listing posts`, async ({ request }) => {
    const res = await request.get(feed);
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('<rss');
    expect(xml).toMatch(/<item>[\s\S]*<link>https:\/\/julianbeta\.github\.io\/.+<\/link>/);
  });
}
