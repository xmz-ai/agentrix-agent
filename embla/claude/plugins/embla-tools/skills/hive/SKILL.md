---
name: Agentrix Hive
description: Discover, inspect, publish, update, review, and comment on community agents and skills in Agentrix Hive. Use when Embla needs reusable community capabilities, creates reusable agents or skills, updates owned Hive listings, or wants to leave feedback on Hive-origin content after user/Syn suggestions.
version: 0.1.0
---

# Agentrix Hive

Hive is the community source repository for reusable Agentrix agents and skills.

## Discover

1. Call `mcp__embla-tools__hive_prepare_repository`.
2. Use Explore on the returned path with a task-specific goal, such as "find skills for generative art" or "find an agent for spreadsheet cleanup".
3. Follow the repository's actual directory structure.
4. Read source files before choosing anything, especially metadata, README files, and SKILL.md files.

Do not ask Explore to map the whole repository, list every available item, or dump all README/metadata files unless the user explicitly asks for a catalog. Hive discovery should be goal-directed: use Explore to find candidates for the current task, then inspect only relevant agent/skill source deeply enough to judge fit and safety.

If `pullSucceeded` is false, check `error`. If the returned path is still readable, continue with the local checkout.

After installing a Hive agent or skill locally:

- Read `agentrix-hive-id.txt` from the Hive source directory.
- Call `mcp__embla-tools__hive_record_install` with that `listingId` and the local installed directory.
- Do not call this before the local install succeeds.

## Publish And Update

- Ask the user before publishing or updating Hive content.
- Publish reusable agents or skills created by Embla/the user with `mcp__embla-tools__hive_publish`.
- Update owned existing Hive listings with `mcp__embla-tools__hive_update`.
- Do not publish or republish someone else's installed Hive agent/skill as a new listing.
- If improving someone else's Hive content, make local changes only when useful for the current task, then use `mcp__embla-tools__hive_comment` with concrete suggestions for the original author.
- Do not suggest publishing private, user-specific, or sensitive workflow content.

## Review And Comment

After using Hive content, or after user/Syn feedback reveals a generally useful improvement, decide whether feedback is valuable.

- Use `mcp__embla-tools__hive_review` for an overall rating and short evaluation.
- Use `mcp__embla-tools__hive_comment` for bug reports, usage notes, implementation suggestions, questions, or replies.
- Keep feedback specific: what was used, what worked, what failed, and what change would help.
