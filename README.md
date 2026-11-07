# julianbeta.github.io

[![Test & Deploy](https://github.com/JulianBeta/JulianBeta.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/JulianBeta/JulianBeta.github.io/actions/workflows/ci.yml)

Personal site of **Julian Betancourt Cuervo**, Senior QA Automation Engineer.
Live at **https://julianbeta.github.io** (English) and **/es/** (Español).

A QA engineer's portfolio should be tested like a product, so this one is: every push runs a
Playwright suite against the production build, and GitHub Pages only deploys if it passes.

## What's on the site

| Section | Content |
|---|---|
| Hero | Name, role switch (Senior QA Automation Engineer / QA Lead) and Inspect mode, which reveals a working Playwright locator for each element (EN + ES) |
| About, Experience, Skills | Summary and career stats, career timeline, skills and certifications (EN + ES) |
| Projects | Portfolio repos: this site, [playwright-pom-saucedemo](https://github.com/JulianBeta/playwright-pom-saucedemo), [Coda · LLM evals](https://github.com/JulianBeta/composition-coach-llm-evals) (in progress) and planned work |
| Development Collaborations | Freelance sites with their development and testing stacks: Gloria Norato, Laura Moth, Juan Pablo Huston |
| Blog | Bilingual posts with RSS feeds (`/rss.xml`, `/es/rss.xml`) |
| Design system | Full documentation of the tokens, components and rules, with live examples (`/design-system/`, `/es/design-system/`) |
| CV | Two-page CV generated from the site data, as web pages (`/cv/`, `/es/cv/`) and downloadable PDFs |

## What's tested

| Suite | Checks |
|---|---|
| `tests/home.spec.ts` | Profile, experience and projects render; brand fonts load; CV download serves the right PDF per language; contact links; in-page navigation |
| `tests/hero.spec.ts` | Role switch; **every locator Inspect mode offers finds exactly one visible element** in both roles and languages; hover, keyboard and touch; clipboard success and failure; reduced motion; 320px screens; no JavaScript; accessibility with a tip open |
| `tests/design-system.spec.ts` | Documented colors match the live CSS variables; every token and component is documented; text pairs reach 4.5:1 in both themes; no overflow at 320px |
| `tests/i18n.spec.ts` | Language switch round-trips EN ⇄ ES on every page type |
| `tests/quality.spec.ts` | axe-core WCAG 2.1 A/AA scan, SEO metadata (canonical, hreflang, description), internal links return 200, anchors resolve, RSS feeds, 404 page (links resolve, `noindex`) |
| `tests/cv.spec.ts` | CV content rules (current role first, certifications only, Coda project listed, no freelance collaborations), brand fonts, `noindex`, accessibility, two printed pages; **committed PDFs** match the current CV text and fit on two pages |
| `tests/brand.spec.ts` | Favicons, web manifest icons and the social image are served; logo in header, divider and footer; accessible icon links |
| `tests/collaborations.spec.ts` | Collaborations section in both languages: one card per client, live-site links, repo links only for public repos, testing stack only where tests exist, screenshots served |
| `tests/fonts.ts`, `tests/pages.ts` | Helpers: a font check that fails when a font isn't really loaded; the list of routes that get smoke + accessibility coverage |

Runs on desktop Chromium and a mobile viewport (Pixel 7).

## Stack

[Astro](https://astro.build) (static; the only client JavaScript is the hero's small, dependency-free script) · TypeScript · Fontsource (Oswald, Nunito) · Tabler Icons via Iconify ·
Playwright · @axe-core/playwright · GitHub Actions · GitHub Pages

## Run locally

```bash
npm install
npx playwright install chromium
npm run dev          # http://localhost:4321
npm run build        # type-check + static build into dist/
npm test             # Playwright against the built site
npm run cv           # rebuild and regenerate both CV PDFs (see below)
```

## Editing content

- Profile, experience, skills, certifications, projects and collaborations: [`src/data/profile.ts`](src/data/profile.ts)
  (EN + ES side by side). Collaboration screenshots live in `public/img/collab/`.
- UI strings: [`src/data/i18n.ts`](src/data/i18n.ts)
- Design system: tokens in [`src/data/design-system/tokens.json`](src/data/design-system/tokens.json), component docs in
  [`src/data/design-system.ts`](src/data/design-system.ts). `tests/design-system.spec.ts` fails if a documented color no longer
  matches `src/styles/global.css`.
- Blog posts: `src/content/blog/{en,es}/*.md`. Set `translation:` in the frontmatter to the slug of the other-language
  version so the language switch links them.
- New routes must be added to [`tests/pages.ts`](tests/pages.ts) to get smoke + accessibility coverage.
- CV (English + Spanish): generated from the same `profile.ts` data; layout lives in `src/components/CV.astro`. After
  editing, run `npm run cv` to regenerate both PDFs and `public/cv/cv-manifest.json`, then commit them.
  `tests/cv.spec.ts` fails if the committed PDFs no longer match the CV **text** or are longer than two pages.
- Brand: palette Ink Black `#011627`, Hot Fuchsia `#FF3366`, Light Sea Green `#2EC4B6`, Bright Snow `#F6F7F8`, Blue Bell
  `#20A4F3`; fonts Oswald (headings) and Nunito (text). Logo: `src/components/Logo.astro`; icons:
  `src/components/Icon.astro`.

## Code review

A read-only **code-reviewer** subagent for Claude Code reviews the code and the tests for bugs and readability:
[`.claude/agents/code-reviewer.md`](.claude/agents/code-reviewer.md). Run `/review-site` (whole repo), `/review-site tests`
or `/review-site changes`; reports and their triage are kept in [`docs/code-review/`](docs/code-review/README.md).
None of this is part of the published site.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml): type-check, build and the full Playwright suite on every push and
pull request; on `main`, deploy to GitHub Pages only when everything passes. Pages permissions are granted to the deploy
job only, and a running deploy is never cancelled by a newer push.
