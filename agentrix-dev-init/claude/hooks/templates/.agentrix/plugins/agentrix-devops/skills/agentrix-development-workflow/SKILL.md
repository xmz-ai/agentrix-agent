# Agentrix Development Workflow

Use this skill for non-trivial implementation work that starts from a user request, requirement, bug report, or issue. It is not limited to Git hosting issues.

This is an acceptance-first workflow: write or update the issue context, plan, review questions, and test plan before or during implementation; after implementation, answer review questions first, then run tests.

Tiny non-functional edits do not need the full workflow, such as wording changes, typos, simple CSS styling, documentation / README / checklist / explanatory text. Function-related changes should use the full workflow.

## Directory Layout

Issue artifact directories live under `.agentrix/issues/` and use local incrementing numbers plus a readable slug:

```text
.agentrix/issues/{LOCAL_NUM}-{ISSUE_SLUG}/
  README.md
  plan/
  review/
    questions/
  test/
```

Meanings:

- `README.md` — requirement, bug report, context, acceptance goals, and Git hosting link if any.
- `plan/` — implementation design and later design revisions.
- `review/questions/` — question-first review prompts prepared before or during implementation.
- `review/` — answers to review questions, review findings, and follow-up review notes.
- `test/` — test plan, commands, results, screenshots/log summaries, and uncovered risks.

If the work maps to a Git hosting issue, record the external issue number under the `# Git` section in that issue artifact's `README.md`, for example `.agentrix/issues/012-companion-automated-testing/README.md#git`. Local artifact numbers still increment independently from Git hosting issue numbers.

## Filename Rule

Only the numeric prefix is fixed. Files should start with ordered prefixes such as:

```text
001-*.md
002-*.md
003-*.md
```

The descriptive slug after the prefix is chosen by the agent. Do not over-standardize filenames. When plans iterate, append a new numbered file instead of overwriting older plans.

## Role Selection

Before using the workflow, identify your role for the current task. A single agent may hold one role or multiple roles depending on the user's instruction.

- **Requirement proposer** — you are clarifying or recording what should be built or fixed. This role maintains `README.md`, acceptance criteria, user corrections, and optional lightweight drafts such as `mvp-draft.md` when the idea is not implementable yet.
- **Solution designer** — you are deciding how the requirement should be implemented. This role writes or updates `plan/` and prepares `review/questions/`.
- **Implementation executor** — you are implementing an existing plan. This role reads `README.md`, the latest relevant plan, and `review/questions/`, then implements, answers questions under `review/`, and records tests under `test/`.

Use these cues:

- If the user only gives a requirement or product goal, you may only be the requirement proposer. Record the issue context and, if useful, a draft. Do not create an implementation plan until the direction is concrete enough to implement.
- If the user gives a concrete bug or asks for implementation and the desired behavior is clear, you may hold all three roles: requirement proposer, solution designer, and implementation executor. For non-trivial implementation work, complete the issue context, actionable plan, and review questions before implementation.
- If the user asks you to design a solution, write a plan, or prepare implementation guidance, you are the solution designer. Create or update `plan/` and `review/questions/`; do not implement unless the user also asks you to proceed.
- If the user gives an existing plan or says to implement a prepared plan, you are the implementation executor. Do not create a competing plan unless the existing plan is missing, stale, inconsistent, or impossible to implement.
- If the user asks you to design and then implement, or explicitly says to continue after planning, you hold both solution designer and implementation executor roles. Finish the design artifacts first, then implement, answer review questions, and test.
- If role assignment is unclear and the next step could change product direction or architecture, ask the user before proceeding.

## Workflow

### 1. Understand the task

Applies to all roles.

- Restate the desired outcome, affected users, and acceptance criteria.
- Search historical related issue artifacts under `.agentrix/issues/` when the request appears connected to prior work, earlier decisions, or a recurring problem.
- Read relevant product/design docs and code before proposing code changes.
- When the task involves setup, test, build, deployment, services, databases, credentials, or other environment-dependent operations, read `.agentrix/env/README.md`.
- Ask the user when product behavior, acceptance criteria, risk tolerance, credentials, external services, or migration requirements are unclear.

### 2. Create or update the issue artifact

Primarily the requirement proposer role. The solution designer or implementation executor may update it when they discover missing or superseded context.

- First check whether the user named an existing issue, artifact directory, or prior iteration. If so, update that artifact location instead of creating a new one.
- If the request continues prior work, search `.agentrix/issues/` for related historical artifacts and reuse the matching one when the connection is clear.
- Create a new artifact directory only when the work is non-trivial and no suitable existing artifact applies.
- For a new artifact, choose the next local issue number by incrementing the highest numeric prefix already present under `.agentrix/issues/`.
- Name new artifact directories with the local issue number and readable slug, for example `.agentrix/issues/012-companion-automated-testing/`.
- Write or update `README.md` with the requirement, background, acceptance criteria, and latest user corrections that materially affect the target.
- If the work is still product direction, MVP exploration, or otherwise not implementable, put lightweight thinking in a root-level draft file such as `mvp-draft.md`, `product-draft.md`, or `notes.md`, and link it from `README.md`.

### 3. Write or update the plan

Primarily the solution designer role. The implementation executor should read the latest plan and only create a new revision when the current plan is missing, stale, inconsistent, or impossible to implement.

Do not treat every requirement note or MVP sketch as a plan. A file under `plan/` must be actionable enough that an implementation executor can reasonably proceed from it. If the current role is only requirement proposer, or the idea remains product direction / MVP exploration / non-actionable thinking, keep it in a root-level draft file such as `mvp-draft.md`, `product-draft.md`, or `notes.md` and link it from `README.md`.

- Check whether `plan/` already contains a plan for the current iteration.
- If no current actionable plan exists and implementation is requested/ready, create the next numbered plan file under `plan/` before implementation.
- If the requirement, constraints, or intended approach changed after a real plan exists, append a new numbered plan revision instead of overwriting the old one.
- Plans should capture the chosen approach, relevant alternatives, files/modules likely affected, risks, what should not change, and testing/verification strategy.
- Identify the source of the behavior rather than only the surface file.
- Reuse existing utilities, patterns, schemas, migrations, and tests where possible.

### 4. Write review questions before accepting implementation

Primarily the solution designer role. These questions are prepared for the implementation executor to answer after implementation.

- For every new or revised plan, create matching numbered question files under `review/questions/`.
- Review questions should be answerable after implementation.
- Questions should probe architecture path, behavior, edge cases, safety, compatibility, UX/prompt/rendering implications when relevant, tests run, and known limitations.
- The purpose is to review semantics and design decisions, not just to inspect a diff.

### 5. Implement

Primarily the implementation executor role. Start here only after the relevant requirement, plan, and review questions are available or confirmed unnecessary for a trivial change.

- Do not stash, switch branches, reset, clean, commit, push, or force operations unless explicitly requested.
- Keep the diff scoped to the task.
- Update docs, schemas, migrations, generated files, and tests when behavior changes.

### 6. Answer review questions

The implementation executor answers these after implementation. The solution designer or reviewer uses the answers to judge semantic correctness.

- After implementation, answer the relevant files in `review/questions/` before treating the implementation as complete.
- Save answers as numbered files under `review/`, for example `review/001-answers.md`, or more descriptive numbered filenames.
- Use the answers to judge whether requirements were implemented semantically, not just whether code changed.
- If answers expose gaps or design changes, append a new numbered plan revision and matching review questions before continuing.

### 7. Run tests after question review

Primarily the implementation executor role.

Question review does not replace tests. After the design/semantic review passes, run relevant validation and save test evidence under `test/`.

Choose the validation level based on what the change is meant to prove. For user-facing behavior or product-effect validation, prefer end-to-end verification that exercises the observable workflow. Backend tests are usually best for covering units, services, APIs, edge cases, and regression logic that does not require proving the full user-visible effect.

A test report should include:

```md
## Result
PASS / FAIL

## Scope
What was verified.

## Commands / Steps
...

## Evidence
Screenshots, logs, console/network/runtime errors.

## Limitations
What was not covered.
```

#### Web E2E evidence standard

For web E2E or browser verification, visual evidence is part of the test result, not an optional debug artifact. Save screenshots from the first meaningful browser state and at each important transition.

At minimum, capture:

- initial page after navigation and authentication/session setup;
- selected navigation or application context before the tested action;
- form, composer, dialog, or page state before submission/action;
- immediate result after submission/action;
- final visible outcome used for the assertion.

The test evidence should also record:

- final and important intermediate URLs;
- relevant visible text used for assertions;
- console errors;
- HTTP `4xx` / `5xx` responses;
- notable loading, offline, retry, or error states;
- any manual user action, permission grant, or environment limitation that affected the run.

If a browser action fails or the page state is unclear, capture the current screenshot before changing strategy. Do not rely only on DOM text dumps when the tested behavior is visual or interaction-based.

Before running test, build, service, database, deployment, or other environment-dependent commands, read `.agentrix/env/README.md`.

For Agentrix project validation or test execution, use or read the `agentrix-test-memory` skill before and during testing. That skill defines how to consult `.agentrix/env/test/`, avoid repeating known testing mistakes, and capture reusable workflows/lessons from failed attempts, user corrections, and successful validation paths.

For web application end-to-end testing, browser verification, screenshots, or console/network debugging, use or read the `webapp-testing` skill.

### 8. Report clearly

- Summarize behavior changes, changed files, validation, and caveats.
- Mention any user action needed, such as credentials, manual verification, migrations, or service restarts.
- Point to the updated issue artifact files when relevant.

## Caveats

- The user's latest explicit correction overrides old plans, old memory, and stale task context.
- Do not restart completed work from old plans unless the user explicitly asks for a new revision.
- Prefer narrow fixes over broad rewrites unless the user asks for redesign.
