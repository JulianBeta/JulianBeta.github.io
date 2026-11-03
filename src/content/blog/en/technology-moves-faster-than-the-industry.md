---
title: 'When technology moves faster than the industry'
description: 'I launched my website, LinkedIn profile and CVs with AI assistance. A look back at the gap between day-to-day work and new standards, and what this week showed about AI agent security.'
date: 2026-11-02
tags: ['AI', 'QA', 'Security']
draft: true
translation: 'la-tecnologia-avanza-mas-rapido-que-la-industria'
---

This week I launched this website and updated my LinkedIn profile and my CVs. I did all of it
assisted by Claude, and it wasn't a shortcut: it was a personal exercise to use AI in several ways at
once and, along the way, start creating content that works as a retrospective of what I'm learning and
applying.

I want to use this first reflective post to put into perspective a problem I think many of us in tech
live with and rarely say out loud.

## The gap between day-to-day work and new standards

At work you do certain things with certain tools. There's a defined stack, a client, timelines and
expectations you have to meet. Meanwhile, outside, a new standard shows up every week: a protocol for
connecting agents, a different way to generate tests, an LLM evaluation framework, a new Playwright
release that changes how I write a test.

The hard part is that you often can't connect one with the other. What I'm learning doesn't always
have room in what I do every day, and what I do every day doesn't always match the new standards.
It's nobody's fault: projects have commitments, and switching tools in the middle of a delivery has a
real cost.

My conclusion is that technology is moving faster than the technology industry. And if you stay
inside the day-to-day bubble, you fall behind.

## My strategy: personal projects and writing

So, once again, you have to find strategies. Mine, for now, are two:

- **Personal projects as a lab.** This site is one example: it's built with Astro and tests itself
  with Playwright and axe-core in GitHub Actions before every deploy. The English and Spanish CVs are
  generated from the same data as the site, and a test checks that they fit on two pages. I also
  rebuilt my Playwright framework for Swag Labs, which went from 2 to 99 scenarios across three
  browsers.
- **Writing.** This blog is my retrospective. Forcing myself to explain what I did and why helps me
  separate what I actually understood from what I only copied.

AI is at the center of both. Even this post came out of a weekly routine where an agent asks me what
I worked on, reviews my repositories, looks for industry news and proposes drafts. I decide what stays
and what doesn't.

[COMPLETAR: one concrete example of something the AI did well and something you had to fix or decide
yourself while building the site or the CVs.]

## This week, the gap showed up in security

Speed has a cost, and this week it showed in several AI development tools:

- Forever Security researchers found a malicious `AGENTS.md` in a customer's Downloads folder that led
  a coding agent to try to install a fake npm package
  ([BleepingComputer](https://bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder),
  October 25).
- The same team showed flaws in the embedded browsers of Cursor, GitHub Copilot, OpenAI Codex, VS Code
  and Claude Desktop: a web page or a local file could reach the developer's machine
  ([Help Net Security](https://www.helpnetsecurity.com/2026/10/29/research-ai-assistant-browser-vulnerabilities/),
  October 29). Some are already fixed and some aren't.
- Wiz is calling this month "Black October" because of the number of incidents on AI development
  platforms ([Anadolu Agency](https://www.aa.com.tr/en/world/timeline-ai-at-center-of-october-cyberattack-wave-targeting-tech-giants-developer-platforms/4108775)).

To me, this connects directly to the point above. Agents reached our day-to-day work faster than the
practices to test and secure them. And I'm not outside of that: the same agent that helps me with this
blog has access to a folder on my computer.

## What I take away as a QA engineer

- **Instruction files are code.** An `AGENTS.md` or a `CLAUDE.md` changes what the agent does, so it
  deserves the same review as a script in a PR.
- **Agents work in project folders, not in Downloads.** That's the researchers' own recommendation,
  and it's easy to apply.
- **Extensions, permissions and the embedded browser are test surface too.** If a team adopts an agent,
  someone should test what happens when the agent reads malicious content. That's indirect prompt
  injection, and it's exactly the kind of case I want to cover in my evaluation and red-teaming project
  with Promptfoo.

[COMPLETAR: if you want, one line on how you experience this at work, with no client details.]

## To close

I don't think the answer is to chase every new tool. What works for me is having my own space to
explore, with the same discipline I apply at work: tests, CI, and reviewing what the AI produces
before trusting it.

How about you? How do you connect what you learn with what you do every day?
