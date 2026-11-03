# julianbeta.github.io

[![Test & Deploy](https://github.com/JulianBeta/JulianBeta.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/JulianBeta/JulianBeta.github.io/actions/workflows/ci.yml)

Personal site of **Julian Betancourt Cuervo**, Lead QA Automation Engineer.
Live at **https://julianbeta.github.io** (English) and **/es/** (Español).

A QA engineer's portfolio should be tested like a product, so this one is: every push runs a
Playwright suite against the production build, and GitHub Pages only deploys if it passes.

## What's tested

| Suite | Checks |
|---|---|
| `tests/home.spec.ts` | Profile, experience and projects render; CV download is a real PDF; contact links; in-page navigation |
| `tests/i18n.spec.ts` | Language switch round-trips EN ⇄ ES on every page type |
| `tests/cv.spec.ts` | CV page content rules, noindex, accessibility, fits on two printed pages |
| `tests/quality.spec.ts` | axe-core WCAG 2.1 A/AA scan, SEO metadata (canonical, hreflang, description), all internal links return 200, anchors resolve, 404 page |

Runs on desktop Chromium and a mobile viewport (Pixel 7).

## Stack

[Astro](https://astro.build) (static, zero JS shipped) · TypeScript · Playwright · @axe-core/playwright · GitHub Actions · GitHub Pages

## Run locally

```bash
npm install
npx playwright install chromium
npm run dev          # http://localhost:4321
npm run build        # type-check + static build into dist/
npm test             # Playwright against the built site
```

## Editing content

- Profile, experience, skills, certifications, projects: [`src/data/profile.ts`](src/data/profile.ts) (EN + ES side by side)
- UI strings: [`src/data/i18n.ts`](src/data/i18n.ts)
- Blog posts: `src/content/blog/{en,es}/*.md`. Set `translation:` in the frontmatter to the slug of the other-language version so the language switch links them.
- New routes must be added to [`tests/pages.ts`](tests/pages.ts) to get smoke + accessibility coverage.
- CV: generated from the same `profile.ts` data. Edit the data (layout lives in `src/pages/cv.astro`), then run `npm run cv` to regenerate `public/cv/Julian-Betancourt-CV.pdf` and commit it. `tests/cv.spec.ts` keeps it to two pages.
