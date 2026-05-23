# Plan: Preserve Existing Local Files on Dev Init Re-run

## Approach

Patch `agentrix-dev-init/claude/system_prompt.md` at the source of behavior. Add explicit re-run rules before the partial-initialization section and reinforce the authoring rules.

## Affected Files

- `agentrix-dev-init/claude/system_prompt.md`

## Constraints

- Do not change fixed hook/template behavior unless evidence shows it overwrites model-authored local files.
- Do not broaden model-authored scope.
- Do not create runtime code for this prompt-only correction.

## Verification

- Inspect the prompt text and confirm it instructs read-before-write, narrow merge, ask-user before overwrite, and special protection for local state/auth/setup files.
- Run repository diff check.
