---
name: Agentrix Interaction
description: This skill should be used when creating MCP tools or Hooks that need to interact with Agentrix service - the service connecting agents with end users and managing service data. Use AgentrixContext for getting workspace directory, user ID, task ID, uploading files, managing sub-tasks for multi-agent collaboration, or sending messages to users. NOTE - Only MCP tools and Hooks can receive injected AgentrixContext.
version: 0.3.0
---

# Using AgentrixContext in MCP Tools and Hooks

## When to Use AgentrixContext

Use AgentrixContext when you need to:
- Access execution context (workspace path, user ID, task ID, chat ID)
- Upload files to Agentrix storage (`uploadFile`)
- Multi-agent collaboration (start sub-tasks, delegate work, collect results)
- Communicate with end users (send messages, show modals)
- Write execution logs (`log`)

## Important: Supported Components

**✅ Supported (Context is injected by server):**
- **MCP Tools** - Server injects AgentrixContext into the main function
- **Hooks** - Server injects AgentrixContext into hook handlers

**❌ NOT Supported (Cannot receive context):**
- Commands - Cannot directly access AgentrixContext
- Skills - Cannot directly access AgentrixContext

If a Command or Skill needs Agentrix data, it must call an MCP tool that has access to the context.

## Setup: Export a Factory Function

Your MCP tool MUST export a function that accepts `context`:

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';

export default function (context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'my-tools',
    version: '1.0.0',
    tools: [ /* ... */ ],
  });
}
```

---

## API Reference

### Basic Context (Synchronous)

| Method | Returns | Description |
|--------|---------|-------------|
| `log(str)` | `void` | Print a line to the task's execution log files |
| `getWorkspace()` | `string` | Absolute path to the current workspace directory |
| `getUserId()` | `string` | Current user ID |
| `getTaskId()` | `string` | Current task ID |
| `getChatId()` | `string` | Current chat ID |
| `getRootTaskId()` | `string` | Root task ID of the current task tree |
| `getParentTaskId()` | `string \| null` | Parent task ID, or `null` if this is the root task |
| `getChatAgents()` | `Record<string, string>` | Map of `{ displayName: agentId }` for all agents in this chat |

### File Upload (Async)

#### `uploadFile(params)`
Upload a file to Agentrix storage and get a URL. Used mainly for agent avatars.

```typescript
const { fileId, url, size, contentType } = await context.uploadFile({
  name: 'my-agent_avatar',
  path: '/abs/path/to/image.png',  // absolute path
  contentType: 'image/png',        // optional, auto-detected if omitted
  visibility: 'public',            // 'public' | 'private' (default: 'private')
});
// Pass url to createDraftAgent({ avatar: url })
```

### Multi-Agent Collaboration (Async)

#### `startSubTask(params)`
Create a sub-task for another agent. Automatically inherits `chatId`, `rootTaskId`, machine context.

```typescript
const { taskId } = await context.startSubTask({
  agentId: 'agent-xxx',
  message: { type: 'user', message: { role: 'user', content: 'Do X' }, parent_tool_use_id: null, session_id: '' },
});
```

#### `findSubTaskByAgent(agentId)`
Find an existing sub-task (where `parentTaskId` = current task). Returns `null` if none exists.

```typescript
const subTask = await context.findSubTaskByAgent('agent-xxx');
// { taskId: '...' } | null
```

#### `getTaskSession(taskId)`
Get the session file path and current state of a task.

```typescript
const { sessionPath, state } = await context.getTaskSession(taskId);
// state: 'running' | 'stopped' | 'cancelled' | ...
if (state === 'stopped') {
  const session = JSON.parse(await fs.readFile(sessionPath, 'utf-8'));
}
```

### Communication (Async)

#### `sendMessage(params)`
Send a message to a task. `target: 'agent'` injects it as user input; `target: 'user'` shows it in the chat UI.

```typescript
// To agent (inject as user input) — SDKUserMessage wraps MessageParam
await context.sendMessage({
  taskId, target: 'agent',
  message: { type: 'user', message: { role: 'user', content: 'Continue' }, parent_tool_use_id: null, session_id: '' },
});

// To user (show in chat UI) — requires a full SDKAssistantMessage (wraps BetaMessage).
// Only use when you already have an SDKAssistantMessage from an existing response.
// For proactive UI notifications, prefer showModal() instead.
```

#### `showModal(params)`
Trigger a modal dialog for users viewing the task.

```typescript
await context.showModal({
  taskId: context.getTaskId(),
  modalName: 'try-draft-agent',
  modalData: { draftAgentId: 'agent-xxx', draftAgentName: 'My Agent' },
});
```

---

## Examples

See `examples/` for complete, runnable TypeScript examples:

| File | Covers |
|------|--------|
| `examples/basic-context.ts` | `log`, `getWorkspace`, `getUserId`, `getTaskId`, `getChatId`, `getRootTaskId`, `getParentTaskId`, `getChatAgents` |
| `examples/file-upload.ts` | `uploadFile`, avatar caching pattern |
| `examples/multi-agent.ts` | `startSubTask`, `findSubTaskByAgent`, `getTaskSession`, `sendMessage` (agent) |
| `examples/communication.ts` | `sendMessage` (user), `showModal` |

---

## Important Rules

- **Never use `process.env.AGENTRIX_*` directly** — always use context methods
- **General env vars (API_KEY, etc.) can use `process.env`** — these are not Agentrix context
- **Must export `function(context)`** — direct export of `createSdkMcpServer` will error
- **`agentDir` must be an absolute path** — use `join(context.getWorkspace(), normalizedName)`
- **Never expose env vars in system prompts** — agents cannot read `$ENV_VAR` directly
- **Sub-tasks inherit context** — `chatId`, `rootTaskId`, machine info are automatically inherited
- **Use `findSubTaskByAgent` before `startSubTask`** — to avoid creating duplicate sub-tasks
- **Cache `uploadFile` results** — store to `avatar/upload-avatar.json` to avoid re-uploading
