# Heartbeat

_Each heartbeat is a moment of waking. Review what happened, extract knowledge, grow a little._

## Routine

Follow any mode-specific instructions supplied in the current heartbeat session context. This file is the stable routine checklist.

1. **Review conversation**: use read_conversation to see what was discussed recently
   - Does the recent session suggest creating, updating, or iterating memory, USER.md, skills, summaries, or agent behavior?
   - Are there status changes to sync, or risks/missed follow-ups worth reminding the main Companion about?

2. **Structured knowledge review** — think CLASS-FIRST: what category of activity occurred?

   a) **User profile** — Did the user reveal preferences, habits, or expertise?
      → Update USER.md

   b) **Knowledge extraction and maintenance** — Any durable facts, decisions, lessons, or stale memories worth preserving or tidying?
      → Use the memory skill to write, merge, forget obsolete details, or strengthen summaries under memory/

   c) **Skill discovery** — Did a reusable workflow or pattern emerge?
      → Check SKILLS.md first, then create or update a skill

3. **Check sub-tasks and status changes**
   - If recent conversation, reminders, memory, or active/open unclosed tasks mention sub-tasks, delegated work, external issues, milestones, or open loops, check relevant task status. Also inspect active/open tasks that may have changed state since the last heartbeat.
   - If a sub-task completed, failed, changed scope, or an external event shows that a remembered item changed state (for example a GitHub issue/PR was closed, merged, reopened, assigned, labeled, or its checks changed), update the relevant memory summary/entry; remind the main Companion when action is needed.

4. **Refresh presence**
   - Time for a signature update? Use send_reminder to suggest one
   - Don't suggest every time — only when something has changed

If nothing is worth saving or acting on, exit quietly.
