---
name: Agentrix Interaction
description: This skill should be used when creating MCP tools or Hooks that need to interact with Agentrix service - the service connecting agents with end users and managing service data. Use AgentrixContext for getting workspace directory, user ID, task ID, creating agents in database, managing sub-tasks for multi-agent collaboration, or sending messages to users. NOTE - Only MCP tools and Hooks can receive injected AgentrixContext.
version: 0.2.0
---

# Using AgentrixContext in MCP Tools and Hooks

## When to Use AgentrixContext

Use AgentrixContext when you need to:
- Interact with service data (create/update agent in database)
- Communicate with end users (send messages, show modals)
- Access execution context (workspace path, user ID, task ID, chat ID)
- Multi-agent collaboration (start sub-tasks, find sub-tasks, send messages between agents)

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

#### Basic Context (Synchronous)

##### `context.getWorkspace(): string`
Get the current workspace directory path.

```typescript
const workspace = context.getWorkspace();
const myPath = join(workspace, 'my-file.txt');
```

##### `context.getUserId(): string`
Get the current user ID.

```typescript
const userId = context.getUserId();
```

##### `context.getTaskId(): string`
Get the current task ID.

```typescript
const taskId = context.getTaskId();
```

##### `context.getChatId(): string`
Get the current chat ID.

```typescript
const chatId = context.getChatId();
```

##### `context.getRootTaskId(): string`
Get the root task ID of the current task tree. If this task is the root, returns its own ID.

```typescript
const rootTaskId = context.getRootTaskId();
```

##### `context.getParentTaskId(): string | null`
Get the parent task ID. Returns null if this is a root task.

```typescript
const parentTaskId = context.getParentTaskId();
if (parentTaskId) {
  // This is a sub-task
}
```

##### `context.getChatAgents(): Record<string, string>`
Get all agents in the current chat. Returns a map of `{ displayName: agentId }`.

```typescript
const agents = context.getChatAgents();
// agents = { "Code Reviewer": "agent-xxx", "Test Runner": "agent-yyy" }
```

#### Agent Management (Async)

##### `context.saveDraftAgent(params): Promise<{ agentId: string, displayName: string }>`
Create a new draft agent or update an existing one in the database.

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
  isUpdate?: boolean;        // Whether updating existing agent
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

#### Multi-Agent Collaboration (Async)

##### `context.startSubTask(params): Promise<{ taskId: string }>`
Create a sub-task for multi-agent collaboration. Automatically inherits chatId, rootTaskId, machineId/cloudId from current task. Sets parentTaskId to current taskId.

**Parameters:**
```typescript
{
  agentId: string;           // ID of the agent to run this sub-task
  message: SDKUserMessage;   // Initial message for the agent
}
```

**Example:**
```typescript
import { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';

const message: SDKUserMessage = {
  type: 'user',
  content: [{ type: 'text', text: 'Review this code for security issues' }],
};

const { taskId } = await context.startSubTask({
  agentId: 'agent-code-reviewer-xxx',
  message,
});
console.log(`Started sub-task: ${taskId}`);
```

##### `context.findSubTaskByAgent(agentId): Promise<{ taskId: string } | null>`
Find a sub-task by agent ID. Searches direct sub-tasks (parentTaskId = current taskId) for the given agent.

**Example:**
```typescript
const subTask = await context.findSubTaskByAgent('agent-code-reviewer-xxx');
if (subTask) {
  console.log(`Found existing sub-task: ${subTask.taskId}`);
}
```

##### `context.getTaskSession(taskId): Promise<{ sessionPath: string, state: TaskState }>`
Get the session file path and state of a task. Used to read completed task's session for analysis.

**Example:**
```typescript
const { sessionPath, state } = await context.getTaskSession(subTaskId);
if (state === 'stopped') {
  // Read session file to analyze results
  const session = JSON.parse(await fs.readFile(sessionPath, 'utf-8'));
}
```

#### Communication (Async)

##### `context.sendMessage(params): Promise<void>`
Send a message to a task.

**Target behavior:**
- `'agent'`: Routes SDKUserMessage to task's agent worker (injects as user input)
- `'user'`: Broadcasts SDKAssistantMessage to users viewing the task (shows in chat UI)

**Parameters:**
```typescript
{
  taskId: string;
  message: SDKUserMessage | SDKAssistantMessage;
  target: 'agent' | 'user';  // Required
}
```

**Example - Send to agent:**
```typescript
import { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';

const message: SDKUserMessage = {
  type: 'user',
  content: [{ type: 'text', text: 'Continue with the next step' }],
};

await context.sendMessage({
  taskId: subTaskId,
  message,
  target: 'agent',
});
```

**Example - Send to user:**
```typescript
import { SDKAssistantMessage } from '@anthropic-ai/claude-agent-sdk';

const message: SDKAssistantMessage = {
  type: 'assistant',
  content: [{ type: 'text', text: 'Sub-task completed successfully!' }],
};

await context.sendMessage({
  taskId: context.getTaskId(),
  message,
  target: 'user',
});
```

##### `context.showModal(params): Promise<void>`
Show a modal dialog to users viewing a task. Used for interactive UI elements like configuration dialogs.

**Parameters:**
```typescript
{
  taskId: string;
  modalName: string;
  modalData: Record<string, any>;
}
```

**Example:**
```typescript
await context.showModal({
  taskId: context.getTaskId(),
  modalName: 'try-draft-agent',
  modalData: {
    draftAgentId: 'agent-xxx',
    draftAgentName: 'My Agent',
  },
});
```

## Complete Example: Multi-Agent Orchestration

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext, SDKUserMessage, SDKAssistantMessage } from '@agentrix/shared';
import { z } from 'zod';
import fs from 'fs/promises';

export default function(context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'orchestrator-tools',
    version: '1.0.0',
    tools: [
      tool(
        'delegate_to_agent',
        'Delegate a task to another agent and wait for completion',
        {
          agentName: z.string().describe('Display name of the agent to delegate to'),
          task: z.string().describe('Task description for the agent'),
        },
        async (args) => {
          // Find agent ID from display name
          const agents = context.getChatAgents();
          const agentId = agents[args.agentName];

          if (!agentId) {
            return {
              content: [{
                type: 'text',
                text: `Agent "${args.agentName}" not found. Available: ${Object.keys(agents).join(', ')}`
              }],
            };
          }

          // Check if sub-task already exists
          let subTask = await context.findSubTaskByAgent(agentId);

          if (!subTask) {
            // Create new sub-task
            const message: SDKUserMessage = {
              type: 'user',
              content: [{ type: 'text', text: args.task }],
            };
            subTask = await context.startSubTask({ agentId, message });
          } else {
            // Send message to existing sub-task
            const message: SDKUserMessage = {
              type: 'user',
              content: [{ type: 'text', text: args.task }],
            };
            await context.sendMessage({
              taskId: subTask.taskId,
              message,
              target: 'agent',
            });
          }

          return {
            content: [{
              type: 'text',
              text: `Delegated to ${args.agentName} (task: ${subTask.taskId})`
            }],
          };
        }
      ),

      tool(
        'check_subtask_result',
        'Check if a sub-task has completed and get its result',
        {
          agentName: z.string().describe('Display name of the agent'),
        },
        async (args) => {
          const agents = context.getChatAgents();
          const agentId = agents[args.agentName];

          if (!agentId) {
            return {
              content: [{ type: 'text', text: `Agent "${args.agentName}" not found` }],
            };
          }

          const subTask = await context.findSubTaskByAgent(agentId);
          if (!subTask) {
            return {
              content: [{ type: 'text', text: 'No sub-task found for this agent' }],
            };
          }

          const { sessionPath, state } = await context.getTaskSession(subTask.taskId);

          if (state !== 'stopped') {
            return {
              content: [{ type: 'text', text: `Sub-task still running (state: ${state})` }],
            };
          }

          // Read session to extract result
          const session = JSON.parse(await fs.readFile(sessionPath, 'utf-8'));
          const lastMessage = session.messages?.slice(-1)[0];

          return {
            content: [{
              type: 'text',
              text: `Sub-task completed. Last message: ${JSON.stringify(lastMessage?.content)}`
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
- **Sub-tasks inherit context** - chatId, rootTaskId, machineId/cloudId are automatically inherited
- **Use findSubTaskByAgent before startSubTask** - to avoid creating duplicate sub-tasks
