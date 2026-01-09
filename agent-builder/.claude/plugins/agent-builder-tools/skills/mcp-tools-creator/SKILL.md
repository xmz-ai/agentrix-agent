---
name: MCP Tools Creator
description: This skill should be used when agent-builder determines that the agent needs MCP tools to execute fixed workflows, access environment variables, or interact with external programs. Provides MCP configuration format and best practices.
version: 0.3.0
---

# MCP Tools Creator

## Overview

MCP (Model Context Protocol) tools enable agents to execute fixed workflows, access environment variables, and interact with external programs.

## When to Use MCP Tools

| Scenario | Example |
|----------|---------|
| Fixed workflow + flexible timing | Session title update |
| Operations that WILL happen | html → pdf conversion |
| Needs environment variables | API keys, secrets |
| Needs external API calls | Database, REST APIs |

## When NOT to Use MCP Tools

| Scenario | Use Instead | Reason |
|----------|-------------|--------|
| Optional features | Skill | Avoid context pollution |
| Fixed timing | Hook | Zero context occupation |
| Creative tasks | Skill | AI needs to think |

**Context Pollution Warning:** MCP tools are ALWAYS in context. 10 tools, use 1 = 9 tools are noise.

---

## Creating MCP Configuration

### Option A: Using Existing MCP Server

For existing MCP servers (npm packages), configure in `.mcp.json`:

```
{agent}/.claude/plugins/{plugin-name}/
└── .mcp.json
```

**.mcp.json:**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

**Note:** No `env` field needed - environment variables are already injected into process at startup.

---

### Option B: Custom SDK MCP Server (TypeScript)

For custom MCP tools, create a TypeScript npm project:

**Directory Structure:**

```
{agent}/.claude/plugins/{plugin-name}/
├── package.json
├── tsconfig.json
├── .gitignore            # IMPORTANT: Add dist/ to gitignore
└── src/
    └── index.ts
```

**Step 1: Create package.json**

```json
{
  "name": "{plugin-name}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@agentrix/shared": "lasted"
  },
  "devDependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.30",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "zod": "^3.0.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Add .gitignore**

```
/node_modules
/dist
**/node_modules
**/dist
```

**Step 4: Register in config.json**

**IMPORTANT**: Add the compiled path to `.claude/config.json`:

```json
{
  "systemPrompt": { ... },
  "settings": {
    "permissionMode": "bypassPermissions",
    "allowedTools": [
      "mcp__servername__*"
    ]
  },
  "sdkMcpTools": [
    "plugins/{plugin-name}/dist/index.js"
  ]
}
```
- The `allowedTools` array contains the tools which is used by agents.
- The `sdkMcpTools` array is only defined with the tools defined by code, and it contains paths to compiled MCP server entry points (relative to `.claude/` directory).

**Step 5: Build**

```bash
cd .claude/plugins/{plugin-name}
npm install && npm run build
```

---

## mcpImplementation Format

For custom MCP servers:

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';

export default createSdkMcpServer({
  name: 'server-name',
  version: '1.0.0',
  tools: [
    tool(
      'tool_name',
      'Tool description',
      {
        param1: z.string().describe('Parameter description'),
        param2: z.number().optional(),
      },
      async (args) => {
        // Implementation
        return { content: [{ type: 'text', text: 'result' }] };
      }
    ),
  ],
});
```

---

## Common MCP Servers

| Server | Package | Env Vars |
|--------|---------|----------|
| GitHub | `@modelcontextprotocol/server-github` | `GITHUB_TOKEN` |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | `DATABASE_URL` |
| Slack | `@modelcontextprotocol/server-slack` | `SLACK_BOT_TOKEN` |
| Filesystem | `@modelcontextprotocol/server-filesystem` | - |

**You can search Context7 first** for existing MCP servers before creating custom ones.

---

## AgentrixContext

When MCP tools need Agentrix platform access:

```typescript
import { AgentrixContext } from '@agentrix/shared';

// Export function that accepts context
export default function(context: AgentrixContext) {
  return createSdkMcpServer({
     name: "server_name",
    // ... tools can use context.getWorkspace(), context.getTaskId(), etc.
  });
}
```

**More About AgentrixContext:**
- USE `AgentrixContext Skill`

---

## Key Principles

### 1. Prefer Existing MCP Servers
Search Context7 before creating custom implementations.

### 2. Minimize Tool Count
Only create tools that WILL be used. Optional features → Skill.

### 3. Document Env Vars
Register required env vars in `save_agent_in_db`.

---

## Environment Variables

MCP tools can read environment variables via `process.env` in their code:

```typescript
const API_KEY = process.env.API_KEY;  // ✅ In code
const BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';
```

**Important:**
- Environment variables are registered in `save_agent_in_db`, and then will be provided by user
- Platform injects env vars into process at startup
- `.mcp.json` does NOT need `env` field configuration
- **System prompts are forbidden** from instructing agents to read environment variables

---

## Additional Resources

### Reference Files
- **`references/mcp-patterns.md`** - Common MCP server patterns
