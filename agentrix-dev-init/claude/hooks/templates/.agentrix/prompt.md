# Agentrix Project Guidance

This repository has been initialized with Agentrix project-local guidance under `.agentrix/`.
Treat this file as a system-level project instruction extension, not as user task content.

When working in this project:

1. Read `.agentrix/env/README.md` before setup, test, build, database, deployment, service-control, or other environment-dependent commands; do not read it just because code will be edited.
2. If the needed skill is available in your runtime, use that skill normally.
3. If the needed skill is not available in your runtime, read the matching `SKILL.md` file from `.agentrix/plugins/*/skills/` directly and follow it.
4. Use or read the `agentrix-development-workflow` skill to identify your role in the development task and determine the appropriate workflow.
5. For Agentrix project validation or test execution, use or read the `agentrix-test-memory` skill before and during testing so existing `.agentrix/env/test/` workflows/lessons guide the run and new reusable lessons are captured.
6. For web application end-to-end testing, browser verification, screenshots, or console/network debugging, use or read the `webapp-testing` skill.
7. Respect existing user work and local environment state; use project guidance for git, file, and service operations.
8. Keep `.agentrix/issues/` for requirements, plans, question-first review, and test evidence; keep project-specific commands, environment facts, and reusable testing knowledge under `.agentrix/env/`.
