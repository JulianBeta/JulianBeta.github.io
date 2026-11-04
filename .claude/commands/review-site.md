---
description: Run the read-only code-reviewer agent and save its report under docs/code-review/reports/
argument-hint: "[scope: all (default) | tests | a folder or files | changes]"
---

Review this repository with the **code-reviewer** subagent and save the report.

1. Scope: `$ARGUMENTS`. If it is empty, the scope is the whole repository as defined in
   `.claude/agents/code-reviewer.md`. If it is `changes`, list the files changed on the current branch
   (`git diff --name-only origin/main...HEAD` plus uncommitted changes) and pass that list to the agent, because the
   agent cannot run git.
2. Invoke the `code-reviewer` subagent with the scope and today's date. Do not review the code yourself.
3. Save its report, unchanged, to `docs/code-review/reports/<YYYY-MM-DD>-<scope-slug>.md` (add `-2`, `-3`… if the
   file exists), and add a row for it at the top of the table in `docs/code-review/reports/README.md`.
4. Reply with the report's path, the severity counts, and the three most important findings. Do not fix anything
   unless the user asks; if they do, fix findings one at a time and run `npm test` after each.
