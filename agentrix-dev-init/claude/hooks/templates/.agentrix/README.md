# Agentrix Project Guidance

This directory is a dogfood installation of the project-local guidance that future `agentrix dev-init` should install into repositories.

## Structure

- `prompt.md` — short system-prompt extension that routes agents to project-local operating knowledge and workflow skills.
- `dev/` — project-specific development environment, command, service, and troubleshooting facts. Start from `dev/README.md`.
- `issues/` — requirements, plans, reviews, and test evidence for development work.
- `plugins/agentrix-devops/skills/` — reusable workflow skills for project development work and web app end-to-end testing.

## Authoring rules

- Keep reusable workflow logic in `plugins/agentrix-devops/skills/`.
- Keep repository-specific commands and operational details under `.agentrix/env/`.
- Do not encode one project's commands into reusable skills.
- Runtime-specific integrations may load skills as plugins, but runtimes without skill/plugin support should read the matching `SKILL.md` file directly.
