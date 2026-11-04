# Code review agent

This repository includes a **read-only code-reviewer subagent** for [Claude Code](https://code.claude.com). It reviews
the site's code **and its tests** for bugs and readability, and writes a Markdown report. Nothing in `.claude/` or
`docs/` is part of the built site, so visitors never see it.

| File | Purpose |
|---|---|
| [`.claude/agents/code-reviewer.md`](../../.claude/agents/code-reviewer.md) | The agent: scope, checklist, severity scale and report format |
| [`.claude/commands/review-site.md`](../../.claude/commands/review-site.md) | `/review-site` command: runs the agent and saves the report |
| [`reports/`](reports/README.md) | Saved reports, newest first |

## Running it

In Claude Code, from the repository root:

```text
/review-site                 # whole repository, including tests
/review-site tests           # only the test suite and Playwright config
/review-site src/components  # one folder (or list files)
/review-site changes         # files changed on the current branch
```

You can also ask in plain words, for example *"use the code-reviewer agent on src/data"*. The report is printed
in the conversation; `/review-site` also saves it in `reports/`.

## Read-only by design

The agent has only the **Read, Grep and Glob** tools: it cannot edit files, run commands or reach the network.
That keeps reviews safe to run at any time and keeps findings separate from fixes. When you want changes, ask
Claude to fix specific findings; each fix is then made and tested (`npm test`) in the normal session, one at a time.

## What it checks

- **Bugs:** logic errors, i18n parity between English and Spanish, broken links and anchors, accessibility and SEO
  metadata, CV generation, Astro and CI pitfalls.
- **Test quality:** tests that cannot fail, missing `await`s, flaky waits and races, weak locators or assertions,
  coverage gaps.
- **Readability:** naming, dead or duplicated code, stale comments, consistency with the repository's conventions.

Every finding must quote the code it refers to with a `path:line` location; anything the agent could not confirm
without running code goes under *Needs verification* instead of being reported as a bug.

## Severity scale

| Severity | Meaning |
|---|---|
| Critical | Breaks the site, build, deploy or CV, or leaks private data |
| High | A real user-facing bug, or a test giving false confidence about important behavior |
| Medium | Edge-case bug, likely flake, meaningful coverage gap, accessibility issue |
| Low | Readability or maintainability cost |
| Nit | Small polish (at most five per report) |
