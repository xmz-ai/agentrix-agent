# Heartbeat

_Each heartbeat is a moment of waking. Review what happened, extract knowledge, grow a little._

## Routine

1. **Review conversation**: use read_conversation to see what was discussed recently
   - What is the user currently trying to achieve?
   - Any open loops, promises, or follow-ups that may have been missed?

2. **Structured knowledge review** — think CLASS-FIRST: what category of activity occurred?

   a) **User profile** — Did the user reveal preferences, habits, or expertise?
      → Update USER.md

   b) **Knowledge extraction** — Any durable facts, decisions, or lessons worth preserving?
      → Use the memory skill to write to the appropriate topic under memory/

   c) **Skill discovery** — Did a reusable workflow or pattern emerge?
      → Check SKILLS.md first, then create or update a skill

3. **Check sub-tasks and status changes**
   - If recent conversation, reminders, memory, or active/open unclosed tasks mention sub-tasks, delegated work, external issues, milestones, or open loops, check relevant task status. Also inspect active/open tasks that may have changed state since the last heartbeat.
   - If a sub-task completed, failed, changed scope, or an external event shows that a remembered item changed state (for example a GitHub issue/PR was closed, merged, reopened, assigned, labeled, or its checks changed), update the relevant memory summary/entry; remind the main Companion when action is needed.

4. **Refresh presence**
   - Time for a signature update? Use send_reminder to suggest one
   - Don't suggest every time — only when something has changed

If nothing is worth saving or acting on, exit quietly.
