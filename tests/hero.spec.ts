import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const heroes = [
  {
    path: '/',
    roles: { engineer: 'Senior QA Automation Engineer', lead: 'QA Lead' },
    text: { engineer: 'teams actually trust', lead: 'QA Center of Excellence' },
    skill: { engineer: 'TypeScript', lead: 'Mentorship' },
    roleGroup: 'Show role',
    inspect: 'Inspect mode',
    copy: 'Copy',
    copied: /Locator copied/,
    copyFailed: /Couldn’t copy/,
  },
  {
    path: '/es/',
    roles: { engineer: 'Senior QA Automation Engineer', lead: 'QA Lead' },
    text: { engineer: 'realmente confían', lead: 'Centro de Excelencia de QA' },
    skill: { engineer: 'TypeScript', lead: 'Mentorship' },
    roleGroup: 'Ver rol',
    inspect: 'Modo inspección',
    copy: 'Copiar',
    copied: /Locator copiado/,
    copyFailed: /No se pudo copiar/,
  },
];

const hero = (page: Page) => page.locator('[data-hero]');
const openTip = (page: Page) => page.locator('.inspect-tip');
/** Text elements are named groups while Inspect mode is on. */
const textTarget = (page: Page, text: string) =>
  hero(page).getByRole('group', { name: /Playwright locator|Locator de Playwright/ }).filter({ hasText: text });

/** Runs an offered locator exactly as a visitor would paste it into a test. */
function resolve(page: Page, code: string): Locator {
  return new Function('page', `return ${code};`)(page);
}

async function expectOfferedLocatorsWork(page: Page) {
  const targets = hero(page).locator('.inspect-target:visible');
  const codes = await targets.evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.locator!));
  expect(codes.length).toBeGreaterThanOrEqual(6);
  for (const code of codes) {
    await expect.soft(resolve(page, code), code).toHaveCount(1);
    await expect.soft(resolve(page, code), code).toBeVisible();
  }
}

for (const h of heroes) {
  test.describe(`Hero ${h.path}`, () => {
    const roleButton = (page: Page, name: string) => hero(page).getByRole('group', { name: h.roleGroup }).getByRole('button', { name });

    test('the role switch swaps description and skills', async ({ page }) => {
      await page.goto(h.path);
      await expect(roleButton(page, h.roles.engineer)).toHaveAttribute('aria-pressed', 'true');
      await expect(hero(page).getByText(h.text.engineer)).toBeVisible();
      await expect(hero(page).getByText(h.skill.engineer)).toBeVisible();

      await roleButton(page, h.roles.lead).click();
      await expect(roleButton(page, h.roles.lead)).toHaveAttribute('aria-pressed', 'true');
      await expect(roleButton(page, h.roles.engineer)).toHaveAttribute('aria-pressed', 'false');
      await expect(hero(page).getByText(h.text.lead)).toBeVisible();
      await expect(hero(page).getByText(h.skill.lead)).toBeVisible();
      await expect(hero(page).getByText(h.text.engineer)).toBeHidden();
    });

    test('every offered locator finds exactly one visible element, for both roles', async ({ page }) => {
      await page.goto(h.path);
      await expectOfferedLocatorsWork(page);
      await roleButton(page, h.roles.lead).click();
      await expectOfferedLocatorsWork(page);
    });

    test('the keyboard reaches a tip and its Copy button; Esc closes it', async ({ page, isMobile }) => {
      test.skip(isMobile, 'Keyboard flow');
      await page.goto(h.path);
      const name = textTarget(page, 'Julian Betancourt');
      await name.focus();
      await expect(openTip(page)).toContainText("getByRole('heading'");
      await page.keyboard.press('Tab');
      await expect(page.locator('.inspect-copy')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(openTip(page)).toHaveCount(0);
      await expect(name).toBeFocused();
      // Keyboard focus must stay visible once the tip's dashed outline is gone.
      await expect(name).toHaveCSS('outline-style', 'solid');
      await expect(name).toHaveCSS('outline-width', '3px');
    });

    test('Esc from a role tip returns focus to the selected role', async ({ page, isMobile }) => {
      test.skip(isMobile, 'Keyboard flow');
      await page.goto(h.path);
      const lead = roleButton(page, h.roles.lead);
      await lead.click();
      await lead.focus();
      await page.keyboard.press('Tab');
      await expect(page.locator('.inspect-copy')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(lead).toBeFocused();
    });

    test('tips do not open inside a live region', async ({ page }) => {
      await page.goto(h.path);
      await textTarget(page, h.text.engineer).focus();
      await expect(openTip(page)).toBeVisible();
      await expect(hero(page).locator('[aria-live]').filter({ has: openTip(page) })).toHaveCount(0);
    });

    test('hovering a target shows its locator, and the pointer can move onto the tip', async ({ page, isMobile }) => {
      test.skip(isMobile, 'No hover on touch');
      await page.goto(h.path);
      await hero(page).getByTestId('cv-download').hover();
      await expect(openTip(page)).toContainText("getByRole('link'");
      await page.locator('.inspect-copy').hover();
      await expect(openTip(page)).toBeVisible();
    });

    test('tapping a text target shows its locator on touch screens', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Touch only');
      await page.goto(h.path);
      await hero(page).getByText(h.text.engineer).tap();
      await expect(openTip(page)).toContainText('getByText');
      await expectTipInsideViewport(page);
    });

    test('Copy puts the locator on the clipboard and only then confirms', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.goto(h.path);
      await textTarget(page, h.text.engineer).focus();
      const code = await page.locator('.inspect-tip code').textContent();
      await page.locator('.inspect-copy').click();
      await expect(page.locator('[data-inspect-toast]')).toHaveText(h.copied);
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(code);
    });

    test('a failed copy says so instead of claiming success', async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } });
      });
      await page.goto(h.path);
      await textTarget(page, h.text.engineer).focus();
      await page.locator('.inspect-copy').click();
      await expect(page.locator('[data-inspect-toast]')).toHaveText(h.copyFailed);
    });

    test('turning Inspect off removes tips and the extra tab stops', async ({ page }) => {
      await page.goto(h.path);
      const toggle = hero(page).getByRole('button', { name: h.inspect });
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(hero(page).locator('[tabindex="0"]')).not.toHaveCount(0);
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await expect(hero(page).locator('[tabindex="0"]')).toHaveCount(0);
      await hero(page).getByTestId('cv-download').focus();
      await expect(openTip(page)).toHaveCount(0);
    });

    test('with reduced motion the indicator still sits under the selected role', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(h.path);
      const lead = roleButton(page, h.roles.lead);
      await lead.click();
      const indicator = (await hero(page).locator('.role-switch-indicator').boundingBox())!;
      const button = (await lead.boundingBox())!;
      expect(Math.abs(indicator.x + indicator.width / 2 - (button.x + button.width / 2))).toBeLessThan(3);
      await expect(lead).toHaveCSS('color', 'rgb(1, 22, 39)');
    });

    test('nothing overflows a 320px screen, even with a tip open', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(h.path);
      await hero(page).getByTestId('cv-download').focus();
      await expectTipInsideViewport(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBe(0);
      const label = roleButton(page, h.roles.engineer);
      expect(await label.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    });

    test('a description tip flipped under the header paints above the skills', async ({ page, isMobile }) => {
      test.skip(isMobile, 'Layout check at desktop width');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(h.path);
      const description = textTarget(page, h.text.engineer);
      await description.evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'instant' }));
      await description.focus();
      await expect(openTip(page)).toHaveClass(/below/);
      const copy = page.locator('.inspect-copy');
      const onTop = await copy.evaluate((el) => {
        const box = el.getBoundingClientRect();
        return el.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
      });
      expect(onTop).toBe(true);
    });

    test('buttons and controls are at least 44px tall', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(h.path);
      await hero(page).getByTestId('cv-download').focus();
      await expect(openTip(page)).toBeVisible();
      const controls = page.locator('.role-switch button, .inspect-toggle, .inspect-copy, .lang-switch, [data-hero] .btn');
      for (const control of await controls.all()) {
        const box = (await control.boundingBox())!;
        // Rounded: layout can report sub-pixel values such as 43.99999.
        expect.soft(Math.round(box.height * 10) / 10, await control.innerText()).toBeGreaterThanOrEqual(44);
      }
    });

    test('passes the accessibility scan with Lead selected and a tip open', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(h.path);
      await roleButton(page, h.roles.lead).click();
      await hero(page).getByTestId('cv-download').focus();
      await expect(openTip(page)).toBeVisible();
      const results = await new AxeBuilder({ page }).include('[data-hero]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });
  });
}

test.describe('Hero without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the Spanish hero also keeps its content', async ({ page }) => {
    await page.goto('/es/');
    await expect(hero(page).locator('.headline')).toHaveText('Senior QA Automation Engineer');
    await expect(hero(page).getByText('realmente confían')).toBeVisible();
    await expect(hero(page).getByTestId('cv-download')).toHaveAttribute('href', /-ES\.pdf$/);
  });

  test('shows the Engineer content and hides controls that cannot work', async ({ page }) => {
    await page.goto('/');
    await expect(hero(page).getByRole('heading', { level: 1 })).toHaveText('Julian Betancourt');
    await expect(hero(page).locator('.headline')).toHaveText('Senior QA Automation Engineer');
    await expect(hero(page).getByText('teams actually trust')).toBeVisible();
    await expect(hero(page).getByText('QA Center of Excellence')).toBeHidden();
    await expect(hero(page).locator('.role-switch')).toBeHidden();
    await expect(hero(page).locator('.inspect-toggle')).toBeHidden();
    // No outlines promising an interaction that needs the script.
    await expect(hero(page).locator('.inspect-target').first()).toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
    await expect(hero(page).getByTestId('cv-download')).toBeVisible();
  });
});

async function expectTipInsideViewport(page: Page) {
  await expect(openTip(page)).toBeVisible();
  const box = (await openTip(page).boundingBox())!;
  const width = page.viewportSize()!.width;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
}
