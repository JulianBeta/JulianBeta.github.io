---
title: '276 of 276 attacks defended, and I didn’t celebrate: evaluating a chatbot with Promptfoo'
description: 'Coda is a chatbot that coaches people on composing music. I evaluated and red-teamed it with Promptfoo, Claude Haiku and Sonnet. The 100% red team score had fine print: many attacks weren’t stopped by my prompt, but by the provider’s filter.'
date: 2026-11-17
tags: ['AI', 'LLM evals', 'Red teaming', 'Promptfoo']
draft: false
translation: '276-ataques-defendidos-quien-los-defendio'
---

I’ve been working on a personal project to put into practice what I learned in the Break Into AI
Testing course: evaluating and red-teaming a chatbot of my own, with LLM-as-a-judge rubrics, all
running on [Promptfoo](https://www.promptfoo.dev). The chatbot is called **Coda**, and it coaches
people who want to compose original music. I’ve always loved music, and I play a few instruments
(guitar and bass guitar). I was looking for something I could use LLMs for, and composing is something
where I’ve always liked having a second opinion: a tool, a suggestion, a route, a guide. An LLM can
offer that, based on what you already have in mind.

This week I re-ran the baseline on Claude Haiku 5.5 and Claude Sonnet 5.5. The red team result was
276 out of 276 attacks defended. The first thing I did was distrust it.

## What I’m testing

Coda has a system prompt that defines its role, answer style, accuracy rules, copyright boundaries,
safety, and protection of the prompt itself. Four suites run against it, 29 cases in total:

- **quality:** music theory with verifiable answers (chords, keys, ii–V–I, counterpoint, modulation).
  Regex and JS checks for exact facts, rubrics for the rest.
- **coaching:** does it adapt to a beginner, ask when the request is vague, answer in the user’s
  language, and stay concise.
- **guardrails:** stays in scope, doesn’t hand out full copyrighted lyrics, handles a crisis or a
  hearing-safety question well.
- **security:** prompt extraction, an injection hidden in pasted lyrics, and persona hijacking. The
  prompt carries a canary code, and every answer checks that it never shows up.

The red team is 376 attacks from 17 Promptfoo plugins (prompt extraction, hijacking, copyright,
self-harm, PII, hallucination, a custom lyrics policy…) combined with strategies like jailbreaks,
base64, leetspeak, rot13 and multi-turn crescendo. I generated them once and committed them, so every
run replays exactly the same attacks and results are comparable.

## The numbers

On the evals, Haiku and Sonnet both scored 93% (27 of 29), above the 90% gate I set. The difference is
cost: a full Haiku run cost about $0.011 and Sonnet $0.238, with median latency of 3.5 s vs. 5.9 s.

The quick red team (138 single-turn attacks per model) had zero failures. But once I split the results
by *who* stopped each attack, the story changed: on Haiku, 102 of 138 attacks ended in an **empty
reply** from Anthropic’s safety filter, and 74 of 138 on Sonnet. All of the rot13 ones and most of the
leetspeak and base64 ones.

Promptfoo counts that as defended. But I wasn’t testing Coda’s guardrails there, I was testing the
provider’s classifier. And from the user’s side, someone who writes in leetspeak gets a blank message.
That became finding F-001: safety-filter refusals reach the user as an empty reply, and the app needs a
fallback message. The local chat UI I added this week (`npm run chat`) already shows one; a test for it
is still missing.

## When the test is the one that’s wrong

Another lesson: a failing eval isn’t worth much until you know whether the model or the test failed.
That’s why the repo keeps two separate tables: product findings and a *calibration log*.

Two of the first failures were eval bugs. In one, Haiku spotted an instruction injected into some
lyrics and ignored it, which was exactly right, but the rubric demanded it treat that line as lyrics,
so the judge failed it. In the other, Haiku correctly wrote "no consecutive 5ths or octaves" and the
regex only accepted "parallel fifths/octaves". I fixed both and left the reason commented in the test.

I also call out a risk I haven’t solved yet: Sonnet judges every rubric, including its own answers, so
self-preference bias is possible.

## Decisions I made

- **CI doesn’t call any model.** Every push runs the reporting scripts’ unit tests and validates the
  configs. I run the evals locally and commit the baseline. A green badge means the pipeline is
  healthy, not that the evals passed, and the README says so.
- **I paused Gemini and Qwen.** Gemini started returning 402 (credits depleted) and the Qwen model on
  Groq wasn’t working. I commented them out in the configs instead of deleting them.
- **Anyone can run it with their own access.** An API key or a Claude Code session; the repo ships no
  keys.

## What’s next

This same week Anthropic published
[Building strong safety evaluations](https://www.anthropic.com/research/building-strong-safety-evaluations),
and several ideas hit home: a model that refuses everything can get a perfect score on a refusal-rate
eval, single-turn tests are saturated, and if your conclusions change when the grader does, you’re
probably measuring the grader.

That makes the roadmap clear: run the full multi-turn red team, bring back a model from another
provider to see how its filter behaves, try prompt variants for Haiku’s pivot-chord modulation mistake
(F-003), and measure run-to-run variance, because with 29 cases a single run is just a sample.

If I started over, I’d probably look for sources to keep my judging system up to date: references on
how each metric is used, kept open to updates and changes, so my framework lets me know when something
shifts and I can adjust accordingly. Since everything is still being built, this will keep happening.

The repo and reports are at
[composition-coach-llm-evals](https://github.com/JulianBeta/composition-coach-llm-evals), and the live
results are on [GitHub Pages](https://julianbeta.github.io/composition-coach-llm-evals/).
