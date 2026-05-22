# Agentrix Test Memory

This directory is the project-local memory for repeatable test workflows. Keep `README.md` short: it explains how memories are organized and points to the concrete files. Do not put full case details or long scripts here.

## Memory Rules

- `README.md` is an index and usage contract only.
- `workflows/` contains reusable procedures that future agents should follow step by step.
- `lessons/` contains incident-style retrospectives, user corrections, and automation behavior lessons.
- Issue-specific evidence still belongs under `.agentrix/issues/{issue}/test/`.
- When a test run exposes a reusable lesson, add or update a workflow/lesson file here and link it from the issue report.

## Required Reading For Web E2E

Before running Agentrix web app E2E, read:

1. `.agentrix/env/README.md`
2. `.agentrix/env/modes/local-direct.md`
3. `.agentrix/env/init/authentication/README.md`
4. The workflow file that matches the task below.

## Workflows

- `workflows/agent-chat-start-run.md` — UI action pattern for starting a real agent run from an Agentrix web agent chat. It covers selecting the agent context, opening a new run, selecting execution target, entering the issue-specific prompt, starting the run, and handing verification back to the calling test.

## Lessons

- `lessons/451-automation-corrections.md` — Retrospective from issue 451. Records the user corrections, what the agent did wrong, why it was wrong, and the new automation rules.

## When To Add A New Memory

Add a memory when a test reveals a behavior that future agents are likely to repeat incorrectly, for example:

- local service startup requires escalation or user-run services;
- UI state is easy to misread;
- a page workflow must not be replaced by API shortcuts;
- a React Native Web control needs a reliable interaction pattern;
- screenshots or logs need a specific evidence standard.
