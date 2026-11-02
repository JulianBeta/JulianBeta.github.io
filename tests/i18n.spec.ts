import { test, expect } from '@playwright/test';

const pairs = [
  ['/', '/es/'],
  ['/blog/', '/es/blog/'],
  ['/blog/why-this-site-tests-itself/', '/es/blog/por-que-este-sitio-se-prueba-a-si-mismo/'],
];

for (const [en, es] of pairs) {
  test(`language switch round-trips ${en} ⇄ ${es}`, async ({ page }) => {
    await page.goto(en);
    await page.getByTestId('lang-switch').click();
    await expect(page).toHaveURL(es);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await page.getByTestId('lang-switch').click();
    await expect(page).toHaveURL(en);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
}
