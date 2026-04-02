---
name: Auto-Test
description: Use this skill after creating an agent to start Syn as a sub-task tester. Covers how to start the test, receive results, and continue the fix-retest loop.
version: 2.0.0
---

# Auto-Test Skill

Use this skill after the agent has been created and you have the `draftAgentId`.

## Important

Do NOT skip the normal creation flow. Auto-test means: create the agent as normal, then start Syn as a sub-task to test it.

## Flow

### Step 1 — Start Syn as a sub-task

Call `start_syn_test` with:
- `draftAgentId`: the created agent's ID
- `requirements`: the original user requirements

Save the returned `taskId` as `synTaskId`.

### Step 2 — Wait for results

Syn will test the agent and save the full report to `tests/` in her own workspace. When the `sub-task-result-updated` callback arrives, the first line of the result contains the full absolute path of the report file. Use the `Read` tool to read it.

### Step 3 — Fix and re-test loop

If Syn reports issues:
1. Apply fixes to the agent
2. Call `emit_to_task` with `taskId: synTaskId` and a message describing what was fixed
3. Syn will re-test and report again
4. Repeat until Syn is satisfied or the user decides to stop
