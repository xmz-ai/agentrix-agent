---
name: Hook Creator
description: This skill should be used when agent-builder determines that the agent needs hooks for event-driven automation with fixed flow and fixed timing. Hooks are completely programmatic with zero AI judgment. Provides Agentrix hook format, implementation patterns, and best practices.
version: 0.4.0
---

# Hook Creator

## Overview

Hooks should be your **FIRST CHOICE** when applicable. They are the most efficient way to add automation.

| Aspect | Hook | MCP Tool | Skill |
|--------|------|----------|-------|
| Context Occupation | **Zero** | Always present | Dynamic |
| Execution Speed | **Fastest** | Fast | Slow |
| AI Judgment | **None** | Decides timing | Full |
| Determinism | **100%** | 100% | Variable |

## When to Use Hooks

**Fixed Flow + Fixed Trigger Timing**
- Both WHAT to do and WHEN to do are predetermined
- No AI judgment needed

**Use Cases:**
- Notifications: "Session ended, here's a summary"
- Logging: "Record every tool call"
- Validation: "Check file path before Read"
- Cleanup: "Save state before session ends"

## When NOT to Use Hooks

| Scenario | Use Instead | Reason |
|----------|-------------|--------|
| Trigger timing needs AI decision | MCP Tool | AI decides WHEN |
| Process needs creativity | Skill | AI thinks and creates |
| External API with dynamic params | MCP Tool | Needs flexible input |

---

## Creating Hooks

### Directory Structure

Hooks are created as a TypeScript npm project in the agent's `.claude/hooks/` directory:

```
{agent}/.claude/hooks/
├── package.json          # npm package config
├── tsconfig.json         # TypeScript config
├── .gitignore            # Ignore node_modules, dist
└── src/
    └── index.ts          # Hook implementation (factory pattern)
```

**Important**: Hooks are in `.claude/hooks/`, NOT inside plugins.

### Required Files

#### package.json

```json
{
  "name": "{agent-name}-hooks",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.mjs",
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
    "typescript": "^5.0.0"
  }
}
```

#### tsconfig.json

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
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### .gitignore

```
/node_modules
/dist
**/node_modules
**/dist
```

---

## Hook Implementation Format (Agentrix SDK)

Hooks use the **factory pattern** with `AgentrixContext`:

### src/index.ts

```typescript
import type { HookFactory, AgentrixContext } from '@agentrix/shared';
import type {
  PreToolUseHookInput,
  PostToolUseHookInput,
  SessionStartHookInput,
  SessionEndHookInput,
  StopHookInput,
} from '@anthropic-ai/claude-agent-sdk';

const createHooks: HookFactory = (context: AgentrixContext) => {
  // Closure variables for state (replaces context.state)
  const startTime = Date.now();
  const toolCounts = new Map<string, number>();

  return {
    PreToolUse: async (
      input: PreToolUseHookInput,
      toolUseID: string,
      options: { signal: AbortSignal }
    ) => {
      const workspace = context.getWorkspace();
      const toolName = input.tool_name;
      const toolInput = input.tool_input;

      // Track tool usage
      toolCounts.set(toolName, (toolCounts.get(toolName) || 0) + 1);

      // Validation example
      if (toolName === 'Bash') {
        const cmd = toolInput?.command as string;
        if (cmd?.includes('rm -rf /')) {
          return {
            decision: 'deny' as const,
            message: 'Dangerous command blocked',
          };
        }
      }

      return { decision: 'approve' as const };
    },

    PostToolUse: async (
      input: PostToolUseHookInput,
      toolUseID: string,
      options: { signal: AbortSignal }
    ) => {
      const taskId = context.getTaskId();
      console.log(`[Task ${taskId}] ${input.tool_name} completed`);
      return {};
    },

    SessionEnd: async (
      input: SessionEndHookInput,
      toolUseID: string,
      options: { signal: AbortSignal }
    ) => {
      const duration = Date.now() - startTime;
      console.log(`[Session] Duration: ${Math.round(duration / 1000)}s`);
      console.log(`[Session] Tools used:`, Object.fromEntries(toolCounts));
      return {};
    },
  };
};

export default createHooks;
```

---

## Hook Events

| Event | Trigger | Use Case |
|-------|---------|----------|
| `PreToolUse` | Before tool executes | Validation, access control |
| `PostToolUse` | After tool executes | Logging, notifications |
| `SessionStart` | Session begins | Initialization |
| `SessionEnd` | Session ends | Cleanup, summary |
| `Stop` | Agent wants to stop | Task completion validation |
| `SubagentStop` | Subagent wants to stop | Subagent validation |
| `RepositoryInit` | Git repo initialized | Project setup |

---

## Hook Output Formats

### PreToolUse Return

```typescript
// Approve
return { decision: 'approve' as const };

// Deny
return {
  decision: 'deny' as const,
  message: 'Reason for denial',
};

// Ask user
return {
  decision: 'pending' as const,
  message: 'Request confirmation for...',
};
```

### Other Hooks Return

```typescript
return {};  // Most hooks just return empty object
```

---

## Key Principles

### 1. Keep Hooks Simple
- Fast execution (30s timeout)
- No complex logic
- Deterministic behavior

### 2. Use Closure Variables for State
```typescript
const createHooks: HookFactory = (context) => {
  // State is scoped to this task instance
  const startTime = Date.now();
  let fileCount = 0;

  return {
    PreToolUse: async (input) => {
      if (input.tool_name === 'Write') fileCount++;
      return { decision: 'approve' as const };
    },
    SessionEnd: async () => {
      console.log(`Files created: ${fileCount}`);
      return {};
    },
  };
};
```

### 3. Validate Inputs
```typescript
PreToolUse: async (input) => {
  const filePath = input.tool_input?.file_path as string || '';
  const workspace = context.getWorkspace();

  // Prevent path traversal
  if (!filePath.startsWith(workspace)) {
    return {
      decision: 'deny' as const,
      message: 'Access denied: outside workspace',
    };
  }

  return { decision: 'approve' as const };
}
```

### 4. Handle Abort Signal
```typescript
PreToolUse: async (input, toolUseID, options) => {
  if (options.signal.aborted) {
    return { decision: 'approve' as const };
  }
  // ... rest of logic
}
```

---

## Environment Variables in Hooks

Hooks can access environment variables via `process.env` in their code:

```typescript
const createHooks: HookFactory = (context: AgentrixContext) => {
  const notificationUrl = process.env.NOTIFICATION_URL;  // ✅ In code

  return {
    SessionEnd: async () => {
      if (notificationUrl) {
        await fetch(notificationUrl, { method: 'POST', body: '...' });
      }
      return {};
    }
  };
};
```

**Important:**
- These env vars must be registered in `save_agent_in_db` for deployment and then the value will be provided by user
- Platform injects env vars into process at startup
- **System prompts are forbidden** from instructing agents to read environment variables

---

### Reference Files
- **`references/`** - Learn More About Hooks
