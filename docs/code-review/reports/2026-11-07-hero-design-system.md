# Code review: uncommitted hero, Inspect mode and design system changes

- **Date:** 2026-11-07
- **Scope:** The 18 listed files, read in full. `CV.astro`, `SocialLinks.astro`, `Icon.astro`, `tests/brand.spec.ts`, `playwright.config.ts` and `ci.yml` were read for context. Nothing was executed.
- **Files reviewed:** 18 (6 of them tests)
- **Verdict:** Solid work with a strong test suite, but fix one mobile bug and several accessibility gaps first, because the design system page makes promises the code doesn't keep.

## Summary
The Inspect mode is carefully built, and its central promise (every offered locator resolves to one visible element, in both languages and for both roles) is tested directly. The most important defect is that a global `nav { display: none }` rule hides the design system's table of contents on phones. The other main risks are accessibility gaps the suite can't see: looping animations under reduced motion on `/design-system/`, a nearly invisible focus indicator after Esc, and tooltip code placed inside a live region. Several documented claims are also untrue, including the 44px touch targets and the Light theme as the CV's palette. Fix R-01 first, then R-02 and R-03.

**Tree changed during the review:** `src/components/DesignSystem.astro:66` read `/img/brand/${logo.file}` on my first read and `/img/logos/${logo.file}` on a later one. `public/img/brand/` doesn't exist and `public/img/logos/` holds all 7 files, so the edit fixed a real bug and I don't report it. I re-checked the key lines for R-01 to R-06 and R-11 after noticing the edit, but other lines could have moved too.

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 1 |
| Medium | 6 |
| Low | 5 |
| Nit | 5 |

## Findings

### R-01: The design system table of contents disappears on phones
- **Severity:** High · **Category:** bug
- **Location:** `src/styles/global.css:76`, `src/styles/global.css:85-88`, `src/components/DesignSystem.astro:50-52`
- **Evidence:**
  ```css
  nav { margin-left: auto; }
  @media (max-width: 760px) {
    nav { display: none; }
  ```
  ```astro
  <nav class="ds-toc" aria-label={c.toc}>
  ```
- **Why it matters:** The bare `nav` selector was written for the header, but `/design-system/` adds a second `nav`. `.ds-toc` (`DesignSystem.astro:247-248`) sets no `display` on the `nav` itself, so the rule hides it at 760px and below. Phone users lose the only navigation on a very long page, and the header nav is hidden there too. No test checks the table of contents at any width.
- **Suggested fix:** Scope both rules to `.site-header nav`, and add a mobile test that the table of contents is visible and its links scroll to their sections.

### R-02: Reduced motion is ignored on the design system page
- **Severity:** Medium · **Category:** accessibility
- **Location:** `src/styles/global.css:145`, `src/styles/global.css:164`, `src/styles/global.css:168-170`, `src/data/design-system.ts:212-215`, `src/data/design-system.ts:230-232`
- **Evidence:**
  ```css
  .inspect-toggle[aria-pressed='true'] .inspect-led { background: var(--accent); animation: inspect-pulse 1.6s ease-out infinite; }
  .scroll-cue .icon { animation: scroll-bob 1.8s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .hero *, .hero *::after, .inspect-toast { animation: none !important; transition: none !important; }
  }
  ```
- **Why it matters:** The live Inspect mode and Scroll cue examples sit in `.ds-example`, outside `.hero`, and `inert` doesn't stop CSS animation. Both loop forever for visitors who asked for reduced motion, on the page that documents the rule (`design-system.ts:480`). The role switch indicator's transition isn't covered there either. The hero's scroll cue also bobs indefinitely with no on-page pause, which may need a WCAG 2.2.2 judgment call.
- **Suggested fix:** Add `.ds-example *` to the media query, or target the animated components directly. Add a `/design-system/` test asserting `animation-name: none` under `reducedMotion: 'reduce'`.

### R-03: Focus is almost invisible after Esc on a text target
- **Severity:** Medium · **Category:** accessibility
- **Location:** `src/styles/global.css:49`, `src/styles/global.css:147-149`, `src/components/Hero.astro:142-146`
- **Evidence:**
  ```css
  :focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; border-radius: 4px; }
  .inspect-target { ... outline: 1px dashed transparent; outline-offset: 8px; ... }
  .hero[data-inspect='on'] .inspect-target { outline-color: rgba(46, 196, 182, 0.22); }
  ```
- **Why it matters:** `.inspect-target` has the same specificity as `:focus-visible` and comes later, so it replaces the focus ring. While a tip is open, `.hit` gives a visible 2px dashed outline. Esc removes `.hit` and `closeTip` returns focus to the target, which then shows only a 1px dashed line at 22% alpha. Keyboard users can lose their place (WCAG 2.4.7). Axe doesn't catch this, and the keyboard test stops at the tip count. It also contradicts the documented "solid 3px" ring (`design-system.ts:482`).
- **Suggested fix:** Add `.hero .inspect-target:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }`, placed after the `.hit` rule or with enough specificity to beat it. Test the outline after Esc.

### R-04: Tooltip code is inserted into a live region
- **Severity:** Medium · **Category:** accessibility
- **Location:** `src/components/Hero.astro:71-77`, `src/components/Hero.astro:167-169`
- **Evidence:**
  ```astro
  <div class="hero-panels" aria-live="polite">
    ...
    <div class="inspect-target" data-locator={locators.text(role.locatorText[lang])} data-focusable>
  ```
  ```ts
  box.append(text, button);
  tip.append(box);
  target.append(tip);
  ```
- **Why it matters:** The description and skills tips are added inside `aria-live="polite"`. Hovering or focusing either target should therefore announce the locator and Copy label, on top of the group's own `aria-label`. The DOM placement is confirmed; the spoken output needs a screen reader check.
- **Suggested fix:** Remove `aria-live` from the container and announce role changes through a dedicated status element. Alternatively, render tips outside `.hero-panels`.

### R-05: The documented 44px touch target rule is false
- **Severity:** Medium · **Category:** accessibility
- **Location:** `src/data/design-system.ts:482`, `src/data/design-system.ts:503`, `src/styles/global.css:155`, `src/styles/global.css:80-83`
- **Evidence:**
  ```ts
  'Touch targets are at least 44px tall.'
  ```
  ```css
  .inspect-copy { flex: none; min-height: 32px; padding: 0 0.6rem; ... }
  ```
- **Why it matters:** Copy is the main action in the touch flow, yet it is 32px tall. `.lang-switch` also falls short, at about 34px by my calculation (0.85rem × 1.65 line height, plus padding and border). A visitor can disprove this claim in DevTools, and no test enforces it.
- **Suggested fix:** Set `.inspect-copy` and `.lang-switch` to `min-height: 44px`, or narrow the claim to the controls that meet it. Add a mobile test over the controls the rule covers.

### R-06: The component docs test can't catch an empty code sample
- **Severity:** Medium · **Category:** test quality
- **Location:** `tests/design-system.spec.ts:53-62`, `src/components/DesignSystem.astro:216`, `src/data/design-system.ts:124-125`
- **Evidence:**
  ```ts
  test('every component has a live example or usage, and its code', async ({ page }) => {
    ...
    await expect(docs).not.toHaveCount(0);
    for (const doc of await docs.all()) {
      await expect.soft(doc.locator('.ds-code')).toHaveCount(1);
  ```
- **Why it matters:** The template always renders one `.ds-code`, so that assertion can't fail. A component with neither `markup` nor `usage` passes with an empty `<code>`, which the types also allow because both fields are optional. Live examples are only checked for `role-switch`, and the component count is only checked as non-zero, so a dropped entry goes unnoticed.
- **Suggested fix:** Assert `doc.locator('.ds-code code')` is not empty and compare the count to `components.length`. Model the type as `markup` or `usage`, with at least one required.

### R-07: The Light theme doesn't match the CV it claims to describe
- **Severity:** Medium · **Category:** bug
- **Location:** `src/data/design-system.ts:469`, `src/data/design-system.ts:474`, `src/data/design-system/tokens.json:101`, `src/data/design-system/tokens.json:117`, `src/data/design-system/tokens.json:125`, `src/components/CV.astro:75-79`, `tests/design-system.spec.ts:24`
- **Evidence:**
  ```ts
  intro: '... and tests fail if these colors drift from it.'
  color: { ..., intro: '... Light is the counterpart for print and the CV. ...' }
  ```
  ```css
  --sea-deep: #0a6e66;
  --blue-deep: #0b6fae;
  --text: #1f2a37;
  --muted: #4b5866;
  ```
- **Why it matters:** The tokens say `primary-text` is `#0f7d73`, `link` is `#0b6fb0`, `text` is ink-black `#011627` and `text-muted` is `#4a5866`. The CV uses other values for all four roles. The test reads only `row.dataset.dark`, so half the color table has no check, and the published contrast ratios describe colors the CV doesn't use.
- **Suggested fix:** Align the CV's variables with the tokens and check the CV's computed values in a test. If they should differ, change the copy to say Light is a reference palette and limit the drift claim to the dark theme.

### R-08: Esc from a role tooltip moves focus to the wrong button
- **Severity:** Low · **Category:** accessibility
- **Location:** `src/components/Hero.astro:145`
- **Evidence:**
  ```ts
  (target.querySelector<HTMLElement>('a, button') ?? target).focus();
  ```
- **Why it matters:** The role target holds two buttons, and this always picks the first. A user who goes from QA Lead to Copy and presses Esc lands on Senior QA Automation Engineer.
- **Suggested fix:** Remember the element focused before entering the tip, or prefer `[aria-pressed="true"]` here. Assert the focused element in the keyboard test.

### R-09: Without JavaScript, the hero shows Inspect outlines that do nothing
- **Severity:** Low · **Category:** bug
- **Location:** `src/components/Hero.astro:29`, `src/styles/global.css:148`
- **Evidence:**
  ```astro
  data-inspect="on"
  ```
  ```css
  .hero[data-inspect='on'] .inspect-target { outline-color: rgba(46, 196, 182, 0.22); }
  ```
- **Why it matters:** The attribute comes from the server and the rule isn't gated on `.js`, so the name, description, skills and CTA targets show dashed outlines. This cuts against the rule that hides controls when JavaScript is off.
- **Suggested fix:** Scope the rule to `html.js .hero[data-inspect='on']`, or set `data-inspect` from the script. Add the outline to the no-JS test.

### R-10: Spanish hero chips are English and aren't marked as such
- **Severity:** Low · **Category:** i18n
- **Location:** `src/data/profile.ts:43`, `src/data/profile.ts:53`, `src/components/Hero.astro:79`, `src/data/design-system.ts:493`, `tests/hero.spec.ts:19`
- **Evidence:**
  ```ts
  skills: ['QA strategy', 'Quality roadmap', 'Mentorship', 'Playwright standard'],
  ```
  ```astro
  {role.skills.map((skill) => <li>{skill}</li>)}
  ```
- **Why it matters:** The new Voice rule keeps only product names and job titles in English, and these phrases are neither. Spanish screen readers will also mispronounce them because there is no `lang="en"`. The existing `skills` list has the same habit, so this is consistent with the repo, but the new rule now makes it a contradiction. The test also locks in `Mentorship` for `/es/`.
- **Suggested fix:** Make non-product chips bilingual, or mark them `lang="en"` and relax the Voice rule to match.

### R-11: Code blocks use `aria-label` on an element with no suitable role
- **Severity:** Low · **Category:** accessibility
- **Location:** `src/components/DesignSystem.astro:216`
- **Evidence:**
  ```astro
  <pre class="ds-code" tabindex="0" aria-label={`${doc.name}: ${c.components.usage}`}>
  ```
- **Why it matters:** HTML-AAM maps `pre` to `generic`, and ARIA 1.2 prohibits naming that role, so assistive technology may ignore the label on this tab stop. The table wrappers in the same file correctly use `role="region"` (`DesignSystem.astro:79`).
- **Suggested fix:** Add `role="region"` or `role="group"`, matching the table wrappers.

### R-12: Hero tests repeat a layout XPath, and the role group regex is too broad
- **Severity:** Low · **Category:** test quality
- **Location:** `tests/hero.spec.ts:47`, `tests/hero.spec.ts:73`, `tests/hero.spec.ts:101`, `tests/hero.spec.ts:113`
- **Evidence:**
  ```ts
  hero(page).getByRole('group', { name: /role|rol/i }).getByRole('button', { name });
  ```
  ```ts
  .locator('xpath=ancestor::*[contains(@class,"inspect-target")]').focus();
  ```
- **Why it matters:** `/role|rol/i` also matches the other groups, whose labels read `Playwright locator: page.getByRole(...)`. It only works because those groups contain no matching button. The XPath ties three tests to a class name, in a suite that advertises strong locators.
- **Suggested fix:** Add the exact group name to the `heroes` data. Add one helper that finds a target through `getByRole('group', { name: /Playwright locator|Locator de Playwright/ })`.

### R-13: The Type section reuses a color copy key
- **Severity:** Nit · **Category:** readability
- **Location:** `src/components/DesignSystem.astro:122`
- **Evidence:**
  ```astro
  {c.color.usageNote && <p class="ds-note">{c.color.usageNote}</p>}
  ```
- **Why it matters:** The note applies to all token usage, so its home under `color` is misleading.
- **Suggested fix:** Move it to `c.tokenUsageNote`.

### R-14: `components.example` copy is never used
- **Severity:** Nit · **Category:** readability
- **Location:** `src/data/design-system.ts:483`, `src/data/design-system.ts:504`
- **Evidence:**
  ```ts
  example: 'Example', usage: 'Usage',
  ```
- **Why it matters:** A search of `src/` finds no reader for this key, so it is dead copy in both languages.
- **Suggested fix:** Delete it from both, or use it to label the examples.

### R-15: The motion table says only two things loop
- **Severity:** Nit · **Category:** readability
- **Location:** `src/data/design-system.ts:111`, `src/styles/global.css:122`
- **Evidence:**
  ```ts
  use: { en: 'Only the Inspect LED pulse and the scroll cue bob', ...
  ```
  ```css
  .hero .btn-primary:hover .icon { animation: hero-nudge 0.6s ease infinite; }
  ```
- **Why it matters:** The CTA icon also loops on hover, and at 0.6s it falls outside the documented 1.6s–1.8s range.
- **Suggested fix:** Document it or stop the loop.

### R-16: The Inspect hint promises "anything"
- **Severity:** Nit · **Category:** readability
- **Location:** `src/data/i18n.ts:19`, `src/data/i18n.ts:68`
- **Evidence:**
  ```ts
  'hero.inspect.hintOn': 'Hover or tap anything to get its Playwright locator',
  ```
- **Why it matters:** The logo, location and scroll cue have no target.
- **Suggested fix:** Say "any outlined element", or add targets for them.

### R-17: The logo test hard-codes its count
- **Severity:** Nit · **Category:** test quality
- **Location:** `tests/design-system.spec.ts:67`
- **Evidence:**
  ```ts
  await expect(images).toHaveCount(7);
  ```
- **Why it matters:** Adding a logo fails this test for a reason unrelated to the logo loading.
- **Suggested fix:** Import `logos` and use `logos.length`.

## Test suite assessment
- **Strengths:** `tests/hero.spec.ts:31-43` runs each offered locator as real code for both roles, which is the right oracle. Both copy outcomes are covered (lines 98-116), the failure path uses a rejecting clipboard, and axe runs with a tip open (lines 152-160). `tests/pages.ts` and `tests/i18n.spec.ts` include the new routes. The new blog posts are `draft: true`, so leaving them out of `pages.ts` looks correct, assuming drafts aren't built.
- **Coverage gaps:**
  - The table of contents at mobile width (R-01).
  - Reduced motion on `/design-system/` (R-02).
  - Focus visibility and focus return after Esc (R-03, R-08).
  - The no-JS hero on `/es/`, since `tests/hero.spec.ts:164-177` only covers `/`.
  - WebKit, since both Playwright projects run Chromium (see Needs verification).
- **Assertion quality:**
  - R-06 is the weakest test.
  - `tests/design-system.spec.ts:49` accepts any non-zero number of ratios, so a dropped pair passes. Compare against `contrastPairs.length * 2`.
  - The ratio is checked after `toFixed(2)`, so 4.496 passes as 4.50. Keep the raw value or round down.
  - `tests/design-system.spec.ts:90-93` only proves that a removed class stays absent, so it adds little.
- **Flakiness:** I found no fixed sleeps. Assertions on the hero mostly use auto-retrying locators, and tests that measure geometry disable motion or set up their own viewport. This is from reading only; the suite wasn't run.

## Needs verification
1. **iOS tap behavior:** Inspect mode is on by default, and `mouseover` adds a tip to the DOM (`Hero.astro:151-173`, `Hero.astro:232-235`). WebKit may treat that content change as a hover and swallow the first tap's click on Download CV, Get in touch and the role buttons. To confirm, tap each control once on an iPhone or in a WebKit mobile Playwright project. If it reproduces, this is High.
2. **Tooltip stacking when flipped below:** `.hero-panel > *` uses `animation ... both`, which should create a stacking context per child, and the `:has(.hit)` raise on line 97 only applies to `.rise`. A description tip flipped by `.below` could paint under the skills chips. To confirm, scroll until the description is near the sticky header, focus it and take a screenshot.
3. **Spoken output for R-04:** Confirm with VoiceOver or NVDA by focusing the description target.
4. **Suite status:** Run `npm test` on the current tree. I couldn't run it, and the file changed during the review.

## Strengths
- `src/components/Hero.astro:150-173` adds the tip only while it's open, so its text can't pollute the locators it offers. The reason is stated in a comment.
- `src/components/Hero.astro:126-133` confirms a copy only after the clipboard call succeeds, and gives a manual fallback if it fails.
- `src/data/design-system.ts:15-21` and `:70-75` compute the published contrast ratios from the tokens, including alpha compositing, rather than hand-typing them.
- `tests/design-system.spec.ts:13-28` lets the browser normalize both colors before comparing them, which holds up against minified CSS.
- `src/data/i18n.ts` and `pageCopy` have matching keys in English and Spanish for everything added.
