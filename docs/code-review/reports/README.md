# Code review reports

Reports written by the [code-reviewer agent](../README.md), newest first. Each report is a snapshot of the code on
its date; findings are tracked here until fixed.

| Date | Scope | Critical | High | Medium | Low | Nit | Report |
|---|---|---:|---:|---:|---:|---:|---|
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
