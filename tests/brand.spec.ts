import { test, expect } from '@playwright/test';

test.describe('Brand assets', () => {
  test('favicons, manifest and social image are served', async ({ page, request }) => {
    await page.goto('/');
    const hrefs = [
      await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute('href'),
      await page.locator('link[rel="icon"][sizes="32x32"]').getAttribute('href'),
      await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'),
      await page.locator('link[rel="manifest"]').getAttribute('href'),
      new URL((await page.locator('meta[property="og:image"]').getAttribute('content'))!).pathname,
    ];
    for (const href of hrefs) {
      const res = await request.get(href!);
      expect.soft(res.status(), href!).toBe(200);
    }
    const manifest = await (await request.get('/site.webmanifest')).json();
    for (const icon of manifest.icons) expect.soft((await request.get(icon.src)).status(), icon.src).toBe(200);
  });

  test('the JB logo appears in the header, between sections and in the footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header .brand svg')).toBeVisible();
    await expect(page.locator('.brand-divider svg')).toBeVisible();
    await expect(page.locator('footer .footer-brand svg')).toBeVisible();
    // Decorative next to visible text: hidden from assistive tech.
    await expect(page.locator('header .brand svg')).toHaveAttribute('aria-hidden', 'true');
  });

  test('footer social links have icons and readable names', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    for (const [name, href] of [
      ['LinkedIn', /linkedin\.com\/in\//],
      ['GitHub', /github\.com\/JulianBeta$/],
      ['Email', /^mailto:/],
    ] as const) {
      const link = footer.getByRole('link', { name });
      await expect(link).toHaveAttribute('href', href);
      await expect(link.locator('svg.icon')).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('the CV header uses the logo and contact icons', async ({ page }) => {
    await page.goto('/cv/');
    await expect(page.locator('.cv-header svg.mark')).toBeVisible();
    await expect(page.locator('.contact svg.icon')).toHaveCount(6);
  });
});
