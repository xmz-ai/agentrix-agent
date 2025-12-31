---
name: Agentrix Interaction
description: This skill should be used when creating MCP tools or Hooks that need to interact with Agentrix service - the service connecting agents with end users and managing service data. Use AgentrixContext for getting workspace directory, user ID, task ID, creating agents in database, or sending messages to users. NOTE - Only MCP tools and Hooks can receive injected AgentrixContext.
version: 0.1.0
---

# Using AgentrixContext in MCP Tools and Hooks

## When to Use AgentrixContext

Use AgentrixContext when you need to:
- Interact with service data (create agent in database)
- Communicate with end users (send messages)
- Access execution context (workspace path, user ID, task ID)

## Important: Supported Components

**✅ Supported (Context is injected by server):**
- **MCP Tools** - Server injects AgentrixContext into the main function
- **Hooks** - Server injects AgentrixContext into hook handlers

**❌ NOT Supported (Cannot receive context):**
- Commands - Cannot directly access AgentrixContext
- Skills - Cannot directly access AgentrixContext

If a Command or Skill needs Agentrix data, it must call an MCP tool that has access to the context.

## How to Use

### 1. Import AgentrixContext
```typescript
import { AgentrixContext } from '@agentrix/shared';
```

### 2. Export Function with Context Parameter
Your MCP tool MUST export a function that accepts `context` parameter:

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';

// REQUIRED: Export function that accepts context
export default function(context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'my-custom-tools',
    version: '1.0.0',
    tools: [
      // Your tools here
    ],
  });
}
```

### 3. Available Context Methods

#### `context.getWorkspace(): string`
Get the current workspace directory path (returns plain string, not Promise).

**Example:**
```typescript
tool('my_tool', 'Description', {}, async (args) => {
  const workspace = context.getWorkspace();
  const myPath = join(workspace, 'my-file.txt');
  // ... use myPath
});
```

#### `context.getUserId(): string`
Get the current user ID (returns plain string, not Promise).

**Example:**
```typescript
const userId = context.getUserId();
```

#### `context.getTaskId(): string`
Get the current task ID (returns plain string, not Promise).

**Example:**
```typescript
const taskId = context.getTaskId();
```

#### `context.saveDraftAgent(params): Promise<{ agentId: string, displayName: string }>`
Create a new draft agent in the database (this is the ONLY method that makes RPC call).

**Parameters:**
```typescript
{
  name: string;              // Agent name
  agentDir: string;          // ABSOLUTE path to agent directory
  type?: 'claude' | 'codex'; // Agent type (default: 'claude')
  avatar?: string;           // Avatar URL
  description?: string;      // Agent description
  envVars?: Array<{          // Environment variables for deployment
    name: string;
    type: 'string' | 'number' | 'boolean' | 'secret';
    description?: string;
    required: boolean;
    defaultValue?: string;
  }>;
}
```

**Example:**
```typescript
const result = await context.saveDraftAgent({
  name: 'my-agent',
  agentDir: '/path/to/agent',
  type: 'claude',
  description: 'My custom agent',
});

console.log(`Created agent: ${result.agentId}`);
```

## Complete Example

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';
import { z } from 'zod';
import { join } from 'path';

export default function(context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'my-tools',
    version: '1.0.0',
    tools: [
      tool(
        'create_agent',
        'Create a new agent in the database',
        {
          name: z.string(),
          description: z.string().optional(),
        },
        async (args) => {
          // Get workspace directory (returns plain string)
          const workspace = context.getWorkspace();
          const agentDir = join(workspace, args.name);

          // Create agent in database (returns Promise)
          const result = await context.saveDraftAgent({
            name: args.name,
            description: args.description,
            agentDir,
            type: 'claude',
          });

          return {
            content: [{
              type: 'text',
              text: `Agent created! ID: ${result.agentId}`
            }],
          };
        }
      ),
    ],
  });
}
```

## Important Notes
- **Never use `process.env.AGENTRIX_*` directly** - always use context methods
- **General env vars (API_KEY, etc.) can use `process.env`** - these are different from Agentrix context
- **Context is injected by server** - your MCP tool/Hook cannot run standalone
- **Must export function(context)** - direct export of createSdkMcpServer will error
- **agentDir must be absolute path** - use `join(workspace, normalizedName)` to build full path
- **Never expose env vars in system prompts** - agents cannot read `$ENV_VAR` directly
