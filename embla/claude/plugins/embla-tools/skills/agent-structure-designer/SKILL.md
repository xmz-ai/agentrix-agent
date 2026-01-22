---
name: Agent Structure Designer
description: This skill should be used when embla needs to design plugin organization, execute the full agent creation workflow, or understand tool call sequences. Covers directory structure, naming conventions, permission modes, and the complete tool call flow for creating agents.
version: 0.2.0
---

# Agent Structure Designer

## Overview

This skill guides you through the complete agent creation process using the available tools. It covers both design decisions and the exact tool calls needed to create an agent.

---

## Part I: Agent Creation Tool Flow

### Complete Creation Sequence

```
1. write_agent_structure()  → Creates base files
2. create_plugin()          → For each plugin
3. Create plugin content    → Use file operations (Write/Edit) for skills/commands/mcp
4. Create hooks             → Use file operations in .claude/hooks/
5. validate_agent()         → Validates structure
6. save_agent_in_db()     → Registers in database
```

### Step 1: Create Agent Structure

**Tool:** `write_agent_structure`

Creates base agent structure including agent.json, config.json, and system_prompt.md.

**Key parameters:**
- `name` - Agent name (will normalize to lowercase-with-hyphens)
- `systemPromptMode` - `replace` or `append` (see System Prompt Creator)
- `systemPromptContent` - The system prompt markdown
- `allowedTools` - Only specify NEW MCP tools added by this agent (use glob pattern like `mcp__github__*`, `mcp__context7__*`)

**Returns:** `{ normalizedName, agentDir, filesCreated }`

**Creates:**
```
{workspace}/{normalized-name}/
├── agent.json
└── claude/
    ├── config.json
    ├── system_prompt.md
    └── plugins/
```

**Note on allowedTools:**
- Only include MCP tools you add via `.mcp.json`
- Use glob patterns: `mcp__servername__*` to allow all tools from a server
- Example: If adding GitHub MCP server, use `mcp__github__*`
- DO NOT list built-in Claude Code tools (Read, Write, Edit, Bash, etc.)

### Step 2: Create Plugins

**Tool:** `create_plugin`

**Parameters:**
- `name` - Agent name (same as step 1)
- `pluginName` - Plugin name (lowercase-with-hyphens)
- `description` - What this plugin provides
- `version` - Semantic version

**Returns:** `{ pluginDir, manifest }`

**Creates:**
```
claude/plugins/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json
└── README.md
```

### Step 3: Create Plugin Content

Use file operations (Write tool) to create plugin content. **See individual creator skills for format details:**

| Content Type | Location | Creator Skill |
|--------------|----------|---------------|
| Skills | `plugins/{plugin}/skills/{skill-name}/SKILL.md` | **Skill Creator** |
| Commands | `plugins/{plugin}/commands/{command-name}.md` | **Command Creator** |
| MCP Config | `plugins/{plugin}/.mcp.json` | **MCP Tools Creator** |

**Note:** When adding MCP servers, remember to add corresponding `allowedTools` pattern (e.g., `mcp__github__*`) in `write_agent_structure`.

### Step 4: Create Hooks (if needed)

Hooks are created in `claude/hooks/` (NOT in plugins). **See Hook Creator skill for format details.**

### Step 5: Validate Agent

**Tool:** `validate_agent`

**Parameters:**
- `name` - Agent name

**Returns:** `{ valid, errors, warnings }`

### Step 6: Register in Database

**Tool:** `save_agent_in_db`

**Parameters:**
- `name` - Agent name
- `description` - Agent description
- `type` - Usually `claude`
- `envVars` - Array of environment variable definitions

**Returns:** `{ agentId, agentDir, envVarsRequired, envVarsOptional }`

---

## Part II: Design Decisions

### Directory Structure (Basic)

```
{agent-name}/
├── agent.json                    # Agent metadata
└── claude/
    ├── config.json               # Framework configuration
    ├── system_prompt.md          # System prompt
    ├── hooks/                    # Hooks (see Hook Creator for structure)
    └── plugins/                  # Plugins (auto-discovered)
        └── {plugin-name}/
            ├── .claude-plugin/
            │   └── plugin.json
            ├── skills/           # See Skill Creator for structure
            ├── commands/         # See Command Creator for structure
            └── .mcp.json         # See MCP Tools Creator for format
```

**Key rules:**
- Hooks are in `claude/hooks/`, NOT inside plugins
- Plugins are auto-discovered - do NOT add `plugins` field in config.json
- plugin.json contains metadata ONLY (no `main` or `type` fields)

For detailed structure of each component, see the corresponding creator skill.

### Plugin Organization Patterns

#### Anti-Pattern: One Giant Plugin

```
❌ BAD: Everything in one plugin

claude/plugins/all-features/
├── skills/
│   ├── skill1/SKILL.md
│   ├── skill2/SKILL.md
│   ├── ... (50 more skills)
├── hooks/hooks.json
├── commands/
└── .mcp.json
```

**Problems:** Hard to maintain, can't reuse parts, difficult to understand.

#### Good Pattern: Logical Domain Grouping

```
✅ GOOD: Grouped by functionality domain

claude/
├── hooks/                         # Hooks at claude/hooks/ (not in plugins)
│   ├── package.json
│   └── src/index.ts
└── plugins/
    ├── core-security-scanner/     # Core detection capabilities
    │   └── skills/
    │       ├── sql-injection/SKILL.md
    │       ├── xss-detection/SKILL.md
    │       └── auth-bypass/SKILL.md
    ├── reporting-tools/           # Report generation
    │   └── commands/generate-report.md
    └── compliance-checks/         # Regulatory compliance
        └── skills/
            ├── pci-dss/SKILL.md
            └── owasp-top-10/SKILL.md
```

### Plugin Count Guidelines

| Agent Complexity | Recommended Plugins |
|------------------|---------------------|
| Simple (single purpose) | 1-2 plugins |
| Standard (multiple features) | 3-5 plugins |
| Complex (many domains) | 5-7 plugins |
| Very complex | Consider splitting into multiple agents |

**Warning**: If you need 7+ plugins, the agent scope may be too broad.

### Naming Conventions

| Type | Good | Bad |
|------|------|-----|
| Agent | `security-auditor`, `code-reviewer` | `agent1`, `myAgent`, `SecurityAuditor` |
| Plugin | `vulnerability-scanner`, `git-operations` | `plugin1`, `misc`, `utils` |
| Skill | `sql-injection-detection`, `conventional-commits` | `skill1`, `detection` |

**Rules:**
1. Use lowercase with hyphens: `my-plugin-name`
2. Be descriptive: Name reflects purpose
3. Be concise: 2-4 words typically
4. Avoid generic names: `utils`, `helpers`, `misc`

### Permission Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `default` | Ask user before every tool | Experimental/untrusted agents |
| `acceptEdits` | Auto-approve file edits, ask for others | Code review/refactoring agents |
| `bypassPermissions` | Auto-approve everything | Trusted automation (CI/CD) |
| `plan` | Plan first, get approval, then execute | Complex multi-step tasks |

**Decision Flow:**
```
Is this a trusted automation (CI/CD, cron)?
    → YES: bypassPermissions
    → NO: Continue

Does the agent do lots of file edits?
    → YES: acceptEdits
    → NO: Continue

Are tasks complex and need user oversight?
    → YES: plan
    → NO: default
```

### Model Selection

| Model | Use Case |
|-------|----------|
| `claude-opus-4-5` | Complex analysis, planning, creative tasks |
| `claude-sonnet-4-20250514` | Simple tasks, high volume, cost-sensitive |

---

## Part III: Validation Checklist

Before finalizing an agent:

- [ ] `agent.json` exists with name, version, description
- [ ] `claude/config.json` exists with model, systemPromptMode
- [ ] config.json has NO `plugins` field (auto-discovered)
- [ ] Each plugin has `.claude-plugin/plugin.json` with metadata only
- [ ] plugin.json has NO `main` or `type` fields
- [ ] System prompt follows correct mode pattern (see System Prompt Creator)
- [ ] Names use lowercase-with-hyphens
- [ ] Plugin count is reasonable (1-7, usually 3-5)
- [ ] Each plugin has clear, single purpose
- [ ] `allowedTools` only lists NEW MCP tools (glob patterns like `mcp__*__*`)
- [ ] `validate_agent()` passes
- [ ] `save_agent_in_db()` succeeds
- [ ] All required environment variables documented

---

## Part IV: Post-Creation Instructions

After successful creation, inform the user:

1. **Agent Location**: `{workspace}/{agent-name}/`
2. **Required Environment Variables**: List variables that need to be configured at deployment
3. **How to Use**: Explain how to invoke the agent
4. **Generate README.md**: Create a README with:
   - Build/deploy instructions
   - Environment variables required for deployment
5. **Next Steps**: Offer to modify or create another agent

**Example Output:**

```
Agent 'Security Auditor' created successfully!

Location: /workspace/security-auditor/

Structure:
- 2 plugins: vulnerability-scanner, reporting
- 2 skills: sql-injection, xss-detection
- 1 command: /generate-report
- 1 hook: SessionEnd

Required Environment Variables (for deployment):
  - GITHUB_TOKEN: For GitHub integration (optional)

A README.md has been generated with build/deploy instructions and environment variable documentation.

The agent is ready to use!
```
