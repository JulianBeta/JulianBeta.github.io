import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('CV page', () => {
  test('lists current role first and only certifications under education', async ({ page }) => {
    await page.goto('/cv/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Julian Betancourt Cuervo');
    await expect(page.locator('.job').first()).toContainText('Perficient Latin America');
    await expect(page.locator('.job').first()).toContainText('Present');
    await expect(page.getByRole('heading', { name: /Certifications/ })).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/UNAD|Universidad Nacional Abierta|High School|Bachillerato/i);
  });

  test('is excluded from search engines', async ({ page }) => {
    await page.goto('/cv/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });

  test('has no WCAG A/AA accessibility violations', async ({ page }) => {
    await page.goto('/cv/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });

  test('fits on two Letter pages when printed', async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== 'chromium' || isMobile, 'PDF export is Chromium desktop only');
    await page.goto('/cv/');
    const pdf = await page.pdf({ format: 'Letter', printBackground: true, preferCSSPageSize: true });
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? [];
    expect(pages.length).toBeLessThanOrEqual(2);
  });
});
