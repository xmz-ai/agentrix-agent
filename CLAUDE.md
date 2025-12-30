# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Agent Builder** repository - a meta-agent that helps users design and create custom AI agents through conversation. Agent Builder is itself a plugin-based agent, demonstrating the architecture it helps users create.

## Build Commands

```bash
cd agent-builder/.claude/plugins/agent-builder-tools
yarn install    # Install dependencies
yarn build      # Compile TypeScript
yarn dev        # Watch mode
yarn clean      # Remove dist/
```

## Architecture

### Agent Structure
```
agent-builder/
├── agent.json                    # Agent metadata (name, version)
├── README.md                     # Agent documentation
└── .claude/
    ├── config.json               # Framework config (model, permissions, allowed tools)
    ├── system_prompt.md          # Agent behavior definition
    └── plugins/
        ├── agent-builder-tools/  # TypeScript MCP tools
        │   ├── src/              # Source code
        │   ├── dist/             # Compiled output
        │   └── skills/           # Creator skills + skill library
        └── context7/             # External MCP server config
```

### Component Types

| Component | Purpose | When to Use |
|-----------|---------|-------------|
| **Skills** | Domain knowledge (SKILL.md files) | Needs AI creativity, optional features, many related operations |
| **MCP Tools** | External APIs, env vars, deterministic flows | Needs env vars/external API, fixed high-frequency core features |
| **Hooks** | Event-driven automation (PreToolUse, SessionEnd) | Fixed flow + fixed trigger timing |
| **Commands** | User-invokable shortcuts (/command) | User-triggered shortcuts |

### Decision Tree for New Capabilities

1. Built-in capability? (Read, Write, Git, Bash) → Don't create anything
2. Fixed flow + fixed timing? → Hook
3. Needs env vars/external API? → MCP Tool
4. Optional with many operations (>3)? → Skill (avoid context pollution)
5. Needs AI creativity? → Skill
6. Default → MCP Tool

### Available MCP Tools

- `write_agent_structure` - Create agent directory with base files
- `create_plugin` - Create plugin with manifest
- `validate_agent` - Validate agent structure
- `save_agent_in_db` - Register agent in database via RPC

### Creator Skills (in skills/)

- `agent-structure-designer` - Plugin organization and tool workflow
- `skill-creator` - SKILL.md format and best practices
- `mcp-tools-creator` - MCP configuration and SDK server patterns
- `hook-creator` - Event hooks with factory pattern
- `command-creator` - Slash command markdown format
- `system-prompt-creator` - Replace vs append mode guidance
- `agentrix-interaction` - AgentrixContext usage

### Key Dependencies

- `@agentrix/shared` - Agentrix platform integration (AgentrixContext)
- `@anthropic-ai/claude-agent-sdk` - Claude Agent SDK for MCP servers
- `zod` - Schema validation

## Conventions

### File Naming
- Agent names: lowercase-with-hyphens (`my-agent`)
- Plugin names: lowercase-with-hyphens (`my-plugin`)
- Skills: Directory + `SKILL.md` (e.g., `skills/my-skill/SKILL.md`)
- Commands: Markdown files (e.g., `commands/my-cmd.md`)

### System Prompt Modes
- **Replace**: Completely replaces Claude Code prompt (most common)
- **Append**: Adds constraints to base Claude Code prompt

### AgentrixContext

Used in MCP tools for platform integration:
- `getWorkspace()` - Workspace directory path
- `getTaskId()` - Current task ID
- `getUserId()` - Current user ID
- `createAgentBuilder()` - RPC to register agents in database
