---
title: 'From 2 to 99 scenarios: rebuilding my Playwright framework for Swag Labs'
description: 'An old CucumberJS repo moved to Playwright Test + playwright-bdd in TypeScript: 99 scenarios, 3 browsers, 16 documented bugs and a report published by CI.'
date: 2026-11-03
tags: ['Playwright', 'BDD', 'TypeScript']
draft: true
translation: 'de-2-a-99-escenarios-playwright-swag-labs'
---

I had a repo on GitHub with Playwright and CucumberJS against [saucedemo.com](https://www.saucedemo.com),
Sauce Labs' demo e-commerce site. It was my strongest automation repo, and it still had only two
scenarios: a login-and-cart happy path and an intentional failure. It used old APIs (`$$`, `isVisible`,
hand-written `if/throw` checks), didn't run in CI, and most of its files were generated reports that
should never have been in git.

For someone who calls himself a Playwright SME, that didn't add up. So I rebuilt it from scratch.
The result is [playwright-pom-saucedemo](https://github.com/JulianBeta/playwright-pom-saucedemo):
99 BDD scenarios on Chromium, Firefox and WebKit, with a
[live report](https://julianbeta.github.io/playwright-pom-saucedemo/) that CI publishes on every run.

[COMPLETAR: how long it took and whether you used AI (Copilot, Claude, Playwright MCP) along the way. If you did, say so: it fits your AI-assisted testing profile.]

## Explore first, automate second

Before writing any code I walked the site as all six demo users, using script-driven exploration,
and built a map: pages, flows, error messages and odd behavior per user. That's where things showed up
like `problem_user` seeing the same image for every product, `error_user` whose Finish button never
completes the order, `visual_user` getting different prices on every load, and the one that surprised
me most: `standard_user` can check out with an empty cart and place a $0.00 order.

That map became the feature proposal first, and later the coverage matrix in the README.

## The decisions that mattered most

**Playwright Test + playwright-bdd instead of CucumberJS.** I wanted to keep Gherkin but get
everything the official runner brings: fixtures, auto-waiting `expect`, traces, sharding and UI mode.
playwright-bdd generates Playwright specs from the `.feature` files, and with
`missingSteps: 'fail-on-gen'` an unimplemented step breaks generation, not the run.

**Page Object Model with components.** Page objects expose locators and actions; assertions live in
the steps. Header, side menu, footer and the product card are shared components. Every locator uses
`data-test` attributes or ARIA roles, no fragile CSS selectors.

**Fast, independent setup.** Only the login tests use the login form. Everything else starts the
session by setting the app's cookie and seeds the cart through `localStorage`, so every scenario is
independent and doesn't pay for a UI login.

**An independent oracle for totals.** Subtotal, 8% tax and total are checked against a product
catalog in the test data (with money calculated in cents), not against numbers read back from the
page. If the page gets the math wrong, comparing the page with itself will never catch it.

**Zero sleeps.** Auto-waiting locators, `expect.poll` for async lists, and `page.clock` to control the
auto-rotating slider. Without `page.clock`, that test depends on getting lucky with timing.

## Known bugs as expected failures

This is my favorite decision in the project. I found 16 real defects, and each one has a report in
`docs/bugs/` and a scenario that describes the **correct** behavior, tagged `@known-bug @fail`:

```gherkin
@fail @BUG-005
Scenario: The last name field accepts input
  Given my cart contains "Sauce Labs Backpack"
  And I am on the checkout information page
  When I type "Betancourt" into the last name field
  Then the last name field should contain "Betancourt"
```

The suite stays green while the bug exists. The day it gets fixed, Playwright reports that the test
was expected to fail but passed, and that's the signal to close the bug and remove the tag. I find
that much better than commenting the test out, or leaving the pipeline red until the whole team learns
to ignore it.

## Visual, accessibility and CI

Visual regression uses `toHaveScreenshot()` on 7 screens, with dynamic text masked and Chromium only,
because baselines depend on the browser. For `visual_user`, the test compares against the standard
user's baseline, and that's where the different layout shows up. Accessibility is checked by axe-core
on the same screens: WCAG 2.1 AA must pass, and best-practice findings are attached to the report
instead of breaking the build.

In GitHub Actions, format, lint and type checks run first; then 3 browsers × 2 shards, the reports
are merged into one HTML report and published to GitHub Pages. It also runs once a day against the
live site. Locally, Husky and lint-staged run ESLint (with `eslint-plugin-playwright`) and Prettier
before every commit.

## What I learned and what I'd do differently

Visual baselines depend on the operating system too: what renders on my Mac is not pixel-for-pixel
what Linux renders in CI. So baselines are stored per OS, and the workflow has an `update_snapshots`
option to refresh the Linux ones after an intended UI change.

[COMPLETAR: the hardest part of the rebuild, or what taught you the most, in your own words.]

[COMPLETAR: what you'd do differently or what's next. Idea from the plan: an API layer and a Screenplay variant in a bigger framework, or generating scenarios with Playwright MCP and comparing.]

## Try it

You need Node.js 20+:

```bash
git clone https://github.com/JulianBeta/playwright-pom-saucedemo
cd playwright-pom-saucedemo
npm install
npx playwright install
npm run test:smoke        # @smoke only
npm run test:known-bugs   # @known-bug scenarios only
npm run test:ui           # Playwright UI mode
```

If you see something you'd do differently, the repo is open. I care more about that conversation
than about stars.
