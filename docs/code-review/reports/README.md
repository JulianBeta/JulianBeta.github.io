# Code review reports

Reports written by the [code-reviewer agent](../README.md), newest first. Each report is a snapshot of the code on
its date; findings are tracked here until fixed.

| Date | Scope | Critical | High | Medium | Low | Nit | Report |
|---|---|---:|---:|---:|---:|---:|---|
| 2026-11-07 | Hero, Inspect mode and design system changes (uncommitted) | 0 | 1 | 6 | 5 | 5 | [2026-11-07-hero-design-system.md](2026-11-07-hero-design-system.md) |
| 2026-11-04 | Changes since baseline (`e15a9a2..c751b16`) | 0 | 0 | 0 | 3 | 4 | [2026-11-04-changes-since-baseline.md](2026-11-04-changes-since-baseline.md) |
| 2026-11-04 | Whole repository (baseline) | 0 | 0 | 6 | 6 | 5 | [2026-11-04-baseline.md](2026-11-04-baseline.md) |

## Triage

Findings are checked against the code before anyone acts on them. Status: **open**, **fixed**, **invalid** (the
finding is wrong), **partial** (part of it is already covered).

### 2026-11-04 baseline

This run used a stand-in for the agent (the agent wasn't loaded in that session yet), and it had no Glob/Grep, so
it found files only by following imports. It missed `tests/brand.spec.ts` and `tests/collaborations.spec.ts`.

| ID | Status | Note |
|---|---|---|
| R-01 | **fixed** | `tests/fonts.ts` requires a loaded FontFace; verified to fail when a font import is removed (`811f041`). |
| R-02 | **fixed** | 404 switch goes to `/es/`, page is `noindex` without canonical/alternates; test verified against the old code (`ddfdcef`). |
| R-03 | **invalid** | `tests/collaborations.spec.ts` covers both languages, links, private-repo rule, testing chips and screenshots. |
| R-04 | **partial** | `tests/brand.spec.ts` checks favicons, manifest icons and the OG image; collaboration screenshots are checked too. Still open: the generic link checker only follows `<a href>`. |
| R-05 | **fixed** | `npm run cv` writes a text fingerprint to `public/cv/cv-manifest.json`; tests compare it with the live CV and count the committed PDFs' pages. Verified with an unregenerated data change. |
| R-06 | **fixed** | Pages permissions only on the deploy job; runs cancel only on pull requests; Pages artifact only uploaded for deploys (`40b77c5`). |
| R-09 | **partial** | `build-cv.mjs` now closes the browser in `finally` and shows server errors; no page-count check in the script (the tests cover it). |
| R-14 | **fixed** | "Inicio" link on the 404 page has `lang`/`hreflang` (`ddfdcef`). |
| R-17 | **fixed** | `npm run cv` runs the type-checked build first. |
| R-07, R-08, R-10 – R-13, R-15, R-16 | open | Not yet triaged in detail. |

### 2026-11-04 changes since baseline

First run of the real `code-reviewer` agent (with Glob/Grep). It verified the fixes for R-01, R-02, R-05, R-06, R-14
and R-17, and R-09 as partly fixed.

| ID | Status | Note |
|---|---|---|
| R-18 | **partial** | README now says the freshness check covers the CV *text*; extending the fingerprint to styles/links is open. |
| R-19 | open | 404 test should assert the switch `href` and `lang="es"` directly. |
| R-20 | open | `build-cv.mjs`: fail fast if the server exits; check page count before writing. |
| R-21 | open | Import `MANIFEST` in the test instead of repeating the path. |
| R-22 | open | Run device-independent CV checks on one project only. |
| R-23 | open | Drop `og:url` on `noindex` pages. |
| R-24 | **fixed** | README test table lists the font and committed-PDF checks. |

### 2026-11-07 hero and design system

IDs here restart at R-01 and refer only to this report. The tests added for these fixes ran against the fixed code; they were not run against the old code.

| ID | Status | Note |
|---|---|---|
| R-01 | **fixed** | Header `nav` rules scoped to `.site-header`; table of contents tested on both projects. |
| R-02 | **fixed** | Reduced motion covers `.ds-example`; the scroll cue now bobs twice and stops; tested. |
| R-03 | **fixed** | Solid 3px focus ring on inspect targets; tested after Esc. |
| R-04 | **fixed** | `aria-live` removed from the panels. A status element was tried and dropped: its copy of the text broke the offered locator. Not checked with a real screen reader. |
| R-05 | **fixed** | Copy and the language switch are 44px; the rule now exempts links in text and lists; tested. |
| R-06 | **fixed** | Type requires `markup` or `usage`; the test checks count and non-empty code. |
| R-07 | **fixed** | Docs copy changed: Light is a reference palette and the drift claim covers dark only. The CV's colors were left as they are. |
| R-08 | **fixed** | Esc returns focus to the selected role; tested. |
| R-09 | **fixed** | Outlines require `html.js`; tested. |
| R-10 | **fixed** | Hero chips marked `lang="en"`; Voice rule now keeps skill tags in English. |
| R-11 | **fixed** | Code blocks have `role="group"`. |
| R-12 | **fixed** | Exact group names and a `textTarget` helper replace the regex and XPath. |
| R-13 – R-17 | **fixed** | Copy key moved, dead key removed, CTA icon nudges once, hint says "outlined element", logo count read from the data. |
| Needs verification 1 | **partial** | Tip opening on `mouseover` limited to `(hover: hover)` devices, which removes the suspected cause. Not tested on a real iPhone or in WebKit. |
| Needs verification 2 | **fixed** | The open target is raised; tested with a tip flipped below. |
