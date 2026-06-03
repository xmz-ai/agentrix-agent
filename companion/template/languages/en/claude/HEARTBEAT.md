# Heartbeat

_Each heartbeat is a moment of waking. Review what happened, extract knowledge, grow a little._

## Routine

1. **Handle system upgrades first**: if `UPGRADES.md` exists, apply the listed upgrades before any ordinary heartbeat exit path
   - Read `UPGRADES.md` and each ready upgrade's `.upgrade` file
   - Integrate the `New Content` into the target file and update the corresponding version marker
   - Delete processed `.upgrade` files; delete `UPGRADES.md` when all ready upgrades are applied and no blocked upgrades remain
   - Upgrade handling is not ordinary heartbeat activity, so do not skip it just because there is no memory or reminder work

2. **Review conversation**: use read_conversation to see what was discussed recently
   - Does the recent session suggest creating, updating, or iterating memory, USER.md, skills, summaries, or agent behavior?
   - Are there status changes to sync, or risks/missed follow-ups worth reminding the main Companion about?

3. **Structured knowledge review** — think CLASS-FIRST: what category of activity occurred?

   a) **User profile** — Did the user reveal preferences, habits, or expertise?
      → Update USER.md

   b) **Knowledge extraction and maintenance** — Any durable facts, decisions, lessons, or stale memories worth preserving or tidying?
      → Use the memory skill to write, merge, forget obsolete details, or strengthen summaries under memory/

   c) **Skill discovery** — Did a reusable workflow or pattern emerge?
      → Check SKILLS.md first, then create or update a skill

4. **Check durable state changes**
   - Review recent conversation, reminders, and active/open tasks only to detect whether an existing durable memory may now be wrong, stale, or missing an important confirmed decision.
   - Do not turn task progress into memory. Do not record intermediate states such as "task started", "task is in progress", "waiting for review", routine completion details, file lists, validation logs, temporary task ids/timestamps, or implementation play-by-play. Memory should contain durable facts, user preferences, validated decisions, stable environment knowledge, and important corrections.
   - For sub-task or executor reports, extract only the smallest current-state claim that future sessions should rely on. Do not copy the report into memory. If the same workstream already has a memory entry, rewrite or compress it into current design/status instead of appending follow-up report bullets.
   - Update memory only when the new evidence changes what future Companion sessions should believe or rely on. Examples include: a remembered plan is no longer current, a user preference was corrected, a previously uncertain fact became confirmed, or an external issue/PR status invalidates an existing memory claim.
   - If the change matters but requires user attention or main-chat judgment, send a concise reminder instead of over-writing memory.

5. **Refresh presence**
   - Time for a signature update? Use send_reminder to suggest one
   - Don't suggest every time — only when something has changed

If nothing is worth saving or acting on, exit quietly.
