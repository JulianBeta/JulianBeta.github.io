import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders profile, experience and projects in English', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Julian Betancourt Cuervo');
    await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
    await expect(page.locator('.job')).not.toHaveCount(0);
    await expect(page.locator('.job').first()).toContainText('Perficient');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('renders in Spanish under /es/', async ({ page }) => {
    await page.goto('/es/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'Experiencia' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Descargar CV' })).toBeVisible();
  });

  test('CV download serves a real PDF', async ({ page, request }) => {
    await page.goto('/');
    const href = await page.getByTestId('cv-download').getAttribute('href');
    expect(href).toBeTruthy();
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/pdf');
    expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-');
  });

  test('contact links point to the right profiles', async ({ page }) => {
    await page.goto('/');
    const contact = page.locator('#contact');
    await expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', /linkedin\.com\/in\/julian-betancourt-cuervo/);
    await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/JulianBeta');
    await expect(contact.getByRole('link', { name: /@/ })).toHaveAttribute('href', /^mailto:/);
  });

  test('in-page navigation scrolls to sections', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Main nav is hidden on small screens');
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#projects')).toBeInViewport();
  });
});
