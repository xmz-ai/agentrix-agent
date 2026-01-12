# Embla

Interactive AI agent that helps users design and create custom agents through conversation.

## Overview

Embla is a meta-agent: an AI assistant that creates other AI agents. It guides users through the entire agent creation process, from understanding requirements to generating complete agent configurations.

**Embla is itself a plugin-based agent**, demonstrating the architecture it helps users create.

## Features

- Interactive discovery: Understands user needs through conversation
- Architecture guidance: Decides between skills, MCP tools, and hooks
- Complete agent generation: Creates all necessary files and configurations
- Database registration: Registers agents with environment variable schemas

## Agent Structure

```
agent-builder/
├── agent.json                    # Agent metadata
├── .claude/
│   ├── config.json               # Claude configuration
│   ├── system_prompt.md          # Agent behavior definition
│   └── plugins/
│       ├── agent-builder-tools/  # MCP tools for agent creation
│       │   ├── src/              # TypeScript source
│       │   ├── dist/             # Compiled JavaScript
│       │   └── skills/           # Creator skills
│       │       ├── agent-structure-designer/
│       │       ├── skill-creator/
│       │       ├── mcp-tools-creator/
│       │       ├── hook-creator/
│       │       ├── command-creator/
│       │       ├── system-prompt-creator/
│       │       └── agentrix-interaction/
│       └── context7/             # Documentation lookup MCP
└── README.md
```

## Available MCP Tools

The agent-builder-tools plugin provides 4 MCP tools:

| Tool | Description |
|------|-------------|
| `write_agent_structure` | Create agent directory with base files |
| `create_plugin` | Create plugin with manifest |
| `validate_agent` | Validate agent structure and configuration |
| `save_agent_in_db` | Register agent in database |

## Available Skills

Creator skills provide implementation guidance:

| Skill | Purpose |
|-------|---------|
| `agent-structure-designer` | Design plugin structure and tool order |
| `skill-creator` | Create SKILL.md files with best practices |
| `mcp-tools-creator` | Create MCP server tools with AgentrixContext |
| `hook-creator` | Create event hooks (PreToolUse, SessionEnd, etc.) |
| `command-creator` | Create slash commands |
| `system-prompt-creator` | Write effective system prompts |
| `agentrix-interaction` | Interact with Agentrix platform |

### Skill Library

The skill-creator includes reference implementations:

- `pdf` - PDF generation
- `docx` - Word document creation
- `xlsx` - Excel spreadsheet creation
- `pptx` - PowerPoint presentation creation
- `canvas-design` - Canvas-based graphics
- `frontend-design` - UI/UX design patterns
- `web-artifacts-builder` - Web component generation
- `webapp-testing` - Web application testing
- `brand-guidelines` - Brand consistency
- `algorithmic-art` - Generative art
- `slack-gif-creator` - Animated GIF creation
- `internal-comms` - Internal communication
- `theme-factory` - Theme generation

## Configuration

### agent.json
```json
{
  "name": "Embla",
  "version": "1.0.0",
  "description": "Interactive agent creation assistant"
}
```

### .claude/config.json
```json
{
  "systemPrompt": {
    "path": "system_prompt.md",
    "mode": "replace"
  },
  "settings": {
    "permissionMode": "bypassPermissions",
    "allowedTools": [
      "mcp__agent-builder-tools__*",
      "mcp__context7__*"
    ]
  },
  "sdkMcpTools": [
    "plugins/agent-builder-tools/dist/index.js"
  ]
}
```

## Workflow

Embla follows a structured workflow:

1. **Discovery**: Ask questions to understand requirements
2. **Design**: Draft complete plan with component decisions
3. **Confirm**: Get user approval before generating
4. **Generate**: Execute tools in correct order
5. **Complete**: Provide next steps and environment variable instructions

### Decision Logic

For each capability, Embla applies this decision tree:

```
1. Built-in capability? → Don't create anything
2. Fixed flow + Fixed timing? → Hook
3. Needs env vars/external API? → MCP Tool
4. Optional/creative? → Skill
5. Default → MCP Tool
```

### Component Selection Matrix

| Dimension | Skill | MCP Tool | Hook |
|-----------|-------|----------|------|
| AI Decision Level | Highest | Medium | None |
| Flow Certainty | Uncertain | Fixed | Fixed |
| Trigger Timing | AI decides | AI decides | Fixed moment |
| Context Cost | Dynamic | Persistent | Zero |
| Needs Env Vars | No | Yes | No |

## Development

### Building the MCP Tools

```bash
cd .claude/plugins/agent-builder-tools
yarn install
yarn build
```

### Watch Mode

```bash
yarn dev
```

## Usage

Embla starts with:

> "I'll help you create a custom agent! What problem are you trying to solve, or what task would you like to automate?"

From there, it guides you through:

1. Understanding your requirements
2. Designing the agent architecture
3. Selecting appropriate components (skills, MCP tools, hooks)
4. Generating the complete agent
5. Registering with required environment variables

## Example Interaction

**User**: I want to create a code review agent

**Embla** asks:
- What languages will it review?
- What checks should it perform? (style, security, performance)
- Should it auto-fix issues or just report?
- CI/CD integration needed?

**Embla** then:
1. Designs the architecture (skills for guidelines, hooks for enforcement)
2. Presents the plan for approval
3. Generates all files
4. Registers the agent
5. Provides setup instructions

## License

Part of the Agentrix project.
