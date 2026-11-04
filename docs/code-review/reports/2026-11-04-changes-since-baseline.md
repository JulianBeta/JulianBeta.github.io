# Code review: Changes since baseline (e15a9a2..HEAD: ddfdcef, 40b77c5, 811f041, c751b16)

- **Date:** 2026-11-04
- **Scope:** Fixes for baseline findings R-01, R-02, R-05, R-06, R-09 (part), R-14 and R-17, plus a review of the changed code: `.github/workflows/ci.yml`, `README.md` (the CV and test sections), `package.json`, `public/cv/cv-manifest.json`, `scripts/build-cv.mjs`, `scripts/cv-fingerprint.mjs`, `src/layouts/Base.astro`, `src/pages/404.astro`, `tests/cv.spec.ts`, `tests/fonts.ts`, `tests/home.spec.ts`, `tests/quality.spec.ts`. For context I also read `src/components/CV.astro`, `playwright.config.ts` and `tsconfig.json`.
- **Files reviewed:** 15 (5 of them tests or test config)
- **Verdict:** Every claimed fix does what it says, and none adds a real bug. The remaining issues are a stale-PDF check that only compares page text, and a 404 test that does not check the language-switch target directly.

## Summary
The fixes are small, well commented and aimed at the right problems. The CI permissions and concurrency now match GitHub's Pages guidance. The 404 page now has a working language switch and is kept out of search indexes. The font helper can now fail. The committed CV PDFs are now checked by tests, both for freshness (via a text fingerprint) and for page count. The main thing still open is how far the stale-PDF check reaches: it fingerprints only `document.body.innerText`. A change to CV styling, the logo, icons or a link target alone does not change the fingerprint, so the README now claims more than the test checks. Second, the new 404 test would still pass if the language switch pointed to the wrong (but existing) page. Fix those two first. Everything else is Low or Nit.

**Fix verification**

| Finding | Verdict | Evidence |
|---|---|---|
| R-01 Font tests cannot fail | **Fixed** | `tests/fonts.ts:10-14` waits for `document.fonts.ready` and counts FontFaces of the exact family with `status === 'loaded'`. If the Fontsource import is missing, the count is 0. If a woff2 returns 404, the face's status is `error`. Either way the assertion fails. Both `home.spec.ts:19-20` and `cv.spec.ts:35-36` use the helper. The `toHaveCSS` checks stay as extra checks of the declared stack. |
| R-02 404 language switch and hreflang | **Fixed** | `404.astro:6` passes `altPath="/es/" noindex`. `Base.astro:47-56` drops the canonical and alternate links and adds `robots noindex`. `quality.spec.ts:51-58` checks that the canonical/alternate links are absent and that every link resolves to 200. The test's assertion on the switch target is weak, see R-19. |
| R-14 `lang` on "Inicio" | **Fixed** | `404.astro:11` has `lang="es" hreflang="es"`. No test checks it (see R-19). |
| R-06 CI permissions and concurrency | **Fixed** | Top level is `contents: read` only (`ci.yml:10-11`). `pages`/`id-token: write` are set on the `deploy` job only (`ci.yml:49-51`). `cancel-in-progress` is true only for `pull_request` (`ci.yml:16`). The Pages artifact is uploaded only on `main` (`ci.yml:40`). |
| R-05 Stale committed PDFs | **Fixed, with a gap** | Manifest freshness test at `cv.spec.ts:71-75` and committed page-count test at `cv.spec.ts:77-82`, with a `> 0` guard against the compressed-object case. The fingerprint covers text only, see R-18. |
| R-17 `npm run cv` skips type-check | **Fixed** | `package.json:11`: `"cv": "npm run build && node scripts/build-cv.mjs"`. |
| R-09 (part) browser leak and hidden server errors | **Partially fixed, as claimed** | `build-cv.mjs:14,39` closes the browser in `finally`. Line 13 inherits stderr. The script still waits about 15 s when the server dies on start, and it still does not check the page count before writing the PDF, see R-20. |

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 3 |
| Nit | 4 |

## Findings

### R-18: The stale-PDF check only fingerprints visible text, so visual or link-only CV changes go undetected
- **Severity:** Low · **Category:** test quality
- **Location:** `scripts/cv-fingerprint.mjs:6-9`, `tests/cv.spec.ts:63-75`, `README.md:42`
- **Evidence:**
  ```js
  const text = await page.evaluate(() => document.body.innerText);
  return createHash('sha256').update(text.replace(/\s+/g, ' ').trim()).digest('hex');
  ```
  ```md
  `tests/cv.spec.ts` fails if the committed PDFs are out of date with the CV pages or longer than two pages.
  ```
- **Why it matters:** The fingerprint does not change for edits to the `<style is:global>` block in `src/components/CV.astro:64-159`, to `Logo`/`Icon`, or to `href`s whose displayed text stays the same. For example, `p.repo` is shown only as its last path segment (`CV.astro:243`), so changing the repo owner changes the link but not the text. Any of these leaves an outdated PDF in `public/cv/` while the tests stay green. The fingerprint also says nothing about the committed PDF files themselves: it compares the manifest with the page. If the manifest is regenerated and committed without the PDFs, the test passes. Both cases are unlikely, but the README sentence promises more than this.
- **Suggested fix:** Either narrow the README and the comment at `cv.spec.ts:63-64` to "out of date with the CV text", or make the fingerprint cover more. One way is to hash `document.documentElement.outerHTML` after stripping the random Logo mask id (baseline R-13), which would catch style and `href` changes. To link the manifest to the files, also record each PDF's page count or byte length and assert it in the committed-PDF test.

### R-19: The 404 test does not pin the language-switch target or the `lang` fix
- **Severity:** Low · **Category:** test quality
- **Location:** `tests/quality.spec.ts:55-57`
- **Evidence:**
  ```ts
  const hrefs = await page.locator('main a[href], [data-testid="lang-switch"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  expect(hrefs).toContain(new URL('/es/', page.url()).href);
  for (const href of new Set(hrefs)) expect.soft((await request.get(href)).status(), href).toBe(200);
  ```
- **Why it matters:** The "Inicio" button in `<main>` (`404.astro:11`) already satisfies `toContain('/es/')`, so that assertion says nothing about the language switch. The 200 loop does catch the original bug, because `/es/404` returns 404. But if `altPath` were changed to `"/"` or any other existing page, the test would still pass while the "Español" link goes to the wrong language. R-14's `lang="es"` has no assertion at all, and the 404 page gets no axe scan, unlike every route in `tests/pages.ts`.
- **Suggested fix:**
  ```ts
  await expect(page.getByTestId('lang-switch')).toHaveAttribute('href', '/es/');
  await expect(page.locator('main').getByRole('link', { name: 'Inicio' })).toHaveAttribute('lang', 'es');
  ```
  Keep the 200 loop. Optionally add the same `AxeBuilder` scan used in `quality.spec.ts:9-10`.

### R-20: `build-cv.mjs` still waits for a dead server and writes PDFs without checking their length
- **Severity:** Low · **Category:** readability
- **Location:** `scripts/build-cv.mjs:13-22`, `scripts/build-cv.mjs:30`
- **Evidence:**
  ```js
  const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], { stdio: ['ignore', 'ignore', 'inherit'] });
  ...
    if (i > 60) throw new Error(`Preview server did not start on ${base}`);
  ```
- **Why it matters:** The server's stderr now shows the cause, which is good, but if the server process exits at once (for example, port 4330 in use) the loop still polls for about 15 s before failing. The script also writes and copies a three-page PDF without complaint. The developer finds out only when `npm test` fails the committed-PDF test (`cv.spec.ts:77-82`), after the PDF has already replaced the good one. These are the two parts of R-09 still open, as the commit message says.
- **Suggested fix:** Fail fast with `server.once('exit', (code) => { if (code) … })`, or check `server.exitCode !== null` inside the loop. Before `page.pdf({ path: out, … })`, call `page.pdf()` without a path, count pages with the same regex the test uses (ideally from a shared helper in `cv-fingerprint.mjs`), and throw if the count is over 2.

### R-21: The test hard-codes the manifest path that the script already exports
- **Severity:** Nit · **Category:** readability
- **Location:** `tests/cv.spec.ts:5`, `tests/cv.spec.ts:66`, `scripts/cv-fingerprint.mjs:16`
- **Evidence:**
  ```ts
  import { CVS, cvFingerprint } from '../scripts/cv-fingerprint.mjs';
  ...
  const manifest = JSON.parse(readFileSync('public/cv/cv-manifest.json', 'utf8'));
  ```
- **Why it matters:** The test already imports `CVS` and `cvFingerprint` from this module. If the manifest moves, `MANIFEST` will be updated and the test path will not. The path is also relative to the current directory, which is true of `CVS` as well.
- **Suggested fix:** Import `MANIFEST` and use `readFileSync(MANIFEST, 'utf8')`.

### R-22: The committed-PDF tests run twice, once per Playwright project
- **Severity:** Nit · **Category:** test quality
- **Location:** `tests/cv.spec.ts:65-84`, `playwright.config.ts:15-18`
- **Evidence:**
  ```ts
  test(`${file} as committed fits on two pages`, async ({ request }) => {
  ```
- **Why it matters:** The checks do not depend on the device, but the `mobile` (Pixel 7) project runs them again, which doubles the work and the failure noise. The fingerprint is also taken at a 412 px viewport there. The CV has no width media queries today (`CV.astro:92-93`), but adding one later would fail only on mobile, and the cause would be hard to see. `cv.spec.ts:53` already skips the print test on mobile for the same reason.
- **Suggested fix:** Add `test.skip(isMobile, 'Device-independent check')`, or run this describe block in the `chromium` project only.

### R-23: `og:url` is still emitted on `noindex` pages
- **Severity:** Nit · **Category:** bug (SEO)
- **Location:** `src/layouts/Base.astro:47-56`, `src/layouts/Base.astro:65`
- **Evidence:**
  ```astro
  <meta property="og:url" content={canonical} />
  ```
- **Why it matters:** The `noindex` branch removes the canonical link, but `og:url` still advertises the build-time path of the 404 route as the page's official URL. That is harmless, but it contradicts the intent of the prop, which the comment at `Base.astro:16` describes as skipping canonical.
- **Suggested fix:** Move `og:url` inside the non-`noindex` branch.

### R-24: The README test table does not mention the new CV checks
- **Severity:** Nit · **Category:** readability
- **Location:** `README.md:17`
- **Evidence:**
  ```md
  | `tests/cv.spec.ts` | CV page content rules, noindex, accessibility, fits on two printed pages |
  ```
- **Why it matters:** The "What's tested" table is the public summary of the suite, and it leaves out the committed-PDF freshness and page-count checks and the font checks. These are now among the more interesting things the suite does.
- **Suggested fix:** Append "brand fonts load; committed PDFs match the page text and fit on two pages".

## Test suite assessment
- **Improvements:** The font checks can now fail (`tests/fonts.ts`), and both home and CV share one helper, as the baseline suggested. The committed PDFs are now under test (`cv.spec.ts:65-84`). The `toBeGreaterThan(0)` guard at line 80 closes the "regex finds nothing, test always passes" hole that the baseline listed under Needs verification, at least for the committed files. The 404 page now has its own test for `noindex`, absent alternates and resolvable links (`quality.spec.ts:51-58`). Failure messages are actionable: the freshness test's name says to run `npm run cv`, and its assertions carry labels (`'page objects found'`, `` `${file} fingerprint` ``).
- **Gaps:** The fingerprint covers text only (R-18). The 404 language-switch target and `lang` attribute are not checked directly, and the 404 page gets no axe scan (R-19). The two-page check of the live HTML (`cv.spec.ts:56-58`) still has no `> 0` guard, unlike the new committed-PDF test.
- **Flakiness:** Low. `expectFontLoaded` waits for `document.fonts.ready`. The fingerprint does not depend on timing, since `innerText` does not depend on fonts and `CV.astro` renders no dates or random text. `Logo`'s random id is in an attribute, not in the text. The manifest is read at collection time, so if the file is missing the whole spec file fails to load. That is loud, which is acceptable.
- **Assertion quality:** Good overall. The only weak assertion is the `toContain('/es/')` covered in R-19.

## Needs verification
- **The manifest hashes match the current build.** I cannot run the suite. Run `npm run build && npx playwright test tests/cv.spec.ts` and confirm the two `is up to date` tests pass on a clean checkout, in CI as well as locally (Node 22, Linux Chromium). `innerText` should be the same across operating systems, but a difference in how text-transform or whitespace is serialized would show up only in CI.
- **Astro preview writes startup errors to stderr.** `build-cv.mjs:13` ignores stdout. If Astro's logger sends errors such as `EADDRINUSE` to stdout, they are still hidden. To confirm, start a server on 4330 first, then run `npm run cv`.
- **`server.kill()` reaches the Astro process.** `build-cv.mjs:40` sends a signal to `npx`. That code is unchanged, but it belongs to the R-09 cleanup. After `npm run cv` finishes, run `lsof -i :4330` and check that nothing is still listening. If something is, a later run's readiness probe (`build-cv.mjs:18`) could succeed against the leftover server.
- **`astro check` covers the `.mjs` import from TypeScript.** `tsconfig.json` includes `**/*`, so `tests/cv.spec.ts` importing `../scripts/cv-fingerprint.mjs` relies on `allowJs` from `astro/tsconfigs/strict`. CI's `npm run build` passing would confirm it.

## Strengths
- The CI changes are least-privilege and leave clear comments explaining the reasoning (`ci.yml:9-16`, `ci.yml:44-51`).
- `noindex` is one typed prop on `Base`, documented at `Base.astro:16-17`, so other utility pages can reuse it.
- The comment in `tests/fonts.ts:3-8` explains why the obvious assertions do not work. That stops someone from "simplifying" the helper back into a test that cannot fail.
- `scripts/cv-fingerprint.mjs` is a single source of truth for the CV list, the manifest location and the fingerprint algorithm, shared by the generator and the tests. The comment at lines 1-3 explains why the PDFs are not compared byte for byte.
- `build-cv.mjs:33,37` also refreshes `dist/`, so a local `npm test` right after `npm run cv` checks the new files instead of stale copies.
