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
| R-01 | open | Confirmed: `document.fonts.check()` returns `true` when no face matches, so the font tests can't fail. |
| R-02 | open | Confirmed: the 404 page's language switch links to `/es/404/`, which doesn't exist. |
| R-03 | **invalid** | `tests/collaborations.spec.ts` covers both languages, links, private-repo rule, testing chips and screenshots. |
| R-04 | **partial** | `tests/brand.spec.ts` checks favicons, manifest icons and the OG image; collaboration screenshots are checked too. Still open: the generic link checker only follows `<a href>`. |
| R-05 | open | Committed CV PDFs aren't compared with the current data. |
| R-06 | open | Confirmed: workflow-wide `pages: write`/`id-token: write` and `cancel-in-progress: true`. |
| R-07 – R-17 | open | Not yet triaged in detail. |
