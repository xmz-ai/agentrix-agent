# Agentrix Test Memory

Use this skill before and during project validation or test execution to reuse and improve project-specific testing memory. The goal is to reduce repeated exploration: read known test workflows and lessons before acting, apply them while testing, and update them when the run reveals reusable knowledge.

This skill is about **testing memory management**, not about the concrete mechanics of browser automation, API testing, service startup, or this project's UI. Concrete test execution rules belong in environment docs, workflow docs, or tool-specific testing skills.

## Memory Location

Project-local test memory lives under:

```text
.agentrix/env/test/
```

Recommended structure:

```text
.agentrix/env/test/
  README.md
  workflows/
  lessons/
```

- `README.md` is the short index and usage contract.
- `workflows/` contains reusable testing procedures.
- `lessons/` contains corrections, failed-attempt retrospectives, and testing behavior lessons.
- Issue-specific evidence remains under `.agentrix/issues/{issue}/test/`.

## Before Testing: Reuse Existing Memory

Before starting a non-trivial test run:

1. Read `.agentrix/env/test/README.md` if it exists.
2. Identify workflow files that match the kind of test being run.
3. Identify lesson files that match prior failures, user corrections, environment constraints, or automation pitfalls.
4. Use those files to choose the initial testing approach and avoid repeating known mistakes.

Do not rediscover a workflow that is already recorded. If the existing memory is stale, incomplete, or wrong, update it during the run.

## During Testing: Notice Reusable Knowledge

While testing, watch for knowledge that future agents would otherwise have to rediscover, such as:

- a reliable sequence of steps for a repeated validation task;
- a required setup, auth, environment, or data condition;
- a common wrong approach and the correction;
- a tool, runner, permission, or sandbox constraint;
- a project-specific convention that affects how tests should be written or interpreted;
- evidence expectations that were missing or corrected by the user;
- a failure mode that looks like an app bug but is actually an environment or automation issue.

When such knowledge becomes clear, update `.agentrix/env/test/` as part of the testing work instead of leaving it only in chat or issue evidence.

## What Belongs Where

Keep three kinds of records separate:

### Issue-specific evidence

Belongs under `.agentrix/issues/{issue}/test/`. Examples:

- exact feature tested;
- timestamps;
- task IDs;
- screenshots and logs for this run;
- final pass/fail/block result;
- one-off limitations.

### Reusable workflow

Belongs under `.agentrix/env/test/workflows/`. A workflow should describe a repeatable procedure that can be applied to future tests with different inputs.

Good workflow content includes:

- when to use the workflow;
- inputs the caller must supply;
- preconditions;
- step-by-step procedure;
- expected outputs;
- checkpoints or evidence to collect;
- a concise easy-to-miss checklist for common mistakes;
- troubleshooting references to detailed lessons for abnormal cases;
- script/evidence file placement conventions when the workflow usually needs automation;
- known caveats.

A workflow should generalize the procedure, not the specific feature outcome. Keep workflows concise enough to execute quickly; put long incident context in `lessons/` and link it from the workflow as troubleshooting reference.

### Reusable lesson

Belongs under `.agentrix/env/test/lessons/`. A lesson should capture a mistake, correction, or discovery that changes future testing behavior.

Good lesson content includes:

- what happened;
- why it was wrong, fragile, expensive, or misleading;
- the user correction or observed evidence;
- the better future behavior;
- links to issue evidence or workflow files when relevant.

## How To Generalize

When extracting memory, move one level up from the specific test. Ask:

- What part of this run will future tests need again?
- Which steps are reusable with different test data or expected outcomes?
- Which failure was caused by a wrong testing strategy rather than the feature under test?
- Which user correction should become a future testing rule or workflow checkpoint?
- Which details are one-off and should stay only in issue evidence?

Examples:

- Too specific: "Test title changes by sending exactly this prompt."
- Reusable: "To test a user-visible agent run, follow the recorded workflow for choosing the environment, selecting the agent, creating the run, sending an issue-specific prompt, waiting for completion, and verifying the visible result."
- Too specific: "This Playwright script failed today."
- Reusable: "When a runner cannot access a needed local capability, classify the capability gap and avoid retrying the same failing approach without new permissions or a changed execution path."

## Updating Test Memory

When adding or updating memory:

1. Prefer updating an existing workflow or lesson if it covers the same testing surface.
2. Create a new workflow only when the procedure is meaningfully different.
3. When a run exposes a new common mistake, risky assumption, or failure pattern, update the relevant workflow with a short checklist/caveat and create or update a detailed lesson under `lessons/`. Link the lesson from the workflow as troubleshooting reference.
4. Keep workflows concise and operational; keep detailed narrative, failed attempts, and user corrections in lessons.
5. Link from issue test evidence to the workflow/lesson when useful.
6. Update `.agentrix/env/test/README.md` so future agents can discover the new memory.

## Reporting

When reporting test results, mention:

- issue-specific test evidence path;
- test memory files read before testing;
- test memory files added or updated;
- any reusable lesson intentionally not recorded and why.
