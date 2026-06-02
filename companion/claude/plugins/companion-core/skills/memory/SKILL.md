---
name: Memory Management
description: Hierarchical memory system — how to organize, write, read, and maintain memories across sessions
version: 0.4.3
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

### MEMORY.md (Top-Level Topic Index)

`MEMORY.md` is only the map of memory topics. Keep it short and stable: one line per topic with a path and a one-line description. Do not put project history, long summaries, dated entry indexes, or implementation details here.

```markdown
# Memory

_A short map. Read the relevant topic README next._

## Topics

- `memory/user-preferences/` — Communication style, collaboration preferences, and durable corrections
- `memory/project-alpha/` — Architecture decisions and current direction for Project Alpha
- `memory/dev-environment/` — Stable local setup and tool behavior facts
```

Rules for `MEMORY.md`:

- Keep each topic line to one concise sentence.
- Add a topic only when it represents a durable category, not a single event.
- Remove or merge topic lines when topics overlap.
- Never paste a topic summary or entry list into top-level `MEMORY.md`.

### memory/{topic}/memory.md (Topic README)

Each topic README has two required sections: **Summary** and **Index**.

`Summary` is the compressed current state for that topic. It is NOT a mini-history and NOT a place to preserve every important-looking detail. It should be short enough to read quickly, but rich enough that future sessions usually do not need to open individual entries. Prefer a few focused paragraphs or bullets over a timeline. Put the latest corrections and current operating rules first; omit obsolete implementation play-by-play.

**Hard Summary budget:** default max **5 bullets or 5 short paragraphs**, roughly **150-300 words**. For broad project topics, use at most **8 bullets / 500 words**. If the Summary needs more, the topic is probably too broad or the details belong in the Index/dedicated entries. Do not exceed the budget just because a task was complex.

`Index` lists dated entries and is the provenance/navigation layer. For topics with more than a handful of entries, group the Index under second-level subheadings (`### ...`) such as areas, milestones, or subtopics. These subheadings are useful and expected: they make the second-level `memory.md` navigable without bloating the Summary.

```markdown
# Project Alpha

## Summary

Project Alpha is a React + FastAPI app. The current architecture uses PostgreSQL for relational data, Tailwind on the frontend, and hexagonal backend boundaries. The latest auth decision is JWT access tokens in memory plus httpOnly refresh cookies; older session-based notes were removed after the current decision and rationale were preserved.

## Index

### Architecture
- `2026-04-28-initial-architecture.md` — Chose React, FastAPI, PostgreSQL, and hexagonal backend boundaries

### Authentication
- `2026-04-30-api-auth-design.md` — Decided on JWT access tokens plus httpOnly refresh cookies

### Deployment
- `2026-05-02-fly-deployment.md` — Chose Fly.io deployment target and documented constraints
```

The Summary is the most important part, but it must stay compressed. A reader who only reads the Summary should understand the current state, key constraints, and latest corrections — not the full history. The Index is the provenance/navigation layer: it should carry source, confidence, status, and pointers to detail without repeating full summaries.

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
- A previously remembered fact becomes outdated or incorrect; update the current state and delete stale obsolete wording after preserving any still-useful rationale.
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
4. Periodically tidy older memory when the heartbeat has enough context and budget: merge overlapping topics, remove or mark obsolete entries, rewrite summaries to emphasize the most important current facts within the Summary budget, and keep detailed old entries as backup only when they still add value.
5. Classify by topic using CLASS-FIRST thinking: describe the category in one sentence before deciding what to save.
6. Follow the same write workflow as chat mode.
7. If nothing is worth saving or tidying, stop — don't create or rewrite memory for the sake of activity.

### What makes a good entry

- **Captures decisions and their reasoning** — not just "chose X" but "chose X because Y"
- **Records corrections** — what was wrong, what's right, why it matters
- **Preserves context that would be lost** — things not obvious from code or docs
- **Stays focused** — one entry per coherent topic, not a dump of everything discussed

### What makes a good Summary

- **Compressed first** — default max 5 bullets/paragraphs (150-300 words); broad topics max 8 bullets/500 words.
- **Current-state only** — describe what is true now; move history and provenance to the Index/entries.
- **Dense and factual** — every sentence carries information; delete filler and play-by-play.
- **Self-contained** — readable without opening individual entries for ordinary decisions.
- **Up-to-date** — reflects the latest corrections; stale facts are removed after any useful rationale is preserved.
- **Prioritized** — most important facts first; if everything seems important, classify by current decision value.

Why previous wording failed: "short enough" and "few focused paragraphs" were subjective, while "rich enough that future sessions usually do not need to open entries" encouraged over-including details. The rule now has a numeric budget and moves detail/provenance responsibility to the Index.

### Confidence/source/status display

When a topic uses confidence metadata, display it in **both Summary and Index**. Do not create a separate CandidateMemory type; confidence is metadata on normal memory nodes/claims.

#### Summary claim format

Use Summary labels for current-state claims:

```markdown
- **Claim name** `[confidence · source · state]`: compressed current fact and the action implication.
```

The Summary answers: "What should the model believe/use now, how strongly, and where did it come from?" Summary labels may be omitted only for trivial evergreen facts where every claim shares the same confidence; otherwise label each bullet/paragraph. Summary should normally contain only `current` claims; `expired` belongs in the Index or a short provenance note only when it explains the current state.

Example:

```markdown
- **Value positioning** `[confirmed · user correction + live experience · current]`: Computer Use is not a short-term main selling point for complex multi-step GUI operation; it is better for user/environment understanding and UI verification.
```

#### Index entry format

Use Index labels for source files/provenance:

```markdown
- `YYYY-MM-DD-slug.md` — one-line description `[confidence · source · state]`
```

If an entry contains multiple confidence/state classes, use `mixed` and add 1-3 indented bullets for **current usable content and meaningful expired history**. Do not add `removed` traces.

```markdown
- `2026-05-25-proactive-computer-use-agent-idea.md` — Computer Use architecture and roadmap `[mixed · user requirements + companion analysis + research · current/expired]`
  - confirmed/current: user requirements and privacy constraints.
  - likely/current: architecture analysis still useful for planning.
  - expired: early self-built daemon route was once a real plan, but current route is Cua Driver/CLI.
```

The Index answers: "What kind of evidence/source is this file, should the model open it, and how strongly should it trust it?" It is a provenance map, not a second Summary. Keep each index line one sentence; mixed bullets are allowed for current usable distinctions and meaningful expired history.

#### Labels

- `confidence`: `confirmed`, `likely`, `provisional`, or `mixed` for entries containing multiple classes.
- `source`: e.g. `user correction`, `user statement`, `sub-task commit/report`, `live test`, `design analysis`, `monitoring summary`, `imported document`.
- `state`: `current`, `unconfirmed`, or `expired`.

#### Expired vs erroneous

Distinguish carefully:

- **Expired** = was valid or useful at the time, but is no longer the current state because the project moved on, the plan was replaced, or the environment changed. Keep a concise trace in the Index/provenance when it helps explain why the current memory is true. Do not use it as current belief.
- **Erroneous** = was wrong, misremembered, hallucinated, or contradicted by the user/evidence. Delete it; do not keep a tombstone. Preserve only the corrected current fact or rule.

#### Model behavior from confidence/state

- `confirmed + current`: may be used as fact, subject to normal risk checks for external/irreversible actions.
- `likely + current`: may guide planning/explanation; verify before high-risk action, person-sensitive judgment, or when conflicting evidence appears.
- `provisional` or `unconfirmed`: clue only; ask/verify before relying on it.
- `expired`: provenance/history only; never use as current belief.

#### Deleting or expiring non-current content

When content becomes non-current, first classify it:

1. **Erroneous** → delete. Rewrite the surviving memory as the corrected positive fact; do not keep `wrong/removed/deleted` traces.
2. **Expired** → keep only a concise provenance trace if it explains the current state or prevents re-litigating a past decision; otherwise delete after extracting the current lesson/rationale.

The evolution trail should explain meaningful changes in current memory, not preserve every dead branch.

## Reading Workflow

When you need to recall past knowledge:

1. **Read `MEMORY.md`** — scan the topic list to find relevant topics
2. **Read the topic README** (`memory/{topic}/memory.md`) — the Summary often has enough information
3. **If you need more detail** — check the Index in the README, then read specific entries starting from the most recent

Most of the time, the Summary in the topic README is sufficient. Only drill into individual entries when you need the original reasoning, exact quotes, or details that the summary compressed away.

## Maintenance

Maintenance is a first-class memory operation, not an occasional cleanup. The goal is to prevent memory from becoming an append-only pile of stale entries while avoiding mechanical over-cleanup. Every write should consider whether it can also merge, compact, expire, or delete older content, but only do so when it improves future recall.

### Operations

- **Merge** — fold overlapping topics or entries that describe the same durable concept into one topic or one consolidated entry.
- **Strengthen** — rewrite a Summary so the current state, key constraints, latest user corrections, confidence, and provenance come first within the Summary budget.
- **Expire** — mark only meaningful formerly-valid content as `expired` in the Index/provenance when it explains the current state or prevents re-litigating a past decision.
- **Forget / replace** — delete erroneous content, low-value process logs, and expired details that no longer explain current state after extracting any still-useful rationale.

### Consolidation check

Do not default to append-only. On memory writes, run this quick consolidation check when the new information touches an existing topic, changes prior state, or risks adding duplicate/process-log noise:

1. **Same topic?** If today's fact belongs to an existing topic, update that topic instead of creating a new topic.
2. **Same-day / same-workstream?** Append to or rewrite the same-day entry unless a truly separate durable decision needs its own file.
3. **Does this supersede older content?** Classify the older content as `erroneous` vs `expired`:
   - erroneous → delete wrong wording; keep only the corrected current fact.
   - expired → keep one concise Index/provenance trace only if it explains the current state; otherwise delete.
4. **Can several old entries be collapsed?** If a completed workstream has many process-log entries, consolidate them into one current-state entry and delete the noisy sources.
5. **Update the Summary and Index when the big picture changes** so the topic README remains the useful entry point.

Use entry count as a smell, not a hard threshold. If a topic or workstream feels hard to scan, duplicated, or stale, consolidate before adding more. If the new memory is small, independent, and does not make the topic harder to use, a simple append is fine.

### Cleanup signals

Cleanup/merge should be considered when any of these occur. Use judgment: act when stale or duplicated memory would mislead future decisions or make the topic harder to scan; do not perform mechanical cleanup just because a signal appeared.

- A topic README Summary exceeds the Summary budget or stops presenting current state quickly.
- A topic has many dated entries that are mostly process logs around a now-stable outcome.
- Multiple entries describe the same direction, roadmap, architecture, or preference.
- A new user correction makes older memory wrong or misleading.
- A project milestone completes, is cancelled, is replaced, or is pushed/merged and existing memory would otherwise describe the old state.
- You notice stale or duplicated facts while reading memory.

### Merge and cleanup procedure

1. **Inventory** — list the entries in the topic and group them by durable concept/workstream.
2. **Extract current state** — write the surviving decisions, rationale, confidence/source/state, and user corrections into the Summary or one consolidated current-state entry.
3. **Classify old material**:
   - current and useful → keep.
   - expired but explanatory → keep only a concise `expired` trace in the Index/provenance.
   - erroneous → delete.
   - low-value process/history → delete after extracting the current lesson, if any.
4. **Collapse files** — move useful content into the consolidated entry, then delete obsolete source files rather than leaving them indexed forever.
5. **Rebuild Index** — every remaining entry gets a one-line description plus `[confidence · source · state]`; mixed entries get at most 1-3 bullets for current/expired distinctions.
6. **Rebuild Summary** — max 5 bullets/paragraphs (150-300 words), or broad-topic max 8 bullets/500 words. If it is still too long, split the topic or move detail to entries.
7. **Reconcile top-level `MEMORY.md`** — remove empty/merged topics and fix renamed topic descriptions.

### Protected classes — preserve rationale before expiring/deleting

Some content must never be deleted blindly during compaction. If it is wrong or outdated, first classify it as erroneous vs expired. For expired protected content, preserve a concise provenance/rationale trace. For erroneous content, keep only the corrected current fact/rule and delete the wrong wording:

- User preferences, corrections, and communication style
- Identity / SOUL facts
- Strategic decisions, roadmaps, and prioritization (the "why we chose this direction")
- Architecture/design decisions together with their rationale
- Security, privacy, and safety facts and guardrails

Rule of thumb: if losing it would make a future session re-litigate a settled decision or repeat a past mistake, extract and keep the rationale before expiring or deleting stale wording. Do not preserve entire old entries just because they once mattered.

### Safe to forget — collapse into current state

These should be compressed aggressively because their value is fully captured by the current state:

- Process logs / play-by-play of how something was built
- Completed task progress and work logs
- Reverted or abandoned attempts (expired only if they were once valid/useful and explain the current direction; erroneous details are deleted)
- Tool outputs, commit file lists, and validation logs that can be found in git/task history
- Anything derivable from code, git history, or project files

### Merging Topics

If two topics overlap significantly: keep the broader/current one (or create a new one), move only useful current/provenance content, rewrite the Summary, rebuild the Index, update `MEMORY.md`, and remove the empty topic directory.


### Memory evolution trail

The evolution trail is the concise provenance of current memory, not a full version history. Every merge/strengthen/expire/forget-or-replace may leave a short note about *what changed, why, what evidence/event triggered it, and whether the user confirmed it* when that note helps future decisions. Keep concise traces for expired content that was once valid and still explains the current state; delete erroneous and low-value dead branches.
