# Agent Builder Tools Plugin

MCP tools plugin for the Agent Builder agent. Provides comprehensive tools for creating and managing custom agents through interactive conversation.

## Overview

This plugin extends the Agent Builder agent with MCP tools that enable:
- Agent directory structure creation
- Plugin management
- Database registration with environment variable schema
- Agent validation

## Available Tools

### Agent Structure Tools

#### `write_agent_structure`
Create complete agent directory structure with all base files. Call this FIRST.

**Parameters:**
- `name` (string, required) - Agent name (will be normalized to directory name, e.g., "My Agent" → "my-agent")
- `displayName` (string, optional) - Agent display name (defaults to name if not provided)
- `version` (string) - Agent version (default: "1.0.0")
- `description` (string, optional) - Agent description
- `maxTurns` (number, optional) - Maximum conversation turns
- `systemPromptPath` (string, optional) - Path to system prompt file (relative to claude/)
- `systemPromptMode` (enum) - "append" or "replace" (default: "append")
- `systemPromptContent` (string, optional) - System prompt content (creates claude/system_prompt.md if provided)
- `allowedTools` (array, optional) - Allowed tool patterns (sets permissionMode to "bypassPermissions" when provided)
- `plugins` (array, optional) - SDK MCP tool scripts to load (sdkMcpTools)

**Creates:**
- `{workspace}/<normalized-name>/` directory structure
- `agent.json` with metadata (name, version, description)
- `claude/config.json` with configuration
- `claude/system_prompt.md` (if systemPromptContent provided)
- `claude/plugins/` directory

**Returns:**
- `normalizedName` (string) - Normalized directory name
- `agentDir` (string) - Agent directory path
- `filesCreated` (array) - List of files created

---

### Plugin Tools

#### `create_plugin`
Create a plugin directory structure with manifest (metadata only).

**Parameters:**
- `name` (string, required) - Agent name
- `pluginName` (string, required) - Plugin name (lowercase, hyphens only, regex: `^[a-z0-9-]+$`)
- `description` (string, required) - Plugin description
- `version` (string) - Plugin version (default: "1.0.0")
- `authorName` (string, optional) - Plugin author name

**Creates:**
- `claude/plugins/<pluginName>/`
- `claude/plugins/<pluginName>/.claude-plugin/plugin.json` manifest
- `claude/plugins/<pluginName>/README.md`

---

### Plugin Content (Created via Write Tool)

Plugin content is created using the standard Write tool (not MCP tools). See the creator skills for format details:

- **Skills**: `plugins/{plugin}/skills/{skill-name}/SKILL.md` - See Skill Creator skill
- **Commands**: `plugins/{plugin}/commands/{command-name}.md` - See Command Creator skill
- **MCP Config**: `plugins/{plugin}/.mcp.json` - See MCP Tools Creator skill

### Hooks (Created via Write Tool)

Hooks are created as a TypeScript npm project at `claude/hooks/` (NOT inside plugins):

```
claude/hooks/
├── package.json
├── tsconfig.json
├── .gitignore
└── src/
    └── index.ts    # Factory pattern with AgentrixContext
```

See Hook Creator skill for format details.

---

### Database Tools

#### `save_agent_in_db`
Register agent in database AFTER all files are created. Uses `context.saveDraftAgent()` RPC call.

**Parameters:**
- `name` (string, required) - Agent name (same name used in write_agent_structure)
- `description` (string, optional) - Agent description
- `type` (string) - Agent type: "claude" or "codex" (default: "claude")
- `envVars` (array, optional) - Environment variables required by agent:
  - `name` (string) - Variable name (e.g., "API_KEY")
  - `type` (enum) - "string", "number", or "boolean"
  - `description` (string) - Variable description
  - `required` (boolean) - Whether required (default: false)
  - `defaultValue` (string, optional) - Default value

**Returns:**
- `agentId` (string) - Generated agent ID
- `agentDir` (string) - Agent directory path
- `envVarsRequired` (array) - Required environment variable names
- `envVarsOptional` (array) - Optional environment variable names

**Note:** Environment variables should be documented in the generated agent's README.md file.

---

### Validation Tools

#### `validate_agent`
Validate agent directory structure and configuration files.

**Parameters:**
- `name` (string, required) - Agent name to validate

**Checks:**
- Agent directory exists
- `agent.json` exists and is valid (has name, version)
- `claude/config.json` exists and is valid
- System prompt file exists (if referenced in config)
- Plugin directories exist (if referenced in config)
- Plugin manifests exist (`.claude-plugin/plugin.json`)
- `claude/plugins/` directory exists (warning if not)

**Returns:**
- `valid` (boolean) - Validation result
- `errors` (array) - Error messages
- `warnings` (array) - Warning messages
- `paths` (object) - Resolved paths (agentDir, agentJson, claudeConfig)

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
├── index.ts              # MCP server entry point (exports factory function)
├── tools/
│   ├── agentStructure.ts # write_agent_structure tool
│   ├── pluginTools.ts    # create_plugin tool
│   ├── databaseTools.ts  # save_agent_in_db tool
│   └── validation.ts     # validate_agent tool
└── utils/
    ├── types.ts          # TypeScript type definitions
    └── fileSystem.ts     # File system utilities
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
3. **Add skill**: Write to `claude/plugins/my-plugin/skills/my-skill/SKILL.md`
4. **Add command**: Write to `claude/plugins/my-plugin/commands/my-cmd.md`
5. **Add MCP config**: Write to `claude/plugins/my-plugin/.mcp.json`
6. **Add hooks**: Write to `claude/hooks/` (package.json, tsconfig.json, src/index.ts)

**Phase 4: Validate and Register (2 tool calls)**
7. **Validate structure**: `validate_agent({ name: "My Agent" })`
8. **Register in DB**: `save_agent_in_db({ name: "My Agent", envVars: [...] })`
   - agentDir is automatically resolved from name
   - Uses context.saveDraftAgent() RPC
   - Returns `agentId`
   - Environment variables are documented in the agent's README.md

**Workflow Summary:**
Structure (1 call) → Plugins (N calls) → Content (Write tool) → Validate & Register (2 calls)

---

## Type Definitions

### AgentMetadata (agent.json)
```typescript
interface AgentMetadata {
  name: string;
  version: string;
  description?: string;
}
```

### ClaudeConfig (claude/config.json)
```typescript
interface ClaudeConfig {
  maxTurns?: number;
  systemPrompt?: {
    path: string;
    mode: 'append' | 'replace';
  };
  settings?: {
    permissionMode?: 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
    allowedTools?: string[];
  };
  sdkMcpTools?: string[];  // Scripts that export createSdkMcpServer()
  pullRequestPrompt?: {
    path: string;
    mode: 'append' | 'replace';
  };
  extraArgs?: Record<string, string | null>;
}
```

### PluginManifest (.claude-plugin/plugin.json)
```typescript
interface PluginManifest {
  name: string;
  description: string;
  version: string;
  author?: {
    name: string;
  };
}
```

---

## Architecture

This plugin uses the Claude Agent SDK's `createSdkMcpServer` to create an MCP server. The server is initialized with an `AgentrixContext` that provides:

- `getWorkspace()` - Returns the workspace directory path
- `saveDraftAgent()` - RPC call to register agents in the database

All tools are factory functions that receive the context and return tool definitions.

---

## License

Part of the Agentrix project.
