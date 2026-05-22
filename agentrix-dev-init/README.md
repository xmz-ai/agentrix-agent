# Agentrix Dev Init

Agentrix Dev Init is a repository initialization agent. It creates the fixed `.agentrix/` bootstrap files through a session-start hook, then guides the LLM to inspect the target repository and author `.agentrix/env/` documentation.

The fixed files are:

- `.agentrix/README.md`
- `.agentrix/prompt.md`
- `.agentrix/plugins/agentrix-devops/skills/agentrix-development-workflow/SKILL.md`
- `.agentrix/plugins/agentrix-devops/skills/agentrix-test-memory/SKILL.md`
- `.agentrix/plugins/agentrix-devops/skills/webapp-testing/SKILL.md`
- `.agentrix/env/test/README.md`
- `.agentrix/env/.gitignore`

The LLM-authored files are under `.agentrix/env/`, guided directly by `claude/system_prompt.md`.
