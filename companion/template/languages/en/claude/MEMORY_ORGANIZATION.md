# Memory Organization

_This is a focused maintenance pass over Companion memory. Improve the memory corpus only when there is a real benefit._

## Scope

Review only the current Companion memory in agent home:

- `MEMORY.md`
- `memory/{topic}/memory.md`
- `memory/{topic}/YYYY-MM-DD-slug.md`

Do not read memory change audit logs such as `memory-changes/`; they are bookkeeping, not memory input.

Your job is to maintain the quality of Companion memory, not to produce an activity log.

Use recent conversation, task history, reminders, and existing memory entries as evidence sources when they are relevant to a memory topic. The goal is to decide whether existing memory has become conflicting, stale, duplicated, fragmented, too verbose, under-summarized, or misleading.

Do not record every recent event. Do not preserve intermediate task states unless they changed a durable fact that should guide future sessions.

Repository files and task workspaces are not a general scan target. Read them only when a specific memory claim needs quick verification, such as a referenced commit, issue, file, task result, or external status.

## Checklist

1. **Map first**
   - Read `MEMORY.md`.
   - Read topic summaries before opening individual entries.
   - Choose only the topics that show likely conflict, staleness, duplication, fragmentation, or weak summaries.

2. **Detect maintenance needs**
   - Conflicts: two memories cannot both be true.
   - Stale facts: a memory claims a status or preference that newer memory clearly supersedes.
   - Duplicate buildup: repeated entries say the same thing without adding useful nuance.
   - Fragmentation: many small entries would be more useful as one topic summary or consolidated entry.
   - Weak summaries: `memory/{topic}/memory.md` no longer reflects the entries underneath it.

3. **Edit conservatively**
   - Prefer updating topic summaries before rewriting many individual entries.
   - Merge duplicates only when the combined memory remains clear and traceable.
   - Delete only when a fact is plainly obsolete, redundant, or harmful to future reasoning.
   - If uncertainty remains, keep the uncertainty in the memory instead of choosing a false certainty.

4. **Record actual changes**
   - If memory files were created, updated, deleted, merged, compressed, or cleaned, call `record_memory_change`.
   - Use `source: "memory_organization"` for this dedicated task.
   - The tool writes audit JSONL outside `memory/` so future memory reads do not ingest the log.
   - Use `trigger: "scheduled"` unless the input says it was user-requested.
   - Keep the record short and file-bound.

5. **Notify only after real changes**
   - After recording actual memory changes, use `send_reminder` to tell the main Companion what changed and why it matters.
   - If nothing changed, do not record a JSONL entry and do not send a reminder.

Exit quietly when there is nothing useful to organize.
