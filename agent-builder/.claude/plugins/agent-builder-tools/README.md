# Agent Builder Tools Plugin

MCP tools plugin for the Agent Builder agent. Provides comprehensive tools for creating and managing custom agents through interactive conversation.

## Overview

This plugin extends the Agent Builder agent with MCP tools that enable:
- Agent directory structure creation
- Plugin management (skills, hooks, commands, MCP servers)
- Database registration with environment variable schema
- Agent validation

## Environment Variables

The following environment variables are injected by the Agentrix CLI worker process:

- `AGENTRIX_SERVER_URL` - API server URL (e.g., `http://localhost:3000`)
- `AGENTRIX_TOKEN` or `AGENTRIX_API_TOKEN` - Authentication token for API requests
- `AGENTRIX_WORKING_USER` - Current user ID
- `AGENTRIX_WORKING_TASK` - Current task ID
- `AGENTRIX_WORKING_DIR` - Current working directory
- `AGENTRIX_HOME_DIR` (optional) - Base directory for agents (default: `~/.agentrix-test`)

## Available Tools

### Agent Structure Tools

#### `write_agent_structure`
Create complete agent directory structure with all base files. Call this FIRST. Replaces 4 previous tools (create_agent_directory, write_agent_metadata, write_claude_config, write_system_prompt).

**Parameters:**
- `name` (string) - Agent name (will be normalized to directory name, e.g., "My Agent" → "my-agent")
- `displayName` (string, optional) - Agent display name (defaults to name if not provided)
- `version` (string) - Agent version (default: "1.0.0")
- `description` (string, optional) - Agent description
- `model` (string) - Claude model to use (default: "claude-opus-4-5")
- `maxTurns` (number, optional) - Maximum conversation turns
- `systemPromptPath` (string, optional) - Path to system prompt file (relative to .claude/)
- `systemPromptMode` (enum) - "append" or "replace" (default: "append")
- `systemPromptContent` (string, optional) - System prompt content (creates .claude/system_prompt.md if provided)
- `permissionMode` (string, optional) - Permission mode (default, acceptEdits, bypassPermissions, plan)
- `allowedTools` (array, optional) - Allowed tool patterns
- `plugins` (array, optional) - SDK MCP tool scripts to load

**Creates:**
- `{AGENTRIX_AGNET_DIR}/<normalized-name>/` directory structure
- `agent.json` with metadata
- `.claude/config.json` with configuration
- `.claude/system_prompt.md` (if systemPromptContent provided)
- `.claude/plugins/` directory

**Returns:**
- `normalizedName` (string) - Normalized directory name
- `agentDir` (string) - Agent directory path
- `filesCreated` (array) - List of files created

---

### Plugin Tools

#### `create_plugin`
Create a plugin directory structure with manifest (metadata only).

**Parameters:**
- `name` (string) - Agent name
- `pluginName` (string) - Plugin name (lowercase, hyphens only)
- `description` (string) - Plugin description
- `version` (string) - Plugin version (default: "1.0.0")
- `authorName` (string, optional) - Plugin author name

**Creates:**
- `.claude/plugins/<pluginName>/`
- `.claude-plugin/plugin.json` manifest
- `README.md`

---

### Plugin Content (Created via Write Tool)

Plugin content is created using the standard Write tool (not MCP tools). See the creator skills for format details:

- **Skills**: `plugins/{plugin}/skills/{skill-name}/SKILL.md` - See Skill Creator skill
- **Commands**: `plugins/{plugin}/commands/{command-name}.md` - See Command Creator skill
- **MCP Config**: `plugins/{plugin}/.mcp.json` - See MCP Tools Creator skill

### Hooks (Created via Write Tool)

Hooks are created as a TypeScript npm project at `.claude/hooks/` (NOT inside plugins):

```
.claude/hooks/
├── package.json
├── tsconfig.json
├── .gitignore
└── src/
    └── index.ts    # Factory pattern with AgentrixContext
```

See Hook Creator skill for format details.

---

### Database Tools

#### `create_agent_in_db`
Register agent in database AFTER all files are created. agentDir is automatically resolved from name.

**Parameters:**
- `name` (string) - Agent name (same name used in write_agent_structure)
- `description` (string, optional) - Agent description
- `type` (string, optional) - Agent type (default: "claude")
- `envVars` (array, optional) - Environment variables required by agent:
  - `name` (string) - Variable name (e.g., "API_KEY")
  - `type` (enum) - "string", "number", or "boolean"
  - `description` (string) - Variable description
  - `required` (boolean) - Whether required (default: false)
  - `defaultValue` (string, optional) - Default value

**API Endpoint:** `POST /v1/agent-builder/create-agent`

**Returns:**
- `agentId` (string) - Generated agent ID
- `envVarsRequired` (array) - Required environment variable names
- `envVarsOptional` (array) - Optional environment variable names

**User Instructions:**
The tool will provide instructions on setting environment variables using:
```
!setenv [name] [value]
```

Example:
```
!setenv API_KEY sk-your-api-key-here
```

---

### Validation Tools

#### `validate_agent`
Validate agent directory structure and configuration files.

**Parameters:**
- `name` (string) - Agent name to validate

**Checks:**
- Agent directory exists
- `agent.json` is valid
- `.claude/config.json` is valid
- System prompt file exists (if referenced)
- Plugin directories exist (if referenced)
- Plugin manifests exist

**Returns:**
- `valid` (boolean) - Validation result
- `errors` (array) - Error messages
- `warnings` (array) - Warning messages

---

## Tool Response Format

All tools return responses in JSON format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Tool-specific data
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Development

### Building

```bash
yarn build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Development Watch Mode

```bash
yarn dev
```

Watches for changes and recompiles automatically.

### Project Structure

```
src/
├── index.ts              # MCP server entry point
├── tools/
│   ├── agentStructure.ts # Agent structure creation (1 tool)
│   ├── pluginTools.ts    # Plugin management (1 tool)
│   ├── databaseTools.ts  # Database operations (1 tool)
│   └── validation.ts     # Agent validation (1 tool)
└── utils/
    ├── types.ts          # TypeScript type definitions
    ├── fileSystem.ts     # File system utilities
    └── apiClient.ts      # HTTP API client
```

**Total: 4 MCP tools**

---

## Usage Example

The Agent Builder agent uses these tools during agent creation:

**Phase 1: Create Agent Structure (1 tool call)**
1. **Create complete structure**: `write_agent_structure({ name: "My Agent", displayName: "My Agent", systemPromptContent: "...", ... })`
   - Creates directory, agent.json, config.json, system_prompt.md in one call
   - Returns `normalizedName: "my-agent"`, `agentDir: "/path/to/my-agent"`

**Phase 2: Create Plugins (N tool calls)**
2. **Create plugin**: `create_plugin({ name: "My Agent", pluginName: "my-plugin", description: "..." })`

**Phase 3: Add Content (via Write tool)**
3. **Add skill**: Write to `.claude/plugins/my-plugin/skills/my-skill/SKILL.md`
4. **Add command**: Write to `.claude/plugins/my-plugin/commands/my-cmd.md`
5. **Add MCP config**: Write to `.claude/plugins/my-plugin/.mcp.json`
6. **Add hooks**: Write to `.claude/hooks/` (package.json, tsconfig.json, src/index.ts)

**Phase 4: Validate and Register (2 tool calls)**
7. **Validate structure**: `validate_agent({ name: "My Agent" })`
8. **Register in DB**: `create_agent_in_db({ name: "My Agent", envVars: [...] })`
   - agentDir is automatically resolved from name
   - API generates and returns `agentId`
   - User receives `!setenv` instructions for environment variables

**Workflow Summary:**
Structure (1 call) → Plugins (N calls) → Content (Write tool) → Validate & Register (2 calls)

---

## API Integration

### Required API Endpoints

The following API endpoint must be implemented on the server:

#### POST /v1/agent-builder/create-agent

**Request:**
```json
{
  "name": "My Agent",
  "agentDir": "my-agent",
  "description": "Agent description",
  "type": "claude",
  "userId": "user-abc123",
  "taskId": "task-xyz789",
  "config": {
    "deploymentSchema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "API_KEY": {
          "type": "string",
          "description": "Your API key for authentication"
        }
      },
      "required": ["API_KEY"]
    }
  }
}
```

**Response:**
```json
{
  "agentId": "agent-generated-id-123"
}
```

**Note:** The API generates the `agentId`, not the client. The `userId` and `taskId` are automatically injected from environment variables (`AGENTRIX_WORKING_USER` and `AGENTRIX_WORKING_TASK`).

---

## License

Part of the Agentrix project.
