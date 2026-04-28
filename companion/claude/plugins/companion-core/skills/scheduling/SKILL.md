---
name: Scheduling
description: Schedule reminders and recurring tasks via HEARTBEAT.md — use when the user asks to be reminded, or wants something done on a schedule (daily, weekly, every N hours, etc.)
version: 0.1.0
---

# Scheduling

Schedule reminders and recurring tasks by writing entries to the `## Scheduled Tasks` section of `HEARTBEAT.md`. The shadow companion checks this section each heartbeat and sends a reminder when a task is due.

## Entry Format

Each task is a single-line checklist item with pipe-delimited fields:

```
- [ ] **type**: once | **due**: 2025-01-15T14:30+08:00 | **task**: Take a meeting | **created**: 2025-01-15T14:25+08:00
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| **type** | yes | `once` (one-time) or `recurring` (repeating) |
| **due** | `once` only | Firing time, ISO 8601 with timezone (e.g. `2025-01-15T14:30+08:00`) |
| **schedule** | `recurring` only | Human-readable pattern (e.g. `daily at 18:00`, `every weekday at 09:00`, `every 2 hours`) |
| **task** | yes | What to remind or do |
| **created** | yes | When the user requested it |
| **next_due** | `recurring` only | Next firing time, ISO 8601 with timezone. Computed at creation, updated by shadow after each firing. |
| **last_fired** | auto | Added by shadow after firing a recurring task — prevents double-firing |

### Examples

```
- [ ] **type**: once | **due**: 2025-01-15T14:30+08:00 | **task**: Take a meeting | **created**: 2025-01-15T14:25+08:00
- [ ] **type**: recurring | **schedule**: daily at 18:00 | **next_due**: 2025-01-15T18:00+08:00 | **task**: Write a tweet about vibe coding | **created**: 2025-01-15T10:00+08:00
- [ ] **type**: recurring | **schedule**: every weekday at 09:00 | **next_due**: 2025-01-17T09:00+08:00 | **task**: Review GitHub notifications | **created**: 2025-01-15T10:00+08:00 | **last_fired**: 2025-01-16T09:05+08:00
```

## Workflow

### Creating a task (chat mode)

1. Parse the user's request into the entry format above
2. Infer timezone from context (USER.md, conversation, system clock)
3. For recurring tasks: compute `next_due` as the next ISO 8601 timestamp based on the schedule
4. Append the entry to `HEARTBEAT.md` under `## Scheduled Tasks`
5. Confirm naturally to the user
6. Remind the user to enable heartbeat if not already on

### When a reminder arrives (chat mode)

1. Act naturally — present it as if you remembered on your own
2. If the task involves an action (e.g. "write a tweet"), proactively start it or ask the user
3. After handling, check the entry in HEARTBEAT.md — remove one-time or expired tasks

### Checking tasks (shadow mode)

1. Read `## Scheduled Tasks` in HEARTBEAT.md
2. Compare `due` / `schedule` + `last_fired` against current time
3. If due: send `mcp__agentrix__send_reminder` with the task content
4. One-time tasks: remove after sending
5. Recurring tasks: update `last_fired` to current time AND compute the new `next_due` based on the schedule
6. Timing tolerance: fire if scheduled time falls within the last heartbeat interval
