import { test, expect } from '@playwright/test';

const SITES = [
  { name: /Gloria Norato/, url: 'https://glorianorato.netlify.app', repo: 'https://github.com/JulianBeta/gloria-norato-web', tested: true },
  { name: /Laura Moth/, url: 'https://laumoth.com', repo: 'https://github.com/JulianBeta/laumoth_webpage', tested: false },
  { name: /Juan Pablo Huston/, url: 'https://juanpablohuston.com', repo: null, tested: false },
];

for (const [path, title, live] of [['/', 'Development Collaborations', 'Live site'], ['/es/', 'Colaboraciones de desarrollo', 'Ver sitio']]) {
  test(`${path} lists the three development collaborations`, async ({ page }) => {
    await page.goto(path);
    const section = page.locator('#collaborations');
    await expect(section.getByRole('heading', { level: 2, name: title })).toBeVisible();
    const cards = section.locator('article.collab');
    await expect(cards).toHaveCount(SITES.length);

    for (const [i, site] of SITES.entries()) {
      const card = cards.nth(i);
      await expect(card.getByRole('heading', { level: 3 })).toHaveText(site.name);
      await expect(card.getByRole('link', { name: live })).toHaveAttribute('href', site.url);
      await expect(card.locator('img')).toHaveAttribute('alt', /.+/);
      // Private repos are not linked.
      const repo = card.locator('a[href^="https://github.com/"]');
      if (site.repo) await expect(repo).toHaveAttribute('href', site.repo);
      else await expect(repo).toHaveCount(0);
      // Testing tools are listed only where the project really has automated tests.
      await expect(card.locator('.chips-test')).toHaveCount(site.tested ? 1 : 0);
    }
  });
}

test('the nav links to the collaborations section', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Main nav is hidden on small screens');
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Collaborations' }).click();
  await expect(page).toHaveURL(/#collaborations$/);
  await expect(page.locator('#collaborations')).toBeInViewport();
});

test('collaboration screenshots are served', async ({ page, request }) => {
  await page.goto('/');
  const srcs = await page.locator('#collaborations img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));
  for (const src of srcs) expect((await request.get(src!)).status(), src!).toBe(200);
});
