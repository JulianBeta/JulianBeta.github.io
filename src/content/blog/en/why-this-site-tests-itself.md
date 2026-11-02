---
title: 'Why my portfolio site has a test suite'
description: 'A QA engineer’s website should practice what it preaches: E2E, accessibility and link checks gating every deploy.'
date: 2026-11-01
tags: ['Playwright', 'Accessibility', 'CI/CD']
translation: 'por-que-este-sitio-se-prueba-a-si-mismo'
---

A portfolio site is a small product. It has users (recruiters, hiring managers, peers), critical
paths (read the profile, download the CV, get in touch) and regressions that hurt (a broken CV
link is a lost opportunity). So I treat it like any product I would test.

## What runs on every push

Before GitHub Pages publishes anything, a GitHub Actions job builds the site and runs a
Playwright suite against the production build:

- **Smoke & content:** both language versions render the profile, experience and projects.
- **Critical paths:** the CV download returns a real PDF; the language switch keeps you on the
  equivalent page; every internal link resolves.
- **Accessibility:** [axe-core](https://github.com/dequelabs/axe-core) scans each page and fails the
  build on WCAG A/AA violations.
- **SEO basics:** canonical URLs, `hreflang` alternates and meta descriptions are asserted, not assumed.

If any check fails, the deploy job never starts. Same rule I apply at work: **quality is a gate,
not a report you read afterwards.**

## Why bother for a static site?

Because the cheapest place to show how you work is your own code. The
[source is on GitHub](https://github.com/JulianBeta/JulianBeta.github.io) — the tests are the most
interesting part.
