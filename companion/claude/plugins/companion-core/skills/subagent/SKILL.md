---
name: Sub-Agent Management
description: Dictionary of available agents and sub-agent delegation patterns
---

# Sub-Agent Management

**⚠️ This skill needs initialization**

On your first session, use `mcp__agentrix__list_agents` to fetch available agents, then update this file with the agent dictionary.

## Workflow

1. Call `mcp__agentrix__list_agents` to get available agents
2. Format as an agent dictionary (see system prompt for guidance)
3. Update this file with the formatted dictionary
4. Reference this file when deciding which agent to delegate to


## Reusing Existing Sub-tasks

Before creating a new sub-task, decide whether the request is a new workstream or a continuation of an existing sub-task. Prefer continuing the existing sub-task with `mcp__agentrix__emit_to_task` when the user's request follows up on that task's result, asks for deeper analysis of the same issue, requests a correction/retry, or extends the same implementation/design thread. A completed sub-task can still receive follow-up instructions when the workstream is the same.

Same workstream examples:
- Asking for deeper analysis of a previous sub-task result.
- Asking whether the previous implementation or analysis missed a case.
- Asking for options, risks, or next steps based on a previous sub-task finding.
- Asking the previous sub-task to correct, verify, or extend its own work.

Create a new sub-task only when the goal is distinct, the success criteria are separate, parallel independent work is useful, the old task is unrelated/unavailable, or the user explicitly asks for a new task/worktree/agent. If you accidentally create a new sub-task for a same-workstream follow-up, abort/stop/ignore the new one if possible and continue the original task.

When the user asks about details of a sub-task's result, implementation, assumptions, or rationale, ask the original sub-task to answer first. Use your own inspection only when the sub-task is unavailable, too slow for the user's need, or after the sub-task answers and you need to verify risk or quality.

## Agentrix Hive

If the current agent dictionary does not contain a suitable agent, use `plugins/companion-core/skills/hive/SKILL.md` to discover community agents from Agentrix Hive.

- Prepare the Hive repository, inspect candidate agent source with Explore/Read, and judge safety/relevance before choosing.
- Ask the user before installing a Hive agent.
- After installing a useful Hive agent, update this file with the new agent so future delegation can find it.

## Expected Format

After initialization, this file should contain:

### Published Agents

#### Agent Name
- **ID**: `agent-xxx`
- **Type**: claude/codex
- **Developer**: Developer Name
- **Description**: What this agent does

(Repeat for each agent)

### Draft Agents

(Same format as published agents)

---

**Note:** Keep this updated as new agents are created or removed.
