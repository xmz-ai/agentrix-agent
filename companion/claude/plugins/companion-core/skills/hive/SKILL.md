---
name: Agentrix Hive
description: Discover, install, publish, update, review, and comment on community agents and skills in Agentrix Hive. Use when the user asks for community agents or skills, when you need a capability you do not have, when you create or update reusable content, or after using/evolving a Hive skill and deciding whether to leave feedback.
version: 0.1.0
---

# Agentrix Hive

Hive is the community source repository for reusable Agentrix agents and skills.

## Discover

1. Check memory for known Hive agents or skills that match the current task.
2. If memory has a likely candidate, inspect that candidate first.
3. If memory has no suitable candidate, call `mcp__agentrix__hive_prepare_repository`.
4. Use Explore on the returned `path` with a task-specific goal, such as "find a skill for PDF table extraction" or "find an agent for code review".
5. Follow the repository's actual directory structure.
6. Read source files before choosing anything, especially metadata, README files, and SKILL.md files.

Do not ask Explore to map the whole repository, list every available item, or dump all README/metadata files unless the user explicitly asks for a catalog. Hive discovery should be goal-directed: use Explore to find candidates for the current task, then inspect only relevant agent/skill source deeply enough to judge fit and safety.

When Explore finds valuable Hive agents or skills, record concise memory entries with the name, path, capability, and when to use it. Before future Hive exploration, check memory first to avoid rediscovering known useful candidates.

If `pullSucceeded` is false, check `error`. If `path` is still readable, continue with the local checkout.

After installing a Hive agent or skill locally:

- Read `agentrix-hive-id.txt` from the Hive source directory.
- Call `mcp__agentrix__hive_record_install` with that `listingId` and the local installed directory.
- Do not call this before the local install succeeds.

## Install

- Before installing anything, inspect the source with Explore/Read and decide whether it is safe and relevant.
- If the source looks unsafe, unclear, or overly broad in permissions, do not install it; explain the risk.
- If it is safe and useful, ask the user for confirmation.
- For a Hive agent, after confirmation install it locally from the inspected Hive source.
- For a Hive skill, after confirmation copy the skill directory into this agent's skill location: `plugins/{plugin-name}/skills/{skill-name}/SKILL.md`, preserving any needed `references/`, `scripts/`, `assets/`, `templates/`, or other bundled resources.
- After copying a skill, update `SKILLS.md` with the new skill path and short description.
- After the local install succeeds, record it as described in Discover.
- After installing a relevant skill, use it to finish the task.

## Publish And Update

- Ask the user before publishing or updating Hive content.
- You may publish reusable agents or skills that you or the user created with `mcp__agentrix__hive_publish`.
- Do not publish or republish someone else's installed Hive agent/skill as a new listing.
- If the user wants to modify their own existing Hive listing, update it with `mcp__agentrix__hive_update`.
- If the user wants to modify someone else's Hive agent/skill, make local changes only when needed for the current task, then use `mcp__agentrix__hive_comment` to leave concrete suggestions for the original author.
- Do not suggest publishing private, user-specific, or sensitive workflow content.

## Review And Comment

After using a Hive agent/skill, or after evolving a downloaded skill, decide whether feedback is useful.

- Use `mcp__agentrix__hive_review` for an overall rating and short evaluation.
- Use `mcp__agentrix__hive_comment` for bug reports, usage notes, implementation suggestions, questions, or replies.
- If local evolution produces a generally useful improvement, consider commenting with concrete suggestions for the original author.

Feedback should be specific: what was used, what worked, what failed, and what change would help.
