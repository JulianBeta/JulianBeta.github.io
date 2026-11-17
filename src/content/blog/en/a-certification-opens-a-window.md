---
title: 'A certification opens a window: what Break Into AI Testing left me'
description: 'I earned the Break Into AI Testing certification from Engenious University. It was worth it, but the real result depends on what you build with it and the people you meet along the way.'
date: 2026-11-17
tags: ['AI Testing', 'Certifications', 'Learning']
draft: false
translation: 'una-certificacion-abre-una-ventana'
---

I just earned the **Break Into AI Testing** certification from Engenious University. I want to write
about it without turning it into a trophy post, because what I take away from it isn't the
certificate itself. A certification doesn't change your career on its own. What it does is open a new
window to start exploring.

## What the bootcamp covered

The course is built around [Promptfoo](https://www.promptfoo.dev) and red teaming, over eight
sessions. It starts with the basics (prompts, providers, assertions), moves on to breaking chatbots by
hand, like a healthcare triage bot and a brokerage bot, and then lets an agent in Claude Code draft and
run the attacks. After that comes advanced evaluation (weights, metrics, F-score, temperature), and
finally testing real applications: a running app behind an endpoint, where the assertions check the
routing decision and the citations, not just the text of the answer.

The lesson that stayed with me the most was about grading the grader. The course shows a real case
where the LLM judge passed a complete system-prompt leak. As QA, that's familiar: if the oracle is
wrong, the whole suite is wrong, no matter how green it looks.

What surprised me the most was seeing how free models perform compared with paid ones. The course
runs by default on free models through Groq's free tier, with paid models as an option, so the
difference is right there in the results. You can still use some free models for certain things. But
paying for a model to study, use and experiment with high performance helps you build trust in what
models can do and where their limits are.

## Worth it, but the result depends on you

I think certifications are worth it. They give you structure, a deadline and a common vocabulary,
which is hard to get when you study on your own between work and everything else.

But the real result depends on two things. The first is what you actually do with what you learned. A
certificate on LinkedIn says you finished a course; a repo says what you can do with it. The second is
the network you build. In a bootcamp you meet people who are facing the same problems from other
companies, other domains and other countries, and that perspective is hard to get from inside your own
team.

## Technology moves faster than the industry

I keep coming back to this idea: technology moves faster than the technology industry. At work there's a defined
stack, a client and commitments, and meanwhile a new standard shows up outside every week.

This bootcamp confirmed something for me: keeping up with new technologies is just a basic
responsibility we have as professionals. It's not a merit, and it's not something extra you do if you
have time. It's part of the job, the same way it was when we moved from Selenium to Playwright.

What a course like this does give you, beyond the content, is an open mind. AI brings new challenges
to testing that don't fit well into the old categories: outputs that change between runs, judges that
are also models, attacks written in plain language. If you only look at them from your day-to-day
work, it's easy to dismiss them or to assume your current tools already cover them.

## A recent example: Coda and Anthropic's guide

The course led me to start **Coda**, a personal project to evaluate and red-team a chatbot that
coaches people on composing music, using Promptfoo with Claude Haiku and Sonnet. I told the full story
in [another post](/blog/276-attacks-defended-who-defended-them/).

While I was running its latest baseline, Anthropic published
[Building strong safety evaluations](https://www.anthropic.com/research/building-strong-safety-evaluations).
Two of its ideas made me reread my own results with different eyes: a model that refuses everything
can get a perfect score on a refusal-rate eval, and if your conclusions change when the grader does,
you're probably measuring the grader. My red team had 276 of 276 attacks defended, and many of them
were stopped by the provider's filter with an empty reply, not by my prompt.

The guide came out while I was still applying what I had just learned. That's the speed I'm talking
about: the ground keeps moving while you're still learning.

## What's next

My next step is the **Claude Certified Architect** certification. I'm studying for it and hope to
get it soon. But I know it will do the same thing: open another window.

The questions I want to answer through it are two. How can I get the most out of a whole suite like
Claude to improve my work? And, at the same time, how can I keep my work independent from the AI
provider? Coda already gave me a first hint: the evals live in configuration, so adding or pausing a
provider is a matter of editing a block, not rewriting the tests. That's what's coming.

The certification opened the window. What comes through it depends on what I build and on the people I
keep learning with.

How about you? What has helped you most to keep up: certifications, communities or side projects?
