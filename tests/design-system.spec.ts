import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const tokens = JSON.parse(readFileSync('src/data/design-system/tokens.json', 'utf8'));
const specs = readFileSync('src/data/design-system.ts', 'utf8');
const count = (pattern: RegExp) => [...specs.matchAll(pattern)].length;
const componentCount = count(/^    id: '/gm);
const logoCount = count(/\{ file: 'jb-mark-/g);
const pairCount = count(/^  \['[a-z-]+', '[a-z-]+'\],$/gm);

for (const path of ['/design-system/', '/es/design-system/']) {
  test.describe(`Design system ${path}`, () => {
    test('every documented color matches the CSS variable the site really uses', async ({ page }) => {
      await page.goto(path);
      const rows = page.locator('[data-color-token]');
      await expect(rows).toHaveCount(tokens.color.tokens.length);
      // The browser resolves both values, because the CSS minifier rewrites colors (#ff3366 becomes #f36).
      const pairs = await rows.evaluateAll((els) => {
        const probe = document.createElement('i');
        document.body.append(probe);
        const channels = (value: string) => {
          probe.style.color = '';
          probe.style.color = value;
          return getComputedStyle(probe).color.match(/[\d.]+/g)!.map(Number);
        };
        const live = getComputedStyle(document.documentElement);
        const result = els.map((el) => {
          const row = el as HTMLElement;
          return { token: row.dataset.colorToken!, documented: channels(row.dataset.dark!), live: channels(live.getPropertyValue(row.dataset.siteVar!)) };
        });
        probe.remove();
        return result;
      });
      for (const { token, documented, live } of pairs) {
        expect.soft(live.length, token).toBe(documented.length);
        // Alpha survives minifying only to 8 bits, so 0.12 can read back as 0.122.
        documented.forEach((channel, i) => expect.soft(Math.abs(channel - live[i]), `${token}: ${documented} vs ${live}`).toBeLessThan(0.01));
      }
    });

    test('documents every type style and every other token', async ({ page }) => {
      await page.goto(path);
      for (const group of tokens.type.groups) {
        for (const style of group.styles) await expect.soft(page.locator(`[data-type-style="${style.name}"]`), style.name).toHaveCount(1);
      }
      for (const family of [tokens.spacing, tokens.radius, tokens.shadow]) {
        for (const token of family.tokens) await expect.soft(page.locator(`[data-token="${token.name}"]`), token.name).toHaveCount(1);
      }
    });

    test('every allowed text pair reaches 4.5:1 in both themes', async ({ page }) => {
      await page.goto(path);
      const ratios = await page.locator('[data-contrast]').evaluateAll((els) => els.map((el) => Number((el as HTMLElement).dataset.contrast)));
      expect(ratios).toHaveLength(pairCount * 2);
      for (const ratio of ratios) expect.soft(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('every component has a live example or usage, and its code', async ({ page }) => {
      await page.goto(path);
      const docs = page.locator('[data-component]');
      await expect(docs).toHaveCount(componentCount);
      for (const doc of await docs.all()) {
        await expect.soft(doc.locator('.ds-code code')).not.toBeEmpty();
        await expect.soft(doc.locator('h4')).not.toBeEmpty();
      }
      await expect(page.locator('[data-component="role-switch"] .ds-example .role-switch')).toBeVisible();
    });

    test('every logo file loads', async ({ page }) => {
      await page.goto(path);
      const images = page.locator('.ds-logos img');
      await expect(images).toHaveCount(logoCount);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
    });

    test('the table of contents works on every screen size', async ({ page }) => {
      await page.goto(path);
      const toc = page.locator('.ds-toc');
      await expect(toc).toBeVisible();
      await toc.locator('a[href="#ds-motion"]').click();
      await expect(page).toHaveURL(/#ds-motion$/);
      await expect(page.locator('#ds-motion')).toBeInViewport();
    });

    test('live examples stop moving under reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const animated = await page.locator('.ds-example *').evaluateAll((els) => els.filter((el) => getComputedStyle(el).animationName !== 'none').length);
      expect(animated).toBe(0);
    });

    test('nothing overflows a 320px screen', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBe(0);
    });
  });
}

test('the footer links to the design system in the page language', async ({ page }) => {
  await page.goto('/es/');
  await page.locator('footer').getByRole('link', { name: 'Sistema de diseño' }).click();
  await expect(page).toHaveURL(/\/es\/design-system\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sistema de diseño');
});
