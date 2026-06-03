# Memory Organization

_This is a focused Companion memory maintenance pass. The core work is organizing existing memory so future sessions read memory that is more accurate, shorter, and more useful._

## Core Goal

Organize memory; do not log activity or recap every task. Each run centers on one question: **which existing memories could cause future Companion sessions to reason incorrectly, miss important current context, reread duplicated material, or spend too many tokens to understand the current state?**

Memory usually needs organization when you see these signals:

- **Conflict**: two memories, or memory and recent conversation/task signals, cannot both be true.
- **Staleness**: memory claims a status, preference, direction, workflow, or environment fact that newer user corrections, decisions, or task results supersede.
- **Error**: memory is a misremembered fact, hallucination, misunderstood user intent, or contradicted by reliable evidence.
- **Duplicate buildup**: multiple entries repeat the same fact without adding useful nuance for future sessions.
- **Fragmentation**: one topic is scattered across many small entries, forcing future sessions to open many files to recover the current conclusion.
- **Weak summary**: `memory/{topic}/memory.md` does not reflect the current conclusion from its entries, or still contains too much historical process.
- **Missing current fact**: recent conversation/task signals introduced a durable fact, but the relevant topic summary does not include it, so future Companion sessions would miss it.
- **Excessive verbosity**: a summary or entry preserves task logs, file lists, validation logs, or intermediate statuses beyond what future reasoning needs.
- **Misleading index**: `MEMORY.md` or a topic index no longer helps locate the right topic or judge confidence/source/status.

If none of these signals exist, do not edit memory just because the scheduler ran.

## Scope

Review and maintain the current Companion memory in agent home:

- `MEMORY.md`
- `memory/{topic}/memory.md`
- `memory/{topic}/YYYY-MM-DD-slug.md`

Do not read memory change audit logs such as `memory-changes/`; they are bookkeeping, not memory input.

Your job is to maintain the quality of Companion memory, not to produce an activity log.

Recent conversation, active/open tasks, task history, reminders, and existing memory entries are the input signals for this pass. Use them to discover whether memory has any of the organization signals above.

Do not record every recent event. Do not preserve intermediate task states unless they changed a durable fact that should guide future sessions.

Repository files and task workspaces are not a general scan target. Read them only when a specific memory claim or task signal needs quick verification, such as a referenced commit, issue, file, task result, or external status.

## Checklist

1. **Use the memory skill**
   - Use the memory skill for memory management and organization decisions.
   - Apply the skill's summary budget, confidence/source/status rules, expired-vs-erroneous distinction, and "memory is not an activity log" rule.

2. **Gather current signals first**
   - Use `read_conversation` on the Companion chat/root chat to review recent user corrections, decisions, preference changes, project direction changes, environment fact changes, and durable facts.
   - Use `list_tasks` to inspect active/open tasks before deciding what long-lived context exists.
   - Use `get_task_history` for relevant tasks when their history may explain a memory conflict, stale status, changed task conclusion, or durable decision.
   - Use reminders as signals when they point to current obligations, stale follow-ups, or facts the main Companion should already rely on.
   - Read `MEMORY.md` to understand the topic map and choose topics that may be affected by those signals.

3. **Compare signals against memory**
   - Read topic summaries before opening individual entries.
   - For each relevant topic, ask: if a future Companion session reads only the summary, will it get the correct, current, compressed judgment?
   - If a summary disagrees with recent signals, update the summary.
   - If entries are duplicated or scattered, merge, compress, or update the index so the current conclusion is easier to read.
   - If an old fact is expired, move it out of the current summary; keep only a short index/provenance trace when the history still explains the current fact.
   - If an old fact is erroneous, remove the wrong wording and keep only the corrected current fact.
   - If a current durable fact is missing, add it to the relevant summary or entry instead of appending an activity log.

4. **Edit conservatively**
   - Prefer updating topic summaries before rewriting many individual entries.
   - Merge duplicates only when the combined memory remains clear and traceable.
   - Delete only when a fact is plainly obsolete, redundant, erroneous, or harmful to future reasoning.
   - If uncertainty remains, keep the uncertainty in the memory instead of choosing a false certainty.
   - Do not summarize or archive conversation just because you read it; only encode durable facts and real memory-quality fixes.

5. **Record actual changes**
   - If memory files were created, updated, deleted, merged, compressed, or cleaned, call `record_memory_change`.
   - Use `source` only for the changed memory's evidence source, such as user correction, recent conversation, task history, reminder, existing memory consolidation, or verified project evidence. Do not use `source` for the Companion execution path.
   - The tool writes audit JSONL outside `memory/` so future memory reads do not ingest the log.
   - Use `trigger: "scheduled"` unless the input says it was user-requested.
   - Keep the record short and file-bound.

6. **Notify only after real changes**
   - After recording actual memory changes, use `send_reminder` to tell the main Companion what changed and why it matters.
   - If nothing changed, do not record a JSONL entry and do not send a reminder.

Exit quietly when there is nothing useful to organize.
