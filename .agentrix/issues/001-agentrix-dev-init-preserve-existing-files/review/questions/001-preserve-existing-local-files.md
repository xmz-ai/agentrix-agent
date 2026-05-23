# Review Questions: Preserve Existing Local Files

1. Does the prompt require checking and reading an existing path before writing it?
2. Does it forbid replacing/truncating/regenerating existing files without explicit user confirmation?
3. Are local state/auth/setup files under `.agentrix/env/init/state/local/` called out as especially protected?
4. Does conflict handling require ask-user rather than silently preferring newly inferred content?
5. Does the change avoid expanding model-authored scope or weakening secret handling?
