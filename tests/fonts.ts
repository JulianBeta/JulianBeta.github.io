import { expect, type Page } from '@playwright/test';

/**
 * Asserts that a self-hosted font family was really downloaded and is in use.
 * `document.fonts.check()` returns true when *no* face matches, and `toHaveCSS('font-family')` only reads the
 * declared stack, so neither notices a missing font file. Instead, look for a FontFace of that family whose
 * status is "loaded" after the page has finished loading its fonts.
 */
export async function expectFontLoaded(page: Page, family: string) {
  const loaded = await page.evaluate(async (name) => {
    await document.fonts.ready;
    return [...document.fonts].filter((f) => f.family.replace(/["']/g, '') === name && f.status === 'loaded').length;
  }, family);
  expect(loaded, `loaded "${family}" font faces`).toBeGreaterThan(0);
}
