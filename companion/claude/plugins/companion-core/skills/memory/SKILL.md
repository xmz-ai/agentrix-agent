---
name: Memory Management
description: Hierarchical memory system — how to organize, write, read, and maintain memories across sessions
version: 0.1.0
---

# Memory Management

Persistent memory organized by topic. Each topic has a README with a compressed summary and an index of dated entries. The top-level `MEMORY.md` is your map of all topics.

## Directory Structure

```
MEMORY.md                            ← Topic index
memory/
  {topic}/                           ← One directory per topic (English, kebab-case)
    memory.md                        ← Topic README: summary + file index
    YYYY-MM-DD-slug.md               ← Individual memory entries
```

### MEMORY.md (Topic Index)

Lists all topics. One line per topic: path + short description.

```markdown
# Memory

## Topics

- `memory/user-preferences/` — Communication style, tools, and workflow preferences
- `memory/project-alpha/` — Architecture decisions and progress for Project Alpha
- `memory/dev-environment/` — Local setup, tool configs, and platform quirks
```

### memory/{topic}/memory.md (Topic README)

Two sections: **Summary** (compressed knowledge) and **Index** (dated file list).

```markdown
# Project Alpha

## Summary

User is building a React + FastAPI app. Chose PostgreSQL over MongoDB for relational data needs (2026-04-28). Frontend uses Tailwind, backend follows hexagonal architecture. Deployment target is Fly.io.

## Index

- `2026-04-30-api-auth-design.md` — Decided on JWT with refresh tokens, 15min access / 7d refresh
- `2026-04-28-initial-architecture.md` — Tech stack selection and project structure
```

The Summary is the most important part — it should be a dense, readable paragraph that captures the essential knowledge from all entries under this topic. A reader who only reads the Summary should understand the key facts without needing to open individual files.

### memory/{topic}/YYYY-MM-DD-slug.md (Entry)

A single memory entry. Plain markdown, no frontmatter required. The filename carries the date and topic hint.

```markdown
# API Auth Design

Discussed authentication approach. Decided on JWT with short-lived access tokens (15 min) and longer refresh tokens (7 days). Refresh tokens stored in httpOnly cookies, access tokens in memory. Chose this over session-based auth because the frontend is a SPA and we want stateless API servers.

Key decisions:
- No third-party auth provider for now — user base is small
- Rate limiting on /auth/refresh to prevent token farming
- User asked to revisit OAuth integration when we add social login
```

## Writing Workflow

### When to write (chat mode)

After a conversation produces knowledge worth preserving, and especially when any of these happen:

- A task or project milestone is completed, cancelled, superseded, or re-scoped.
- A previously remembered fact becomes outdated or incorrect.
- The user corrects a stale memory, project status, or preference.
- A related memory event changes the meaning of an existing summary, roadmap, or open-task list, including external tracker events such as issue/PR closed, PR merged, issue/PR reopened, assignment/label changes, review state changes, or CI/check status changes.

Do not only append new memories. When new information changes previous knowledge, update the relevant topic README Summary and, when useful, add a dated entry explaining what changed so future sessions do not rely on stale state.


1. **Classify** — What topic does this belong to? Think at the category level, not the instance level. "Project Alpha architecture" is a topic; "today's meeting about the API" is an entry within that topic.

2. **Check existing topics** — Read `MEMORY.md`. Does a relevant topic already exist?

3. **If topic exists**:
   - Create a new entry: `memory/{topic}/YYYY-MM-DD-slug.md`
   - Update the Index in `memory/{topic}/memory.md`
   - If the new information changes the big picture, update the Summary too

4. **If topic is new**:
   - Create directory: `memory/{new-topic}/`
   - Create README: `memory/{new-topic}/memory.md` with initial Summary and Index
   - Create entry: `memory/{new-topic}/YYYY-MM-DD-slug.md`
   - Add the topic to `MEMORY.md`

5. **Same-day entries** — If a topic already has an entry for today, either append to the existing file or create a new one with a more specific slug (e.g., `2026-04-30-auth-revisited.md`).

### When to write (shadow mode)

During the structured knowledge review in the heartbeat workflow:

1. Review the conversation for durable facts.
2. Review relevant sub-task status when the conversation, recent reminders, existing memory, or active/open unclosed tasks mention delegated work, external issues, milestones, or open loops. Also inspect active/open tasks that may have changed state since the last heartbeat.
3. Compare sub-task progress/results and external status signals with existing memory. External signals include issue/PR closed, PR merged, issue/PR reopened, assignment/label changes, review state changes, and CI/check status changes. If a remembered item completed, failed, changed scope, or became stale, update the relevant topic summary and entry immediately.
4. Periodically tidy older memory when the heartbeat has enough context and budget: merge overlapping topics, remove or mark obsolete entries, rewrite summaries to emphasize the most important current facts, and keep detailed old entries as backup only when they still add value.
5. Classify by topic using CLASS-FIRST thinking: describe the category in one sentence before deciding what to save.
6. Follow the same write workflow as chat mode.
7. If nothing is worth saving or tidying, stop — don't create or rewrite memory for the sake of activity.

### What makes a good entry

- **Captures decisions and their reasoning** — not just "chose X" but "chose X because Y"
- **Records corrections** — what was wrong, what's right, why it matters
- **Preserves context that would be lost** — things not obvious from code or docs
- **Stays focused** — one entry per coherent topic, not a dump of everything discussed

### What makes a good Summary

- **Dense and factual** — every sentence carries information
- **Self-contained** — readable without opening individual entries
- **Up-to-date** — reflects the latest state, not just the first entry
- **Prioritized** — most important facts first

## Reading Workflow

When you need to recall past knowledge:

1. **Read `MEMORY.md`** — scan the topic list to find relevant topics
2. **Read the topic README** (`memory/{topic}/memory.md`) — the Summary often has enough information
3. **If you need more detail** — check the Index in the README, then read specific entries starting from the most recent

Most of the time, the Summary in the topic README is sufficient. Only drill into individual entries when you need the original reasoning, exact quotes, or details that the summary compressed away.

## Maintenance

Memory maintenance is not only appending entries. Shadow mode may perform maintenance when it notices drift, duplication, obsolete facts, or weak summaries. Maintenance has three goals:

- **Merge** overlapping topics or entries when they represent the same durable concept.
- **Forget** obsolete or low-value details when they no longer help future decisions; remove them or mark them superseded so they do not mislead.
- **Strengthen** important memories by rewriting summaries to surface the current state, key constraints, and user corrections first.

Do not over-maintain. Prefer small targeted cleanup when stale memory would affect decisions, or when a topic summary has become too noisy to guide future sessions.

### Updating Summaries

When a topic accumulates several entries, the Summary may drift from the current state. Periodically re-read all entries under a topic and rewrite the Summary to reflect the latest knowledge. Also update summaries immediately when a task completion, user correction, or status change contradicts an existing memory. This is especially important when:
- New information contradicts or supersedes older entries
- The topic has grown significantly since the last summary update
- You notice the Summary is missing important facts during a read

### Merging Topics

If two topics turn out to overlap significantly, merge them:
1. Create a new topic (or keep the broader one)
2. Move relevant entries
3. Rewrite the Summary
4. Update `MEMORY.md`
5. Remove the empty topic directory

### Cleaning Up

- Remove entries that are no longer relevant (the decision was reversed, the project ended, etc.)
- After removing entries, update the Index and Summary in the topic README
- Remove empty topic directories and their entries from `MEMORY.md`
