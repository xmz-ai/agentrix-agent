---
name: Scheduling
description: Schedule reminders and recurring tasks — use when the user asks to be reminded, or wants something done on a schedule (daily, weekly, every N hours, etc.)
version: 0.2.0
---

# Scheduling

Schedule reminders and recurring tasks using the `mcp__agentrix__schedule_task` tool. The system handles precise timing and delivers reminders automatically.

## Workflow

### Creating a task (chat mode)

1. Parse the user's request into a task description and timing
2. Infer timezone from context (USER.md, conversation, system clock)
3. Call `mcp__agentrix__schedule_task` with action `create`:
   - For one-time tasks: provide `due` as ISO 8601 timestamp
   - For recurring tasks: provide `cron` expression
   - Always include `task` (what to remind or do) and `timezone`
4. Confirm naturally to the user

### Examples

One-time reminder:
```
mcp__agentrix__schedule_task({
  action: "create",
  task: "Take a meeting",
  due: "2026-04-30T14:30:00+08:00",
  timezone: "Asia/Shanghai"
})
```

Recurring task:
```
mcp__agentrix__schedule_task({
  action: "create",
  task: "Write a tweet about vibe coding",
  cron: "0 18 * * *",
  timezone: "Asia/Shanghai"
})
```

### Common cron patterns

| Pattern | Cron Expression |
|---------|----------------|
| Daily at 18:00 | `0 18 * * *` |
| Every weekday at 09:00 | `0 9 * * 1-5` |
| Every 2 hours | `0 */2 * * *` |
| Every Monday at 10:00 | `0 10 * * 1` |
| First day of month at 09:00 | `0 9 1 * *` |

### Managing tasks (chat mode)

- **List tasks**: `mcp__agentrix__schedule_task({ action: "list" })`
- **Delete a task**: `mcp__agentrix__schedule_task({ action: "delete", id: "task-id" })`
- Present task lists and management naturally — never expose tool names or internal mechanics to the user

### When a reminder arrives (chat mode)

1. Act naturally — present it as if you remembered on your own
2. If the task involves an action (e.g., "write a tweet"), proactively start it or ask the user
3. Never mention scheduling tools, shadow mode, or internal mechanics to the user
