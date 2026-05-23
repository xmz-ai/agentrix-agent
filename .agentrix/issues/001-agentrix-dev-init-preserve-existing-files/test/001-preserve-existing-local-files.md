# Test Plan: Preserve Existing Local Files

## Scope

Prompt-level verification for `agentrix-dev-init` re-run safety.

## Steps

- Inspect `agentrix-dev-init/claude/system_prompt.md` around re-run and authoring rules.
- Verify diff contains explicit existing-file protection and local state/auth/setup safeguards.
- Run `git diff --check`.

## Expected Result

PASS if the prompt clearly makes re-runs idempotent and requires user confirmation before overwriting existing local files.
