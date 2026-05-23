# 001 Agentrix Dev Init Preserve Existing Files

# Git

No external issue linked.

# Background

A user re-ran Agentrix Dev Init against a project that already had local `.agentrix/env/` files. Existing local files were overwritten. Re-running dev-init must be safe and idempotent because `.agentrix/env/init/state/local/` can contain machine-specific setup decisions, ignored helper scripts, and authentication-state conventions.

# Requirement

Strengthen the `agentrix-dev-init` prompt so the agent checks existing model-authored files before writing and preserves existing local files by default. Any overwrite, reset, truncation, or full regeneration of existing local state/auth/setup files must require explicit user confirmation for the specific path.

# Acceptance Criteria

- The prompt states that existing `.agentrix/env/` files must be read before modification.
- Existing files are updated by narrow merge/patch by default, not full replacement.
- Existing files under `.agentrix/env/init/state/local/`, including auth files and `setup-local-values.sh`, are never overwritten/deleted/recreated without explicit user confirmation for the exact path.
- Re-run behavior is idempotent and treats existing local state/auth/setup files as source-of-truth unless user requests reset.
- Conflicts between repository evidence and existing local state trigger ask-user instead of silent replacement.
