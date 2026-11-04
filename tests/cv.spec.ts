import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { expectFontLoaded } from './fonts';

const cvs = [
  { path: '/cv/', lang: 'en', present: 'Present', certs: /Certifications/ },
  { path: '/es/cv/', lang: 'es', present: 'Actual', certs: /Certificaciones/ },
];

for (const { path, lang, present, certs } of cvs) {
  test.describe(`CV ${path}`, () => {
    test('lists current role first and only certifications under education', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Julian Betancourt Cuervo');
      await expect(page.locator('.job').first()).toContainText('Perficient Latin America');
      await expect(page.locator('.job').first()).toContainText(present);
      await expect(page.getByRole('heading', { name: certs })).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/UNAD|Universidad Nacional Abierta|High School|Bachillerato/i);
    });

    test('selected projects include the LLM eval project and no freelance collaborations', async ({ page }) => {
      await page.goto(path);
      const projects = page.locator('ul.projects');
      await expect(projects).toContainText('Coda');
      await expect(projects).toContainText(lang === 'en' ? 'In progress' : 'En progreso');
      await expect(projects.locator('a[href="https://github.com/JulianBeta/composition-coach-llm-evals"]')).toHaveCount(1);
      await expect(page.locator('body')).not.toContainText(/Laura Moth|Juan Pablo Huston|Gloria Norato|Collaborations|Colaboraciones/);
    });

    test('uses the brand fonts', async ({ page }) => {
      await page.goto(path);
      await expectFontLoaded(page, 'Oswald Variable');
      await expectFontLoaded(page, 'Nunito Variable');
      await expect(page.locator('h2').first()).toHaveCSS('font-family', /Oswald/);
      await expect(page.locator('main p').first()).toHaveCSS('font-family', /Nunito/);
    });

    test('is excluded from search engines', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    });

    test('has no WCAG A/AA accessibility violations', async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });

    test('fits on two Letter pages when printed', async ({ page, browserName, isMobile }) => {
      test.skip(browserName !== 'chromium' || isMobile, 'PDF export is Chromium desktop only');
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const pdf = await page.pdf({ format: 'Letter', printBackground: true, preferCSSPageSize: true });
      const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? [];
      expect(pages.length).toBeLessThanOrEqual(2);
    });
  });
}
