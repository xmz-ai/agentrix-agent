/**
 * Multi-Agent Orchestration
 * Delegate work to other agents in the same chat, then collect results.
 *
 * Pattern:
 *   1. getChatAgents()             — discover available agents
 *   2. findSubTaskByAgent()        — check if a sub-task already exists
 *   3. startSubTask()              — create a new sub-task (if none exists)
 *   4. sendMessage(target:'agent') — send follow-up messages to the sub-task
 *   5. getTaskSession()            — poll state; read session when stopped
 */

import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';
import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';
import * as fs from 'fs/promises';
import { z } from 'zod';

function userMessage(text: string): SDKUserMessage {
  return {
    type: 'user',
    message: { role: 'user', content: text },
    parent_tool_use_id: null,
    session_id: '',
  };
}

export default function (context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'multi-agent-example',
    version: '1.0.0',
    tools: [

      // ── Delegate ─────────────────────────────────────────────────────────
      tool(
        'delegate_task',
        'Send a task to another agent in this chat',
        {
          agentDisplayName: z.string().describe('Exact display name shown in the chat'),
          task:             z.string().describe('Task description to send'),
        },
        async (args) => {
          const agents  = context.getChatAgents(); // { "Code Reviewer": "agent-xxx", ... }
          const agentId = agents[args.agentDisplayName];

          if (!agentId) {
            return {
              content: [{
                type: 'text',
                text: `Agent "${args.agentDisplayName}" not found. Available: ${Object.keys(agents).join(', ')}`,
              }],
            };
          }

          // Reuse existing sub-task or create a new one
          let subTask = await context.findSubTaskByAgent(agentId);

          if (subTask) {
            // Send a follow-up message to the existing sub-task's agent
            await context.sendMessage({
              taskId: subTask.taskId,
              message: userMessage(args.task),
              target: 'agent',
            });
          } else {
            subTask = await context.startSubTask({
              agentId,
              message: userMessage(args.task),
            });
          }

          return {
            content: [{ type: 'text', text: `Delegated to ${args.agentDisplayName} (taskId: ${subTask.taskId})` }],
          };
        }
      ),

      // ── Collect result ────────────────────────────────────────────────────
      tool(
        'get_subtask_result',
        'Check if a sub-task has finished and return its last message',
        {
          agentDisplayName: z.string(),
        },
        async (args) => {
          const agents  = context.getChatAgents();
          const agentId = agents[args.agentDisplayName];
          if (!agentId) {
            return { content: [{ type: 'text', text: `Agent "${args.agentDisplayName}" not found` }] };
          }

          const subTask = await context.findSubTaskByAgent(agentId);
          if (!subTask) {
            return { content: [{ type: 'text', text: 'No sub-task found for this agent' }] };
          }

          const { sessionPath, state } = await context.getTaskSession(subTask.taskId);
          // state: 'running' | 'stopped' | 'cancelled' | ...

          if (state !== 'stopped') {
            return { content: [{ type: 'text', text: `Still running (state: ${state})` }] };
          }

          const session     = JSON.parse(await fs.readFile(sessionPath, 'utf-8'));
          const lastMessage = session.messages?.at(-1);

          return {
            content: [{ type: 'text', text: `Result: ${JSON.stringify(lastMessage?.content)}` }],
          };
        }
      ),

    ],
  });
}
